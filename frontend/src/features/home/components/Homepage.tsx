import { Code2, Eye, FileText, Flame, MessageCircle, Pencil, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import { getHome, type FeedbackType, type HomeResponse, type MyFeedbackItem, type PopularFeedbackItem } from "../api/homeApi";
import "./Homepage.css";

const fallbackMyFeedbacks: MyFeedbackItem[] = [
  {
    id: 1,
    type: "RESUME",
    title: "백엔드 개발자 신입 이력서 피드백 부탁드립니다!",
    createdAtText: "2일 전",
    mentorCount: 3,
    commentCount: 8,
  },
  {
    id: 2,
    type: "RESUME",
    title: "경력 3년 백엔드 개발자 이력서 피드백 요청합니다",
    createdAtText: "1일 전",
    mentorCount: 2,
    commentCount: 5,
  },
  {
    id: 3,
    type: "RESUME",
    title: "이직을 위한 이력서 첨삭 부탁드립니다",
    createdAtText: "방금 전",
    summary: "멘토 매칭 중입니다",
    commentCount: 0,
  },
  {
    id: 4,
    type: "PROJECT",
    title: "사이드 프로젝트 기능 구성 피드백 부탁드립니다",
    createdAtText: "3일 전",
    mentorCount: 4,
    commentCount: 12,
  },
  {
    id: 5,
    type: "PROJECT",
    title: "포트폴리오 프로젝트 아키텍처 방향이 괜찮을까요?",
    createdAtText: "5일 전",
    mentorCount: 2,
    commentCount: 6,
  },
];

const fallbackPopularFeedbacks: PopularFeedbackItem[] = [
  {
    id: 1,
    title: "신입 개발자 이력서, 어떤 점을 개선하면 좋을까요?",
    category: "RESUME",
    mentorRole: "코드리뷰어",
    viewCount: 1200,
    commentCount: 24,
  },
  {
    id: 2,
    title: "이 기능, 꼭 필요한 기능일까? 사이드 프로젝트 기능 구성 피드백",
    category: "PROJECT",
    mentorRole: "백엔드 개발자",
    viewCount: 980,
    commentCount: 18,
  },
  {
    id: 3,
    title: "경력 개발자 기술 스택, 이렇게 정리하는 게 좋을까요?",
    category: "RESUME",
    mentorRole: "시니어 개발자",
    viewCount: 756,
    commentCount: 12,
  },
];

const statusLabel: Record<string, string> = {
  DONE: "완료",
  IN_PROGRESS: "진행중",
  WAITING: "대기중",
};

const statusClassName: Record<string, string> = {
  DONE: "done",
  IN_PROGRESS: "progress",
  WAITING: "waiting",
};

function formatCount(count?: number) {
  if (!count) {
    return "0";
  }

  if (count >= 1000) {
    const compactCount = Math.round((count / 1000) * 10) / 10;
    return `${compactCount}k`;
  }

  return String(count);
}

function getCategoryLabel(category?: string) {
  return category === "PROJECT" ? "프로젝트" : "이력서";
}

function FeedbackMeta({ comments, views }: { comments?: number; views?: number }) {
  if (comments === undefined && views === undefined) {
    return null;
  }

  return (
    <span className="homepage-feedback-meta" aria-label="피드백 지표">
      {comments !== undefined && (
        <span>
          <MessageCircle size={16} />
          {formatCount(comments)}
        </span>
      )}
      {views !== undefined && (
        <span>
          <Eye size={16} />
          {formatCount(views)}
        </span>
      )}
    </span>
  );
}

function getFeedbackTypeLabel(type?: FeedbackType) {
  return type === "PROJECT" ? "프로젝트" : "이력서";
}

function MyFeedbackRow({ item }: { item: MyFeedbackItem }) {
  const status = item.status ?? "WAITING";
  const helperText =
    item.summary ??
    `${item.createdAtText ?? "최근"} · ${item.mentorCount ?? 0}명의 멘토가 피드백을 남겼습니다`;

  return (
    <article className={item.status ? "homepage-my-row" : "homepage-my-row homepage-my-row--compact"}>
      <span className="homepage-document-icon" aria-hidden="true">
        <FileText size={22} />
      </span>
      <div className="homepage-my-content">
        <span className="homepage-category">{getFeedbackTypeLabel(item.type)}</span>
        <h3>{item.title}</h3>
        <p>{helperText}</p>
      </div>
      {item.status && (
        <span className={`homepage-status homepage-status--${statusClassName[status] ?? "waiting"}`}>
          {statusLabel[status] ?? status}
        </span>
      )}
      <FeedbackMeta comments={item.commentCount} views={item.viewCount} />
    </article>
  );
}

function PopularFeedbackRow({ item }: { item: PopularFeedbackItem }) {
  return (
    <article className="homepage-popular-row">
      <Flame className="homepage-flame" size={20} fill="currentColor" />
      <div className="homepage-popular-content">
        <span className="homepage-category">{getCategoryLabel(item.category)}</span>
        <h3>{item.title}</h3>
        <p>멘토 · {item.mentorRole ?? item.authorRole ?? "개발자"}</p>
      </div>
      <FeedbackMeta comments={item.commentCount} />
    </article>
  );
}

function Homepage() {
  const [home, setHome] = useState<HomeResponse | null>(null);
  const [activeFeedbackType, setActiveFeedbackType] = useState<"RESUME" | "PROJECT">("RESUME");

  useEffect(() => {
    let ignore = false;

    getHome()
      .then((data) => {
        if (!ignore) {
          setHome(data);
        }
      })
      .catch(() => undefined);

    return () => {
      ignore = true;
    };
  }, []);

  const myFeedbacks = useMemo(() => {
    const apiFeedbacks = [
      ...(home?.myResumeFeedbacks ?? []).map((item) => ({ ...item, type: item.type ?? "RESUME" })),
      ...(home?.myProjectFeedbacks ?? []).map((item) => ({ ...item, type: item.type ?? "PROJECT" })),
    ];
    const source = apiFeedbacks.length ? apiFeedbacks : fallbackMyFeedbacks;

    return source.filter((item) => item.type === activeFeedbackType);
  }, [activeFeedbackType, home]);
  const popularFeedbacks = home?.popularFeedbacks?.length
    ? home.popularFeedbacks
    : fallbackPopularFeedbacks;

  return (
    <AppLayout>
      <div className="homepage-shell">
        <section className="homepage-hero" aria-labelledby="homepage-title">
          <div className="homepage-hero__copy">
            <h1 id="homepage-title">
              개발자의 성장을 위한
              <strong>피드백 플랫폼</strong>
            </h1>
            <p>
              이력서와 사이드 프로젝트를 더 좋게 만들고,
              <br />
              개발자로서 한 단계 성장해보세요.
            </p>
            <div className="homepage-hero__actions">
              <Link className="homepage-primary-button" to={ROUTES.resumeFeedbackWrite}>
                <Pencil size={18} />
                이력서 피드백 작성하기
              </Link>
              <Link className="homepage-secondary-button" to={ROUTES.projectFeedbackWrite}>
                <Code2 size={18} />
                프로젝트 피드백 작성하기
              </Link>
            </div>
          </div>

          <div className="homepage-visual" aria-hidden="true">
            <div className="homepage-visual__profile">
              <UserRound size={34} />
              <span />
              <span />
              <span />
            </div>
            <div className="homepage-visual__code">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="homepage-visual__tip">피드백으로 더 나은 개발자가 되세요!</div>
            <div className="homepage-visual__badge">
              <Code2 size={44} />
            </div>
            <div className="homepage-visual__chart" />
          </div>
        </section>

        <section className="homepage-grid" aria-label="홈 피드백 요약">
          <div className="homepage-card">
            <div className="homepage-card__header">
              <h2>내 피드백 현황</h2>
              <Link className="homepage-write-link" to={ROUTES.resumeFeedbackWrite}>
                <Pencil size={16} />
                글 작성하기
              </Link>
            </div>
            <div className="homepage-tabs" aria-label="피드백 종류">
              <button
                className={activeFeedbackType === "RESUME" ? "is-active" : undefined}
                type="button"
                onClick={() => setActiveFeedbackType("RESUME")}
              >
                이력서 피드백
              </button>
              <button
                className={activeFeedbackType === "PROJECT" ? "is-active" : undefined}
                type="button"
                onClick={() => setActiveFeedbackType("PROJECT")}
              >
                프로젝트 피드백
              </button>
              <Link to={activeFeedbackType === "RESUME" ? ROUTES.resumeFeedbacks : ROUTES.projectFeedbacks}>
                전체 보기
              </Link>
            </div>
            <div className="homepage-list">
              {myFeedbacks.map((item) => (
                <MyFeedbackRow item={item} key={item.id} />
              ))}
            </div>
            <Link
              className="homepage-card__more"
              to={activeFeedbackType === "RESUME" ? ROUTES.resumeFeedbacks : ROUTES.projectFeedbacks}
            >
              전체 보기
            </Link>
          </div>

          <div className="homepage-card">
            <div className="homepage-card__header">
              <h2>인기 피드백</h2>
              <Link className="homepage-plain-link" to={ROUTES.community}>더 보기</Link>
            </div>
            <div className="homepage-list">
              {popularFeedbacks.map((item) => (
                <PopularFeedbackRow item={item} key={item.id} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default Homepage;
