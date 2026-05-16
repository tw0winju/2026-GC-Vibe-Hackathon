import { supabase } from "../config/supabase.js";
import { AppError } from "../middlewares/errorHandler.js";
import type { Position } from "../constants/enums.js";

type ListResumePostsInput = {
  position?: Position;
  sort: "latest" | "like";
  page: number;
  size: number;
  keyword?: string;
};

type ResumePostInput = {
  title?: string;
  description?: string;
  file_url?: string;
  thumbnail?: string;
  position?: Position;
};

// DB 컬럼명은 'likes' (복수형)
const RESUME_POST_SELECT =
  "id,title,description,file_url,thumbnail,likes,position,created_at,user:users(id,nickname)";

function sanitizeKeyword(raw: string): string {
  return raw.replace(/[%_]/g, "").replace(/[,()\\]/g, " ").trim();
}

export const listResumePosts = async (query: ListResumePostsInput) => {
  const from = (query.page - 1) * query.size;
  const to = from + query.size - 1;
  // sort enum 'like' ↔ DB 컬럼 'likes' 매핑
  const orderColumn = query.sort === "like" ? "likes" : "created_at";

  let request = supabase
    .from("resume_posts")
    .select(RESUME_POST_SELECT, { count: "exact" })
    .order(orderColumn, { ascending: false })
    .range(from, to);

  if (query.position) request = request.eq("position", query.position);

  if (query.keyword) {
    const safe = sanitizeKeyword(query.keyword);
    if (safe) {
      request = request.or(
        `title.ilike.%${safe}%,description.ilike.%${safe}%`,
      );
    }
  }

  const { data, error, count } = await request;
  if (error) {
    throw new AppError(500, "이력서 게시글 목록 조회에 실패했습니다.");
  }

  return {
    posts: data ?? [],
    total: count ?? 0,
    page: query.page,
    size: query.size,
  };
};

export const createResumePost = async (
  userId: number,
  input: Required<ResumePostInput>,
) => {
  const { data, error } = await supabase
    .from("resume_posts")
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description,
      file_url: input.file_url,
      thumbnail: input.thumbnail,
      position: input.position,
      likes: 0,
    })
    .select(
      "id,title,description,file_url,thumbnail,likes,position,created_at",
    )
    .single();

  if (error || !data) {
    throw new AppError(500, "이력서 게시글 작성에 실패했습니다.");
  }

  return data;
};

export const getResumePost = async (postId: number) => {
  const { data: post, error } = await supabase
    .from("resume_posts")
    .select(
      "id,title,description,file_url,thumbnail,likes,position,created_at,updated_at,user:users(id,nickname,position)",
    )
    .eq("id", postId)
    .single();

  if (error || !post) {
    throw new AppError(404, "이력서 게시글을 찾을 수 없습니다.");
  }

  const { data: comments } = await supabase
    .from("comments")
    .select(
      "id,user_id,content,comment_parent_id,created_at,user:users(id,nickname)",
    )
    .eq("post_id", postId)
    .eq("post_type", "resume")
    .order("created_at", { ascending: true });

  return {
    ...post,
    comments: comments ?? [],
  };
};

export const updateResumePost = async (
  postId: number,
  userId: number,
  input: ResumePostInput,
) => {
  await assertResumePostOwner(postId, userId);

  const { data, error } = await supabase
    .from("resume_posts")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", postId)
    .select(
      "id,title,description,file_url,thumbnail,likes,position,updated_at",
    )
    .single();

  if (error || !data) {
    throw new AppError(500, "이력서 게시글 수정에 실패했습니다.");
  }

  return data;
};

export const deleteResumePost = async (
  postId: number,
  userId: number,
) => {
  await assertResumePostOwner(postId, userId);

  await supabase
    .from("comments")
    .delete()
    .eq("post_id", postId)
    .eq("post_type", "resume");

  await supabase
    .from("likes")
    .delete()
    .eq("post_id", postId)
    .eq("post_type", "resume");

  const { error } = await supabase
    .from("resume_posts")
    .delete()
    .eq("id", postId);

  if (error) {
    throw new AppError(500, "이력서 게시글 삭제에 실패했습니다.");
  }
};

export const likeResumePost = async (
  postId: number,
  userId: number,
) => {
  const { data: post } = await supabase
    .from("resume_posts")
    .select("id,likes")
    .eq("id", postId)
    .single();

  if (!post) {
    throw new AppError(404, "이력서 게시글을 찾을 수 없습니다.");
  }

  const { data: likedRow } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .eq("post_type", "resume")
    .maybeSingle();

  let nextLikes = Number(post.likes ?? 0);
  let liked = false;

  if (likedRow) {
    nextLikes = Math.max(nextLikes - 1, 0);
    await supabase.from("likes").delete().eq("id", likedRow.id);
  } else {
    nextLikes += 1;
    liked = true;
    await supabase.from("likes").insert({
      user_id: userId,
      post_id: postId,
      post_type: "resume",
    });
  }

  await supabase
    .from("resume_posts")
    .update({ likes: nextLikes })
    .eq("id", postId);

  return { likes: nextLikes, liked };
};

const assertResumePostOwner = async (
  postId: number,
  userId: number,
) => {
  const { data } = await supabase
    .from("resume_posts")
    .select("user_id")
    .eq("id", postId)
    .single();

  if (!data) {
    throw new AppError(404, "이력서 게시글을 찾을 수 없습니다.");
  }

  if (data.user_id !== userId) {
    throw new AppError(403, "수정 권한이 없습니다.");
  }
};
