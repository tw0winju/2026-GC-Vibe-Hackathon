import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { generateOpenApiDocument } from "./config/openapi.js";
import authRouter from "./routes/auth.route.js";
import oauthRouter, { oauthCallbackRouter } from "./routes/oauth.route.js";
import projectPostRouter from "./routes/projectPost.route.js";
import userRouter from "./routes/user.route.js";
import {
  resumeCommentRouter,
  projectCommentRouter,
  communityCommentRouter,
  commentRouter,
} from "./routes/comment.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import storageRouter from "./routes/storage.route.js";
import resumePostRouter from "./routes/resumePost.route.js";
import communityPostRouter from "./routes/communityPost.route.js";
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

// OAuth 브라우저 리다이렉트 방식 (프론트가 사용)
// GET /oauth2/authorization/kakao → 카카오 인증 페이지로 redirect
// GET /oauth2/authorization/google → 구글 인증 페이지로 redirect
app.use("/oauth2", oauthRouter);

// 카카오/구글이 인증 후 callback할 URL
// GET /login/oauth2/code/kakao?code=...
// GET /login/oauth2/code/google?code=...
app.use("/login/oauth2/code", oauthCallbackRouter);

// 기존 Auth API (POST 방식, 테스트/모바일 앱용)
app.use("/api/auth", authRouter);
app.use("/auth", authRouter);

app.use("/api/storage", storageRouter);
app.use("/storage", storageRouter);

// 댓글: 게시글 하위 라우터는 게시글 상세 라우터보다 먼저 등록
app.use("/api/resume-posts/:post_id/comments", resumeCommentRouter);
app.use("/resume-posts/:post_id/comments", resumeCommentRouter);
app.use("/api/project-posts/:post_id/comments", projectCommentRouter);
app.use("/project-posts/:post_id/comments", projectCommentRouter);
app.use("/api/community-posts/:post_id/comments", communityCommentRouter);
app.use("/community-posts/:post_id/comments", communityCommentRouter);

app.use("/api/project-posts", projectPostRouter);
app.use("/project-posts", projectPostRouter);

app.use("/api/resume-posts", resumePostRouter);
app.use("/resume-posts", resumePostRouter);

app.use("/api/community-posts", communityPostRouter);
app.use("/community-posts", communityPostRouter);

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
  console.log(`🔐 Kakao Login: http://localhost:${PORT}/oauth2/authorization/kakao`);
  console.log(`🔐 Google Login: http://localhost:${PORT}/oauth2/authorization/google`);
});
