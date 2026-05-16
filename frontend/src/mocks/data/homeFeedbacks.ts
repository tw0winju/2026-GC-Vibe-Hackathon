import type { MyFeedbackItem, PopularFeedbackItem } from "../../features/home/api/homeApi";
import { projectFeedbackPosts } from "./projectFeedbacks";
import { resumeFeedbackPosts } from "./resumeFeedbacks";

export const homeMyFeedbacks: MyFeedbackItem[] = [
  ...resumeFeedbackPosts.slice(0, 3).map((post, index) => ({
    id: post.id,
    type: "RESUME" as const,
    title: post.title,
    createdAtText: post.createdAt,
    mentorCount: Math.max(1, Math.min(5, post.comments)),
    commentCount: post.comments,
    viewCount: post.views,
  })),
  ...projectFeedbackPosts.slice(0, 3).map((post, index) => ({
    id: post.post_id,
    type: "PROJECT" as const,
    title: post.title,
    createdAtText: formatRelativeProjectDate(post.created_at),
    mentorCount: Math.max(1, Math.min(5, Math.round(post.like / 30))),
    commentCount: Math.max(3, Math.round(post.like / 6)),
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
      category: "RESUME" as const,
      mentorRole: `${post.category} 멘토`,
      viewCount: post.views,
      commentCount: post.comments,
    })),
  ...projectFeedbackPosts
    .slice()
    .sort((a, b) => b.like - a.like)
    .slice(0, 2)
    .map((post) => ({
      id: post.post_id,
      title: post.title,
      category: "PROJECT" as const,
      mentorRole: `${post.position} 멘토`,
      commentCount: Math.max(3, Math.round(post.like / 6)),
    })),
]
  .sort((a, b) => (b.commentCount ?? 0) - (a.commentCount ?? 0))
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
