import { z } from "../config/zod.js";
import { COMMUNITY_CATEGORIES } from "../constants/enums.js";

export const CommunityPostListQuerySchema = z.object({
  category: z.enum(COMMUNITY_CATEGORIES).optional(),
  sort: z.enum(["latest", "like"]).optional().default("latest"),
  page: z.coerce.number().int().positive().optional().default(1),
  size: z.coerce.number().int().positive().max(50).optional().default(10),
  keyword: z.string().min(1).max(100).optional(),
});

export const CommunityPostIdParamSchema = z.object({
  post_id: z.coerce.number().int().positive(),
});

export const CommunityPostCreateSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(3000),
  category: z.enum(COMMUNITY_CATEGORIES),
});

export const CommunityPostUpdateSchema = CommunityPostCreateSchema.partial();
