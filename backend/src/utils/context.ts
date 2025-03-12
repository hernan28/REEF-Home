import { Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express';
import { getToken, getUser, AuthUser } from '../middleware/auth';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  user?: AuthUser | null;
  userRole?: string;
}

export async function createContext({ req }: ExpressContext): Promise<Context> {
  const token = getToken(req as Request);
  const user = token ? await getUser(token) : undefined;

  return {
    prisma,
    user,
    userRole: user?.role
  };
} 