import { FormEvent, useEffect, useState } from "react";
import { Heart, MessageSquareText, Send } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import profileImage from "../../../assets/images/home/gg.png";
import AppLayout from "../../../components/layout/AppLayout";
import { isCurrentUser } from "../../../lib/auth/session";
import {
  createCommunityComment,
  deleteCommunityPost,
  getCommunityComments,
  getCommunityPost,
  toggleCommunityLike,
  type CommentNode,
  type CommunityPost,
} from "../../../lib/api/devfeedback";
import "./CommunityDetailPage.css";

function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [message, setMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!postId) return;
    let mounted = true;
    setIsLoading(true);
    setErrorMessage("");

    Promise.all([getCommunityPost(postId), getCommunityComments(postId)])
      .then(([response, commentsResponse]) => {
        if (!mounted) return;
        setPost(response);
        setIsLiked(Boolean(response.liked));
        setComments(commentsResponse.comments);
      })
      .catch((error) => {
        if (mounted) setErrorMessage(error instanceof Error ? error.message : "게시글을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [postId]);

  if (!postId) {
    return <Navigate to={ROUTES.community} replace />;
  }

  const handleLike = () => {
    if (isLiking) return;
    setIsLiking(true);
    setMessage("");

    toggleCommunityLike(postId)
      .then((response) => {
        setPost((current) => current ? { ...current, likes: response.likes } : current);
        setIsLiked(response.liked);
        setMessage(response.liked ? "좋아요를 눌렀습니다." : "좋아요를 취소했습니다.");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "좋아요 처리에 실패했습니다.");
      })
      .finally(() => {
        setIsLiking(false);
      });
  };

  const handleDelete = () => {
    if (!window.confirm("게시글을 삭제할까요?")) return;
    deleteCommunityPost(postId).then(() => navigate(ROUTES.community));
  };

  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = commentContent.trim();
    if (!content) return;
    setCommentMessage("");

    createCommunityComment(postId, content)
      .then((created) => {
        setComments((current) => [...current, { ...created, replies: [] }]);
        setCommentContent("");
      })
      .catch((error) => {
        setCommentMessage(error instanceof Error ? error.message : "댓글 작성에 실패했습니다.");
      });
  };

  const postOwnerId = post?.user?.id ?? post?.user?.user_id;
  const canManagePost = isCurrentUser(postOwnerId);

  return (
    <AppLayout>
      <div className="community-detail-page">
        <aside className="community-detail-sidebar" aria-label="커뮤니티 메뉴">
          <h2>커뮤니티</h2>
          <Link className="community-detail-sidebar__write" to={ROUTES.communityWrite}>
            <MessageSquareText size={18} strokeWidth={2.2} />
            글 작성하기
          </Link>
        </aside>

        <section className="community-detail-content">
          {isLoading && <article className="community-detail-card">불러오는 중입니다.</article>}
          {errorMessage && <article className="community-detail-card">{errorMessage}</article>}

          {post && !isLoading && !errorMessage && (
            <>
              {canManagePost && (
                <div className="community-detail-actions" aria-label="작성자 작업">
                  <Link to={`/community/${post.id}/edit`}>수정</Link>
                  <button type="button" onClick={handleDelete}>삭제</button>
                </div>
              )}

              <article className="community-detail-card">
                <div className="community-detail-tags">
                  <span>커뮤니티</span>
                  <span>{post.category}</span>
                </div>

                <h1>{post.title}</h1>

                <div className="community-detail-meta">
                  <span className="community-detail-avatar">
                    <img src={profileImage} alt="" />
                  </span>
                  <div>
                    <strong>{post.user?.nickname ?? "사용자"}</strong>
                    <span>{post.user?.position ?? "커뮤니티 멤버"}</span>
                  </div>
                  <time>{formatDateTime(post.created_at)}</time>
                  <span>좋아요 {post.likes}</span>
                  <span>댓글 {comments.length}</span>
                </div>

                <div className="community-detail-tools">
                  <button className={isLiked ? "is-liked" : ""} type="button" disabled={isLiking} onClick={handleLike}>
                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                    {isLiking ? "처리 중..." : "좋아요"}
                  </button>
                </div>
                {message && <p className="community-detail-feedback">{message}</p>}

                <section className="community-detail-section">
                  <h2>본문</h2>
                  <p>{post.content}</p>
                </section>
              </article>

              <section className="community-comments">
                <div className="community-comments__header">
                  <h2>댓글 {comments.length}</h2>
                </div>

                <form className="community-comment-form" onSubmit={handleCommentSubmit}>
                  <textarea
                    aria-label="댓글 내용"
                    maxLength={1000}
                    placeholder="의견, 질문, 응원 메시지를 자유롭게 남겨주세요."
                    value={commentContent}
                    onChange={(event) => setCommentContent(event.target.value)}
                  />
                  <div className="community-comment-form__footer">
                    <span>{commentContent.length}/1000</span>
                    <button disabled={!commentContent.trim()} type="submit">
                      <Send size={16} strokeWidth={2.3} />
                      댓글 작성
                    </button>
                  </div>
                </form>

                <div className="community-comment-list">
                  {commentMessage && <p className="community-comment-message">{commentMessage}</p>}
                  {comments.map((comment) => (
                    <CommentArticle comment={comment} key={comment.comment_id} />
                  ))}
                </div>
              </section>
            </>
          )}
        </section>

        <aside className="community-detail-aside" aria-label="커뮤니티 안내">
          <section className="community-detail-side-card">
            <h2>카테고리 안내</h2>
            <div className="community-guide-list">
              <article>
                <strong>자유</strong>
                <span>잡담, 질문, 정보 공유</span>
              </article>
              <article>
                <strong>프로젝트 팀 구하기</strong>
                <span>팀원 모집과 프로젝트 소개</span>
              </article>
              <article>
                <strong>취업&진로</strong>
                <span>취업 준비, 진로 고민, 면접 경험</span>
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
    <article className="community-comment">
      <span className="community-comment__avatar">
        <img src={profileImage} alt="" />
      </span>
      <div>
        <div className="community-comment__meta">
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

export default CommunityDetailPage;
