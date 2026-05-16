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
  title: string;
  description: string;
  category: Exclude<ResumeFeedbackCategory, "전체">;
  author: string;
  authorRole: string;
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
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
