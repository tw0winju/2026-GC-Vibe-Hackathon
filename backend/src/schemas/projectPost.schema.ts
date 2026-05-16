import { z } from "../config/zod.js";
import { POSITIONS } from "../constants/enums.js";

export const ProjectPostListQuerySchema = z.object({
  position: z.enum(POSITIONS).optional(),
  sort: z.enum(["latest", "like"]).optional().default("latest"),
  page: z.coerce.number().int().positive().optional().default(1),
  size: z.coerce.number().int().positive().max(50).optional().default(10),
  // 제목 또는 내용에서 keyword 검색 (부분 일치, 대소문자 무시)
  keyword: z.string().min(1).max(100).optional(),
});

export const ProjectPostIdParamSchema = z.object({
  post_id: z.coerce.number().int().positive(),
});

export const ProjectPostCreateSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(3000),
  file_url: z.string().url().optional(),
  thumbnail: z.string().min(1).optional(),
  position: z.enum(POSITIONS),
  tag: z.array(z.string()).default([]),
});

export const ProjectPostUpdateSchema = ProjectPostCreateSchema.partial();
