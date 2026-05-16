import { Request, Response } from "express";
import { AppError } from "../middlewares/errorHandler.js";
import * as communityPostService from "../services/communityPost.service.js";

export const listCommunityPosts = async (req: Request, res: Response) => {
  const result = await communityPostService.listCommunityPosts(req.query as any);
  res.json(result);
};

export const createCommunityPost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "인증이 필요합니다.");
  const result = await communityPostService.createCommunityPost(req.user.userId, req.body);
  res.status(201).json(result);
};

export const getCommunityPost = async (req: Request, res: Response) => {
  const result = await communityPostService.getCommunityPost(
    Number(req.params.post_id),
    req.user?.userId,
  );
  res.json(result);
};

export const updateCommunityPost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "인증이 필요합니다.");
  const result = await communityPostService.updateCommunityPost(
    Number(req.params.post_id),
    req.user.userId,
    req.body,
  );
  res.json(result);
};

export const deleteCommunityPost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "인증이 필요합니다.");
  await communityPostService.deleteCommunityPost(Number(req.params.post_id), req.user.userId);
  res.json({ message: "ok" });
};

export const likeCommunityPost = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "인증이 필요합니다.");
  const result = await communityPostService.likeCommunityPost(
    Number(req.params.post_id),
    req.user.userId,
  );
  res.json(result);
};
