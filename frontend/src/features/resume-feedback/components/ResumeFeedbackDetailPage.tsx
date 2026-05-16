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
import {
  resumeFeedbackComments,
  resumeFeedbackDetail,
  resumeRelatedTagsByCategory,
} from "../../../mocks/data/feedbackDetails";
import { resumeSidebarGuides } from "../../../mocks/data/feedbackPageContent";
import { resumeFeedbackPosts } from "../../../mocks/data/resumeFeedbacks";
import "./ResumeFeedbackDetailPage.css";

const CURRENT_USER_ID = 1;

const contentIconByKey = {
  lightbulb: Lightbulb,
  message: MessageSquare,
  search: SearchCheck,
};

function ResumeSidebar() {
  return (
    <aside className="resume-detail-sidebar" aria-label="이력서 피드백 메뉴">
      <h2>이력서 피드백</h2>
      <Link className="resume-detail-sidebar__write" to={ROUTES.resumeFeedbackWrite}>
        <Edit3 size={18} strokeWidth={2.2} />
        글 작성하기
      </Link>
      <div className="resume-detail-sidebar__guide-list">
        {resumeSidebarGuides.map(({ icon, title, items }) => {
          const Icon = contentIconByKey[icon];

          return (
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
          );
        })}
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
                <strong>{resumeFeedbackDetail.authorName}</strong>
                <span>{resumeFeedbackDetail.authorInfo}</span>
              </div>
              <time>{resumeFeedbackDetail.createdAt}</time>
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
              <p>{resumeFeedbackDetail.request}</p>
            </section>

            <section className="resume-attachment-section">
              <h2>첨부 파일</h2>
              <div className="resume-file-box">
                <FileText size={18} />
                <strong>{resumeFeedbackDetail.attachment.fileName}</strong>
                <span>{resumeFeedbackDetail.attachment.fileSize}</span>
                <button type="button" aria-label="첨부파일 다운로드">
                  <Download size={18} />
                </button>
              </div>
            </section>
          </article>

          <section className="resume-comments">
            <div className="resume-comments__header">
              <h2>피드백 {resumeFeedbackComments.length}</h2>
            </div>

            <div className="resume-comment-list">
              {resumeFeedbackComments.map((comment) => (
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
  return resumeRelatedTagsByCategory[category] ?? [category, "경험 정리", "직무 적합도"];
}

export default ResumeFeedbackDetailPage;
