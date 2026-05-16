import {
  Code2,
  Edit3,
  ExternalLink,
  FileImage,
  GitBranch,
  Heart,
  Lightbulb,
  MessageSquare,
  MoreHorizontal,
  Rocket,
  SearchCheck,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import {
  projectFeedbackComments,
  projectFeedbackDetailsByPostId,
  projectFeedbackFallbackDetail,
} from "../../../mocks/data/feedbackDetails";
import { projectSidebarGuides } from "../../../mocks/data/feedbackPageContent";
import { projectFeedbackPosts } from "../../../mocks/data/projectFeedbacks";
import "./ProjectFeedbackDetailPage.css";

const CURRENT_USER_ID = 101;

const contentIconByKey = {
  branch: GitBranch,
  rocket: Rocket,
  search: SearchCheck,
};

function ProjectDetailSidebar() {
  return (
    <aside className="project-detail-sidebar" aria-label="프로젝트 피드백 메뉴">
      <h2>프로젝트 피드백</h2>
      <Link className="project-detail-sidebar__write" to={ROUTES.projectFeedbackWrite}>
        <Edit3 size={18} strokeWidth={2.2} />
        글 작성하기
      </Link>
      <div className="project-detail-sidebar__guide-list">
        {projectSidebarGuides.map(({ icon, title, items }) => {
          const Icon = contentIconByKey[icon];

          return (
          <section className="project-detail-sidebar__guide-card" key={title}>
            <div>
              <Icon size={18} strokeWidth={2.2} />
              <h3>{title}</h3>
            </div>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          );
        })}
      </div>
    </aside>
  );
}

function ProjectFeedbackDetailPage() {
  const { id } = useParams();
  const post = projectFeedbackPosts.find((item) => item.post_id === Number(id));

  if (!post) {
    return <Navigate to={ROUTES.projectFeedbacks} replace />;
  }

  const isAuthor = post.user.user_id === CURRENT_USER_ID;
  const detail = projectFeedbackDetailsByPostId[post.post_id] ?? projectFeedbackFallbackDetail;

  return (
    <AppLayout>
      <div className="project-detail-page">
        <ProjectDetailSidebar />

        <section className="project-detail-content">
          {isAuthor && (
            <div className="project-detail-actions" aria-label="작성자 작업">
              <Link to={`/project-feedbacks/${post.post_id}/edit`}>수정</Link>
              <button type="button">삭제</button>
            </div>
          )}

          <article className="project-detail-card">
            <div className="project-detail-tags">
              <span>프로젝트</span>
              <span>{post.position}</span>
            </div>

            <h1>{post.title}</h1>

            <div className="project-detail-meta">
              <span className="project-detail-avatar">
                <UserRoundCheck size={18} />
              </span>
              <div>
                <strong>{post.user.nickname}</strong>
                <span>{post.position} · 프로젝트 작성자</span>
              </div>
              <time>{formatProjectDateTime(post.created_at)}</time>
              <span>좋아요 {post.like}</span>
              <span>피드백 {projectFeedbackComments.length}</span>
            </div>

            <div className="project-detail-tools">
              <button type="button">
                <Heart size={18} />
                좋아요
              </button>
              <button type="button" aria-label="더 보기">
                <MoreHorizontal size={18} />
              </button>
            </div>

            <section className="project-detail-section">
              <h2>프로젝트 소개</h2>
              <p>{post.description}</p>
            </section>

            <section className="project-detail-section">
              <h2>주요 기능</h2>
              <ul className="project-feature-list">
                {detail.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>

            <section className="project-detail-section">
              <h2>기술 스택</h2>
              <div className="project-stack-list">
                {detail.stacks.map((stack) => (
                  <span key={stack}>{stack}</span>
                ))}
              </div>
            </section>

            <section className="project-detail-section">
              <h2>추가로 받고 싶은 피드백</h2>
              <p>{detail.request}</p>
            </section>

            <section className="project-reference-section">
              <h2>참고 자료</h2>
              <div className="project-link-box">
                <ExternalLink size={18} />
                <strong>{detail.link}</strong>
                <a href={detail.link} target="_blank" rel="noreferrer">
                  열기
                </a>
              </div>
              <div className="project-image-box">
                <FileImage size={18} />
                <div>
                  <strong>프로젝트 화면 및 구조 참고 이미지</strong>
                  <span>첨부 이미지 미리보기 영역</span>
                </div>
              </div>
            </section>
          </article>

          <section className="project-comments">
            <div className="project-comments__header">
              <h2>피드백 {projectFeedbackComments.length}</h2>
            </div>

            <div className="project-comment-list">
              {projectFeedbackComments.map((comment) => (
                <article className="project-comment" key={comment.id}>
                  <span className="project-comment__avatar">
                    <UserRoundCheck size={18} />
                  </span>
                  <div>
                    <div className="project-comment__meta">
                      <strong>{comment.author}</strong>
                      <span>{comment.role}</span>
                      <time>{comment.createdAt}</time>
                    </div>
                    <p>{comment.content}</p>
                    <div className="project-comment__actions">
                      <button type="button">도움돼요 {comment.helpful}</button>
                      <button type="button">댓글 달기</button>
                      <button type="button">신고</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="project-detail-aside" aria-label="상세 도움말">
          <section className="project-detail-side-card">
            <h2>피드백 포인트</h2>
            <div className="project-review-points">
              <article>
                <Code2 size={18} />
                <div>
                  <strong>구조</strong>
                  <span>기능 분리와 데이터 흐름</span>
                </div>
              </article>
              <article>
                <Lightbulb size={18} />
                <div>
                  <strong>기획</strong>
                  <span>핵심 문제와 우선순위</span>
                </div>
              </article>
              <article>
                <ShieldCheck size={18} />
                <div>
                  <strong>품질</strong>
                  <span>성능, 보안, 유지보수성</span>
                </div>
              </article>
            </div>
          </section>

          <section className="project-detail-side-card">
            <h2>관련 태그</h2>
            <div className="project-related-tags">
              {[post.position, ...detail.stacks].map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </AppLayout>
  );
}

function formatProjectDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default ProjectFeedbackDetailPage;
