import { Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler.js";
import * as projectPostService from "../services/projectPost.service.js";

export const listProjectPosts = async (req: Request, res: Response) => {
  const result = await projectPostService.listProjectPosts(req.query as any);
  res.json(result);
};

export const createProjectPost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "인증이 필요합니다.");
  const result = await projectPostService.createProjectPost(req.user.userId, req.body);
  res.status(201).json(result);
};

export const getProjectPost = async (req: Request, res: Response) => {
  const result = await projectPostService.getProjectPost(Number(req.params.post_id), req.user?.userId);
  res.json(result);
};

export const updateProjectPost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "인증이 필요합니다.");
  const result = await projectPostService.updateProjectPost(
    Number(req.params.post_id),
    req.user.userId,
    req.body
  );
  res.json(result);
};

export const deleteProjectPost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "인증이 필요합니다.");
  await projectPostService.deleteProjectPost(Number(req.params.post_id), req.user.userId);
  res.json({ message: "ok" });
};

export const likeProjectPost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "인증이 필요합니다.");
  const result = await projectPostService.likeProjectPost(Number(req.params.post_id), req.user.userId);
  res.json(result);
};
