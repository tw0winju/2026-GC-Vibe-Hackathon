import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { generateOpenApiDocument } from "./config/openapi.js";
import authRouter from "./routes/auth.route.js";
import projectPostRouter from "./routes/projectPost.route.js";
import userRouter from "./routes/user.route.js";
import {
  resumeCommentRouter,
  projectCommentRouter,
  commentRouter,
} from "./routes/comment.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import storageRouter from "./routes/storage.route.js";
import resumePostRouter from "./routes/resumePost.route.js";
import { env } from "./config/env.js";

dotenv.config();

const app = express();
const PORT = env.PORT;

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.split(","), credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ── 라우터 등록 (Swagger보다 먼저) ────────────────────────
app.use("/api/auth", authRouter);
app.use("/auth", authRouter);

app.use("/api/storage", storageRouter);
app.use("/storage", storageRouter);

app.use("/api/project-posts", projectPostRouter);
app.use("/project-posts", projectPostRouter);

app.use("/api/resume-posts", resumePostRouter);
app.use("/resume-posts", resumePostRouter);

// 댓글: 게시글 하위 라우터
app.use("/api/resume-posts/:post_id/comments", resumeCommentRouter);
app.use("/resume-posts/:post_id/comments", resumeCommentRouter);
app.use("/api/project-posts/:post_id/comments", projectCommentRouter);
app.use("/project-posts/:post_id/comments", projectCommentRouter);

// 댓글 삭제 (공용)
app.use("/api/comments", commentRouter);
app.use("/comments", commentRouter);

app.use("/api/users", userRouter);
app.use("/users", userRouter);

// ── Swagger (라우트 등록 후) ───────────────────────────────
const openApiDocument = generateOpenApiDocument();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.get("/api-docs.json", (_req, res) => {
  res.json(openApiDocument);
});

// ── 에러 핸들러 (항상 마지막) ─────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/api-docs`);
});
