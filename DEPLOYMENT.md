# Deployment

## Vercel frontend

The repository root includes `vercel.json`, so Vercel can be connected to the root of this repository.

Build settings:

- Framework Preset: `Vite`
- Install Command: `cd frontend && npm ci`
- Build Command: `cd frontend && npm run build`
- Output Directory: `frontend/dist`

Environment variables:

```env
VITE_BASE_URL=https://gg-web.onrender.com
```

`frontend/.env.production` already sets this value for production builds.

## Render backend

After the Vercel domain is created, add it to the backend CORS allowlist.

```env
CORS_ORIGIN=https://your-vercel-domain.vercel.app,http://localhost:5173
FRONTEND_CALLBACK_URL=https://your-vercel-domain.vercel.app/auth/callback
```

For OAuth providers, register the backend callback URLs:

```text
https://gg-web.onrender.com/login/oauth2/code/kakao
https://gg-web.onrender.com/login/oauth2/code/google
```

Then set the backend OAuth env values to the same URLs:

```env
KAKAO_REDIRECT_URI=https://gg-web.onrender.com/login/oauth2/code/kakao
GOOGLE_REDIRECT_URI=https://gg-web.onrender.com/login/oauth2/code/google
```
