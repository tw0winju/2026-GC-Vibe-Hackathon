import { supabase } from '../config/supabase.js';
import { AppError } from '../middlewares/errorHandler.js';
import type { CreateCommentBody } from '../schemas/comment.schema.js';

const COMMENT_SELECT =
  'id,user_id,content,comment_parent_id,created_at,user:users(nickname)';

// ── 내부 헬퍼: flat 목록 → 트리 (루트 + replies) ──────────
function buildTree(rows: any[]) {
  const roots: any[] = [];
  const map = new Map<number, any>();

  // 1차: 루트 댓글만 먼저 Map에 등록
  for (const row of rows) {
    if (!row.comment_parent_id) {
      const node = { ...row, comment_id: row.id, replies: [] };
      map.set(row.id, node);
      roots.push(node);
    }
  }

  // 2차: 대댓글을 부모 replies 배열에 삽입
  for (const row of rows) {
    if (row.comment_parent_id) {
      const parent = map.get(row.comment_parent_id);
      if (parent) {
        parent.replies.push({ ...row, comment_id: row.id });
      }
    }
  }

  return roots;
}

// ── GET /resume-posts/:post_id/comments ──────────────────
export const getResumeComments = async (postId: number) => {
  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_SELECT)
    .eq('post_type', 'resume')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw new AppError(500, '댓글 조회에 실패했습니다');
  return { comments: buildTree(data ?? []) };
};

// ── POST /resume-posts/:post_id/comments ─────────────────
export const createResumeComment = async (
  postId: number,
  userId: number,
  input: CreateCommentBody,
) => {
  // 대댓글인 경우 부모 댓글 존재 확인
  if (input.comment_parent_id) {
    const { data: parent, error: parentErr } = await supabase
      .from('comments')
      .select('id')
      .eq('id', input.comment_parent_id)
      .eq('post_type', 'resume')
      .eq('post_id', postId)
      .maybeSingle();

    if (parentErr || !parent) {
      throw new AppError(404, '부모 댓글을 찾을 수 없습니다');
    }
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_type: 'resume',
      post_id: postId,
      user_id: userId,
      content: input.content,
      comment_parent_id: input.comment_parent_id ?? null,
    })
    .select(`${COMMENT_SELECT}`)
    .single();

  if (error || !data) throw new AppError(500, '댓글 작성에 실패했습니다');
  return { ...data, comment_id: data.id };
};

// ── GET /project-posts/:post_id/comments ─────────────────
export const getProjectComments = async (postId: number) => {
  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_SELECT)
    .eq('post_type', 'project')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw new AppError(500, '댓글 조회에 실패했습니다');
  return { comments: buildTree(data ?? []) };
};

// ── POST /project-posts/:post_id/comments ────────────────
export const createProjectComment = async (
  postId: number,
  userId: number,
  input: CreateCommentBody,
) => {
  if (input.comment_parent_id) {
    const { data: parent, error: parentErr } = await supabase
      .from('comments')
      .select('id')
      .eq('id', input.comment_parent_id)
      .eq('post_type', 'project')
      .eq('post_id', postId)
      .maybeSingle();

    if (parentErr || !parent) {
      throw new AppError(404, '부모 댓글을 찾을 수 없습니다');
    }
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_type: 'project',
      post_id: postId,
      user_id: userId,
      content: input.content,
      comment_parent_id: input.comment_parent_id ?? null,
    })
    .select(COMMENT_SELECT)
    .single();

  if (error || !data) throw new AppError(500, '댓글 작성에 실패했습니다');
  return { ...data, comment_id: data.id };
};

// ── DELETE /comments/:comment_id ─────────────────────────
export const deleteComment = async (commentId: number, userId: number) => {
  // 1. 본인 확인
  const { data: comment, error: fetchErr } = await supabase
    .from('comments')
    .select('id,user_id')
    .eq('id', commentId)
    .maybeSingle();

  if (fetchErr || !comment) throw new AppError(404, '댓글을 찾을 수 없습니다');
  if (comment.user_id !== userId) throw new AppError(403, '본인 댓글만 삭제할 수 있습니다');

  // 2. 대댓글이 있는 루트 댓글이면 내용만 마스킹
  const { data: children } = await supabase
    .from('comments')
    .select('id')
    .eq('comment_parent_id', commentId)
    .limit(1);

  if (children && children.length > 0) {
    const { error: maskErr } = await supabase
      .from('comments')
      .update({ content: '삭제된 댓글입니다', user_id: null })
      .eq('id', commentId);

    if (maskErr) throw new AppError(500, '댓글 삭제에 실패했습니다');
  } else {
    // 3. 대댓글 없으면 완전 삭제
    const { error: delErr } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (delErr) throw new AppError(500, '댓글 삭제에 실패했습니다');
  }

  return { message: 'ok' };
};
