import { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import { AppError } from '../middlewares/errorHandler.js';

export const socialLogin = async (req: Request, res: Response) => {
  const { provider, code } = req.body;
  const result = await authService.socialLogin(provider, code);
  res.json(result);
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  const result = await authService.refreshAccessToken(refresh_token);
  res.json(result);
};

export const logout = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, '인증이 필요합니다');
  const result = await authService.logout(req.user.userId);
  res.json(result);
};