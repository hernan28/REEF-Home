import { AuthenticationError } from 'apollo-server';
import bcrypt from 'bcryptjs';
import { Context } from '../utils/context';
import { createToken } from '../utils/auth';

export const authResolvers = {
  Mutation: {
    signup: async (
      _: any,
      { input }: { input: { email: string; password: string; firstName: string; lastName: string; phone?: string; address?: string } },
      { prisma }: Context
    ) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new AuthenticationError('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await prisma.user.create({
        data: {
          ...input,
          password: hashedPassword,
        },
      });

      const token = createToken(user.id, user.role);

      return {
        token,
        user,
      };
    },

    login: async (
      _: any,
      { input }: { input: { email: string; password: string } },
      { prisma }: Context
    ) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }
      const validPassword = await bcrypt.compare(input.password, user.password);
      if (!validPassword) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = createToken(user.id, user.role);

      return {
        token,
        user,
      };
    },
  },
}; 