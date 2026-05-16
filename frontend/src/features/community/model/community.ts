import type { CommunityCategory } from "../../../lib/api/devfeedback";

export const COMMUNITY_CATEGORIES = [
  "전체",
  "자유",
  "프로젝트 팀 구하기",
  "취업&진로",
] as const;

export type CommunityCategoryFilter = (typeof COMMUNITY_CATEGORIES)[number];
export type CommunityPostCategory = CommunityCategory;
export type CommunitySort = "latest" | "likes";
