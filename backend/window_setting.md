# Windows 환경 세팅 가이드

아무것도 설치 안 된 Windows에서 백엔드 프로젝트를 실행하기까지의 모든 단계를 정리한 문서입니다.

---

## ✅ 설치 체크리스트

순서대로 진행하세요. 위에서 아래로 따라가시면 됩니다.

- [ ] 1. Node.js 설치
- [ ] 2. Git 설치
- [ ] 3. VSCode 설치 (권장)
- [ ] 4. 프로젝트 클론
- [ ] 5. 의존성 설치 (`npm install`)
- [ ] 6. 환경변수 설정 (`.env`)
- [ ] 7. 실행 (`npm run dev`)

---

## 1️⃣ Node.js 설치

### 다운로드
https://nodejs.org/ 접속 → **LTS 버전 (20.x 이상)** 다운로드 → 설치 파일 실행

설치 중 모든 옵션 **기본값** 그대로 두고 진행하면 됩니다. **"Automatically install the necessary tools..."** 체크박스는 굳이 안 켜도 됩니다 (안 켜면 빠름).

### 설치 확인

**PowerShell** 또는 **명령 프롬프트(cmd)** 열고:

```powershell
node --version
npm --version
```

`v20.x.x` 같은 버전 번호가 나오면 성공.

> 💡 **버전 관리 도구 (선택)**: 여러 Node 버전을 동시에 쓸 일이 있다면 [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)를 설치하세요. 단순히 이 프로젝트만 돌릴 거면 위에서 설치한 Node로 충분합니다.

---

## 2️⃣ Git 설치

### 다운로드
https://git-scm.com/download/win 접속 → **Standalone Installer 64-bit** 다운로드 → 설치 파일 실행

### 설치 시 옵션 (중요)

거의 다 기본값 두면 되지만, 아래 두 가지만 확인하세요:

| 화면 | 권장 옵션 |
|------|----------|
| **Choosing the default editor** | "Use Visual Studio Code as Git's default editor" (VSCode 설치 후 권장) |
| **Configuring the line ending conversions** | "Checkout Windows-style, commit Unix-style line endings" (기본값) |
| **Choosing the terminal emulator** | "Use MinTTY" (기본값) |

### 설치 확인

**새** PowerShell 또는 cmd 창을 열고 (기존 창에서는 PATH 인식 안 됨):

```powershell
git --version
```

`git version 2.x.x` 출력되면 성공.

### Git 초기 설정 (최초 1회)

```powershell
git config --global user.name "홍길동"
git config --global user.email "your@email.com"
git config --global core.autocrlf true
```

---

## 3️⃣ VSCode 설치 (권장)

### 다운로드
https://code.visualstudio.com/ 접속 → **Download for Windows** → 설치 파일 실행

설치 중 **모든 체크박스 켜기** 추천:
- ✅ Add "Open with Code" action to Windows Explorer file context menu
- ✅ Add "Open with Code" action to Windows Explorer directory context menu
- ✅ Register Code as an editor for supported file types
- ✅ Add to PATH

### 추천 확장 (프로젝트 열 때 알림 뜸)

프로젝트 폴더 열면 추천 확장 자동 표시됩니다. **Install All** 클릭하시면 일괄 설치돼요.

수동 설치하려면 PowerShell에서:

```powershell
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
code --install-extension mikestead.dotenv
code --install-extension usernamehw.errorlens
code --install-extension yoavbls.pretty-ts-errors
code --install-extension humao.rest-client
code --install-extension EditorConfig.EditorConfig
```

---

## 4️⃣ 프로젝트 클론

작업할 폴더 위치로 이동 (예: `C:\Users\내이름\Study`):

```powershell
cd C:\Users\내이름\Study
git clone <저장소-URL>
cd <프로젝트-폴더명>
```

> 💡 PowerShell에서 경로에 한글이 있으면 깨지는 경우가 있으니, 가능하면 **영문 경로**에 두세요.

VSCode로 폴더 열기:

```powershell
code .
```

---

## 5️⃣ 의존성 설치

프로젝트 폴더에서:

```powershell
npm install
```

처음 받는 패키지가 많아서 1~3분 정도 걸립니다. 끝나면 `node_modules` 폴더가 생성돼요.

### 설치되는 주요 패키지

```
express                      # 서버 프레임워크
@supabase/supabase-js        # Supabase 클라이언트
jsonwebtoken                 # JWT 발급/검증
zod                          # 스키마 검증
dotenv                       # 환경변수 로드
helmet, cors                 # 보안
swagger-ui-express           # API 문서 UI
@asteasolutions/zod-to-openapi  # Zod → OpenAPI 변환

# 개발 의존성
typescript, tsx              # TS 컴파일/실행
eslint, prettier             # 린트/포매팅
cross-env                    # Windows/Mac 환경변수 호환
```

---

## 6️⃣ 환경변수 설정

