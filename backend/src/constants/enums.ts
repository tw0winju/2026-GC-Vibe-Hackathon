export const PROVIDERS = ["google", "kakao", "구글", "카카오톡"] as const;

export type Provider = (typeof PROVIDERS)[number];

export const POSITIONS = [
  "웹 개발",
  "앱 개발",
  "백엔드",
  "AI/ML",
  "인프라",
  "보안",
  "네트워크",
  "기획",
] as const;

export type Position = (typeof POSITIONS)[number];
