import { Router } from 'express';
import { registry } from '../config/openapi.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as userController from '../controllers/user.controller.js';
import {
  UserProfileSchema,
  MyProfileSchema,
  UpdateUserSchema,
  PaginationQuerySchema,
  UserListQuerySchema,
  UserPostListResponseSchema,
  UserCommentListResponseSchema,
  UserIdParamSchema,
} from '../schemas/user.schema.js';

const router = Router();

// ── Swagger 등록 ───────────────────────────────────────────

// GET /users/me  (응답에 tag + counts 포함)
registry.registerPath({
  method: 'get',
  path: '/users/me',
  tags: ['User'],
  summary: '내 프로필 조회 (tag + 활동 카운트 포함)',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: '내 프로필 + counts',
      content: { 'application/json': { schema: MyProfileSchema } },
    },
    401: { description: '인증 필요' },
  },
});

// GET /users/posts (내가 쓴 글)
// post_type=resume|project 로 필터 가능
registry.registerPath({
  method: 'get',
  path: '/users/posts',
  tags: ['User'],
  summary: '내가 쓴 글 목록 (post_type 필터)',
  security: [{ bearerAuth: [] }],
  request: { query: UserListQuerySchema },
  responses: {
    200: {
      description: '내가 쓴 글 목록',
      content: { 'application/json': { schema: UserPostListResponseSchema } },
    },
    401: { description: '인증 필요' },
  },
});

// GET /users/comments (작성한 댓글, post_type 필터)
registry.registerPath({
  method: 'get',
  path: '/users/comments',
  tags: ['User'],
  summary: '작성한 댓글 목록 (post_type 필터)',
  security: [{ bearerAuth: [] }],
  request: { query: UserListQuerySchema },
  responses: {
    200: {
      description: '작성한 댓글 목록',
      content: {
        'application/json': { schema: UserCommentListResponseSchema },
      },
    },
    401: { description: '인증 필요' },
  },
});

// GET /users/likes (좋아요한 게시글, post_type 필터)
registry.registerPath({
  method: 'get',
  path: '/users/likes',
  tags: ['User'],
  summary: '좋아요한 게시글 목록 (post_type 필터)',
  security: [{ bearerAuth: [] }],
  request: { query: UserListQuerySchema },
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
  request: { params: UserIdParamSchema },
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
router.get(
  '/posts',
  authenticate,
  validate({ query: UserListQuerySchema }),
  userController.getMyPosts,
);
router.get(
  '/comments',
  authenticate,
  validate({ query: UserListQuerySchema }),
  userController.getMyComments,
);
router.get(
  '/likes',
  authenticate,
  validate({ query: UserListQuerySchema }),
  userController.getMyLikes,
);
router.put(
  '/me',
  authenticate,
  validate({ body: UpdateUserSchema }),
  userController.updateMe,
);
router.get(
  '/:user_id',
  validate({ params: UserIdParamSchema }),
  userController.getUserById,
);

export default router;
