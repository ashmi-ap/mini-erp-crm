import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { env } from '../../config/env';
import type { Role } from '../../constants/domain';
import { prisma } from '../../db/prisma';
import { ApiError } from '../../utils/ApiError';

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true, passwordHash: true },
  });

  if (!user) {
    throw new ApiError(401, 'UNAUTHENTICATED', 'Invalid credentials');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(401, 'UNAUTHENTICATED', 'Invalid credentials');
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    },
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    throw new ApiError(404, 'NOT_FOUND', 'User not found');
  }

  return user;
};
