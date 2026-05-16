import { supabase } from "../config/supabase.js";
import { AppError } from "../middlewares/errorHandler.js";
import type {
  UpdateUserBody,
  PaginationQuery,
} from "../schemas/user.schema.js";

const USER_PUBLIC_SELECT =
  "id,nickname,position,introduction,git_url,linked_url,blog_url";

// ── 내부 헬퍼: DB row → API 응답 형태 변환 ────────────────
function formatUser(row: Record<string, unknown>) {
  return {
    user_id: row.id,
    nickname: row.nickname,
    position: row.position ?? null,
    introduction: row.introduction ?? null,
    git_url: row.git_url ?? null,
    linked_url: row.linked_url ?? null,
    blog_url: row.blog_url ?? null,
  };
}

// ── GET /users/me ─────────────────────────────────────────
export const getMe = async (userId: number) => {
  const { data, error } = await supabase
    .from("users")
    .select(USER_PUBLIC_SELECT)
    .eq("id", userId)
    .single();

  if (error || !data) throw new AppError(404, "유저를 찾을 수 없습니다");
  return formatUser(data as Record<string, unknown>);
};

// ── PUT /users/me ─────────────────────────────────────────
export const updateMe = async (userId: number, input: UpdateUserBody) => {
  // 닉네임 변경 시 중복 검사
  if (input.nickname) {
    const { data: dup } = await supabase
      .from("users")
      .select("id")
      .eq("nickname", input.nickname)
      .neq("id", userId)
      .maybeSingle();

    if (dup) throw new AppError(409, "이미 사용 중인 닉네임입니다");
  }

  const { data, error } = await supabase
    .from("users")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select(USER_PUBLIC_SELECT)
    .single();

  if (error || !data) throw new AppError(500, "프로필 수정에 실패했습니다");
  return formatUser(data as Record<string, unknown>);
};

// ── GET /users (내가 쓴 글) ───────────────────────────────
export const getMyPosts = async (userId: number, query: PaginationQuery) => {
  const from = (query.page - 1) * query.size;
  const to = from + query.size - 1;

  // resume_posts 와 project_posts 를 합쳐서 반환
  const [resumeRes, projectRes] = await Promise.all([
    supabase
      .from("resume_posts")
      .select("id,title,description,thumbnail,likes,position,created_at", {
        count: "exact",
      })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to),
    supabase
      .from("project_posts")
      .select("id,title,description,thumbnail,likes,position,created_at", {
        count: "exact",
      })
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to),
  ]);

  if (resumeRes.error || projectRes.error) {
    throw new AppError(500, "내가 쓴 글 조회에 실패했습니다");
  }

  const posts = [
    ...(resumeRes.data ?? []).map((p) => ({
      ...p,
      post_id: p.id,
      type: "이력서",
    })),
    ...(projectRes.data ?? []).map((p) => ({
      ...p,
      post_id: p.id,
      type: "프로젝트",
    })),
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return {
    posts,
    total: (resumeRes.count ?? 0) + (projectRes.count ?? 0),
    page: query.page,
  };
};

// ── GET /users (작성한 댓글) ──────────────────────────────
export const getMyComments = async (userId: number, query: PaginationQuery) => {
  const from = (query.page - 1) * query.size;
  const to = from + query.size - 1;

  const { data, error, count } = await supabase
    .from("comments")
    .select("id,content,post_id,post_type,created_at", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new AppError(500, "작성한 댓글 조회에 실패했습니다");

  return {
    comments: data ?? [],
    total: count ?? 0,
    page: query.page,
  };
};

// ── GET /users (좋아요 목록) ──────────────────────────────
export const getMyLikes = async (userId: number, query: PaginationQuery) => {
  const from = (query.page - 1) * query.size;
  const to = from + query.size - 1;

  const { data, error, count } = await supabase
    .from("likes")
    .select(
      "post_id, project_posts(id,title,description,thumbnail,likes,position,created_at,user:users(id,nickname))",
      { count: "exact" },
    )
    .eq("user_id", userId)
    .eq("post_type", "project")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new AppError(500, "좋아요 목록 조회에 실패했습니다");

  return {
    posts: (data ?? []).map((row: any) => row.project_posts).filter(Boolean),
    total: count ?? 0,
    page: query.page,
  };
};

// ── GET /users/:user_id ───────────────────────────────────
export const getUserById = async (userId: number) => {
  const { data, error } = await supabase
    .from("users")
    .select(USER_PUBLIC_SELECT)
    .eq("id", userId)
    .single();

  if (error || !data) throw new AppError(404, "유저를 찾을 수 없습니다");
  return formatUser(data as Record<string, unknown>);
};
