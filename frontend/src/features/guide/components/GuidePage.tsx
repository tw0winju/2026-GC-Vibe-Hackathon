import { ArrowLeft, BookOpenCheck, CheckCircle2, ChevronRight, Lightbulb, Target } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import { findResumeGuideBySlug, getResumeGuidePath, resumeGuides } from "../model/resumeGuide";
import "./GuidePage.css";

function GuideIndexPage() {
  return (
    <AppLayout>
      <main className="guide-page">
        <section className="guide-index-hero">
          <p>Resume Guide</p>
          <h1>직무별 포트폴리오 작성 가이드</h1>
          <span>지원 분야에 맞춰 강조해야 할 경험, 키워드, 프로젝트 설명 방식을 확인해보세요.</span>
        </section>

        <section className="guide-grid" aria-label="직무별 가이드 목록">
          {resumeGuides.map((guide) => (
            <Link className="guide-card" key={guide.slug} to={getResumeGuidePath(guide.slug)}>
              <div>
                <span>{guide.category}</span>
                <h2>{guide.title}</h2>
                <p>{guide.summary}</p>
              </div>
              <ChevronRight size={22} strokeWidth={2.1} />
            </Link>
          ))}
        </section>
      </main>
    </AppLayout>
  );
}

function GuideDetailPage() {
  const { slug } = useParams();
  const guide = findResumeGuideBySlug(slug);

  if (!guide) {
    return <Navigate to={ROUTES.guide} replace />;
  }

  return (
    <AppLayout>
      <main className="guide-page">
        <Link className="guide-back" to={ROUTES.guide}>
          <ArrowLeft size={18} strokeWidth={2.2} />
          가이드 목록
        </Link>

        <section className="guide-detail-hero">
          <span>{guide.category}</span>
          <h1>{guide.title}</h1>
          <p>{guide.summary}</p>
          <div className="guide-role-list">
            {guide.targetRoles.map((role) => (
              <span key={role}>{role}</span>
            ))}
          </div>
        </section>

        <section className="guide-layout">
          <article className="guide-main-card">
            <div className="guide-section-title">
              <Target size={22} strokeWidth={2.2} />
              <h2>핵심 메시지</h2>
            </div>
            <p className="guide-core-message">{guide.coreMessage}</p>
          </article>

          <article className="guide-main-card">
            <div className="guide-section-title">
              <BookOpenCheck size={22} strokeWidth={2.2} />
              <h2>작성 구조</h2>
            </div>
            <ol className="guide-number-list">
              {guide.structure.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>

          <article className="guide-main-card">
            <div className="guide-section-title">
              <Lightbulb size={22} strokeWidth={2.2} />
              <h2>프로젝트 설명 팁</h2>
            </div>
            <div className="guide-tip-stack">
              {guide.projectTips.map((tip) => (
                <p key={tip}>{tip}</p>
              ))}
            </div>
          </article>

          <aside className="guide-side-column">
            <section className="guide-side-card">
              <h2>추천 키워드</h2>
              <div className="guide-keywords">
                {guide.keywords.map((keyword) => (
                  <span key={keyword}>{keyword}</span>
                ))}
              </div>
            </section>

            <section className="guide-side-card">
              <h2>최종 체크리스트</h2>
              <ul className="guide-check-list">
                {guide.checklist.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={18} strokeWidth={2.2} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="guide-side-card">
              <h2>피해야 할 실수</h2>
              <ul className="guide-mistake-list">
                {guide.mistakes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </aside>
        </section>
      </main>
    </AppLayout>
  );
}

export { GuideDetailPage, GuideIndexPage };
