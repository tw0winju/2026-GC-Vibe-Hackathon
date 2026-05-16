export const BASE_URL = import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") ?? "";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!BASE_URL) {
    throw new Error("VITE_BASE_URL이 설정되지 않았습니다. .env 파일을 확인해주세요.");
  }

  const { auth = true, headers, ...requestOptions } = options;
  const accessToken = localStorage.getItem("access_token");
  const bodyIsFormData = requestOptions.body instanceof FormData;
  const requestHeaders = new Headers(headers);

  if (!bodyIsFormData && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth && accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: requestHeaders,
    ...requestOptions,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? `API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}
