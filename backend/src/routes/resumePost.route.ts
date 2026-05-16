import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import * as resumePostController from "../controllers/resumePost.controller.js";
import {
  ResumePostCreateSchema,
  ResumePostIdParamSchema,
  ResumePostListQuerySchema,
  ResumePostUpdateSchema,
} from "../schemas/resumePost.schema.js";
import { registry } from "../config/openapi.js";
import { z } from "../config/zod.js";
import { POSITIONS } from "../constants/enums.js";

const router = Router();

const ResumePostItemSchema = z
  .object({
    id: z.number().int(),
    title: z.string(),
    description: z.string(),
    file_url: z.string(),
    thumbnail: z.string().nullable(),
    like: z.number().int(),
    position: z.enum(POSITIONS).nullable(),
    created_at: z.string().datetime(),
    user: z.object({
      id: z.number().int(),
      nickname: z.string(),
    }),
  })
  .openapi("ResumePostItem");

const ResumePostDetailSchema = ResumePostItemSchema.extend({
  updated_at: z.string().datetime().nullable(),
  comments: z.array(z.any()),
}).openapi("ResumePostDetail");

const ResumePostListResponseSchema = z
  .object({
    posts: z.array(ResumePostItemSchema),
    total: z.number().int(),
    page: z.number().int(),
    size: z.number().int(),
  })
  .openapi("ResumePostListResponse");

const LikeResponseSchema = z
  .object({
    like: z.number().int(),
    liked: z.boolean(),
  })
  .openapi("ResumeLikeResponse");

registry.registerPath({
  method: "get",
  path: "/resume-posts",
  tags: ["ResumePost"],
  summary: "이력서 게시글 목록",
  request: {
    query: ResumePostListQuerySchema,
  },
  responses: {
    200: {
      description: "게시글 목록",
      content: {
        "application/json": {
          schema: ResumePostListResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/resume-posts",
  tags: ["ResumePost"],
  summary: "이력서 게시글 작성",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ResumePostCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "작성 완료",
      content: {
        "application/json": {
          schema: ResumePostItemSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/resume-posts/{post_id}",
  tags: ["ResumePost"],
  summary: "이력서 게시글 상세",
  request: {
    params: ResumePostIdParamSchema,
  },
  responses: {
    200: {
      description: "게시글 상세",
      content: {
        "application/json": {
          schema: ResumePostDetailSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/resume-posts/{post_id}",
  tags: ["ResumePost"],
  summary: "이력서 게시글 수정",
  security: [{ bearerAuth: [] }],
  request: {
    params: ResumePostIdParamSchema,
    body: {
      content: {
        "application/json": {
          schema: ResumePostUpdateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "수정 완료",
      content: {
        "application/json": {
          schema: ResumePostDetailSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/resume-posts/{post_id}",
  tags: ["ResumePost"],
  summary: "이력서 게시글 삭제",
  security: [{ bearerAuth: [] }],
  request: {
    params: ResumePostIdParamSchema,
  },
  responses: {
    200: {
      description: "삭제 완료",
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/resume-posts/{post_id}/like",
  tags: ["ResumePost"],
  summary: "이력서 좋아요 토글",
  security: [{ bearerAuth: [] }],
  request: {
    params: ResumePostIdParamSchema,
  },
  responses: {
    200: {
      description: "좋아요 처리 결과",
      content: {
        "application/json": {
          schema: LikeResponseSchema,
        },
      },
    },
  },
});

router.get(
  "/",
  validate({ query: ResumePostListQuerySchema }),
  resumePostController.listResumePosts,
);

router.post(
  "/",
  authenticate,
  validate({ body: ResumePostCreateSchema }),
  resumePostController.createResumePost,
);

router.get(
  "/:post_id",
  validate({ params: ResumePostIdParamSchema }),
  resumePostController.getResumePost,
);

router.put(
  "/:post_id",
  authenticate,
  validate({
    params: ResumePostIdParamSchema,
    body: ResumePostUpdateSchema,
  }),
  resumePostController.updateResumePost,
);

router.delete(
  "/:post_id",
  authenticate,
  validate({ params: ResumePostIdParamSchema }),
  resumePostController.deleteResumePost,
);

router.post(
  "/:post_id/like",
  authenticate,
  validate({ params: ResumePostIdParamSchema }),
  resumePostController.likeResumePost,
);

export default router;
