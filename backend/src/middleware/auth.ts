import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthContext {
  user?: AuthUser;
  prisma: PrismaClient;
}

export async function getUser(token: string): Promise<AuthUser | null> {
  try {
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });

    return user;
  } catch (error) {
    return null;
  }
}

export function getToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const [bearer, token] = authHeader.split(' ');
    if (bearer === 'Bearer' && token) {
      return token;
    }
  }

  return null;
} 