import type { PostType, UserListPost } from "../../../lib/api/devfeedback";

export function getPostTypeLabel(type?: PostType | string) {
  if (type === "project" || type === "PROJECT") return "프로젝트";
  if (type === "community" || type === "COMMUNITY") return "커뮤니티";
  return "포트폴리오";
}

export function getPostDetailPath(type: PostType | string | undefined, id: number) {
  if (type === "project" || type === "PROJECT") return `/project-feedbacks/${id}`;
  if (type === "community" || type === "COMMUNITY") return `/community/${id}`;
  return `/resume-feedbacks/${id}`;
}

export function getPostTags(post: UserListPost) {
  return [post.type === "community" ? post.category : post.position].filter(Boolean) as string[];
}
