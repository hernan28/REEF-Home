import { Context } from '../utils/context';
import { requireAuth, requireAdmin } from '../utils/auth';
import { OrderStatus } from '@prisma/client';

export const orderResolvers = {
  Query: {
    orders: async (_: any, __: any, context: Context) => {
      requireAdmin(context);
      return context.prisma.order.findMany({
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });
    },

    order: async (_: any, { id }: { id: string }, context: Context) => {
      const userId = requireAuth(context);
      const order = await context.prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Allow access only to admin or order owner
      if (order.userId !== userId && context.userRole !== 'ADMIN') {
        throw new Error('Not authorized to view this order');
      }

      return order;
    },

    myOrders: async (_: any, __: any, context: Context) => {
      const userId = requireAuth(context);
      return context.prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    },
  },

  Mutation: {
    createOrder: async (
      _: any,
      { input }: { input: { items: { productId: string; quantity: number }[]; shippingAddress: string } },
      context: Context
    ) => {
      const userId = requireAuth(context);

      // Validate and process order items
      const orderItems = await Promise.all(
        input.items.map(async (item) => {
          const product = await context.prisma.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }

          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product: ${product.name}`);
          }

          return {
            product,
            quantity: item.quantity,
            price: product.price,
          };
        })
      );

      // Calculate total
      const total = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Create order and update product stock in a transaction
      const order = await context.prisma.$transaction(async (prisma) => {
        // Create the order
        const newOrder = await prisma.order.create({
          data: {
            userId,
            total,
            status: OrderStatus.PENDING,
            shippingAddress: input.shippingAddress,
            items: {
              create: orderItems.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        // Update product stock
        await Promise.all(
          orderItems.map((item) =>
            prisma.product.update({
              where: { id: item.product.id },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            })
          )
        );

        return newOrder;
      });

      return order;
    },

    updateOrderStatus: async (
      _: any,
      { id, status }: { id: string; status: OrderStatus },
      context: Context
    ) => {
      requireAdmin(context);

      const order = await context.prisma.order.findUnique({
        where: { id },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      return context.prisma.order.update({
        where: { id },
        data: { status },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    },
  },

  Order: {
    user: (parent: { userId: string }, _: any, context: Context) => {
      return context.prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },
    items: (parent: { id: string }, _: any, context: Context) => {
      return context.prisma.orderItem.findMany({
        where: { orderId: parent.id },
        include: {
          product: true,
        },
      });
    },
  },
}; 