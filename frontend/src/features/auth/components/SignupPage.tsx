import { useEffect, useState } from "react";
import {
  Code2,
  MessageSquareText,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import googleLogo from "../../../assets/images/auth/google.png";
import kakaoLogo from "../../../assets/images/auth/kakao.png";
import { BASE_URL } from "../../../lib/api/client";
import { getMe } from "../../../lib/api/devfeedback";
import { socialLogin, type AuthProvider } from "../api/authApi";
import "./SignupPage.css";

const benefits = [
  {
    icon: UsersRound,
    title: "서로의 성장을 돕는 피드백",
    description: "이력서와 프로젝트를 공유하고 건설적인 피드백을 주고받을 수 있어요.",
  },
  {
    icon: Code2,
    title: "아이디어를 구체화하는 프로젝트 리뷰",
    description: "사이드 프로젝트의 기능, 구조, 기술 스택까지 다양한 관점에서 리뷰를 받아요.",
  },
  {
    icon: TrendingUp,
    title: "기록하고 발전하는 개발 여정",
    description: "나의 성장 과정을 한눈에 확인할 수 있어요.",
  },
];

const signupBenefits = [
  {
    icon: UsersRound,
    title: "같은 목표를 가진 사람들과 연결",
    description: "IT 직군을 준비하는 동료들과 네트워크를 만들어요.",
  },
  {
    icon: MessageSquareText,
    title: "다양한 피드백으로 더 나은 결과",
    description: "여러 관점의 피드백으로 완성도를 높여보세요.",
  },
  {
    icon: TrendingUp,
    title: "성장 과정을 기록하고 확인",
    description: "피드백을 통해 발전한 나를 확인할 수 있어요.",
  },
];

const socialLoginRequests = new Map<string, ReturnType<typeof socialLogin>>();

function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [authStatus, setAuthStatus] = useState<"idle" | "checking" | "signingIn" | "signedIn" | "guest" | "error">(
    "idle",
  );
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const userId = searchParams.get("user_id");
    const oauthError = searchParams.get("error");
    const code = searchParams.get("code");
    const provider = resolveOAuthProvider(searchParams, location.pathname);

    if (oauthError) {
      setAuthStatus("error");
      setAuthMessage(decodeURIComponent(oauthError));
      return () => {
        mounted = false;
      };
    }

    if (accessToken && refreshToken && userId) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_id", userId);
      localStorage.removeItem("oauth_provider");
      setAuthStatus("signedIn");
      navigate(ROUTES.homepage, { replace: true });

      return () => {
        mounted = false;
      };
    }

    if (code && provider) {
      setAuthStatus("signingIn");
      socialLoginOnce(provider, code)
        .then((response) => {
          if (!mounted) return;
          localStorage.setItem("access_token", response.access_token);
          localStorage.setItem("refresh_token", response.refresh_token);
          localStorage.setItem("user_id", String(response.user_id));
          localStorage.removeItem("oauth_provider");
          setAuthStatus("signedIn");
          navigate(ROUTES.homepage, { replace: true });
        })
        .catch((error) => {
          if (!mounted) return;
          setAuthStatus("error");
          setAuthMessage(error instanceof Error ? error.message : "소셜 로그인에 실패했습니다.");
        });

      return () => {
        mounted = false;
      };
    }

    setAuthStatus("checking");
    getMe()
      .then(() => {
        if (!mounted) return;
        setAuthStatus("signedIn");
        navigate(ROUTES.homepage, { replace: true });
      })
      .catch(() => {
        if (!mounted) return;
        setAuthStatus("guest");
      });

    return () => {
      mounted = false;
    };
  }, [location.pathname, navigate, searchParams]);

  const handleOAuthStart = (provider: AuthProvider) => {
    const oauthUrl = getOAuthStartUrl(provider);

    if (!oauthUrl) {
      setAuthStatus("error");
      setAuthMessage(".env의 VITE_BASE_URL을 설정해주세요.");
      return;
    }

    localStorage.setItem("oauth_provider", provider);
    window.location.href = oauthUrl;
  };

  return (
    <main className="signup-page">
      <section className="signup-intro" aria-label="DevFeedback 소개">
        <Link className="brand" to={ROUTES.signup} aria-label="GachonGrow 회원가입">
          <span className="brand-mark">
            <MessageSquareText size={18} strokeWidth={2.6} />
          </span>
          <span>GachonGrow</span>
        </Link>

        <div className="intro-content">
          <div>
            <h1>
              함께 성장하는 가천대 컴공 커뮤니티,
              <br />
              <strong>피드백</strong>으로 더 나은 결과를 만들어요.
            </h1>
            <p>
              이력서, 프로젝트까지 같은 목표를 가진 사람들과 피드백을
              주고받으며 실력을 한 단계 성장시켜보세요.
            </p>
          </div>

          <div className="benefit-list">
            {benefits.map(({ icon: Icon, title, description }) => (
              <article className="benefit-item" key={title}>
                <span className="benefit-icon">
                  <Icon size={24} strokeWidth={2.4} />
                </span>
                <div>
                  <h2>{title}</h2>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="developer-visual" aria-hidden="true">
          <div className="chat-bubble">
            <span />
            <span />
            <span />
          </div>
          <div className="laptop">
            <div className="laptop-window">
              <div className="window-dots">
                <span />
                <span />
                <span />
              </div>
              <div className="window-body">
                <div className="code-card">
                  <Code2 size={54} strokeWidth={2.6} />
                </div>
                <div className="line-stack">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
            <div className="laptop-base" />
          </div>
          <div className="profile-card">
            <span className="profile-avatar" />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section className="signup-panel" aria-label="회원가입">
        <div className="signup-card">
          <div className="signup-hero-icon">
            <Sparkles className="sparkle sparkle-left" size={16} />
            <span>
              <UsersRound size={34} strokeWidth={2.4} />
            </span>
            <Sparkles className="sparkle sparkle-right" size={16} />
          </div>

          <div className="signup-heading">
            <h2>회원가입</h2>
            <p>계정을 생성하고 GachonGrow을 시작해보세요!</p>
          </div>

          <div className="signup-benefits">
            {signupBenefits.map(({ icon: Icon, title, description }) => (
              <article className="signup-benefit" key={title}>
                <span>
                  <Icon size={24} strokeWidth={2.4} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="divider">
            <span />
            <p>간편하게 시작하기</p>
            <span />
          </div>

          <div className="oauth-actions">
            <button className="oauth-button kakao" type="button" onClick={() => handleOAuthStart("kakao")}>
              <img className="oauth-logo" src={kakaoLogo} alt="" aria-hidden="true" />
              카카오로 시작하기
            </button>
            <button className="oauth-button google" type="button" onClick={() => handleOAuthStart("google")}>
              <img className="oauth-logo" src={googleLogo} alt="" aria-hidden="true" />
              구글로 시작하기
            </button>
          </div>

          <p className="agreement">
            가입하면 GachonGrow의 <Link to={ROUTES.terms}>이용약관</Link> 및{" "}
            <Link to={ROUTES.privacy}>개인정보처리방침</Link>에 동의하게 됩니다.
          </p>

          {authStatus === "checking" && <p className="auth-status">로그인 상태를 확인하고 있어요.</p>}
          {authStatus === "signingIn" && <p className="auth-status">소셜 로그인 처리 중입니다.</p>}
          {authStatus === "signedIn" && <p className="auth-status">이미 로그인되어 이동합니다.</p>}
          {authStatus === "error" && <p className="auth-status">{authMessage}</p>}
        </div>
      </section>
    </main>
  );
}

function getOAuthStartUrl(provider: AuthProvider) {
  if (!BASE_URL) return "";
  return `${BASE_URL}/oauth2/authorization/${provider}`;
}

function socialLoginOnce(provider: AuthProvider, code: string) {
  const requestKey = `${provider}:${code}`;
  const cachedRequest = socialLoginRequests.get(requestKey);

  if (cachedRequest) return cachedRequest;

  const request = socialLogin(provider, code);
  socialLoginRequests.set(requestKey, request);

  return request;
}

function resolveOAuthProvider(searchParams: URLSearchParams, pathname: string): AuthProvider | null {
  const providerParam = searchParams.get("provider") ?? searchParams.get("state");
  const savedProvider = localStorage.getItem("oauth_provider");
  const candidate = normalizeProvider(providerParam) ?? normalizeProvider(pathname) ?? normalizeProvider(savedProvider);

  return candidate;
}

function normalizeProvider(value: string | null): AuthProvider | null {
  if (!value) return null;
  const normalized = value.toLowerCase();

  if (normalized.includes("kakao") || normalized.includes("카카오")) return "kakao";
  if (normalized.includes("google") || normalized.includes("구글")) return "google";
  return null;
}

export default SignupPage;
