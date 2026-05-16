import { apiRequest, BASE_URL } from "../../../lib/api/client";

export type AuthProvider = "kakao" | "google";

export type MeResponse = {
  id: number;
  email: string;
  nickname?: string;
  onboardingCompleted?: boolean;
};

const OAUTH_PATH_BY_PROVIDER: Record<AuthProvider, string> = {
  kakao: "/oauth2/authorization/kakao",
  google: "/oauth2/authorization/google",
};

export function getMe() {
  return apiRequest<MeResponse>("/api/auth/me");
}

export function getOAuthUrl(provider: AuthProvider) {
  return `${BASE_URL}${OAUTH_PATH_BY_PROVIDER[provider]}`;
}
