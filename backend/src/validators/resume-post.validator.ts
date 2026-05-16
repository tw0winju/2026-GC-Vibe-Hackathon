import { z } from "zod";
import { POSITION_VALUES } from "../constants/position";

export const createResumePostSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  file_url: z.string().url(),
  thumbnail: z.string().url(),
  position: z.enum(POSITION_VALUES),
});

export const updateResumePostSchema = createResumePostSchema.partial();

export const resumePostQuerySchema = z.object({
  position: z.enum(POSITION_VALUES).optional(),
  sort: z.enum(["latest", "like"]).optional(),
  page: z.coerce.number().min(1).optional(),
  size: z.coerce.number().min(1).max(50).optional(),
});