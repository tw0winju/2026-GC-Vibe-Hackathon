import { z } from '../config/zod.js';

export const UploadUrlRequestSchema = z.object({
  type: z.enum(['resume', 'thumbnail']).openapi({ example: 'thumbnail' }),
  filename: z.string().min(1).openapi({ example: 'cover.png' }),
  mime_type: z.string().min(1).openapi({ example: 'image/png' }),
}).openapi('UploadUrlRequest');

export const UploadUrlResponseSchema = z.object({
  upload_url: z.string().url(),
  file_path: z.string(),
  token: z.string(),
  max_size: z.number().int(),
}).openapi('UploadUrlResponse');

export const GetFileUrlRequestSchema = z.object({
  type: z.enum(['resume', 'thumbnail']),
  file_path: z.string(),
}).openapi('GetFileUrlRequest');

export const GetFileUrlResponseSchema = z.object({
  url: z.string().url(),
}).openapi('GetFileUrlResponse');