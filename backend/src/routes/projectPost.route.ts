import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import * as projectPostController from "../controllers/projectPost.controller.js";
import {
  ProjectPostCreateSchema,
  ProjectPostIdParamSchema,
  ProjectPostListQuerySchema,
  ProjectPostUpdateSchema,
} from "../schemas/projectPost.schema.js";
import { registry } from "../config/openapi.js";
import { z } from "../config/zod.js";
import { POSITIONS } from "../constants/enums.js";

const router = Router();

// ── Swagger 스키마 정의 ────────────────────────────────────

const ProjectPostItemSchema = z
  .object({
    id: z.number().int(),
    title: z.string(),
    description: z.string(),
    file_url: z.string().nullable(),
    thumbnail: z.string().nullable(),
    like: z.number().int(),
    position: z.enum(POSITIONS).nullable(),
    created_at: z.string().datetime(),
    user: z.object({ id: z.number().int(), nickname: z.string() }),
  })
  .openapi("ProjectPostItem");

const ProjectPostDetailSchema = ProjectPostItemSchema.extend({
  tag: z.array(z.string()),
  updated_at: z.string().datetime().nullable(),
  comments: z.array(z.any()),
}).openapi("ProjectPostDetail");

const ProjectPostListResponseSchema = z
  .object({
    posts: z.array(ProjectPostItemSchema),
    total: z.number().int(),
    page: z.number().int(),
    size: z.number().int(),
  })
  .openapi("ProjectPostListResponse");

const LikeResponseSchema = z
  .object({ like: z.number().int(), liked: z.boolean() })
  .openapi("LikeResponse");

// ── Swagger 등록 ───────────────────────────────────────────

registry.registerPath({
  method: "get",
  path: "/project-posts",
  tags: ["ProjectPost"],
  summary: "프로젝트 게시글 목록",
  request: { query: ProjectPostListQuerySchema },
  responses: {
    200: {
      description: "게시글 목록",
      content: { "application/json": { schema: ProjectPostListResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/project-posts",
  tags: ["ProjectPost"],
  summary: "프로젝트 게시글 작성",
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: ProjectPostCreateSchema } } },
  },
  responses: {
    201: {
      description: "작성 완료",
      content: { "application/json": { schema: ProjectPostItemSchema } },
    },
    401: { description: "인증 필요" },
  },
});

registry.registerPath({
  method: "get",
  path: "/project-posts/{post_id}",
  tags: ["ProjectPost"],
  summary: "프로젝트 게시글 상세",
  request: { params: ProjectPostIdParamSchema },
  responses: {
    200: {
      description: "게시글 상세",
      content: { "application/json": { schema: ProjectPostDetailSchema } },
    },
    404: { description: "게시글 없음" },
  },
});

registry.registerPath({
  method: "put",
  path: "/project-posts/{post_id}",
  tags: ["ProjectPost"],
  summary: "프로젝트 게시글 수정",
  security: [{ bearerAuth: [] }],
  request: {
    params: ProjectPostIdParamSchema,
    body: { content: { "application/json": { schema: ProjectPostUpdateSchema } } },
  },
  responses: {
    200: {
      description: "수정 완료",
      content: { "application/json": { schema: ProjectPostDetailSchema } },
    },
    401: { description: "인증 필요" },
    403: { description: "작성자 아님" },
    404: { description: "게시글 없음" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/project-posts/{post_id}",
  tags: ["ProjectPost"],
  summary: "프로젝트 게시글 삭제",
  security: [{ bearerAuth: [] }],
  request: { params: ProjectPostIdParamSchema },
  responses: {
    200: { description: "삭제 완료" },
    401: { description: "인증 필요" },
    403: { description: "작성자 아님" },
    404: { description: "게시글 없음" },
  },
});

registry.registerPath({
  method: "post",
  path: "/project-posts/{post_id}/like",
  tags: ["ProjectPost"],
  summary: "프로젝트 좋아요 토글",
  security: [{ bearerAuth: [] }],
  request: { params: ProjectPostIdParamSchema },
  responses: {
    200: {
      description: "좋아요 처리 결과",
      content: { "application/json": { schema: LikeResponseSchema } },
    },
    401: { description: "인증 필요" },
    404: { description: "게시글 없음" },
  },
});

// ── 실제 라우트 ────────────────────────────────────────────

router.get("/", validate({ query: ProjectPostListQuerySchema }), projectPostController.listProjectPosts);
router.post("/", authenticate, validate({ body: ProjectPostCreateSchema }), projectPostController.createProjectPost);
router.get("/:post_id", validate({ params: ProjectPostIdParamSchema }), projectPostController.getProjectPost);
router.put("/:post_id", authenticate, validate({ params: ProjectPostIdParamSchema, body: ProjectPostUpdateSchema }), projectPostController.updateProjectPost);
router.delete("/:post_id", authenticate, validate({ params: ProjectPostIdParamSchema }), projectPostController.deleteProjectPost);
router.post("/:post_id/like", authenticate, validate({ params: ProjectPostIdParamSchema }), projectPostController.likeProjectPost);

export default router;
