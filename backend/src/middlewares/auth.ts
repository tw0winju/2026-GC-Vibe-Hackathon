import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.js';
import { AppError } from './errorHandler.js';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, '인증 토큰이 필요합니다');
  }

  try {
    req.user = verifyToken(authHeader.substring(7));
    next();
  } catch {
    throw new AppError(401, '유효하지 않은 토큰입니다');
  }
};