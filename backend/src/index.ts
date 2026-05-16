import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { generateOpenApiDocument } from "./config/openapi.js";
import authRouter from "./routes/auth.route.js";
import projectPostRouter from "./routes/projectPost.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import storageRouter from "./routes/storage.route.js";

import { env } from "./config/env.js";

// Express 앱 생성
const app = express();
const PORT = env.PORT;

// 보안 미들웨어
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.split(","), credentials: true }));

// 바디 파서
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 헬스체크
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// 라우트 (생기면 여기에 추가)
// Swagger보다 먼저 라우트 import (registerPath 실행되도록)
app.use("/api/auth", authRouter);
app.use("/auth", authRouter);
app.use("/api/storage", storageRouter);
app.use("/storage", storageRouter);
app.use("/api/project-posts", projectPostRouter);
app.use("/project-posts", projectPostRouter);

// Swagger는 라우트 등록 후
const openApiDocument = generateOpenApiDocument();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.get("/api-docs.json", (_req, res) => {
  res.json(openApiDocument);
});

// 에러 핸들러는 항상 마지막
app.use(errorHandler);

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/api-docs`);
});
