export const BASE_URL = import.meta.env.VITE_BASE_URL?.replace(/\/$/, "") ?? "";

type RequestOptions = RequestInit & {
  auth?: boolean;
};

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  const response = await fetch(`${BASE_URL}/auth/token/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) return null;

  localStorage.setItem("access_token", data.access_token);
  return data.access_token;
}

async function parseErrorMessage(response: Response) {
  const error = await response.json().catch(() => null);
  return error?.message ?? `API request failed: ${response.status}`;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!BASE_URL) {
    throw new Error("VITE_BASE_URL이 설정되지 않았습니다. .env 파일을 확인해주세요.");
  }

  const { auth = true, headers, ...requestOptions } = options;
  const bodyIsFormData = requestOptions.body instanceof FormData;

  const createHeaders = (token: string | null) => {
    const requestHeaders = new Headers(headers);

    if (!bodyIsFormData && !requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }

    if (auth && token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    return requestHeaders;
  };

  const send = (token: string | null) =>
    fetch(`${BASE_URL}${path}`, {
      headers: createHeaders(token),
      ...requestOptions,
    });

  let response = await send(localStorage.getItem("access_token"));

  if (auth && response.status === 401 && path !== "/auth/token/refresh") {
    const nextAccessToken = await refreshAccessToken();
    if (nextAccessToken) {
      response = await send(nextAccessToken);
    }
  }

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}
