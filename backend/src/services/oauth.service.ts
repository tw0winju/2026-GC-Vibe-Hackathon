import { env } from '../config/env.js';
import { AppError } from '../middlewares/errorHandler.js';

export interface OAuthResult {
  providerUserId: string;
  accessToken: string;
  refreshToken: string | null;
  nickname: string;
}

// ============================================
// 카카오 OAuth
// ============================================
export const kakaoOAuth = async (code: string): Promise<OAuthResult> => {
  // 1. 인가코드 → 액세스 토큰 교환
  const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: env.KAKAO_CLIENT_ID,
      client_secret: env.KAKAO_CLIENT_SECRET,
      redirect_uri: env.KAKAO_REDIRECT_URI,
      code,
    }),
  });

  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    console.error('Kakao token exchange failed:', errorText);
    throw new AppError(401, '카카오 OAuth 토큰 교환 실패');
  }

  const tokenData = (await tokenRes.json()) as {
    access_token: string;
    refresh_token?: string;
  };

  // 2. 액세스 토큰으로 유저 정보 조회
  const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!userRes.ok) {
    throw new AppError(401, '카카오 유저 정보 조회 실패');
  }

  const userData = (await userRes.json()) as {
    id: number;
    kakao_account?: {
      profile?: { nickname?: string };
    };
  };

  return {
    providerUserId: String(userData.id),
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token ?? null,
    nickname: userData.kakao_account?.profile?.nickname ?? `kakao_${userData.id}`,
  };
};

// ============================================
// 구글 OAuth
// ============================================
export const googleOAuth = async (code: string): Promise<OAuthResult> => {
  // 1. 인가코드 → 액세스 토큰 교환
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      code,
    }),
  });

  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    console.error('Google token exchange failed:', errorText);
    throw new AppError(401, '구글 OAuth 토큰 교환 실패');
  }

  const tokenData = (await tokenRes.json()) as {
    access_token: string;
    refresh_token?: string;
  };

  // 2. 액세스 토큰으로 유저 정보 조회
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!userRes.ok) {
    throw new AppError(401, '구글 유저 정보 조회 실패');
  }

  const userData = (await userRes.json()) as {
    id: string;
    name?: string;
    email?: string;
  };

  return {
    providerUserId: String(userData.id),
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token ?? null,
    nickname:
      userData.name ?? userData.email?.split('@')[0] ?? `google_${userData.id}`,
  };
};