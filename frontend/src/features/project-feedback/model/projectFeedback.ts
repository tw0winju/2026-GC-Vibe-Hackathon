export type ProjectFeedbackCategory =
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

export type ProjectFeedbackSort = "latest" | "likes";

export type ProjectFeedbackPost = {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  likes: number;
  position: Exclude<ProjectFeedbackCategory, "전체">;
  created_at?: string;
  updated_at?: string;
  tag?: string[];
};

export const PROJECT_FEEDBACK_CATEGORIES: ProjectFeedbackCategory[] = [
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

export type ProjectPostsResponse = {
  posts: ProjectFeedbackPost[];
  total: number;
  page: number;
};
