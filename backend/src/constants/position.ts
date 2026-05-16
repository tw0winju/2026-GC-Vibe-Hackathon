export const POSITION_VALUES = [
  "웹 개발",
  "앱 개발",
  "백엔드",
  "AI/ML",
  "인프라",
  "보안",
  "네트워크",
  "기획",
] as const;

export type Position = (typeof POSITION_VALUES)[number];