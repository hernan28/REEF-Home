import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { Context } from './context';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

export const createToken = (userId: string, role: Role): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};

export function requireAuth(context: Context): string {
  if (!context.user) {
    throw new AuthenticationError('You must be logged in');
  }
  return context.user.id;
}

export function requireAdmin(context: Context): void {
  if (context.userRole !== 'ADMIN') {
    throw new ForbiddenError('Admin access required');
  }
}

export function isAdmin(context: Context): boolean {
  return context.userRole === 'ADMIN';
} 