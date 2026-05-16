import { Router } from "express";
import { ResumePostController } from "../controllers/resume-post.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", ResumePostController.getResumePosts);

router.post(
  "/",
  authMiddleware,
  ResumePostController.createResumePost
);

router.get("/:post_id", ResumePostController.getResumePostDetail);

router.put(
  "/:post_id",
  authMiddleware,
  ResumePostController.updateResumePost
);

router.delete(
  "/:post_id",
  authMiddleware,
  ResumePostController.deleteResumePost
);

export default router;