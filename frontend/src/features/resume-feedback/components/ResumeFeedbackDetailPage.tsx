import { FormEvent, useEffect, useState } from "react";
import {
  Edit3,
  FileSearch,
  Heart,
  Lightbulb,
  MessageSquare,
  SearchCheck,
  Target,
  UserRoundCheck,
  Wand2,
} from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import {
  createResumeComment,
  deleteResumePost,
  getFileUrl,
  getResumeComments,
  getResumePost,
  toggleResumeLike,
  type CommentNode,
  type ResumePost,
} from "../../../lib/api/devfeedback";
import { resumeSidebarGuides } from "../../../mocks/data/feedbackPageContent";
import "./ResumeFeedbackDetailPage.css";

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
  const navigate = useNavigate();
  const postId = Number(id);
  const [post, setPost] = useState<ResumePost | null>(null);
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [fileHref, setFileHref] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!postId) return;
    let mounted = true;
    setIsLoading(true);
    setErrorMessage("");

    Promise.all([getResumePost(postId), getResumeComments(postId)])
      .then(([postResponse, commentsResponse]) => {
        if (!mounted) return;
        setPost(postResponse);
        setComments(commentsResponse.comments);

        if (postResponse.file_url) {
          getFileUrl({ type: "resume", file_path: postResponse.file_url })
            .then((response) => {
              if (mounted) setFileHref(response.url);
            })
            .catch(() => {
              if (mounted) setFileHref(postResponse.file_url ?? "");
            });
        }
      })
      .catch((error) => {
        if (!mounted) return;
        setErrorMessage(error instanceof Error ? error.message : "게시글을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [postId]);

  if (!postId) {
    return <Navigate to={ROUTES.resumeFeedbacks} replace />;
  }

  const handleLike = () => {
    toggleResumeLike(postId).then((response) => {
      setPost((current) => current ? { ...current, likes: response.likes } : current);
    });
  };

  const handleDelete = () => {
    if (!window.confirm("게시글을 삭제할까요?")) return;
    deleteResumePost(postId).then(() => navigate(ROUTES.resumeFeedbacks));
  };

  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = commentContent.trim();
    if (!content) return;

    createResumeComment(postId, content).then((created) => {
      setComments((current) => [...current, { ...created, replies: [] }]);
      setCommentContent("");
    });
  };

  return (
    <AppLayout>
      <div className="resume-detail-page">
        <ResumeSidebar />

        <section className="resume-detail-content">
          {isLoading && <article className="resume-detail-card">불러오는 중입니다.</article>}
          {errorMessage && <article className="resume-detail-card">{errorMessage}</article>}

          {post && !isLoading && !errorMessage && (
            <>
              <div className="resume-detail-actions" aria-label="작성자 작업">
                <Link to={`/resume-feedbacks/${post.id}/edit`}>수정</Link>
                <button type="button" onClick={handleDelete}>삭제</button>
              </div>

              <article className="resume-detail-card">
                <div className="resume-detail-tags">
                  <span>이력서</span>
                  <span>{post.position}</span>
                </div>

                <h1>{post.title}</h1>

                <div className="resume-detail-meta">
                  <span className="resume-detail-avatar">
                    <UserRoundCheck size={18} />
                  </span>
                  <div>
                    <strong>{post.user?.nickname ?? "사용자"}</strong>
                    <span>{post.user?.position ?? post.position}</span>
                  </div>
                  <time>{formatDateTime(post.created_at)}</time>
                  <span>좋아요 {post.likes}</span>
                </div>

                <div className="resume-detail-tools">
                  <button type="button" onClick={handleLike}>
                    <Heart size={18} />
                    좋아요
                  </button>
                </div>

                <section className="resume-detail-description-section">
                  <h2>피드백 요청 내용</h2>
                  <p>{post.description}</p>
                </section>

                {post.file_url && (
                  <section className="resume-attachment-section">
                    <h2>첨부 파일</h2>
                    <a className="resume-file-box" href={fileHref || post.file_url} target="_blank" rel="noreferrer">
                      이력서 파일 열기
                    </a>
                  </section>
                )}
              </article>

              <section className="resume-comments">
                <div className="resume-comments__header">
                  <h2>피드백 {comments.length}</h2>
                </div>

                <form className="resume-comment-list" onSubmit={handleCommentSubmit}>
                  <textarea
                    aria-label="댓글 내용"
                    maxLength={1000}
                    placeholder="댓글을 입력하세요."
                    value={commentContent}
                    onChange={(event) => setCommentContent(event.target.value)}
                  />
                  <button disabled={!commentContent.trim()} type="submit">댓글 작성</button>
                </form>

                <div className="resume-comment-list">
                  {comments.map((comment) => (
                    <CommentArticle comment={comment} key={comment.comment_id} />
                  ))}
                </div>
              </section>
            </>
          )}
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
                  <span>선택 직무와의 연결성</span>
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
        </aside>
      </div>
    </AppLayout>
  );
}

function CommentArticle({ comment }: { comment: CommentNode }) {
  return (
    <article className="resume-comment">
      <span className="resume-comment__avatar">
        <UserRoundCheck size={18} />
      </span>
      <div>
        <div className="resume-comment__meta">
          <strong>{comment.user.nickname}</strong>
          <time>{formatDateTime(comment.created_at)}</time>
        </div>
        <p>{comment.content}</p>
        {comment.replies?.map((reply) => (
          <CommentArticle comment={reply} key={reply.comment_id} />
        ))}
      </div>
    </article>
  );
}

function formatDateTime(value?: string) {
  if (!value) return "";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default ResumeFeedbackDetailPage;
