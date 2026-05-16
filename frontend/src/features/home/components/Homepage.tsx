import { Code2, FileText, Flame, Pencil, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import { homeMyFeedbacks, homePopularFeedbacks } from "../../../mocks/data/homeFeedbacks";
import { type FeedbackType, type MyFeedbackItem, type PopularFeedbackItem } from "../api/homeApi";
import "./Homepage.css";

function getFeedbackTypeLabel(type?: FeedbackType) {
  return type === "PROJECT" ? "프로젝트" : "이력서";
}

function getFeedbackDetailPath(type: FeedbackType | undefined, id: number) {
  return type === "PROJECT" ? `/project-feedbacks/${id}` : `/resume-feedbacks/${id}`;
}

function MyFeedbackRow({ item }: { item: MyFeedbackItem }) {
  const helperText =
    item.summary ??
    `${item.created_at ?? "최근"} · 좋아요 ${item.likes ?? 0}`;

  return (
    <Link className="homepage-my-row" to={getFeedbackDetailPath(item.type, item.id)}>
      <span className="homepage-document-icon" aria-hidden="true">
        <FileText size={22} />
      </span>
      <div className="homepage-my-content">
        <span className="homepage-category">{getFeedbackTypeLabel(item.type)}</span>
        <h3>{item.title}</h3>
        <p>{helperText}</p>
      </div>
    </Link>
  );
}

function PopularFeedbackRow({ item }: { item: PopularFeedbackItem }) {
  return (
    <Link className="homepage-popular-row" to={getFeedbackDetailPath(item.type, item.id)}>
      <Flame className="homepage-flame" size={20} fill="currentColor" />
      <div className="homepage-popular-content">
        <span className="homepage-category">{getFeedbackTypeLabel(item.type)}</span>
        <h3>{item.title}</h3>
        <p>{item.position ?? "피드백"} · 좋아요 {item.likes ?? 0}</p>
      </div>
    </Link>
  );
}

function Homepage() {
  const [activeFeedbackType, setActiveFeedbackType] = useState<"RESUME" | "PROJECT">("RESUME");

  const myFeedbacks = useMemo(() => {
    return homeMyFeedbacks.filter((item) => item.type === activeFeedbackType);
  }, [activeFeedbackType]);
  const popularFeedbacks = homePopularFeedbacks;

  return (
    <AppLayout>
      <div className="homepage-shell">
        <section className="homepage-hero" aria-labelledby="homepage-title">
          <div className="homepage-hero__copy">
            <h1 id="homepage-title">
              가천 IT 인재의 성장을 위한
              <strong>피드백 플랫폼</strong>
            </h1>
            <p>
              이력서와 사이드 프로젝트를 더 좋게 만들고,
              <br />
              가천 IT 인재로서 한 단계 성장해보세요.
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
            <div className="homepage-visual__tip">피드백으로 더 나은 가천 IT 인재가 되세요!</div>
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
              <Link
                className="homepage-write-link"
                to={activeFeedbackType === "RESUME" ? ROUTES.resumeFeedbackWrite : ROUTES.projectFeedbackWrite}
              >
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
