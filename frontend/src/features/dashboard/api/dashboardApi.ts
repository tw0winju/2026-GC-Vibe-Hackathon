import { apiRequest } from "../../../lib/api/client";

export type DashboardFeedbackType = "RESUME" | "PROJECT" | string;

export type DashboardProfile = {
  name?: string;
  major?: string;
  grade?: string;
  bio?: string;
  avatarUrl?: string;
  githubUrl?: string;
  email?: string;
  blogUrl?: string;
  location?: string;
  techStacks?: string[];
};

export type DashboardStats = {
  resumePostCount?: number;
  projectPostCount?: number;
  likedPostCount?: number;
  commentCount?: number;
};

export type DashboardPost = {
  id: number;
  type?: DashboardFeedbackType;
  title: string;
  description?: string;
  createdAtText?: string;
  commentCount?: number;
  likeCount?: number;
};

export type DashboardPopularFeedback = {
  id: number;
  rank?: number;
  type?: DashboardFeedbackType;
  title: string;
  mentorRole?: string;
  commentCount?: number;
  likeCount?: number;
};

export type DashboardLikedPost = {
  id: number;
  type?: DashboardFeedbackType;
  title: string;
  authorRole?: string;
  createdAtText?: string;
};

export type DashboardResponse = {
  profile?: DashboardProfile;
  stats?: DashboardStats;
  recentPosts?: DashboardPost[];
  popularFeedbacks?: DashboardPopularFeedback[];
  likedPosts?: DashboardLikedPost[];
};

export function getDashboard() {
  return apiRequest<DashboardResponse>("/api/me/dashboard");
}
