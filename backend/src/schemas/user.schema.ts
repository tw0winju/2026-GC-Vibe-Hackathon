import { z } from '../config/zod.js';
import { POSITIONS } from '../constants/enums.js';

const nullableEmptyString = (schema: z.ZodString) =>
  z.preprocess(
    (value) => (value === '' ? null : value),
    schema.nullable().optional(),
  );

// ── 공통: 프로필 카운트 ───────────────────────────────────
// counts 객체 안의 키는 DB 컬럼 매핑이 아니라 의미별 이름이라
// like(좋아요 누른 개수), comment(작성한 댓글 개수) 단수 유지
export const ProfileCountsSchema = z
  .object({
    resume_post: z.number().int(),
    project_post: z.number().int(),
    like: z.number().int(),
    comment: z.number().int(),
  })
  .openapi('ProfileCounts');

// ── 공통: 유저 프로필 (다른 유저용) ──────────────────────
export const UserProfileSchema = z
  .object({
    user_id: z.number().int(),
    nickname: z.string(),
    position: z.enum(POSITIONS).nullable(),
    introduction: z.string().nullable(),
    school: z.string().nullable(),
    grade: z.string().nullable(),
    email: z.string().nullable(),
    git_url: z.string().nullable(),
    linked_url: z.string().nullable(),
    blog_url: z.string().nullable(),
    tag: z.array(z.string()),
  })
  .openapi('UserProfile');

// ── GET /users/me 응답 ───────────────────────────────────
export const MyProfileSchema = UserProfileSchema.extend({
  counts: ProfileCountsSchema,
}).openapi('MyProfile');

// ── PUT /users/me 요청 ────────────────────────────────────
export const UpdateUserSchema = z
  .object({
    nickname: z.string().min(1).max(30).optional(),
    position: z.enum(POSITIONS).optional(),
    introduction: z.string().max(500).optional(),
    school: nullableEmptyString(z.string().max(100)),
    grade: nullableEmptyString(z.string().max(30)),
    email: nullableEmptyString(z.string().email()),
    git_url: nullableEmptyString(z.string().url()),
    linked_url: nullableEmptyString(z.string().url()),
    blog_url: nullableEmptyString(z.string().url()),
    tag: z.array(z.string()).optional(),
  })
  .openapi('UpdateUserRequest');

// ── 페이지네이션 ─────────────────────────────────────────
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  size: z.coerce.number().int().positive().max(50).default(10),
});

export const UserListQuerySchema = PaginationQuerySchema.extend({
  post_type: z.enum(['resume', 'project']).optional(),
});

// ── 응답 스키마 (DB 컬럼명 likes에 맞춤) ──────────────────
export const UserPostItemSchema = z
  .object({
    post_id: z.number().int(),
    title: z.string(),
    description: z.string(),
    thumbnail: z.string().nullable(),
    likes: z.number().int(),
    position: z.enum(POSITIONS).nullable(),
    type: z.enum(['resume', 'project']),
    user: z
      .object({ user_id: z.number().int(), nickname: z.string() })
      .nullable(),
    created_at: z.string().datetime(),
  })
  .openapi('UserPostItem');

export const UserPostListResponseSchema = z
  .object({
    posts: z.array(UserPostItemSchema),
    total: z.number().int(),
    page: z.number().int(),
  })
  .openapi('UserPostListResponse');

export const UserCommentItemSchema = z
  .object({
    id: z.number().int(),
    content: z.string(),
    post_id: z.number().int(),
    post_title: z.string(),
    post_type: z.enum(['resume', 'project']),
    created_at: z.string(),
  })
  .openapi('UserCommentItem');

export const UserCommentListResponseSchema = z
  .object({
    comments: z.array(UserCommentItemSchema),
    total: z.number().int(),
    page: z.number().int(),
  })
  .openapi('UserCommentListResponse');

// ── GET /users/:user_id ──────────────────────────────────
export const UserIdParamSchema = z.object({
  user_id: z.coerce.number().int().positive(),
});

export type UpdateUserBody = z.infer<typeof UpdateUserSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type UserListQuery = z.infer<typeof UserListQuerySchema>;
