import { useMemo, useState } from "react";
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
  UserRoundCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import { resumeFeedbackPosts } from "../../../mocks/data/resumeFeedbacks";
import { getResumeGuideByCategory, getResumeGuidePath } from "../../guide/model/resumeGuide";
import {
  RESUME_FEEDBACK_CATEGORIES,
  type ResumeFeedbackCategory,
  type ResumeFeedbackSort,
} from "../model/resumeFeedback";
import "./ResumeFeedbackPage.css";

const PAGE_SIZE = 10;

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

const guides = RESUME_FEEDBACK_CATEGORIES.filter((category) => category !== "전체");

const tips = [
  {
    icon: FileText,
    title: "경험은 구체적으로 작성하세요",
    description: "프로젝트, 역할, 성과를 구체적으로 작성하면 더 좋은 피드백을 받을 수 있어요.",
  },
  {
    icon: Lightbulb,
    title: "기술 스택은 명확히 정리하세요",
    description: "사용한 기술과 숙련도를 명확히 기재하면 피드백이 더 정확해져요.",
  },
  {
    icon: SearchCheck,
    title: "맞춤형 이력서를 작성하세요",
    description: "지원하는 회사와 직무에 맞춰 이력서를 최적화해보세요.",
  },
];

function ResumeFeedbackPage() {
  const [selectedCategory, setSelectedCategory] = useState<ResumeFeedbackCategory>("전체");
  const [sort, setSort] = useState<ResumeFeedbackSort>("likes");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const postsByCategory =
      selectedCategory === "전체"
        ? [...resumeFeedbackPosts]
        : resumeFeedbackPosts.filter((post) => post.category === selectedCategory);

    const posts = normalizedQuery
      ? postsByCategory.filter((post) =>
          [post.title, post.description, post.author, post.category]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
        )
      : postsByCategory;

    return posts.sort((a, b) => {
      if (sort === "latest") return a.id - b.id;
      return b.likes - a.likes;
    });
  }, [searchQuery, selectedCategory, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const paginatedPosts = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const popularPosts = [...resumeFeedbackPosts].sort((a, b) => b.likes - a.likes).slice(0, 5);

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
            {sidebarGuides.map(({ icon: Icon, title, items }) => (
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
            ))}
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
              placeholder="제목, 내용, 작성자 검색"
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

            {paginatedPosts.map((post) => (
              <Link className="resume-row" key={post.id} to={`/resume-feedbacks/${post.id}`} role="row">
                <div className="resume-row__title">
                  <strong>{post.title}</strong>
                  <span>{post.description}</span>
                </div>
                <span className="resume-row__category">{post.category}</span>
                <span className="resume-row__author">
                  <span className="resume-row__avatar">
                    <UserRoundCheck size={16} strokeWidth={2.3} />
                  </span>
                  {post.author}
                </span>
                <span className="resume-row__date">{post.createdAt}</span>
                <span className="resume-row__likes">
                  <Heart size={18} strokeWidth={2.1} />
                  {post.likes}
                </span>
              </Link>
            ))}

            {paginatedPosts.length === 0 && (
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
                  <span>{index + 1}</span>
                  <p>{post.title}</p>
                  <Heart size={16} strokeWidth={2.1} />
                  <strong>{post.likes}</strong>
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
              {tips.map(({ icon: Icon, title, description }) => (
                <article key={title}>
                  <span>
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </AppLayout>
  );
}

export default ResumeFeedbackPage;
