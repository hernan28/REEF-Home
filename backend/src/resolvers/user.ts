import { Context } from '../utils/context';
import { requireAuth, requireAdmin } from '../utils/auth';

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      const userId = requireAuth(context);
      return context.prisma.user.findUnique({
        where: { id: userId },
      });
    },

    users: async (_: any, __: any, context: Context) => {
      requireAdmin(context);
      return context.prisma.user.findMany();
    },

    user: async (_: any, { id }: { id: string }, context: Context) => {
      requireAdmin(context);
      return context.prisma.user.findUnique({
        where: { id },
      });
    },
  },

  Mutation: {
    updateUser: async (
      _: any,
      { id, input }: { id: string; input: { firstName?: string; lastName?: string; phone?: string; address?: string } },
      context: Context
    ) => {
      const userId = requireAuth(context);
      
      // Only allow users to update their own profile unless they're an admin
      if (id !== userId && context.userRole !== 'ADMIN') {
        throw new Error('Not authorized to update this user');
      }

      return context.prisma.user.update({
        where: { id },
        data: input,
      });
    },

    deleteUser: async (_: any, { id }: { id: string }, context: Context) => {
      requireAdmin(context);
      return context.prisma.user.delete({
        where: { id },
      });
    },
  },

  User: {
    orders: (parent: { id: string }, _: any, context: Context) => {
      return context.prisma.order.findMany({
        where: { userId: parent.id },
      });
    },
  },
}; 