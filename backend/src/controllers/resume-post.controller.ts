import { Request, Response } from "express";
import { ResumePostService } from "../services/resume-post.service";
import {
  createResumePostSchema,
  resumePostQuerySchema,
  updateResumePostSchema,
} from "../validators/resume-post.validator";

export class ResumePostController {
  static async getResumePosts(req: Request, res: Response) {
    const query = resumePostQuerySchema.parse(req.query);

    const result = await ResumePostService.getResumePosts(query);

    return res.json(result);
  }

  static async createResumePost(req: Request, res: Response) {
    const body = createResumePostSchema.parse(req.body);

    const result = await ResumePostService.createResumePost(
      req.user!.user_id,
      body
    );

    return res.status(201).json(result);
  }

  static async getResumePostDetail(req: Request, res: Response) {
    const post_id = Number(req.params.post_id);

    const result = await ResumePostService.getResumePostDetail(post_id);

    return res.json(result);
  }

  static async updateResumePost(req: Request, res: Response) {
    const post_id = Number(req.params.post_id);

    const body = updateResumePostSchema.parse(req.body);

    const result = await ResumePostService.updateResumePost(
      post_id,
      req.user!.user_id,
      body
    );

    return res.json(result);
  }

  static async deleteResumePost(req: Request, res: Response) {
    const post_id = Number(req.params.post_id);

    const result = await ResumePostService.deleteResumePost(
      post_id,
      req.user!.user_id
    );

    return res.json(result);
  }
}