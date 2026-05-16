import {
  Download,
  Edit3,
  FileText,
  Lightbulb,
  MessageSquare,
  MoreHorizontal,
  SearchCheck,
  Target,
  FileSearch,
  Wand2,
  UserRoundCheck,
} from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import { resumeFeedbackPosts } from "../../../mocks/data/resumeFeedbacks";
import "./ResumeFeedbackDetailPage.css";

const CURRENT_USER_ID = 1;

const sidebarGuides = [
  {
    icon: MessageSquare,
    title: "피드백 요청 전에",
    items: ["지원 직무를 명확히 적기", "궁금한 지점을 2~3개로 좁히기", "이력서 파일 최신본 첨부하기"],
  },
  {
    icon: Lightbulb,
    title: "좋은 요청 예시",
    items: ["백엔드 신입 지원용입니다.", "프로젝트 설명이 충분한지 봐주세요.", "기술 스택 순서가 자연스러운지 궁금해요."],
  },
  {
    icon: SearchCheck,
    title: "받기 좋은 피드백",
    items: ["경험 표현 방식", "직무와의 연결성", "빠진 역량이나 키워드"],
  },
];

const feedbackComments = [
  {
    id: 1,
    author: "백엔드진자",
    role: "전문가",
    createdAt: "3시간 전",
    content:
      "프로젝트 경험이 잘 정리되어 있고 기술 스택도 적절합니다. 다만 각 프로젝트에서 본인의 역할과 성과를 조금 더 구체적으로 작성하면 좋을 것 같아요.",
    helpful: 12,
  },
  {
    id: 2,
    author: "커리어멘토",
    role: "멘토",
    createdAt: "5시간 전",
    content:
      "백엔드 직무와 연결되는 경험은 충분합니다. 성능 개선이나 장애 대응처럼 실무에서 강점으로 보일 수 있는 항목을 상단 요약에 한 줄 추가해보세요.",
    helpful: 8,
  },
];

function ResumeSidebar() {
  return (
    <aside className="resume-detail-sidebar" aria-label="이력서 피드백 메뉴">
      <h2>이력서 피드백</h2>
      <Link className="resume-detail-sidebar__write" to={ROUTES.resumeFeedbackWrite}>
        <Edit3 size={18} strokeWidth={2.2} />
        글 작성하기
      </Link>
      <div className="resume-detail-sidebar__guide-list">
        {sidebarGuides.map(({ icon: Icon, title, items }) => (
          <section className="resume-detail-sidebar__guide-card" key={title}>
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

function ResumeFeedbackDetailPage() {
  const { id } = useParams();
  const post = resumeFeedbackPosts.find((item) => item.id === Number(id));

  if (!post) {
    return <Navigate to={ROUTES.resumeFeedbacks} replace />;
  }

  const authorId = post.id <= 2 ? CURRENT_USER_ID : post.id;
  const isAuthor = authorId === CURRENT_USER_ID;

  return (
    <AppLayout>
      <div className="resume-detail-page">
        <ResumeSidebar />

        <section className="resume-detail-content">
          {isAuthor && (
            <div className="resume-detail-actions" aria-label="작성자 작업">
              <Link to={`/resume-feedbacks/${post.id}/edit`}>수정</Link>
              <button type="button">삭제</button>
            </div>
          )}

          <article className="resume-detail-card">
            <div className="resume-detail-tags">
              <span>이력서</span>
              <span>{post.category}</span>
            </div>

            <h1>{post.title}</h1>

            <div className="resume-detail-meta">
              <span className="resume-detail-avatar">
                <UserRoundCheck size={18} />
              </span>
              <div>
                <strong>김개발</strong>
                <span>컴퓨터공학과 · 4학년</span>
              </div>
              <time>2024.05.10 14:30</time>
              <span>조회 {post.views}</span>
              <span>피드백 {post.comments}</span>
            </div>

            <div className="resume-detail-tools">
              <button type="button" aria-label="더 보기">
                <MoreHorizontal size={18} />
              </button>
            </div>

            <section className="resume-detail-description-section">
              <h2>피드백 요청 내용</h2>
              <p>
                안녕하세요! 백엔드 개발자로 취업을 준비하고 있는 4학년 학생입니다. 이력서에 부족한
                부분이나 개선할 점이 있다면 피드백 부탁드립니다. 감사합니다!
              </p>
            </section>

            <section className="resume-attachment-section">
              <h2>첨부 파일</h2>
              <div className="resume-file-box">
                <FileText size={18} />
                <strong>김개발_이력서.pdf</strong>
                <span>245KB</span>
                <button type="button" aria-label="첨부파일 다운로드">
                  <Download size={18} />
                </button>
              </div>
            </section>
          </article>

          <section className="resume-comments">
            <div className="resume-comments__header">
              <h2>피드백 {feedbackComments.length}</h2>
            </div>

            <div className="resume-comment-list">
              {feedbackComments.map((comment) => (
                <article className="resume-comment" key={comment.id}>
                  <span className="resume-comment__avatar">
                    <UserRoundCheck size={18} />
                  </span>
                  <div>
                    <div className="resume-comment__meta">
                      <strong>{comment.author}</strong>
                      <span>{comment.role}</span>
                      <time>{comment.createdAt}</time>
                    </div>
                    <p>{comment.content}</p>
                    <div className="resume-comment__actions">
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

        <aside className="resume-detail-aside" aria-label="상세 도움말">
          <section className="resume-detail-side-card">
            <h2>피드백 포인트</h2>
            <div className="resume-review-points">
              <article>
                <FileSearch size={18} />
                <div>
                  <strong>구성</strong>
                  <span>요약, 경험, 프로젝트 흐름</span>
                </div>
              </article>
              <article>
                <Target size={18} />
                <div>
                  <strong>직무 적합도</strong>
                  <span>{post.category} 직무와의 연결성</span>
                </div>
              </article>
              <article>
                <Wand2 size={18} />
                <div>
                  <strong>표현</strong>
                  <span>성과, 역할, 기술 키워드</span>
                </div>
              </article>
            </div>
          </section>

          <section className="resume-detail-side-card">
            <h2>관련 태그</h2>
            <div className="resume-related-tags">
              {getResumeRelatedTags(post.category).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </AppLayout>
  );
}

function getResumeRelatedTags(category: string) {
  const tagsByCategory: Record<string, string[]> = {
    "웹 개발": ["웹 개발", "React", "UI 구현", "성능 개선"],
    "앱 개발": ["앱 개발", "모바일", "배포 경험", "사용자 흐름"],
    백엔드: ["백엔드", "API 설계", "DB 설계", "성능 개선"],
    "AI/ML": ["AI/ML", "모델링", "실험 설계", "모델 서빙"],
    데이터: ["데이터", "SQL", "대시보드", "지표 분석"],
    인프라: ["인프라", "CI/CD", "클라우드", "운영"],
    보안: ["보안", "취약점 분석", "리포트", "대응"],
    네트워크: ["네트워크", "장애 분석", "라우팅", "운영"],
    기획: ["기획", "문제 정의", "요구사항", "협업"],
  };

  return tagsByCategory[category] ?? [category, "경험 정리", "직무 적합도"];
}

export default ResumeFeedbackDetailPage;
