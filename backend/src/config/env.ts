import dotenv from "dotenv";
import { z } from "./zod.js";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // JWT
  JWT_SECRET: z.string().min(32, "JWT_SECRET은 최소 32자 이상이어야 합니다"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("1h"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("14d"),

  // CORS
  CORS_ORIGIN: z.string().default("*"),

  // OAuth
  KAKAO_CLIENT_ID: z.string().min(1),
  KAKAO_CLIENT_SECRET: z.string().min(1),
  KAKAO_REDIRECT_URI: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().url(),

  // OAuth 성공 후 프론트엔드로 토큰을 전달할 URL
  // 예: http://localhost:5173/auth/callback
  FRONTEND_CALLBACK_URL: z.string().url(),

  // Storage
  SUPABASE_BUCKET_RESUME: z.string().default("resume-files"),
  SUPABASE_BUCKET_THUMBNAIL: z.string().default("thumbnails"),
  MAX_FILE_SIZE_PDF: z.coerce.number().default(10 * 1024 * 1024),
  MAX_FILE_SIZE_IMAGE: z.coerce.number().default(5 * 1024 * 1024),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ 환경변수 검증 실패:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
