# GachonGrow

> 가천대학교 IT 인재들이 포트폴리오, 프로젝트, 커뮤니티 피드백을 주고받으며 함께 성장하는 웹 서비스

<p align="center">
  <img src="./frontend/src/assets/images/home/GG_logo.png" alt="GachonGrow logo" width="180" />
</p>

<p align="center">
  <a href="https://gg-web.onrender.com/api-docs/">Swagger API Docs</a>
  ·
  <a href="#web-ui">Web UI</a>
  ·
  <a href="#local-setup">Local Setup</a>
  ·
  <a href="#deployment">Deployment</a>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
</p>

---

<div align="center">

### 🎉 배포 완료 🎉

현재 서비스가 실제로 배포되어 운영 중입니다.

<br/>

🌐 **LIVE SERVICE**  
👉 https://2026-gc-vibehackathon.vercel.app/

<br/>

<img width="100%" alt="banner" src="https://capsule-render.vercel.app/api?type=waving&color=0:6C63FF,100:4F46E5&height=220&section=header&text=2026%20GC%20Vibe%20Hackathon&fontSize=40&fontColor=ffffff&animation=fadeIn&fontAlignY=38"/>

</div>

---

## Overview

GachonGrow는 가천대 개발자들이 서로의 결과물을 더 빠르게 개선할 수 있도록 만든 피드백 커뮤니티입니다.

포트폴리오와 프로젝트를 올리고, 댓글과 좋아요로 피드백을 주고받고, 커뮤니티에서 팀원 모집과 진로 이야기를 나눌 수 있습니다. 프론트엔드는 Vite + React 기반의 SPA로 구성되어 있고, 백엔드는 Express + Supabase + OpenAPI 문서화를 중심으로 구성되어 있습니다.

## Features

| 영역 | 기능 |
| --- | --- |
| Auth | 일반 회원가입/로그인, Kakao/Google OAuth 로그인 |
| Portfolio Feedback | 포트폴리오 피드백 게시글 목록, 상세, 작성, 수정, 삭제, 댓글, 좋아요 |
| Project Feedback | 프로젝트 소개, 기술 스택, 썸네일 기반 피드백 게시글 관리 |
| Community | 자유 글, 프로젝트 팀 구하기, 취업/진로 카테고리 게시판 |
| My Page | 내가 쓴 글, 좋아요한 글, 작성한 피드백, 프로필 관리 |
| File Storage | 이력서 파일 및 프로젝트 썸네일 업로드 URL 발급 |
| API Docs | OpenAPI 기반 Swagger UI 제공 |

## Web UI

GachonGrow 웹 UI는 실제 사용 흐름을 기준으로 화면이 구성되어 있습니다.

| Route | Screen |
| --- | --- |
| `/signup` | 회원가입 및 소셜 로그인 |
| `/homepage` | 서비스 홈 |
| `/resume-feedbacks` | 포트폴리오 피드백 목록 |
| `/resume-feedbacks/write` | 포트폴리오 피드백 작성 |
| `/project-feedbacks` | 프로젝트 피드백 목록 |
| `/project-feedbacks/write` | 프로젝트 피드백 작성 |
| `/community` | 커뮤니티 목록 |
| `/community/write` | 커뮤니티 글 작성 |
| `/mypage` | 마이페이지 대시보드 |
| `/guide` | 포트폴리오 작성 가이드 |

### UI Highlights

- 게시판형 레이아웃으로 피드백 글을 빠르게 탐색
- 포트폴리오/프로젝트 성격에 맞춘 작성 폼 제공
- 댓글, 좋아요, 조회수 등 피드백 반응 확인
- 마이페이지에서 내 활동과 작성 글을 한 번에 관리
- Kakao, Google 로그인 버튼과 OAuth 콜백 화면 구성

## API Docs

배포된 API 문서는 Swagger UI에서 바로 확인할 수 있습니다.

- Production Swagger: [https://gg-web.onrender.com/api-docs/](https://gg-web.onrender.com/api-docs/)
- Local Swagger: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api-docs.json`
- Health Check: `http://localhost:3000/health`

## Tech Stack

| Layer | Stack |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router, Lucide React |
| Backend | Node.js 20+, Express 5, TypeScript, Zod |
| API Docs | Swagger UI, zod-to-openapi |
| Auth | JWT, Kakao OAuth, Google OAuth |
| Database/Storage | Supabase |
| Deployment | Vercel Frontend, Render Backend |

## Project Structure

```text
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── routes
│   │   ├── schemas
│   │   ├── services
│   │   └── index.ts
│   └── package.json
├── frontend
│   ├── src
│   │   ├── app
│   │   ├── assets
│   │   ├── components
│   │   ├── features
│   │   ├── lib
│   │   ├── mocks
│   │   └── styles
│   └── package.json
├── DEPLOYMENT.md
├── vercel.json
└── README.md
```

## Local Setup

### Requirements

- Node.js `20+`
- npm
- Supabase project
- Kakao/Google OAuth app credentials, if OAuth login is needed locally

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Backend server runs on `http://localhost:3000`.

Create `backend/.env` with the required values used by the server. The exact values depend on the Supabase and OAuth projects connected to the service.

```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
FRONTEND_CALLBACK_URL=http://localhost:5173/auth/callback

SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...

KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
KAKAO_REDIRECT_URI=http://localhost:3000/login/oauth2/code/kakao

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/login/oauth2/code/google
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend dev server runs on `http://localhost:5173`.

Create `frontend/.env`:

```env
VITE_BASE_URL=http://localhost:3000
```

## Scripts

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start Express server with `tsx watch` |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled server from `dist` |
| `npm run typecheck` | Type-check backend without emitting files |

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build production bundle |
| `npm run preview` | Preview production build locally |

## Deployment

### Frontend: Vercel

The root `vercel.json` is configured for the Vite frontend.

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Install Command | `cd frontend && npm ci` |
| Build Command | `cd frontend && npm run build` |
| Output Directory | `frontend/dist` |

Production frontend environment:

```env
VITE_BASE_URL=https://gg-web.onrender.com
```

### Backend: Render

Render backend should expose the Express API and Swagger UI.

```env
CORS_ORIGIN=https://your-vercel-domain.vercel.app,http://localhost:5173
FRONTEND_CALLBACK_URL=https://your-vercel-domain.vercel.app/auth/callback

KAKAO_REDIRECT_URI=https://gg-web.onrender.com/login/oauth2/code/kakao
GOOGLE_REDIRECT_URI=https://gg-web.onrender.com/login/oauth2/code/google
```

OAuth provider callback URLs:

```text
https://gg-web.onrender.com/login/oauth2/code/kakao
https://gg-web.onrender.com/login/oauth2/code/google
```

## API Resources

| Resource | Endpoint Prefix |
| --- | --- |
| Auth | `/api/auth` |
| OAuth | `/oauth2`, `/login/oauth2/code` |
| Users | `/api/users` |
| Resume Posts | `/api/resume-posts` |
| Project Posts | `/api/project-posts` |
| Community Posts | `/api/community-posts` |
| Comments | `/api/*-posts/:post_id/comments`, `/api/comments` |
| Storage | `/api/storage` |

## Team

2026 GC Vibe Hackathon project.

Made for Gachon developers who want better feedback, sharper portfolios, and stronger projects.
