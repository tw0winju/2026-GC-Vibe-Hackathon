import type { MyFeedbackItem, PopularFeedbackItem } from "../../features/home/api/homeApi";
import { projectFeedbackPosts } from "./projectFeedbacks";
import { resumeFeedbackPosts } from "./resumeFeedbacks";

export const homeMyFeedbacks: MyFeedbackItem[] = [
  ...resumeFeedbackPosts.slice(0, 3).map((post, index) => ({
    id: post.id,
    type: "RESUME" as const,
    title: post.title,
    created_at: post.created_at,
    likes: post.likes,
  })),
  ...projectFeedbackPosts.slice(0, 3).map((post, index) => ({
    id: post.id,
    type: "PROJECT" as const,
    title: post.title,
    created_at: post.created_at,
    likes: post.likes,
  })),
];

export const homePopularFeedbacks: PopularFeedbackItem[] = [
  ...resumeFeedbackPosts
    .slice()
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 2)
    .map((post) => ({
      id: post.id,
      title: post.title,
      type: "RESUME" as const,
      position: post.position,
      likes: post.likes,
    })),
  ...projectFeedbackPosts
    .slice()
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 2)
    .map((post) => ({
      id: post.id,
      title: post.title,
      type: "PROJECT" as const,
      position: post.position,
      likes: post.likes,
    })),
]
  .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
  .slice(0, 3);

function formatRelativeProjectDate(value: string) {
  const date = new Date(value);
  const now = new Date("2026-05-17T12:00:00+09:00");
  const diffHours = Math.max(1, Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60)));

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  return `${Math.round(diffHours / 24)}일 전`;
}
