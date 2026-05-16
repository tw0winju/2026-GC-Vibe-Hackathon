import { supabase } from "../config/supabase.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyToken,
} from "../utils/jwt.js";
import { hashToken } from "../utils/hash.js";
import { kakaoOAuth, googleOAuth, OAuthResult } from "./oauth.service.js";
import { AppError } from "../middlewares/errorHandler.js";
import { Provider } from "../constants/enums.js";

// ============================================
// 소셜 로그인
// POST /auth/social/login
// ============================================
export const socialLogin = async (provider: Provider, code: string) => {
  // 1. OAuth 토큰 교환 + 유저 정보 조회
  const oauthResult: OAuthResult =
    provider === "카카오톡" ? await kakaoOAuth(code) : await googleOAuth(code);

  // 2. social_accounts 조회 → 기존 유저인지 확인
  const { data: existing, error: existingErr } = await supabase
    .from("social_accounts")
    .select("user_id")
    .eq("provider", provider)
    .eq("provider_user_id", oauthResult.providerUserId)
    .maybeSingle();

  if (existingErr) {
    console.error("Social account lookup failed:", existingErr);
    throw new AppError(500, "소셜 계정 조회 실패");
  }

  let userId: number;

  if (existing) {
    // ----- 기존 유저: SocialAccount 토큰 갱신 -----
    userId = existing.user_id;

    const { error: updateErr } = await supabase
      .from("social_accounts")
      .update({
        access_token: oauthResult.accessToken,
        refresh_token: oauthResult.refreshToken,
        updated_at: new Date().toISOString(),
      })
      .eq("provider", provider)
      .eq("provider_user_id", oauthResult.providerUserId);

    if (updateErr) {
      console.error("Social account update failed:", updateErr);
      throw new AppError(500, "소셜 계정 업데이트 실패");
    }
  } else {
    // ----- 신규 유저: User + SocialAccount 생성 -----
    const nickname = await generateUniqueNickname(oauthResult.nickname);

    const { data: newUser, error: userErr } = await supabase
      .from("users")
      .insert({
        nickname,
        position: "웹 개발",
        introduction: null,
        git_url: null,
        linked_url: null,
        blog_url: null,
        tag: [],
      })
      .select("id")
      .single();

    if (userErr || !newUser) {
      console.error("User creation failed:", userErr);
      throw new AppError(500, "유저 생성 실패");
    }
    userId = newUser.id;

    const { error: socialErr } = await supabase.from("social_accounts").insert({
      provider,
      provider_user_id: oauthResult.providerUserId,
      access_token: oauthResult.accessToken,
      refresh_token: oauthResult.refreshToken,
      user_id: userId,
    });

    if (socialErr) {
      console.error("Social account creation failed:", socialErr);
      // 롤백: 방금 만든 유저 삭제
      await supabase.from("users").delete().eq("id", userId);
      throw new AppError(500, "소셜 계정 등록 실패");
    }
  }

  // 3. JWT 발급
  const accessToken = signAccessToken({ userId });
  const refreshToken = signRefreshToken({ userId });

  // 4. RefreshToken 해시값 저장
  const { error: rtErr } = await supabase.from("refresh_tokens").insert({
    token_hash: hashToken(refreshToken),
    user_id: userId,
  });

  if (rtErr) {
    console.error("Refresh token creation failed:", rtErr);
    throw new AppError(500, "RefreshToken 저장 실패");
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user_id: userId,
  };
};

// ============================================
// Access Token 갱신
// POST /auth/token/refresh
// ============================================
export const refreshAccessToken = async (refreshToken: string) => {
  // 1. JWT 자체 검증 (서명 + 만료)
  let payload;
  try {
    payload = verifyToken(refreshToken);
  } catch {
    throw new AppError(401, "유효하지 않은 refresh token");
  }

  // 2. DB에 저장된 token_hash와 일치하는지 확인
  const { data, error } = await supabase
    .from("refresh_tokens")
    .select("id")
    .eq("token_hash", hashToken(refreshToken))
    .eq("user_id", payload.userId)
    .maybeSingle();

  if (error) throw new AppError(500, "RefreshToken 조회 실패");
  if (!data) throw new AppError(401, "등록되지 않은 refresh token");

  // 3. 새 access_token 발급
  return {
    access_token: signAccessToken({ userId: payload.userId }),
  };
};

// ============================================
// 로그아웃
// POST /auth/logout
// ============================================
export const logout = async (userId: number) => {
  const { error } = await supabase
    .from("refresh_tokens")
    .delete()
    .eq("user_id", userId);

  if (error) throw new AppError(500, "로그아웃 실패");

  return { message: "ok" };
};

// ============================================
// 내부 헬퍼: 닉네임 중복 처리
// ============================================
const generateUniqueNickname = async (base: string): Promise<string> => {
  const normalizedBase = normalizeNickname(base);
  let nickname = normalizedBase;
  let suffix = 0;

  while (true) {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("nickname", nickname)
      .maybeSingle();

    if (error) {
      console.error("Nickname lookup failed:", error);
      throw new AppError(500, "닉네임 중복 확인 실패");
    }

    if (!data) return nickname;
    suffix += 1;
    const suffixText = `_${suffix}`;
    nickname = `${normalizedBase.slice(0, 30 - suffixText.length)}${suffixText}`;

    // 무한 루프 방지
    if (suffix > 1000) {
      const fallbackSuffix = `_${Date.now()}`;
      nickname = `${normalizedBase.slice(0, 30 - fallbackSuffix.length)}${fallbackSuffix}`;
      return nickname;
    }
  }
};

const normalizeNickname = (value: string) => {
  const trimmed = value.trim();
  const fallback = trimmed || "kakao_user";

  return fallback.slice(0, 30);
};
