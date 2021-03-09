import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import authConfig from '@config/auth.config';

import AppError from '@shared/errors/AppError';

interface ITokenPayLoad {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) throw new AppError('JWT token is missing', 401);

  const [, token] = authHeader.split(' ');
  const { secret } = authConfig.jwt;

  try {
    const decoded = verify(token, secret);
    const { sub } = decoded as ITokenPayLoad;

    req.user = { id: sub };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
