import { z } from '../config/zod.js';

// ── 공통 ──────────────────────────────────────────────────

export const CommentPostIdParamSchema = z.object({
  post_id: z.coerce.number().int().positive(),
});

export const CommentIdParamSchema = z.object({
  comment_id: z.coerce.number().int().positive(),
});

// ── 댓글 작성 Body ────────────────────────────────────────

export const CreateCommentSchema = z
  .object({
    content: z.string().min(1).max(1000),
    comment_parent_id: z.coerce.number().int().positive().optional(),
  })
  .openapi('CreateCommentRequest');

// ── 응답 스키마 ───────────────────────────────────────────

export const ReplyItemSchema = z
  .object({
    comment_id: z.number().int(),
    comment_parent_id: z.number().int(),
    user_id: z.number().int(),
    user: z.object({ nickname: z.string() }),
    content: z.string(),
    created_at: z.string().datetime(),
  })
  .openapi('ReplyItem');

export const CommentItemSchema = z
  .object({
    comment_id: z.number().int(),
    user_id: z.number().int(),
    user: z.object({ nickname: z.string() }),
    content: z.string(),
    created_at: z.string().datetime(),
    replies: z.array(ReplyItemSchema),
  })
  .openapi('CommentItem');

export const CommentListResponseSchema = z
  .object({ comments: z.array(CommentItemSchema) })
  .openapi('CommentListResponse');

export const CommentCreateResponseSchema = z
  .object({
    comment_id: z.number().int(),
    user_id: z.number().int(),
    user: z.object({ nickname: z.string() }),
    content: z.string(),
    comment_parent_id: z.number().int().nullable(),
    created_at: z.string().datetime(),
  })
  .openapi('CommentCreateResponse');

export type CreateCommentBody = z.infer<typeof CreateCommentSchema>;
