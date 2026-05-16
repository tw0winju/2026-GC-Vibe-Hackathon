import { z } from '../config/zod.js';

export const PROVIDERS = ['구글', '카카오톡'] as const;

// POST /auth/social/login
export const SocialLoginSchema = z.object({
  provider: z.enum(PROVIDERS).openapi({ example: '카카오톡' }),
  code: z.string().min(1).openapi({ example: 'oauth-authorization-code' }),
}).openapi('SocialLoginRequest');

export const SocialLoginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user_id: z.number().int(),
}).openapi('SocialLoginResponse');

// POST /auth/token/refresh
export const TokenRefreshSchema = z.object({
  refresh_token: z.string().min(1),
}).openapi('TokenRefreshRequest');

export const TokenRefreshResponseSchema = z.object({
  access_token: z.string(),
}).openapi('TokenRefreshResponse');

// POST /auth/logout
export const MessageResponseSchema = z.object({
  message: z.string(),
}).openapi('MessageResponse');

export type SocialLoginBody = z.infer<typeof SocialLoginSchema>;
export type TokenRefreshBody = z.infer<typeof TokenRefreshSchema>;