### .env 파일 생성

PowerShell에서:

```powershell
Copy-Item .env.example .env
```

또는 cmd에서:

```cmd
copy .env.example .env
```

> ⚠️ **VSCode에서 직접 만들 때 주의**: 파일명이 `.env.txt`로 저장되면 안 됩니다. VSCode 좌측 파일 탭에서 새 파일 만들면 `.env`로 정확히 저장됩니다.

### .env 값 채우기

VSCode로 `.env` 파일 열고 아래 값들을 채우세요:

```env
# 서버
PORT=3000
NODE_ENV=development

# Supabase (팀 리드에게 요청)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# JWT
JWT_SECRET=여기에-32자-이상-랜덤-문자열
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=14d

# OAuth - Kakao (팀 리드에게 요청)
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
KAKAO_REDIRECT_URI=http://localhost:5173/auth/kakao/callback

# OAuth - Google (팀 리드에게 요청)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

# CORS
CORS_ORIGIN=http://localhost:5173
```

### JWT_SECRET 직접 생성하기

랜덤한 시크릿이 필요하면 PowerShell에서:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

출력된 64자 hex 문자열을 `JWT_SECRET`에 붙여넣으세요.

> ⚠️ **절대 `.env` 파일을 git에 커밋하지 마세요.** `.gitignore`에 이미 등록되어 있습니다.

---

## 7️⃣ 실행

```powershell
npm run dev
```

성공하면 콘솔에:

```
🚀 Server running on http://localhost:3000
📚 API docs: http://localhost:3000/api-docs
```

### 동작 확인

브라우저에서 접속:

| URL | 용도 |
|-----|------|
| http://localhost:3000/health | 헬스체크 (`{"status":"ok"}` 나오면 OK) |
| http://localhost:3000/api-docs | Swagger UI (API 문서) |

---

## 🐛 자주 발생하는 문제 (Windows 특화)

### `npm` 또는 `node` 명령어를 찾을 수 없음

→ Node.js 설치 후 **PowerShell/cmd 창을 닫고 새로 열어야** PATH가 적용됩니다.
   여전히 안 되면 컴퓨터 재부팅.

### `git` 명령어를 찾을 수 없음

→ 동일. Git 설치 후 새 터미널 창을 여세요.

### `npm install` 중 권한 에러 (`EPERM`, `EACCES`)

```powershell
# 관리자 권한으로 PowerShell 실행 후
npm cache clean --force
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### `npm install` 중 Python/C++ 빌드 도구 에러

일부 native 모듈이 빌드 도구를 요구하는 경우:

```powershell
# 관리자 권한 PowerShell에서
npm install -g windows-build-tools
```

또는 Visual Studio Build Tools 별도 설치:
https://visualstudio.microsoft.com/visual-cpp-build-tools/

### `.env` 파일이 인식 안 됨

- 파일 확장자가 `.env.txt`로 되어 있지 않은지 확인
- 파일 탐색기 → **보기 → 파일 확장명** 켜서 확인
- 프로젝트 **루트 폴더**에 있는지 확인 (`src/.env` 같은 위치 X)

### `EADDRINUSE: address already in use :::3000`

3000번 포트를 다른 프로그램이 사용 중입니다.

```powershell
# 3000 포트 사용 중인 프로세스 찾기
netstat -ano | findstr :3000

# 출력된 PID로 종료 (예: PID가 12345면)
taskkill /PID 12345 /F
```

또는 `.env`의 `PORT`를 3001 등 다른 번호로 변경.

### PowerShell에서 스크립트 실행 정책 에러

```
실행 정책으로 인해 ... 실행할 수 없습니다.
```

관리자 권한 PowerShell에서:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Y 입력 후 엔터.

### Git에서 파일들이 전부 수정됨으로 표시 (줄바꿈 문제)

```powershell
git rm --cached -r .
git reset --hard
```

### 한글 파일명이 깨져 보임

PowerShell 인코딩 문제. 다음 명령 실행:

```powershell
chcp 65001
```

영구적으로 하려면 PowerShell 프로필에 추가하세요.

### `tsx`가 동작 안 함 / `cannot find module`

`node_modules` 폴더 자체가 망가졌을 가능성:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 📞 도움 요청

위 항목들로 해결 안 되면 팀 슬랙 `#backend` 채널에 아래 정보와 함께 문의:

1. 어떤 명령어를 실행했는지
2. **전체 에러 메시지** (스크린샷이 아닌 텍스트)
3. `node --version`, `npm --version` 출력
4. 운영체제 버전 (Windows 10 / 11)

---

## 다음 단계

서버가 정상 실행되면:

1. http://localhost:3000/api-docs 에서 Swagger UI 확인
2. `POST /auth/social/login` 등 API 테스트
3. Git 작업 흐름 익히기 (`feature/내기능` 브랜치 생성 → PR)

수고하셨습니다 🎉
