import { Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler.js";
import * as resumePostService from "../services/resumePost.service.js";

export const listResumePosts = async (req: Request, res: Response) => {
  const result = await resumePostService.listResumePosts(req.query as any);
  res.json(result);
};

export const createResumePost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "인증이 필요합니다.");

  const result = await resumePostService.createResumePost(
    req.user.userId,
    req.body,
  );

  res.status(201).json(result);
};

export const getResumePost = async (req: Request, res: Response) => {
  const result = await resumePostService.getResumePost(
    Number(req.params.post_id),
  );

  res.json(result);
};

export const updateResumePost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "인증이 필요합니다.");

  const result = await resumePostService.updateResumePost(
    Number(req.params.post_id),
    req.user.userId,
    req.body,
  );

  res.json(result);
};

export const deleteResumePost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "인증이 필요합니다.");

  await resumePostService.deleteResumePost(
    Number(req.params.post_id),
    req.user.userId,
  );

  res.json({ message: "ok" });
};

export const likeResumePost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "인증이 필요합니다.");

  const result = await resumePostService.likeResumePost(
    Number(req.params.post_id),
    req.user.userId,
  );

  res.json(result);
};