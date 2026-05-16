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
import { projectFeedbackPosts } from "../../../mocks/data/projectFeedbacks";
import "./ProjectFeedbackDetailPage.css";

const CURRENT_USER_ID = 101;

const sidebarGuides = [
  {
    icon: Rocket,
    title: "공유 전에",
    items: ["프로젝트 목표 한 줄로 정리", "데모나 GitHub 링크 준비", "현재 단계와 고민 지점 표시"],
  },
  {
    icon: GitBranch,
    title: "좋은 요청 포인트",
    items: ["아키텍처 구조가 적절한지", "핵심 기능 우선순위가 맞는지", "사용자 흐름이 자연스러운지"],
  },
  {
    icon: SearchCheck,
    title: "받기 좋은 피드백",
    items: ["기술 선택 근거", "확장성과 유지보수성", "UI/UX와 완성도"],
  },
];

const detailByPostId: Record<number, { features: string[]; stacks: string[]; link: string; request: string }> = {
  1: {
    features: ["강의실과 건물명 검색", "현재 위치 기준 이동 경로 표시", "자주 찾는 건물 즐겨찾기"],
    stacks: ["React Native", "Kakao Map", "Firebase"],
    link: "https://github.com/devfeedback/campus-map",
    request: "지도 SDK 선택과 이동 경로 UX가 적절한지, MVP 단계에서 기능을 더 줄여야 할지 피드백 받고 싶습니다.",
  },
  2: {
    features: ["관심 기술 기반 스터디 추천", "가능 시간대 필터", "모집 글 작성과 참여 신청"],
    stacks: ["React", "Spring", "MySQL"],
    link: "https://github.com/devfeedback/study-match",
    request: "첫 방문자가 스터디 생성까지 자연스럽게 도달하는지, 매칭 기준을 더 단순화해야 하는지 궁금합니다.",
  },
};

const fallbackDetail = {
  features: ["핵심 기능 설계", "사용자 플로우 구성", "피드백 기반 개선"],
  stacks: ["React", "TypeScript", "API"],
  link: "https://github.com/devfeedback/project",
  request: "프로젝트 방향성과 구현 우선순위가 적절한지 피드백 받고 싶습니다.",
};

const feedbackComments = [
  {
    id: 1,
    author: "구조리뷰어",
    role: "백엔드",
    createdAt: "2시간 전",
    content:
      "MVP 범위가 명확해서 좋아요. 다만 지도 검색, 경로 표시, 즐겨찾기를 한 번에 구현하기보다 검색과 경로 표시를 먼저 안정화하면 완성도가 더 높아질 것 같습니다.",
    helpful: 15,
  },
  {
    id: 2,
    author: "UX멘토",
    role: "프로덕트",
    createdAt: "4시간 전",
    content:
      "사용자가 건물명을 정확히 모를 수 있으니 초성 검색이나 카테고리 탐색을 고려해보세요. 경로 결과 화면에는 예상 소요 시간을 함께 보여주면 좋겠습니다.",
    helpful: 9,
  },
];

function ProjectDetailSidebar() {
  return (
    <aside className="project-detail-sidebar" aria-label="프로젝트 피드백 메뉴">
      <h2>프로젝트 피드백</h2>
      <Link className="project-detail-sidebar__write" to={ROUTES.projectFeedbackWrite}>
        <Edit3 size={18} strokeWidth={2.2} />
        글 작성하기
      </Link>
      <div className="project-detail-sidebar__guide-list">
        {sidebarGuides.map(({ icon: Icon, title, items }) => (
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
        ))}
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
  const detail = detailByPostId[post.post_id] ?? fallbackDetail;

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
              <span>피드백 {feedbackComments.length}</span>
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
              <h2>피드백 {feedbackComments.length}</h2>
            </div>

            <div className="project-comment-list">
              {feedbackComments.map((comment) => (
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
