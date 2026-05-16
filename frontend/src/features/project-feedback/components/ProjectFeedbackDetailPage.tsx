import { FormEvent, useEffect, useState } from "react";
import {
  Code2,
  Edit3,
  GitBranch,
  Heart,
  Lightbulb,
  MessageSquare,
  Rocket,
  SearchCheck,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import {
  createProjectComment,
  deleteProjectPost,
  getProjectComments,
  getProjectPost,
  toggleProjectLike,
  type CommentNode,
  type ProjectPost,
} from "../../../lib/api/devfeedback";
import { projectSidebarGuides } from "../../../mocks/data/feedbackPageContent";
import "./ProjectFeedbackDetailPage.css";

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
  const navigate = useNavigate();
  const postId = Number(id);
  const [post, setPost] = useState<ProjectPost | null>(null);
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!postId) return;
    let mounted = true;
    setIsLoading(true);
    setErrorMessage("");

    Promise.all([getProjectPost(postId), getProjectComments(postId)])
      .then(([postResponse, commentsResponse]) => {
        if (!mounted) return;
        setPost(postResponse);
        setComments(commentsResponse.comments);
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
    return <Navigate to={ROUTES.projectFeedbacks} replace />;
  }

  const handleLike = () => {
    toggleProjectLike(postId).then((response) => {
      setPost((current) => current ? { ...current, likes: response.likes } : current);
    });
  };

  const handleDelete = () => {
    if (!window.confirm("게시글을 삭제할까요?")) return;
    deleteProjectPost(postId).then(() => navigate(ROUTES.projectFeedbacks));
  };

  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = commentContent.trim();
    if (!content) return;

    createProjectComment(postId, content).then((created) => {
      setComments((current) => [...current, { ...created, replies: [] }]);
      setCommentContent("");
    });
  };

  return (
    <AppLayout>
      <div className="project-detail-page">
        <ProjectDetailSidebar />

        <section className="project-detail-content">
          {isLoading && <article className="project-detail-card">불러오는 중입니다.</article>}
          {errorMessage && <article className="project-detail-card">{errorMessage}</article>}

          {post && !isLoading && !errorMessage && (
            <>
              <div className="project-detail-actions" aria-label="작성자 작업">
                <Link to={`/project-feedbacks/${post.id}/edit`}>수정</Link>
                <button type="button" onClick={handleDelete}>삭제</button>
              </div>

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
                    <strong>{post.user?.nickname ?? "사용자"}</strong>
                    <span>{post.user?.position ?? post.position} · 프로젝트 작성자</span>
                  </div>
                  <time>{formatProjectDateTime(post.created_at)}</time>
                  <span>좋아요 {post.likes}</span>
                  <span>피드백 {comments.length}</span>
                </div>

                <div className="project-detail-tools">
                  <button type="button" onClick={handleLike}>
                    <Heart size={18} />
                    좋아요
                  </button>
                </div>

                <section className="project-detail-section">
                  <h2>프로젝트 소개</h2>
                  <p>{post.description}</p>
                </section>

                {post.tag.length > 0 && (
                  <section className="project-detail-section">
                    <h2>기술 스택</h2>
                    <div className="project-stack-list">
                      {post.tag.map((stack) => (
                        <span key={stack}>{stack}</span>
                      ))}
                    </div>
                  </section>
                )}
              </article>

              <section className="project-comments">
                <div className="project-comments__header">
                  <h2>피드백 {comments.length}</h2>
                </div>

                <form className="project-comment-list" onSubmit={handleCommentSubmit}>
                  <textarea
                    aria-label="댓글 내용"
                    maxLength={1000}
                    placeholder="댓글을 입력하세요."
                    value={commentContent}
                    onChange={(event) => setCommentContent(event.target.value)}
                  />
                  <button disabled={!commentContent.trim()} type="submit">댓글 작성</button>
                </form>

                <div className="project-comment-list">
                  {comments.map((comment) => (
                    <CommentArticle comment={comment} key={comment.comment_id} />
                  ))}
                </div>
              </section>
            </>
          )}
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
        </aside>
      </div>
    </AppLayout>
  );
}

function CommentArticle({ comment }: { comment: CommentNode }) {
  return (
    <article className="project-comment">
      <span className="project-comment__avatar">
        <UserRoundCheck size={18} />
      </span>
      <div>
        <div className="project-comment__meta">
          <strong>{comment.user.nickname}</strong>
          <time>{formatProjectDateTime(comment.created_at)}</time>
        </div>
        <p>{comment.content}</p>
        {comment.replies?.map((reply) => (
          <CommentArticle comment={reply} key={reply.comment_id} />
        ))}
      </div>
    </article>
  );
}

function formatProjectDateTime(value?: string) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default ProjectFeedbackDetailPage;
