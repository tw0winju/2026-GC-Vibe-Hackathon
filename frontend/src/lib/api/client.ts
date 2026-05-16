const DEFAULT_BASE_URL = "http://localhost:8080";

export const BASE_URL = (import.meta.env.VITE_BASE_URL ?? DEFAULT_BASE_URL).replace(
  /\/$/,
  "",
);

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: options.auth === false ? "same-origin" : "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
