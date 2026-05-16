import { Router } from 'express';
import { registry } from '../config/openapi.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as commentController from '../controllers/comment.controller.js';
import {
  CommentPostIdParamSchema,
  CommentIdParamSchema,
  CreateCommentSchema,
  CommentListResponseSchema,
  CommentCreateResponseSchema,
} from '../schemas/comment.schema.js';
import { z } from '../config/zod.js';

// ── 이력서 댓글 라우터 (/resume-posts/:post_id/comments) ──
export const resumeCommentRouter = Router({ mergeParams: true });

// GET /resume-posts/:post_id/comments
registry.registerPath({
  method: 'get',
  path: '/resume-posts/{post_id}/comments',
  tags: ['Comment'],
  summary: '이력서 댓글 목록',
  request: { params: CommentPostIdParamSchema },
  responses: {
    200: {
      description: '루트 댓글 + replies 배열',
      content: { 'application/json': { schema: CommentListResponseSchema } },
    },
    404: { description: '게시글 없음' },
  },
});

// POST /resume-posts/:post_id/comments
registry.registerPath({
  method: 'post',
  path: '/resume-posts/{post_id}/comments',
  tags: ['Comment'],
  summary: '이력서 댓글/대댓글 작성',
  security: [{ bearerAuth: [] }],
  request: {
    params: CommentPostIdParamSchema,
    body: { content: { 'application/json': { schema: CreateCommentSchema } } },
  },
  responses: {
    201: {
      description: '작성된 댓글',
      content: { 'application/json': { schema: CommentCreateResponseSchema } },
    },
    401: { description: '인증 필요' },
    404: { description: '부모 댓글 없음 (대댓글 시)' },
  },
});

resumeCommentRouter.get(
  '/',
  validate({ params: CommentPostIdParamSchema }),
  commentController.getResumeComments,
);
resumeCommentRouter.post(
  '/',
  authenticate,
  validate({ params: CommentPostIdParamSchema, body: CreateCommentSchema }),
  commentController.createResumeComment,
);

// ── 프로젝트 댓글 라우터 (/project-posts/:post_id/comments) ─
export const projectCommentRouter = Router({ mergeParams: true });

// GET /project-posts/:post_id/comments
registry.registerPath({
  method: 'get',
  path: '/project-posts/{post_id}/comments',
  tags: ['Comment'],
  summary: '프로젝트 댓글 목록',
  request: { params: CommentPostIdParamSchema },
  responses: {
    200: {
      description: '루트 댓글 + replies 배열',
      content: { 'application/json': { schema: CommentListResponseSchema } },
    },
    404: { description: '게시글 없음' },
  },
});

// POST /project-posts/:post_id/comments
registry.registerPath({
  method: 'post',
  path: '/project-posts/{post_id}/comments',
  tags: ['Comment'],
  summary: '프로젝트 댓글/대댓글 작성',
  security: [{ bearerAuth: [] }],
  request: {
    params: CommentPostIdParamSchema,
    body: { content: { 'application/json': { schema: CreateCommentSchema } } },
  },
  responses: {
    201: {
      description: '작성된 댓글',
      content: { 'application/json': { schema: CommentCreateResponseSchema } },
    },
    401: { description: '인증 필요' },
    404: { description: '부모 댓글 없음 (대댓글 시)' },
  },
});

projectCommentRouter.get(
  '/',
  validate({ params: CommentPostIdParamSchema }),
  commentController.getProjectComments,
);
projectCommentRouter.post(
  '/',
  authenticate,
  validate({ params: CommentPostIdParamSchema, body: CreateCommentSchema }),
  commentController.createProjectComment,
);

// ── 커뮤니티 댓글 라우터 (/community-posts/:post_id/comments) ─
export const communityCommentRouter = Router({ mergeParams: true });

registry.registerPath({
  method: 'get',
  path: '/community-posts/{post_id}/comments',
  tags: ['Comment'],
  summary: '커뮤니티 댓글 목록',
  request: { params: CommentPostIdParamSchema },
  responses: {
    200: {
      description: '루트 댓글 + replies 배열',
      content: { 'application/json': { schema: CommentListResponseSchema } },
    },
    404: { description: '게시글 없음' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/community-posts/{post_id}/comments',
  tags: ['Comment'],
  summary: '커뮤니티 댓글/대댓글 작성',
  security: [{ bearerAuth: [] }],
  request: {
    params: CommentPostIdParamSchema,
    body: { content: { 'application/json': { schema: CreateCommentSchema } } },
  },
  responses: {
    201: {
      description: '작성된 댓글',
      content: { 'application/json': { schema: CommentCreateResponseSchema } },
    },
    401: { description: '인증 필요' },
    404: { description: '부모 댓글 없음 (대댓글 시)' },
  },
});

communityCommentRouter.get(
  '/',
  validate({ params: CommentPostIdParamSchema }),
  commentController.getCommunityComments,
);
communityCommentRouter.post(
  '/',
  authenticate,
  validate({ params: CommentPostIdParamSchema, body: CreateCommentSchema }),
  commentController.createCommunityComment,
);

// ── 공용 댓글 삭제 라우터 (/comments/:comment_id) ─────────
export const commentRouter = Router();

// DELETE /comments/:comment_id
registry.registerPath({
  method: 'delete',
  path: '/comments/{comment_id}',
  tags: ['Comment'],
  summary: '댓글 삭제 (공용)',
  description:
    '대댓글이 있는 루트 댓글은 내용만 마스킹 처리되고, 대댓글이 없으면 완전 삭제됩니다.',
  security: [{ bearerAuth: [] }],
  request: { params: CommentIdParamSchema },
  responses: {
    200: {
      description: '삭제 완료',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }).openapi('DeleteResponse'),
        },
      },
    },
    401: { description: '인증 필요' },
    403: { description: '본인 댓글 아님' },
    404: { description: '댓글 없음' },
  },
});

commentRouter.delete(
  '/:comment_id',
  authenticate,
  validate({ params: CommentIdParamSchema }),
  commentController.deleteComment,
);
