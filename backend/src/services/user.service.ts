import { supabase } from "../config/supabase.js";
import { AppError } from "../middlewares/errorHandler.js";
import type {
  UpdateUserBody,
  UserListQuery,
} from "../schemas/user.schema.js";

const USER_PUBLIC_SELECT =
  "id,nickname,position,introduction,git_url,linked_url,blog_url,tag";

// DB 컬럼명 'likes' 사용
const POST_BASIC_SELECT =
  "id,title,description,thumbnail,likes,position,created_at,user:users(id,nickname)";

// ── 내부 헬퍼 ─────────────────────────────────────────────
function formatUser(row: Record<string, unknown>) {
  return {
    user_id: row.id,
    nickname: row.nickname,
    position: row.position ?? null,
    introduction: row.introduction ?? null,
    git_url: row.git_url ?? null,
    linked_url: row.linked_url ?? null,
    blog_url: row.blog_url ?? null,
    tag: (row.tag as string[] | null) ?? [],
  };
}

function formatPostRow(p: any, type: "resume" | "project") {
  return {
    post_id: p.id,
    title: p.title,
    description: p.description,
    thumbnail: p.thumbnail ?? null,
    likes: p.likes ?? 0,
    position: p.position ?? null,
    type,
    user: p.user ? { user_id: p.user.id, nickname: p.user.nickname } : null,
    created_at: p.created_at,
  };
}

// ── 카운트 4개 병렬 조회 ──────────────────────────────────
async function getUserCounts(userId: number) {
  const [resumeRes, projectRes, likeRes, commentRes] = await Promise.all([
    supabase
      .from("resume_posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("project_posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("likes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  return {
    resume_post: resumeRes.count ?? 0,
    project_post: projectRes.count ?? 0,
    like: likeRes.count ?? 0,
    comment: commentRes.count ?? 0,
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

  const profile = formatUser(data as Record<string, unknown>);
  const counts = await getUserCounts(userId);

  return { ...profile, counts };
};

// ── PUT /users/me ─────────────────────────────────────────
export const updateMe = async (userId: number, input: UpdateUserBody) => {
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

// ── GET /users/posts ──────────────────────────────────────
export const getMyPosts = async (userId: number, query: UserListQuery) => {
  const from = (query.page - 1) * query.size;
  const to = from + query.size - 1;

  const wantResume = !query.post_type || query.post_type === "resume";
  const wantProject = !query.post_type || query.post_type === "project";

  const requests: Promise<any>[] = [];
  if (wantResume) {
    requests.push(
      supabase
        .from("resume_posts")
        .select(POST_BASIC_SELECT, { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to),
    );
  }
  if (wantProject) {
    requests.push(
      supabase
        .from("project_posts")
        .select(POST_BASIC_SELECT, { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to),
    );
  }

  const results = await Promise.all(requests);
  if (results.some((r) => r.error)) {
    throw new AppError(500, "내가 쓴 글 조회에 실패했습니다");
  }

  let posts: any[] = [];
  let total = 0;
  let idx = 0;

  if (wantResume) {
    const r = results[idx++];
    posts = posts.concat(
      (r.data ?? []).map((p: any) => formatPostRow(p, "resume")),
    );
    total += r.count ?? 0;
  }
  if (wantProject) {
    const r = results[idx++];
    posts = posts.concat(
      (r.data ?? []).map((p: any) => formatPostRow(p, "project")),
    );
    total += r.count ?? 0;
  }

  posts.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return { posts, total, page: query.page };
};

// ── GET /users/comments ───────────────────────────────────
export const getMyComments = async (
  userId: number,
  query: UserListQuery,
) => {
  const from = (query.page - 1) * query.size;
  const to = from + query.size - 1;

  let request = supabase
    .from("comments")
    .select("id,content,post_id,post_type,created_at", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query.post_type) request = request.eq("post_type", query.post_type);

  const { data, error, count } = await request;
  if (error) throw new AppError(500, "작성한 댓글 조회에 실패했습니다");

  return { comments: data ?? [], total: count ?? 0, page: query.page };
};

// ── GET /users/likes ──────────────────────────────────────
export const getMyLikes = async (
  userId: number,
  query: UserListQuery,
) => {
  const from = (query.page - 1) * query.size;
  const to = from + query.size - 1;

  let likesRequest = supabase
    .from("likes")
    .select("post_id,post_type,created_at", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query.post_type) {
    likesRequest = likesRequest.eq("post_type", query.post_type);
  }

  const { data: likes, error: likesErr, count } = await likesRequest;
  if (likesErr) throw new AppError(500, "좋아요 목록 조회에 실패했습니다");

  if (!likes || likes.length === 0) {
    return { posts: [], total: count ?? 0, page: query.page };
  }

  const resumeIds = likes
    .filter((l) => l.post_type === "resume")
    .map((l) => l.post_id);
  const projectIds = likes
    .filter((l) => l.post_type === "project")
    .map((l) => l.post_id);

  const [resumeRes, projectRes] = await Promise.all([
    resumeIds.length
      ? supabase
          .from("resume_posts")
          .select(POST_BASIC_SELECT)
          .in("id", resumeIds)
      : Promise.resolve({ data: [], error: null }),
    projectIds.length
      ? supabase
          .from("project_posts")
          .select(POST_BASIC_SELECT)
          .in("id", projectIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (resumeRes.error || projectRes.error) {
    throw new AppError(500, "좋아요 게시글 상세 조회에 실패했습니다");
  }

  const resumeMap = new Map(
    (resumeRes.data ?? []).map((p: any) => [p.id, p]),
  );
  const projectMap = new Map(
    (projectRes.data ?? []).map((p: any) => [p.id, p]),
  );

  const posts = likes
    .map((l) => {
      const p =
        l.post_type === "resume"
          ? resumeMap.get(l.post_id)
          : projectMap.get(l.post_id);
      if (!p) return null;
      return formatPostRow(p, l.post_type as "resume" | "project");
    })
    .filter(Boolean);

  return { posts, total: count ?? 0, page: query.page };
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
