import { Request, Response } from 'express';
import { AppError } from '../middlewares/errorHandler.js';
import * as commentService from '../services/comment.service.js';

export const getResumeComments = async (req: Request, res: Response) => {
  const result = await commentService.getResumeComments(Number(req.params.post_id));
  res.json(result);
};

export const createResumeComment = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, '인증이 필요합니다');
  const result = await commentService.createResumeComment(
    Number(req.params.post_id),
    req.user.userId,
    req.body,
  );
  res.status(201).json(result);
};

export const getProjectComments = async (req: Request, res: Response) => {
  const result = await commentService.getProjectComments(Number(req.params.post_id));
  res.json(result);
};

export const createProjectComment = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, '인증이 필요합니다');
  const result = await commentService.createProjectComment(
    Number(req.params.post_id),
    req.user.userId,
    req.body,
  );
  res.status(201).json(result);
};

export const getCommunityComments = async (req: Request, res: Response) => {
  const result = await commentService.getCommunityComments(Number(req.params.post_id));
  res.json(result);
};

export const createCommunityComment = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, '인증이 필요합니다');
  const result = await commentService.createCommunityComment(
    Number(req.params.post_id),
    req.user.userId,
    req.body,
  );
  res.status(201).json(result);
};

export const deleteComment = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, '인증이 필요합니다');
  const result = await commentService.deleteComment(
    Number(req.params.comment_id),
    req.user.userId,
  );
  res.json(result);
};
