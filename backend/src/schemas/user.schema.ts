import { z } from '../config/zod.js';
import { POSITIONS } from '../constants/enums.js';

// ── 공통 응답 스키마 ──────────────────────────────────────
export const UserProfileSchema = z
  .object({
    user_id: z.number().int(),
    nickname: z.string(),
    position: z.enum(POSITIONS).nullable(),
    introduction: z.string().nullable(),
    git_url: z.string().nullable(),
    linked_url: z.string().nullable(),
    blog_url: z.string().nullable(),
    stack: z.array(z.string()),
  })
  .openapi('UserProfile');

// ── GET /users/me ─────────────────────────────────────────
// (응답: UserProfileSchema)

// ── PUT /users/me ─────────────────────────────────────────
export const UpdateUserSchema = z
  .object({
    nickname: z.string().min(1).max(30).optional(),
    position: z.enum(POSITIONS).optional(),
    introduction: z.string().max(500).optional(),
    git_url: z.string().url().optional().nullable(),
    linked_url: z.string().url().optional().nullable(),
    blog_url: z.string().url().optional().nullable(),
    stack: z.array(z.string()).optional(),
  })
  .openapi('UpdateUserRequest');

// ── GET /users (내가 쓴 글, 작성한 댓글, 좋아요) ─────────
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  size: z.coerce.number().int().positive().max(50).default(10),
});

export const UserPostItemSchema = z
  .object({
    post_id: z.number().int(),
    title: z.string(),
    description: z.string(),
    thumbnail: z.string().nullable(),
    like: z.number().int(),
    position: z.enum(POSITIONS).nullable(),
    user: z.object({ user_id: z.number().int(), nickname: z.string() }),
    created_at: z.string().datetime(),
  })
  .openapi('UserPostItem');

export const UserPostListResponseSchema = z
  .object({
    posts: z.array(UserPostItemSchema),
    total: z.number().int(),
    page: z.number().int(),
  })
  .openapi('UserPostListResponse');

export const UserCommentItemSchema = z
  .object({
    user_id: z.number().int(),
    title: z.string(),
    post_nickname: z.string(),
    like: z.number().int(),
    comment_count: z.number().int(),
    position: z.enum(POSITIONS).nullable(),
    created_at: z.string(),
    type: z.enum(['이력서', '프로젝트']),
    total: z.number().int(),
    page: z.number().int(),
  })
  .openapi('UserCommentItem');

export const UserLikeItemSchema = z
  .object({
    user_id: z.number().int(),
    title: z.string(),
    post_nickname: z.string(),
    like: z.number().int(),
    comment_count: z.number().int(),
    position: z.enum(POSITIONS).nullable(),
    created_at: z.string(),
    total: z.number().int(),
    page: z.number().int(),
  })
  .openapi('UserLikeItem');

// ── GET /users/:user_id ───────────────────────────────────
export const UserIdParamSchema = z.object({
  user_id: z.coerce.number().int().positive(),
});

export type UpdateUserBody = z.infer<typeof UpdateUserSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
