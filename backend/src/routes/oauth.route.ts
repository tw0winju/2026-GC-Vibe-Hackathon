import { Router, Request, Response } from "express";
import { env } from "../config/env.js";
import * as authService from "../services/auth.service.js";
import { AppError } from "../middlewares/errorHandler.js";

// ============================================
// 1단계: OAuth 인증 시작
// 프론트가 이 엔드포인트로 사용자를 보내면, 카카오/구글 인증 페이지로 리다이렉트됨
// ============================================
const router = Router();

// GET /oauth2/authorization/kakao
router.get("/authorization/kakao", (_req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.KAKAO_CLIENT_ID || "",
    redirect_uri: process.env.KAKAO_REDIRECT_URI || "",
    response_type: "code",
  });
  res.redirect(`https://kauth.kakao.com/oauth/authorize?${params.toString()}`);
});

// GET /oauth2/authorization/google
router.get("/authorization/google", (_req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });
  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
});

export default router;

// ============================================
// 2단계: OAuth 콜백
// 카카오/구글이 인증 완료 후 이 URL로 리다이렉트 (code 포함)
// 백엔드가 code로 토큰 교환 + 유저 처리 + JWT 발급 후 프론트로 리다이렉트
// ============================================
export const oauthCallbackRouter = Router();

// GET /login/oauth2/code/kakao
oauthCallbackRouter.get("/kakao", async (req, res) => {
  await handleOAuthCallback(req, res, "카카오톡");
});

// GET /login/oauth2/code/google
oauthCallbackRouter.get("/google", async (req, res) => {
  await handleOAuthCallback(req, res, "구글");
});

async function handleOAuthCallback(
  req: Request,
  res: Response,
  provider: "카카오톡" | "구글",
) {
  const code = req.query.code as string | undefined;
  const oauthError = req.query.error as string | undefined;

  // OAuth 페이지에서 에러 (사용자 취소 등)
  if (oauthError) {
    return res.redirect(
      `${process.env.FRONTEND_CALLBACK_URL || "http://localhost:5173/auth/callback"}?error=${encodeURIComponent(oauthError)}`,
    );
  }

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_CALLBACK_URL || "http://localhost:5173/auth/callback"}?error=missing_code`);
  }

  try {
    // 기존 socialLogin 로직 재사용 (code → 토큰 교환 → 유저 처리 → JWT 발급)
    const result = await authService.socialLogin(provider, code);

    // 토큰을 쿼리 파라미터로 프론트엔드 콜백 페이지에 전달
    const params = new URLSearchParams({
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      user_id: String(result.user_id),
    });
    return res.redirect(`${process.env.FRONTEND_CALLBACK_URL || "http://localhost:5173/auth/callback"}?${params.toString()}`);
  } catch (err) {
    const message = err instanceof AppError ? err.message : "login_failed";
    return res.redirect(
      `${process.env.FRONTEND_CALLBACK_URL || "http://localhost:5173/auth/callback"}?error=${encodeURIComponent(message)}`,
    );
  }
}
