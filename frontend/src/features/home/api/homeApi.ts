import { apiRequest } from "../../../lib/api/client";

export type FeedbackStatus = "DONE" | "IN_PROGRESS" | "WAITING" | string;
export type FeedbackType = "RESUME" | "PROJECT" | string;

export type MyFeedbackItem = {
  id: number;
  type?: FeedbackType;
  title: string;
  status?: FeedbackStatus;
  createdAtText?: string;
  mentorCount?: number;
  summary?: string;
  commentCount?: number;
  viewCount?: number;
};

export type PopularFeedbackItem = {
  id: number;
  title: string;
  category?: "RESUME" | "PROJECT" | string;
  mentorRole?: string;
  authorRole?: string;
  viewCount?: number;
  commentCount?: number;
};

export type HomeResponse = {
  myResumeFeedbacks?: MyFeedbackItem[];
  myProjectFeedbacks?: MyFeedbackItem[];
  savedFeedbacks?: MyFeedbackItem[];
  popularFeedbacks?: PopularFeedbackItem[];
};

export function getHome() {
  return apiRequest<HomeResponse>("/api/home");
}
