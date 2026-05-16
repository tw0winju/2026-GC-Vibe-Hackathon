import { useMemo, useState } from "react";
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  Code2,
  Edit3,
  GitBranch,
  Heart,
  Lightbulb,
  Rocket,
  Search,
  SearchCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import { projectFeedbackPosts } from "../../../mocks/data/projectFeedbacks";
import {
  PROJECT_FEEDBACK_CATEGORIES,
  type ProjectFeedbackCategory,
  type ProjectFeedbackSort,
} from "../model/projectFeedback";
import "./ProjectFeedbackPage.css";

const PAGE_SIZE = 10;

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

const tips = [
  {
    icon: Boxes,
    title: "문제와 사용자를 먼저 보여주세요",
    description: "무엇을 해결하려는 프로젝트인지 알면 기능 피드백도 훨씬 정확해져요.",
  },
  {
    icon: Code2,
    title: "핵심 기술 선택 이유를 남겨보세요",
    description: "스택 이름보다 왜 그 기술을 골랐는지가 좋은 토론을 만듭니다.",
  },
  {
    icon: Lightbulb,
    title: "다음 개선 목표를 적어주세요",
    description: "현재 막힌 지점을 공유하면 실행 가능한 피드백을 받기 쉬워요.",
  },
];

function ProjectFeedbackPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectFeedbackCategory>("전체");
  const [sort, setSort] = useState<ProjectFeedbackSort>("like");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const postsByCategory =
      selectedCategory === "전체"
        ? [...projectFeedbackPosts]
        : projectFeedbackPosts.filter((post) => post.position === selectedCategory);

    const posts = normalizedQuery
      ? postsByCategory.filter((post) =>
          [post.title, post.description, post.user.nickname, post.position]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery),
        )
      : postsByCategory;

    return posts.sort((a, b) => {
      if (sort === "latest") return b.created_at.localeCompare(a.created_at);
      return b.like - a.like;
    });
  }, [searchQuery, selectedCategory, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const paginatedPosts = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const popularPosts = [...projectFeedbackPosts].sort((a, b) => b.like - a.like).slice(0, 5);

  const handleCategoryChange = (category: ProjectFeedbackCategory) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleSortChange = (nextSort: ProjectFeedbackSort) => {
    setSort(nextSort);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  return (
    <AppLayout>
      <div className="project-feedback-page">
        <aside className="project-sidebar" aria-label="프로젝트 피드백 메뉴">
          <h2>프로젝트 피드백</h2>
          <Link className="project-sidebar__write" to={ROUTES.projectFeedbackWrite}>
            <Edit3 size={18} strokeWidth={2.2} />
            글 작성하기
          </Link>
          <div className="project-sidebar__guide-list">
            {sidebarGuides.map(({ icon: Icon, title, items }) => (
              <section className="project-sidebar__guide-card" key={title}>
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

        <section className="project-content">
          <div className="project-content__heading">
            <div>
              <h1>프로젝트 피드백</h1>
              <p>기획, 구현, 디자인, 배포까지 프로젝트의 완성도를 함께 끌어올려보세요.</p>
            </div>
          </div>

          <label className="project-search" htmlFor="project-feedback-search">
            <Search size={18} strokeWidth={2.2} />
            <input
              id="project-feedback-search"
              placeholder="제목, 내용, 작성자 검색"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </label>

          <div className="project-toolbar">
            <div className="project-categories" aria-label="카테고리 필터">
              {PROJECT_FEEDBACK_CATEGORIES.map((category) => (
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
              className="project-sort"
              value={sort}
              onChange={(event) => handleSortChange(event.target.value as ProjectFeedbackSort)}
            >
              <option value="like">좋아요 많은 순</option>
              <option value="latest">최신순</option>
            </select>
          </div>

          <Link className="project-guide-banner" to={ROUTES.projectFeedbackWrite}>
            <Sparkles size={20} strokeWidth={2.3} />
            <div>
              <strong>내 프로젝트도 피드백 받아보기</strong>
              <span>데모 링크, 기술 스택, 고민 지점을 함께 올리면 더 구체적인 피드백을 받을 수 있어요.</span>
            </div>
            <ChevronRight size={22} strokeWidth={2.1} />
          </Link>

          <div className="project-table" role="table" aria-label="프로젝트 피드백 게시글">
            <div className="project-table__head" role="row">
              <span>프로젝트</span>
              <span>분야</span>
              <span>작성일</span>
              <span>작성자</span>
              <span>좋아요</span>
            </div>

            {paginatedPosts.map((post) => (
              <Link className="project-row" key={post.post_id} to={`/project-feedbacks/${post.post_id}`} role="row">
                <div className="project-row__title">
                  <strong>{post.title}</strong>
                  <span>{post.description}</span>
                </div>
                <span className="project-row__category">{post.position}</span>
                <span className="project-row__date">{formatProjectDate(post.created_at)}</span>
                <span className="project-row__author">
                  <span className="project-row__avatar">
                    <UserRoundCheck size={16} strokeWidth={2.3} />
                  </span>
                  {post.user.nickname}
                </span>
                <span className="project-row__stats">
                  <Heart size={17} strokeWidth={2.1} />
                  {post.like}
                </span>
              </Link>
            ))}

            {paginatedPosts.length === 0 && (
              <div className="project-empty" role="row">
                검색 결과가 없습니다.
              </div>
            )}
          </div>

          <div className="project-pagination" aria-label="페이지네이션">
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

        <aside className="project-aside" aria-label="추천 정보">
          <section className="project-side-card">
            <h2>인기 프로젝트</h2>
            <ol className="project-popular-list">
              {popularPosts.map((post, index) => (
                <li key={post.post_id}>
                  <span>{index + 1}</span>
                  <p>{post.title}</p>
                  <Heart size={16} strokeWidth={2.1} />
                  <strong>{post.like}</strong>
                </li>
              ))}
            </ol>
          </section>

          <section className="project-side-card">
            <h2>피드백 작성 팁</h2>
            <div className="project-tip-list">
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

function formatProjectDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
  }).format(new Date(value));
}

export default ProjectFeedbackPage;
