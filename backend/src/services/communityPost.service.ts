import { supabase } from "../config/supabase.js";
import { AppError } from "../middlewares/errorHandler.js";
import type { CommunityCategory } from "../constants/enums.js";

type ListCommunityPostsInput = {
  category?: CommunityCategory;
  sort: "latest" | "like";
  page: number;
  size: number;
  keyword?: string;
};

type CommunityPostInput = {
  title?: string;
  content?: string;
  category?: CommunityCategory;
};

const COMMUNITY_POST_SELECT =
  "id,title,content,category,likes,created_at,user:users(id,nickname,position)";

function sanitizeKeyword(raw: string): string {
  return raw.replace(/[%_]/g, "").replace(/[,()\\]/g, " ").trim();
}

export const listCommunityPosts = async (query: ListCommunityPostsInput) => {
  const page = Number(query.page);
  const size = Number(query.size);
  const from = (page - 1) * size;
  const to = from + size - 1;
  const orderColumn = query.sort === "like" ? "likes" : "created_at";

  let request = supabase
    .from("community_posts")
    .select(COMMUNITY_POST_SELECT, { count: "exact" })
    .order(orderColumn, { ascending: false })
    .range(from, to);

  if (query.category) request = request.eq("category", query.category);

  if (query.keyword) {
    const safe = sanitizeKeyword(query.keyword);
    if (safe) {
      request = request.or(`title.ilike.%${safe}%,content.ilike.%${safe}%`);
    }
  }

  const { data, error, count } = await request;
  if (error) {
    console.error("Community post list lookup failed:", error);
    throw new AppError(500, "커뮤니티 게시글 목록 조회에 실패했습니다.");
  }

  return {
    posts: data ?? [],
    total: count ?? 0,
    page,
    size,
  };
};

export const createCommunityPost = async (
  userId: number,
  input: Required<CommunityPostInput>,
) => {
  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      user_id: userId,
      title: input.title,
      content: input.content,
      category: input.category,
      likes: 0,
    })
    .select("id,title,content,category,likes,created_at")
    .single();

  if (error || !data) {
    console.error("Community post create failed:", error);
    throw new AppError(500, "커뮤니티 게시글 작성에 실패했습니다.");
  }

  return data;
};

export const getCommunityPost = async (postId: number, userId?: number) => {
  const { data: post, error } = await supabase
    .from("community_posts")
    .select(
      "id,title,content,category,likes,created_at,updated_at,user:users(id,nickname,position)",
    )
    .eq("id", postId)
    .single();

  if (error || !post) {
    throw new AppError(404, "커뮤니티 게시글을 찾을 수 없습니다.");
  }

  let liked = false;

  if (userId) {
    const { data: likedRow } = await supabase
      .from("community_likes")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .maybeSingle();

    liked = Boolean(likedRow);
  }

  return { ...post, liked };
};

export const updateCommunityPost = async (
  postId: number,
  userId: number,
  input: CommunityPostInput,
) => {
  await assertCommunityPostOwner(postId, userId);

  const { data, error } = await supabase
    .from("community_posts")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", postId)
    .select("id,title,content,category,likes,updated_at")
    .single();

  if (error || !data) {
    throw new AppError(500, "커뮤니티 게시글 수정에 실패했습니다.");
  }

  return data;
};

export const deleteCommunityPost = async (postId: number, userId: number) => {
  await assertCommunityPostOwner(postId, userId);

  await supabase.from("community_likes").delete().eq("post_id", postId);

  const { error } = await supabase
    .from("community_posts")
    .delete()
    .eq("id", postId);

  if (error) {
    throw new AppError(500, "커뮤니티 게시글 삭제에 실패했습니다.");
  }
};

export const likeCommunityPost = async (postId: number, userId: number) => {
  const { data: post, error: readError } = await supabase
    .from("community_posts")
    .select("id,likes")
    .eq("id", postId)
    .single();

  if (readError || !post) {
    throw new AppError(404, "커뮤니티 게시글을 찾을 수 없습니다.");
  }

  const { data: likedRow, error: likeReadError } = await supabase
    .from("community_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (likeReadError) {
    throw new AppError(500, "커뮤니티 게시글 좋아요 조회에 실패했습니다.");
  }

  const liked = !likedRow;
  const nextLikes = liked
    ? Number(post.likes ?? 0) + 1
    : Math.max(Number(post.likes ?? 0) - 1, 0);

  if (liked) {
    const { error } = await supabase.from("community_likes").insert({
      post_id: postId,
      user_id: userId,
    });
    if (error) throw new AppError(500, "커뮤니티 게시글 좋아요 등록에 실패했습니다.");
  } else {
    const { error } = await supabase
      .from("community_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
    if (error) throw new AppError(500, "커뮤니티 게시글 좋아요 취소에 실패했습니다.");
  }

  const { data, error } = await supabase
    .from("community_posts")
    .update({ likes: nextLikes })
    .eq("id", postId)
    .select("likes")
    .single();

  if (error || !data) {
    throw new AppError(500, "커뮤니티 게시글 좋아요 처리에 실패했습니다.");
  }

  return { likes: data.likes, liked };
};

async function assertCommunityPostOwner(postId: number, userId: number) {
  const { data, error } = await supabase
    .from("community_posts")
    .select("id,user_id")
    .eq("id", postId)
    .single();

  if (error || !data) {
    throw new AppError(404, "커뮤니티 게시글을 찾을 수 없습니다.");
  }

  if (data.user_id !== userId) {
    throw new AppError(403, "커뮤니티 게시글 작성자만 수정하거나 삭제할 수 있습니다.");
  }
}
