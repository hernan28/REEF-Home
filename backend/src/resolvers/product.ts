import { Context } from '../utils/context';
import { requireAdmin } from '../utils/auth';

export const productResolvers = {
  Query: {
    products: (_: any, __: any, { prisma }: Context) => {
      return prisma.product.findMany();
    },

    product: (_: any, { id }: { id: string }, { prisma }: Context) => {
      return prisma.product.findUnique({
        where: { id },
      });
    },
  },

  Mutation: {
    createProduct: async (
      _: any,
      { input }: { input: { name: string; description: string; price: number; stock: number; imageUrl: string } },
      context: Context
    ) => {
      requireAdmin(context);
      return context.prisma.product.create({
        data: input,
      });
    },

    updateProduct: async (
      _: any,
      { id, input }: { id: string; input: { name?: string; description?: string; price?: number; stock?: number; imageUrl?: string } },
      context: Context
    ) => {
      requireAdmin(context);
      return context.prisma.product.update({
        where: { id },
        data: input,
      });
    },

    deleteProduct: async (_: any, { id }: { id: string }, context: Context) => {
      requireAdmin(context);
      return context.prisma.product.delete({
        where: { id },
      });
    },
  },
}; 