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

export type ProjectFeedbackSort = "latest" | "like";

export type ProjectFeedbackPost = {
  post_id: number;
  title: string;
  description: string;
  thumbnail: string;
  like: number;
  position: Exclude<ProjectFeedbackCategory, "전체">;
  user: {
    user_id: number;
    nickname: string;
  };
  created_at: string;
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
