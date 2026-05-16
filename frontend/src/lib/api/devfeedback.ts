import { apiRequest } from "./client";

export type Position =
  | "웹 개발"
  | "앱 개발"
  | "백엔드"
  | "AI/ML"
  | "인프라"
  | "보안"
  | "네트워크"
  | "기획"
  | "데이터";

export type PostType = "resume" | "project";
export type ApiSort = "latest" | "like";
export type FrontPostType = "RESUME" | "PROJECT";

export const POSITIONS: Position[] = [
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

export type ApiUser = {
  id?: number;
  user_id?: number;
  nickname: string;
  position?: Position;
};

export type MeResponse = {
  user_id: number;
  nickname: string;
  position: Position;
  introduction: string | null;
  school: string | null;
  grade: string | null;
  email: string | null;
  git_url: string | null;
  linked_url: string | null;
  blog_url: string | null;
  tag: string[];
  counts: {
    resume_post: number;
    project_post: number;
    like: number;
    comment: number;
  };
};

export type ResumePost = {
  id: number;
  title: string;
  description: string;
  file_url?: string | null;
  thumbnail?: string | null;
  likes: number;
  liked?: boolean;
  position: Position;
  created_at: string;
  updated_at?: string;
  user?: ApiUser;
  comments?: CommentNode[];
};

export type ProjectPost = {
  id: number;
  title: string;
  description: string;
  thumbnail?: string | null;
  likes: number;
  liked?: boolean;
  position: Position;
  tag: string[];
  created_at: string;
  updated_at?: string;
  user?: ApiUser;
  comments?: CommentNode[];
};

export type UserListPost = {
  post_id: number;
  title: string;
  description: string;
  thumbnail?: string | null;
  likes: number;
  position: Position;
  type: PostType;
  user: {
    user_id: number;
    nickname: string;
  };
  created_at: string;
};

export type PostsResponse<T> = {
  posts: T[];
  total: number;
  page: number;
  size?: number;
};

export type ListPostsParams = {
  page?: number;
  size?: number;
  position?: Position;
  sort?: ApiSort;
  keyword?: string;
};

export type UserListParams = {
  page?: number;
  size?: number;
  post_type?: PostType;
};

export type CommentNode = {
  comment_id: number;
  comment_parent_id?: number;
  user_id: number;
  user: {
    nickname: string;
  };
  content: string;
  created_at: string;
  replies?: CommentNode[];
};

export type CommentsResponse = {
  comments: CommentNode[];
};

export type UserComment = {
  id: number;
  content: string;
  post_id: number;
  post_title?: string;
  post_type: PostType;
  created_at: string;
};

export type UserCommentsResponse = {
  comments: UserComment[];
  total: number;
  page: number;
};

export type UploadUrlResponse = {
  upload_url: string;
  file_path: string;
  token: string;
  max_size: number;
};

export type FileUrlResponse = {
  url: string;
};

export type CreateResumePostBody = {
  title: string;
  description: string;
  file_url: string;
  thumbnail?: string;
  position: Position;
};

export type CreateProjectPostBody = {
  title: string;
  description: string;
  thumbnail?: string;
  position: Position;
  tag: string[];
};

export type UpdateResumePostBody = Partial<CreateResumePostBody>;
export type UpdateProjectPostBody = Partial<CreateProjectPostBody>;

export type UpdateProfileBody = Partial<{
  nickname: string;
  position: Position;
  introduction: string;
  git_url: string;
  linked_url: string;
  blog_url: string;
  tag: string[];
}>;

export function toQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  return query.toString();
}

export function getMe() {
  return apiRequest<MeResponse>("/users/me");
}

export function updateMe(body: UpdateProfileBody) {
  return apiRequest<Omit<MeResponse, "counts">>("/users/me", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function getResumePosts(params: ListPostsParams = {}) {
  return apiRequest<PostsResponse<ResumePost>>(`/resume-posts?${toQuery(params)}`, { auth: false });
}

export function getProjectPosts(params: ListPostsParams = {}) {
  return apiRequest<PostsResponse<ProjectPost>>(`/project-posts?${toQuery(params)}`, { auth: false });
}

export function getResumePost(postId: number) {
  return apiRequest<ResumePost>(`/resume-posts/${postId}`);
}

export function getProjectPost(postId: number) {
  return apiRequest<ProjectPost>(`/project-posts/${postId}`);
}

export function createResumePost(body: CreateResumePostBody) {
  return apiRequest<ResumePost>("/resume-posts", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function createProjectPost(body: CreateProjectPostBody) {
  return apiRequest<ProjectPost>("/project-posts", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateResumePost(postId: number, body: UpdateResumePostBody) {
  return apiRequest<ResumePost>(`/resume-posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function updateProjectPost(postId: number, body: UpdateProjectPostBody) {
  return apiRequest<ProjectPost>(`/project-posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteResumePost(postId: number) {
  return apiRequest<Record<string, never>>(`/resume-posts/${postId}`, { method: "DELETE" });
}

export function deleteProjectPost(postId: number) {
  return apiRequest<Record<string, never>>(`/project-posts/${postId}`, { method: "DELETE" });
}

export function toggleResumeLike(postId: number) {
  return apiRequest<{ likes: number; liked: boolean }>(`/resume-posts/${postId}/like`, { method: "POST" });
}

export function toggleProjectLike(postId: number) {
  return apiRequest<{ likes: number; liked: boolean }>(`/project-posts/${postId}/like`, { method: "POST" });
}

export function getResumeComments(postId: number) {
  return apiRequest<CommentsResponse>(`/resume-posts/${postId}/comments`, { auth: false });
}

export function getProjectComments(postId: number) {
  return apiRequest<CommentsResponse>(`/project-posts/${postId}/comments`, { auth: false });
}

export function createResumeComment(postId: number, content: string, comment_parent_id?: number) {
  return apiRequest<CommentNode>(`/resume-posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content, comment_parent_id }),
  });
}

export function createProjectComment(postId: number, content: string, comment_parent_id?: number) {
  return apiRequest<CommentNode>(`/project-posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content, comment_parent_id }),
  });
}

export function deleteComment(commentId: number) {
  return apiRequest<{ message: string }>(`/comments/${commentId}`, { method: "DELETE" });
}

export function getMyPosts(params: UserListParams = {}) {
  return apiRequest<PostsResponse<UserListPost>>(`/users/posts?${toQuery(params)}`);
}

export function getMyLikes(params: UserListParams = {}) {
  return apiRequest<PostsResponse<UserListPost>>(`/users/likes?${toQuery(params)}`);
}

export function getMyComments(params: UserListParams = {}) {
  return apiRequest<UserCommentsResponse>(`/users/comments?${toQuery(params)}`);
}

export function getUploadUrl(body: { type: "resume" | "thumbnail"; filename: string; mime_type: string }) {
  return apiRequest<UploadUrlResponse>("/storage/upload-url", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function uploadFileToSignedUrl(uploadUrl: string, file: File) {
  const formData = new FormData();
  formData.append("cacheControl", "3600");
  formData.append("", file);

  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`파일 업로드에 실패했습니다: ${response.status}`);
  }
}

export function getFileUrl(body: { type: "resume" | "thumbnail"; file_path: string }) {
  return apiRequest<FileUrlResponse>("/storage/file-url", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function adaptFrontPostType(type?: PostType): FrontPostType {
  return type === "project" ? "PROJECT" : "RESUME";
}

export function adaptPostType(type?: FrontPostType): PostType | undefined {
  if (!type) return undefined;
  return type === "PROJECT" ? "project" : "resume";
}
