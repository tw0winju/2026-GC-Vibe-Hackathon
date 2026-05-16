import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  FileText,
  Heart,
  Lightbulb,
  MessageSquare,
  Search,
  SearchCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import profileImage from "../../../assets/images/home/gg.png";
import AppLayout from "../../../components/layout/AppLayout";
import { getResumePosts, type ResumePost } from "../../../lib/api/devfeedback";
import { resumeSidebarGuides, resumeTips } from "../../../mocks/data/feedbackPageContent";
import { getResumeGuideByCategory, getResumeGuidePath } from "../../guide/model/resumeGuide";
import {
  RESUME_FEEDBACK_CATEGORIES,
  type ResumeFeedbackCategory,
  type ResumeFeedbackSort,
} from "../model/resumeFeedback";
import "./ResumeFeedbackPage.css";

const PAGE_SIZE = 10;

const guides = RESUME_FEEDBACK_CATEGORIES.filter((category) => category !== "전체");

const contentIconByKey = {
  file: FileText,
  lightbulb: Lightbulb,
  message: MessageSquare,
  search: SearchCheck,
};

function ResumeFeedbackPage() {
  const [selectedCategory, setSelectedCategory] = useState<ResumeFeedbackCategory>("전체");
  const [sort, setSort] = useState<ResumeFeedbackSort>("likes");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<ResumePost[]>([]);
  const [popularPosts, setPopularPosts] = useState<ResumePost[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setErrorMessage("");

    getResumePosts({
      page,
      size: PAGE_SIZE,
      position: selectedCategory === "전체" ? undefined : selectedCategory,
      sort: sort === "likes" ? "like" : "latest",
      keyword: searchQuery.trim() || undefined,
    })
      .then((response) => {
        if (!mounted) return;
        setPosts(response.posts);
        setTotal(response.total);
      })
      .catch((error) => {
        if (!mounted) return;
        setPosts([]);
        setTotal(0);
        setErrorMessage(error instanceof Error ? error.message : "이력서 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, searchQuery, selectedCategory, sort]);

  useEffect(() => {
    getResumePosts({ page: 1, size: 5, sort: "like" })
      .then((response) => setPopularPosts(response.posts))
      .catch(() => setPopularPosts([]));
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleCategoryChange = (category: ResumeFeedbackCategory) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleSortChange = (nextSort: ResumeFeedbackSort) => {
    setSort(nextSort);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  return (
    <AppLayout>
      <div className="resume-feedback-page">
        <aside className="resume-sidebar" aria-label="이력서 피드백 메뉴">
          <h2>이력서 피드백</h2>
          <Link className="resume-sidebar__write" to={ROUTES.resumeFeedbackWrite}>
            <Edit3 size={18} strokeWidth={2.2} />
            글 작성하기
          </Link>
          <div className="resume-sidebar__guide-list">
            {resumeSidebarGuides.map(({ icon, title, items }) => {
              const Icon = contentIconByKey[icon];

              return (
              <section className="resume-sidebar__guide-card" key={title}>
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

        <section className="resume-content">
          <div className="resume-content__heading">
            <div>
              <h1>이력서 피드백</h1>
              <p>전공, 직무, 경력에 맞는 피드백을 받고 더 나은 이력서를 완성해보세요.</p>
            </div>
          </div>

          <label className="resume-search" htmlFor="resume-feedback-search">
            <Search size={18} strokeWidth={2.2} />
            <input
              id="resume-feedback-search"
              placeholder="제목, 내용 검색"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </label>

          <div className="resume-toolbar">
            <div className="resume-categories" aria-label="카테고리 필터">
              {RESUME_FEEDBACK_CATEGORIES.map((category) => (
                <button
                  className={selectedCategory === category ? "is-active" : ""}
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <select
              aria-label="정렬"
              className="resume-sort"
              value={sort}
              onChange={(event) => handleSortChange(event.target.value as ResumeFeedbackSort)}
            >
              <option value="likes">좋아요 많은 순</option>
              <option value="latest">최신순</option>
            </select>
          </div>

          <Link className="resume-guide-banner" to={ROUTES.guide}>
            <Sparkles size={20} strokeWidth={2.3} />
            <div>
              <strong>이력서 피드백 게시판 이용 가이드</strong>
              <span>피드백을 요청할 때 더 정확하고 유용한 피드백을 받을 수 있는 방법을 확인해보세요!</span>
            </div>
            <ChevronRight size={22} strokeWidth={2.1} />
          </Link>

          <div className="resume-table" role="table" aria-label="이력서 피드백 게시글">
            <div className="resume-table__head" role="row">
              <span>제목</span>
              <span>직무</span>
              <span>작성자</span>
              <span>작성일</span>
              <span>좋아요</span>
            </div>

            {isLoading && <div className="resume-empty" role="row">불러오는 중입니다.</div>}
            {errorMessage && <div className="resume-empty" role="row">{errorMessage}</div>}

            {!isLoading && !errorMessage && posts.map((post) => (
              <Link className="resume-row" key={post.id} to={`/resume-feedbacks/${post.id}`} role="row">
                <div className="resume-row__title">
                  <strong>{post.title}</strong>
                  <span>{post.description}</span>
                </div>
                <span className="resume-row__category">{post.position}</span>
                <span className="resume-row__author">
                  <span className="resume-row__avatar">
                    <img src={profileImage} alt="" />
                  </span>
                  {post.user?.nickname ?? "사용자"}
                </span>
                <span className="resume-row__date">{formatResumeDate(post.created_at)}</span>
                <span className="resume-row__likes">
                  <Heart size={18} strokeWidth={2.1} />
                  {post.likes}
                </span>
              </Link>
            ))}

            {!isLoading && !errorMessage && posts.length === 0 && (
              <div className="resume-empty" role="row">
                검색 결과가 없습니다.
              </div>
            )}
          </div>

          <div className="resume-pagination" aria-label="페이지네이션">
            <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                className={page === pageNumber ? "is-active" : ""}
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </section>

        <aside className="resume-aside" aria-label="추천 정보">
          <section className="resume-side-card">
            <h2>인기 피드백 글</h2>
            <ol className="popular-list">
              {popularPosts.map((post, index) => (
                <li key={post.id}>
                  <Link to={`/resume-feedbacks/${post.id}`}>
                    <span>{index + 1}</span>
                    <p>{post.title}</p>
                    <Heart size={16} strokeWidth={2.1} />
                  <strong>{post.likes}</strong>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section className="resume-side-card">
            <h2>직무별 가이드</h2>
            <div className="guide-list">
              {guides.map((category) => (
                <Link
                  key={category}
                  to={getResumeGuidePath(getResumeGuideByCategory(category)?.slug ?? "")}
                >
                  <span>{category}</span>
                  이력서 작성 가이드
                  <ChevronRight size={17} />
                </Link>
              ))}
            </div>
          </section>

          <section className="resume-side-card">
            <h2>이력서 작성 팁</h2>
            <div className="tip-list">
              {resumeTips.map(({ icon, title, description }) => {
                const Icon = contentIconByKey[icon];

                return (
                <article key={title}>
                  <span>
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </article>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </AppLayout>
  );
}

function formatResumeDate(value?: string) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
  }).format(new Date(value));
}

export default ResumeFeedbackPage;
