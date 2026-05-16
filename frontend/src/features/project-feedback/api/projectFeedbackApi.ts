import { apiRequest } from "../../../lib/api/client";
import type {
  ProjectFeedbackCategory,
  ProjectFeedbackSort,
  ProjectPostsResponse,
} from "../model/projectFeedback";

type ProjectPostsQuery = {
  position?: Exclude<ProjectFeedbackCategory, "전체">;
  sort?: ProjectFeedbackSort;
  page?: number;
  size?: number;
};

export function getProjectPosts({ position, sort = "latest", page = 1, size = 10 }: ProjectPostsQuery = {}) {
  const params = new URLSearchParams({
    sort,
    page: String(page),
    size: String(size),
  });

  if (position) {
    params.set("position", position);
  }

  return apiRequest<ProjectPostsResponse>(`/project-posts?${params.toString()}`);
}
