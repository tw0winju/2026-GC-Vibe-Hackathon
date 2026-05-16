export type ResumeFeedbackCategory =
  | "전체"
  | "웹 개발"
  | "앱 개발"
  | "백엔드"
  | "AI/ML"
  | "데이터"
  | "인프라"
  | "보안"
  | "네트워크"
  | "기획";

export type ResumeFeedbackSort = "likes" | "latest";

export type ResumeFeedbackPost = {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  file_url?: string;
  thumbnail?: string;
  position: Exclude<ResumeFeedbackCategory, "전체">;
  likes: number;
  created_at?: string;
  updated_at?: string;
};

export const RESUME_FEEDBACK_CATEGORIES: ResumeFeedbackCategory[] = [
  "전체",
  "웹 개발",
  "앱 개발",
  "백엔드",
  "AI/ML",
  "데이터",
  "인프라",
  "보안",
  "네트워크",
  "기획",
];
