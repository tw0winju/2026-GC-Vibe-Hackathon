import { Router } from 'express';
import { registry } from '../config/openapi.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';
import * as authController from '../controllers/auth.controller.js';
import {
  SocialLoginSchema,
  SocialLoginResponseSchema,
  TokenRefreshSchema,
  TokenRefreshResponseSchema,
  MessageResponseSchema,
} from '../schemas/auth.schema.js';

const router = Router();

// POST /auth/social/login
registry.registerPath({
  method: 'post',
  path: '/auth/social/login',
  tags: ['Auth'],
  summary: '소셜 로그인 (카카오/구글)',
  request: {
    body: { content: { 'application/json': { schema: SocialLoginSchema } } },
  },
  responses: {
    200: {
      description: '로그인 성공',
      content: { 'application/json': { schema: SocialLoginResponseSchema } },
    },
    401: { description: 'OAuth 인증 실패' },
  },
});

// POST /auth/token/refresh
registry.registerPath({
  method: 'post',
  path: '/auth/token/refresh',
  tags: ['Auth'],
  summary: 'Access Token 갱신',
  request: {
    body: { content: { 'application/json': { schema: TokenRefreshSchema } } },
  },
  responses: {
    200: {
      description: '갱신 성공',
      content: { 'application/json': { schema: TokenRefreshResponseSchema } },
    },
    401: { description: '유효하지 않은 refresh token' },
  },
});

// POST /auth/logout
registry.registerPath({
  method: 'post',
  path: '/auth/logout',
  tags: ['Auth'],
  summary: '로그아웃',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: '로그아웃 성공',
      content: { 'application/json': { schema: MessageResponseSchema } },
    },
  },
});

// 실제 라우트
router.post('/social/login', validate({ body: SocialLoginSchema }), authController.socialLogin);
router.post('/token/refresh', validate({ body: TokenRefreshSchema }), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

export default router;