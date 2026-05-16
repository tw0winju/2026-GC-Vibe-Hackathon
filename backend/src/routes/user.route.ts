import { Router } from 'express';
import { registry } from '../config/openapi.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as userController from '../controllers/user.controller.js';
import {
  UserProfileSchema,
  UpdateUserSchema,
  PaginationQuerySchema,
  UserPostListResponseSchema,
  UserIdParamSchema,
} from '../schemas/user.schema.js';
import { z } from '../config/zod.js';

const router = Router();

// ── Swagger 등록 ───────────────────────────────────────────

// GET /users/me
registry.registerPath({
  method: 'get',
  path: '/users/me',
  tags: ['User'],
  summary: '내 프로필 조회',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: '내 프로필',
      content: { 'application/json': { schema: UserProfileSchema } },
    },
    401: { description: '인증 필요' },
  },
});

// GET /users/posts (내가 쓴 글)
registry.registerPath({
  method: 'get',
  path: '/users/posts',
  tags: ['User'],
  summary: '내가 쓴 글 목록',
  security: [{ bearerAuth: [] }],
  request: {
    query: PaginationQuerySchema,
  },
  responses: {
    200: {
      description: '내가 쓴 글 목록',
      content: { 'application/json': { schema: UserPostListResponseSchema } },
    },
    401: { description: '인증 필요' },
  },
});

// GET /users/comments (작성한 댓글)
registry.registerPath({
  method: 'get',
  path: '/users/comments',
  tags: ['User'],
  summary: '작성한 댓글 목록',
  security: [{ bearerAuth: [] }],
  request: { query: PaginationQuerySchema },
  responses: {
    200: {
      description: '작성한 댓글 목록',
      content: {
        'application/json': {
          schema: z.object({ comments: z.array(z.any()), total: z.number(), page: z.number() }),
        },
      },
    },
    401: { description: '인증 필요' },
  },
});

// GET /users/likes (좋아요 목록)
registry.registerPath({
  method: 'get',
  path: '/users/likes',
  tags: ['User'],
  summary: '좋아요 목록',
  security: [{ bearerAuth: [] }],
  request: { query: PaginationQuerySchema },
  responses: {
    200: {
      description: '좋아요한 게시글 목록',
      content: { 'application/json': { schema: UserPostListResponseSchema } },
    },
    401: { description: '인증 필요' },
  },
});

// PUT /users/me
registry.registerPath({
  method: 'put',
  path: '/users/me',
  tags: ['User'],
  summary: '내 프로필 수정',
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { 'application/json': { schema: UpdateUserSchema } } },
  },
  responses: {
    200: {
      description: '수정된 프로필',
      content: { 'application/json': { schema: UserProfileSchema } },
    },
    401: { description: '인증 필요' },
    409: { description: '닉네임 중복' },
  },
});

// GET /users/:user_id
registry.registerPath({
  method: 'get',
  path: '/users/{user_id}',
  tags: ['User'],
  summary: '타 유저 프로필 조회',
  request: {
    params: UserIdParamSchema,
  },
  responses: {
    200: {
      description: '유저 프로필',
      content: { 'application/json': { schema: UserProfileSchema } },
    },
    404: { description: '유저 없음' },
  },
});

// ── 실제 라우트 ────────────────────────────────────────────
// ⚠️ 순서 중요: /me, /posts 등 고정 경로가 /:user_id 보다 앞에 와야 함

router.get('/me', authenticate, userController.getMe);
router.get('/posts', authenticate, validate({ query: PaginationQuerySchema }), userController.getMyPosts);
router.get('/comments', authenticate, validate({ query: PaginationQuerySchema }), userController.getMyComments);
router.get('/likes', authenticate, validate({ query: PaginationQuerySchema }), userController.getMyLikes);
router.put('/me', authenticate, validate({ body: UpdateUserSchema }), userController.updateMe);
router.get('/:user_id', validate({ params: UserIdParamSchema }), userController.getUserById);

export default router;
