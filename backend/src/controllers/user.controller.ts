import { Request, Response } from 'express';
import { AppError } from '../middlewares/errorHandler.js';
import * as userService from '../services/user.service.js';

export const getMe = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, '인증이 필요합니다');
  const result = await userService.getMe(req.user.userId);
  res.json(result);
};

export const updateMe = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, '인증이 필요합니다');
  const result = await userService.updateMe(req.user.userId, req.body);
  res.json(result);
};

export const getMyPosts = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, '인증이 필요합니다');
  const result = await userService.getMyPosts(req.user.userId, req.query as any);
  res.json(result);
};

export const getMyComments = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, '인증이 필요합니다');
  const result = await userService.getMyComments(req.user.userId, req.query as any);
  res.json(result);
};

export const getMyLikes = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, '인증이 필요합니다');
  const result = await userService.getMyLikes(req.user.userId, req.query as any);
  res.json(result);
};

export const getUserById = async (req: Request, res: Response) => {
  const result = await userService.getUserById(Number(req.params.user_id));
  res.json(result);
};
