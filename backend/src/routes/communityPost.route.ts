import { Router } from "express";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import * as communityPostController from "../controllers/communityPost.controller.js";
import {
  CommunityPostCreateSchema,
  CommunityPostIdParamSchema,
  CommunityPostListQuerySchema,
  CommunityPostUpdateSchema,
} from "../schemas/communityPost.schema.js";
import { registry } from "../config/openapi.js";
import { z } from "../config/zod.js";
import { COMMUNITY_CATEGORIES } from "../constants/enums.js";

const router = Router();

const CommunityPostItemSchema = z
  .object({
    id: z.number().int(),
    title: z.string(),
    content: z.string(),
    category: z.enum(COMMUNITY_CATEGORIES),
    likes: z.number().int(),
    created_at: z.string().datetime(),
    user: z.object({ id: z.number().int(), nickname: z.string(), position: z.string().nullable() }),
  })
  .openapi("CommunityPostItem");

const CommunityPostDetailSchema = CommunityPostItemSchema.extend({
  updated_at: z.string().datetime().nullable(),
  liked: z.boolean(),
}).openapi("CommunityPostDetail");

const CommunityPostListResponseSchema = z
  .object({
    posts: z.array(CommunityPostItemSchema),
    total: z.number().int(),
    page: z.number().int(),
    size: z.number().int(),
  })
  .openapi("CommunityPostListResponse");

const LikeResponseSchema = z
  .object({ likes: z.number().int(), liked: z.boolean() })
  .openapi("CommunityLikeResponse");

registry.registerPath({
  method: "get",
  path: "/community-posts",
  tags: ["CommunityPost"],
  summary: "커뮤니티 게시글 목록",
  request: { query: CommunityPostListQuerySchema },
  responses: {
    200: {
      description: "게시글 목록",
      content: { "application/json": { schema: CommunityPostListResponseSchema } },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/community-posts",
  tags: ["CommunityPost"],
  summary: "커뮤니티 게시글 작성",
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: CommunityPostCreateSchema } } },
  },
  responses: {
    201: {
      description: "작성 완료",
      content: { "application/json": { schema: CommunityPostItemSchema } },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/community-posts/{post_id}",
  tags: ["CommunityPost"],
  summary: "커뮤니티 게시글 상세",
  request: { params: CommunityPostIdParamSchema },
  responses: {
    200: {
      description: "게시글 상세",
      content: { "application/json": { schema: CommunityPostDetailSchema } },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/community-posts/{post_id}",
  tags: ["CommunityPost"],
  summary: "커뮤니티 게시글 수정",
  security: [{ bearerAuth: [] }],
  request: {
    params: CommunityPostIdParamSchema,
    body: { content: { "application/json": { schema: CommunityPostUpdateSchema } } },
  },
  responses: {
    200: {
      description: "수정 완료",
      content: { "application/json": { schema: CommunityPostDetailSchema } },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/community-posts/{post_id}",
  tags: ["CommunityPost"],
  summary: "커뮤니티 게시글 삭제",
  security: [{ bearerAuth: [] }],
  request: { params: CommunityPostIdParamSchema },
  responses: { 200: { description: "삭제 완료" } },
});

registry.registerPath({
  method: "post",
  path: "/community-posts/{post_id}/like",
  tags: ["CommunityPost"],
  summary: "커뮤니티 좋아요 토글",
  security: [{ bearerAuth: [] }],
  request: { params: CommunityPostIdParamSchema },
  responses: {
    200: {
      description: "좋아요 처리 결과",
      content: { "application/json": { schema: LikeResponseSchema } },
    },
  },
});

router.get("/", validate({ query: CommunityPostListQuerySchema }), communityPostController.listCommunityPosts);
router.post("/", authenticate, validate({ body: CommunityPostCreateSchema }), communityPostController.createCommunityPost);
router.get("/:post_id", optionalAuthenticate, validate({ params: CommunityPostIdParamSchema }), communityPostController.getCommunityPost);
router.put("/:post_id", authenticate, validate({ params: CommunityPostIdParamSchema, body: CommunityPostUpdateSchema }), communityPostController.updateCommunityPost);
router.delete("/:post_id", authenticate, validate({ params: CommunityPostIdParamSchema }), communityPostController.deleteCommunityPost);
router.post("/:post_id/like", authenticate, validate({ params: CommunityPostIdParamSchema }), communityPostController.likeCommunityPost);

export default router;
