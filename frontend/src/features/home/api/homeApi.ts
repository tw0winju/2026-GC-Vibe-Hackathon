export type FeedbackStatus = "DONE" | "IN_PROGRESS" | "WAITING" | string;
export type FeedbackType = "RESUME" | "PROJECT" | string;

export type MyFeedbackItem = {
  id: number;
  type?: FeedbackType;
  title: string;
  status?: FeedbackStatus;
  summary?: string;
  created_at?: string;
  likes?: number;
};

export type PopularFeedbackItem = {
  id: number;
  title: string;
  type?: "RESUME" | "PROJECT" | string;
  position?: string;
  likes?: number;
};

export type HomeResponse = {
  myResumeFeedbacks?: MyFeedbackItem[];
  myProjectFeedbacks?: MyFeedbackItem[];
  savedFeedbacks?: MyFeedbackItem[];
  popularFeedbacks?: PopularFeedbackItem[];
};
