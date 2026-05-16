import { supabase } from "../config/supabase.js";
import { AppError } from "../middlewares/errorHandler.js";
import type { Position } from "../constants/enums.js";

type ListProjectPostsInput = {
  position?: Position;
  sort: "latest" | "like";
  page: number;
  size: number;
};

type ProjectPostInput = {
  title?: string;
  description?: string;
  file_url?: string;
  thumbnail?: string;
  position?: Position;
  tag?: Array<string>;
};

const PROJECT_POST_SELECT =
  "id,title,description,thumbnail,likes,position,created_at,user:users(id,nickname)";

export const listProjectPosts = async (query: ListProjectPostsInput) => {
  const from = (query.page - 1) * query.size;
  const to = from + query.size - 1;
  const orderColumn = query.sort === "like" ? "like" : "created_at";

  let request = supabase
    .from("project_posts")
    .select(PROJECT_POST_SELECT, { count: "exact" })
    .order(orderColumn, { ascending: false })
    .range(from, to);

  if (query.position) {
    request = request.eq("position", query.position);
  }

  const { data, error, count } = await request;

  if (error) {
    throw new AppError(500, "프로젝트 게시글 목록 조회에 실패했습니다.");
  }

  return {
    posts: data ?? [],
    total: count ?? 0,
    page: query.page,
    size: query.size,
  };
};

export const createProjectPost = async (
  userId: number,
  input: Required<ProjectPostInput>,
) => {
  const { data, error } = await supabase
    .from("project_posts")
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description,
      thumbnail: input.thumbnail,
      position: input.position,
      tag: input.tag,
      like: 0,
    })
    .select("id,title,description,file_url,thumbnail,likes,position,created_at")
    .single();

  if (error || !data) {
    throw new AppError(500, "프로젝트 게시글 작성에 실패했습니다.");
  }

  return data;
};

export const getProjectPost = async (postId: number) => {
  const { data: post, error } = await supabase
    .from("project_posts")
    .select(
      "id,title,description,thumbnail,likes,position,tag,created_at,updated_at,user:users(id,nickname,position)",
    )
    .eq("id", postId)
    .single();

  if (error || !post) {
    throw new AppError(404, "프로젝트 게시글을 찾을 수 없습니다.");
  }

  const { data: comments, error: commentError } = await supabase
    .from("comments")
    .select(
      "id,user_id,content,comment_parent_id,created_at,user:users(id,nickname)",
    )
    .eq("post_type", "project")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (commentError) {
    return { ...post, comments: [] };
  }

  return { ...post, comments: comments ?? [] };
};

export const updateProjectPost = async (
  postId: number,
  userId: number,
  input: ProjectPostInput,
) => {
  await assertProjectPostOwner(postId, userId);

  const { data, error } = await supabase
    .from("project_posts")
    .update(input)
    .eq("id", postId)
    .select("id,title,description,thumbnail,likes,position,tag,updated_at")
    .single();

  if (error || !data) {
    throw new AppError(500, "프로젝트 게시글 수정에 실패했습니다.");
  }

  return data;
};

export const deleteProjectPost = async (postId: number, userId: number) => {
  await assertProjectPostOwner(postId, userId);

  await supabase.from("comments").delete().eq("post_id", postId);
  await supabase
    .from("likes")
    .delete()
    .eq("post_type", "project")
    .eq("post_id", postId);

  const { error } = await supabase
    .from("project_posts")
    .delete()
    .eq("post_type", "project")
    .eq("id", postId);

  if (error) {
    throw new AppError(500, "프로젝트 게시글 삭제에 실패했습니다.");
  }
};

export const likeProjectPost = async (postId: number, userId: number) => {
  const { data: post, error: readError } = await supabase
    .from("project_posts")
    .select("id,like")
    .eq("id", postId)
    .single();

  if (readError || !post) {
    throw new AppError(404, "프로젝트 게시글을 찾을 수 없습니다.");
  }

  const { data: likedRow, error: likeReadError } = await supabase
    .from("likes")
    .select("id")
    .eq("post_type", "project")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (likeReadError) {
    throw new AppError(500, "프로젝트 게시글 좋아요 조회에 실패했습니다.");
  }

  const liked = !likedRow;
  const nextLike = liked
    ? Number(post.like ?? 0) + 1
    : Math.max(Number(post.like ?? 0) - 1, 0);

  if (liked) {
    const { error } = await supabase.from("likes").insert({
      post_id: postId,
      user_id: userId,
      post_type: "project",
    });

    if (error) {
      throw new AppError(500, "프로젝트 게시글 좋아요 등록에 실패했습니다.");
    }
  } else {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("post_type", "project")
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (error) {
      throw new AppError(500, "프로젝트 게시글 좋아요 취소에 실패했습니다.");
    }
  }

  const { data, error } = await supabase
    .from("project_posts")
    .update({ likes: nextLike })
    .eq("id", postId)
    .select("like")
    .single();

  if (error || !data) {
    throw new AppError(500, "프로젝트 게시글 좋아요 처리에 실패했습니다.");
  }

  return { likes: data.likes, liked };
};

async function assertProjectPostOwner(postId: number, userId: number) {
  const { data, error } = await supabase
    .from("project_posts")
    .select("id,user_id")
    .eq("id", postId)
    .single();

  if (error || !data) {
    throw new AppError(404, "프로젝트 게시글을 찾을 수 없습니다.");
  }

  if (data.user_id !== userId) {
    throw new AppError(
      403,
      "프로젝트 게시글 작성자만 수정하거나 삭제할 수 있습니다.",
    );
  }
}
