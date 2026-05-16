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

const router = Router();

router.get("/", validate({ query: ProjectPostListQuerySchema }), projectPostController.listProjectPosts);
router.post(
  "/",
  authenticate,
  validate({ body: ProjectPostCreateSchema }),
  projectPostController.createProjectPost
);
router.get(
  "/:post_id",
  validate({ params: ProjectPostIdParamSchema }),
  projectPostController.getProjectPost
);
router.put(
  "/:post_id",
  authenticate,
  validate({ params: ProjectPostIdParamSchema, body: ProjectPostUpdateSchema }),
  projectPostController.updateProjectPost
);
router.delete(
  "/:post_id",
  authenticate,
  validate({ params: ProjectPostIdParamSchema }),
  projectPostController.deleteProjectPost
);
router.post(
  "/:post_id/like",
  authenticate,
  validate({ params: ProjectPostIdParamSchema }),
  projectPostController.likeProjectPost
);

export default router;
