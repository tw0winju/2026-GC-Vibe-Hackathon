import { FormEvent, useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  Handshake,
  Lightbulb,
  MessageSquareText,
  UsersRound,
} from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import { isCurrentUser } from "../../../lib/auth/session";
import {
  createCommunityPost,
  getCommunityPost,
  updateCommunityPost,
  type CommunityCategory,
} from "../../../lib/api/devfeedback";
import { COMMUNITY_CATEGORIES } from "../model/community";
import "./CommunityWritePage.css";

const categories = COMMUNITY_CATEGORIES.filter(
  (category): category is CommunityCategory => category !== "전체",
);

const categoryGuides = [
  {
    title: "자유",
    description: "잡담, 질문, 정보 공유는 맥락을 먼저 적어주면 답변이 훨씬 쉬워져요.",
  },
  {
    title: "프로젝트 팀 구하기",
    description: "역할, 기술 스택, 진행 기간, 현재 모집 인원을 함께 적어주세요.",
  },
  {
    title: "취업&진로",
    description: "목표 직무와 현재 상황을 함께 쓰면 더 현실적인 조언을 받을 수 있어요.",
  },
];

const manners = [
  "서로의 경험과 선택을 존중하는 표현을 사용해주세요.",
  "비판보다 제안에 가깝게, 이유와 대안을 함께 남겨주세요.",
  "개인정보나 외부 링크를 공유할 때는 공개 범위를 한 번 더 확인해주세요.",
];

function CommunityWritePage({ mode = "create" }: { mode?: "create" | "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);
  const isEdit = mode === "edit";
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CommunityCategory>("자유");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = Boolean(title.trim() && category && content.trim());

  useEffect(() => {
    if (!isEdit || !postId) return;
    let mounted = true;

    getCommunityPost(postId)
      .then((post) => {
        if (!mounted) return;
        const postOwnerId = post.user?.id ?? post.user?.user_id;
        if (!isCurrentUser(postOwnerId)) {
          setCanEdit(false);
          setErrorMessage("본인이 작성한 글만 수정할 수 있습니다.");
          return;
        }

        setTitle(post.title);
        setCategory(post.category);
        setContent(post.content);
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
  }, [isEdit, postId]);

  if (isEdit && !postId) {
    return <Navigate to={ROUTES.community} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        title: title.trim(),
        category,
        content: content.trim(),
      };
      const post = isEdit
        ? await updateCommunityPost(postId, payload)
        : await createCommunityPost(payload);

      navigate(`/community/${post.id ?? postId}`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "커뮤니티 글 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="community-write-page">
        <main className="community-write-content">
          <div className="community-write-heading">
            <h1>{isEdit ? "커뮤니티 글 수정" : "커뮤니티 글 작성"}</h1>
            <p>나누고 싶은 이야기의 성격에 맞게 카테고리를 선택해주세요.</p>
          </div>

          {isLoading ? (
            <article className="community-write-form">불러오는 중입니다.</article>
          ) : !canEdit ? (
            <article className="community-write-form">{errorMessage}</article>
          ) : (
            <form className="community-write-form" onSubmit={handleSubmit}>
              <section className="community-form-section">
                <label htmlFor="community-title">1. 제목</label>
                <div className="community-input-with-count">
                  <input
                    id="community-title"
                    maxLength={100}
                    placeholder="제목을 입력해주세요."
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                  <span>{title.length}/100</span>
                </div>
              </section>

              <section className="community-form-section">
                <span className="community-form-label">2. 카테고리</span>
                <div className="community-category-options" aria-label="커뮤니티 카테고리">
                  {categories.map((item) => (
                    <button
                      className={category === item ? "is-active" : ""}
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                    >
                      {category === item && <Check size={15} strokeWidth={2.4} />}
                      {item}
                    </button>
                  ))}
                </div>
              </section>

              <section className="community-form-section">
                <label htmlFor="community-content">3. 내용</label>
                <div className="community-textarea-with-count">
                  <textarea
                    id="community-content"
                    maxLength={3000}
                    placeholder={"자유롭게 내용을 작성해주세요.\n팀원 모집 글이라면 역할, 기술 스택, 기간을 함께 적으면 좋아요."}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                  />
                  <span>{content.length}/3000</span>
                </div>
              </section>

              <div className="community-form-actions">
                {errorMessage && <p>{errorMessage}</p>}
                <button disabled={!canSubmit || isSubmitting} type="submit">
                  <MessageSquareText size={17} strokeWidth={2.3} />
                  {isSubmitting ? "저장 중..." : isEdit ? "수정 완료" : "작성 완료"}
                </button>
              </div>
            </form>
          )}
        </main>

        <aside className="community-write-aside" aria-label="커뮤니티 작성 도움말">
          <section>
            <div className="community-aside-title">
              <Handshake size={19} strokeWidth={2.2} />
              <h2>대화 매너</h2>
            </div>
            <ul className="community-manner-list">
              {manners.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={17} strokeWidth={2.2} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="community-aside-title">
              <Lightbulb size={19} strokeWidth={2.2} />
              <h2>카테고리 작성 포인트</h2>
            </div>
            <div className="community-category-guide-list">
              {categoryGuides.map((guide) => (
                <article key={guide.title}>
                  <strong>{guide.title}</strong>
                  <p>{guide.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="community-aside-card--accent">
            <div className="community-aside-title">
              <UsersRound size={19} strokeWidth={2.2} />
              <h2>게시 전 체크</h2>
            </div>
            <p>제목만 봐도 글의 목적이 보이는지, 댓글로 이어질 질문이 포함되어 있는지 확인해보세요.</p>
          </section>
        </aside>
      </div>
    </AppLayout>
  );
}

export default CommunityWritePage;
