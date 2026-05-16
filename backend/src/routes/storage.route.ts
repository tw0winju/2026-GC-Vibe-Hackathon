import { Router } from 'express';
import { registry } from '../config/openapi.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';
import * as storageController from '../controllers/storage.controller.js';
import {
  UploadUrlRequestSchema,
  UploadUrlResponseSchema,
  GetFileUrlRequestSchema,
  GetFileUrlResponseSchema,
} from '../schemas/storage.schema.js';

const router = Router();

// POST /storage/upload-url
registry.registerPath({
  method: 'post',
  path: '/storage/upload-url',
  tags: ['Storage'],
  summary: '파일 업로드용 Presigned URL 발급',
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { 'application/json': { schema: UploadUrlRequestSchema } } },
  },
  responses: {
    200: {
      description: 'URL 발급 성공',
      content: { 'application/json': { schema: UploadUrlResponseSchema } },
    },
  },
});

// POST /storage/file-url
registry.registerPath({
  method: 'post',
  path: '/storage/file-url',
  tags: ['Storage'],
  summary: '파일 접근 URL 발급 (Private 파일은 Signed URL 반환)',
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { 'application/json': { schema: GetFileUrlRequestSchema } } },
  },
  responses: {
    200: {
      description: '성공',
      content: { 'application/json': { schema: GetFileUrlResponseSchema } },
    },
  },
});

router.post(
  '/upload-url',
  authenticate,
  validate({ body: UploadUrlRequestSchema }),
  storageController.getUploadUrl,
);

router.post(
  '/file-url',
  authenticate,
  validate({ body: GetFileUrlRequestSchema }),
  storageController.getFileUrl,
);

export default router;