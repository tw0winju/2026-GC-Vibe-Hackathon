import { apiRequest } from "../../../lib/api/client";

export type AuthProvider = "kakao" | "google";
export type ApiAuthProvider = "카카오톡" | "구글";

export type SocialLoginResponse = {
  access_token: string;
  refresh_token: string;
  user_id: number;
};

const API_PROVIDER_BY_PROVIDER: Record<AuthProvider, ApiAuthProvider> = {
  kakao: "카카오톡",
  google: "구글",
};

export function socialLogin(provider: AuthProvider, code: string) {
  return apiRequest<SocialLoginResponse>("/auth/social/login", {
    auth: false,
    method: "POST",
    body: JSON.stringify({
      provider: API_PROVIDER_BY_PROVIDER[provider],
      code,
    }),
  });
}

export function refreshAccessToken(refresh_token: string) {
  return apiRequest<{ access_token: string }>("/auth/token/refresh", {
    auth: false,
    method: "POST",
    body: JSON.stringify({ refresh_token }),
  });
}

export function logout() {
  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
  });
}
