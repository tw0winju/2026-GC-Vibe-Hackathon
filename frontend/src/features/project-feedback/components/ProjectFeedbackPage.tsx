import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  GitBranch,
  Heart,
  Lightbulb,
  Rocket,
  Search,
  SearchCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import profileImage from "../../../assets/images/home/gg.png";
import AppLayout from "../../../components/layout/AppLayout";
import { getProjectPosts, type ProjectPost } from "../../../lib/api/devfeedback";
import { projectSidebarGuides, projectTips } from "../../../mocks/data/feedbackPageContent";
import {
  PROJECT_FEEDBACK_CATEGORIES,
  type ProjectFeedbackCategory,
  type ProjectFeedbackSort,
} from "../model/projectFeedback";
import "./ProjectFeedbackPage.css";

const PAGE_SIZE = 10;

const contentIconByKey = {
  branch: GitBranch,
  file: Sparkles,
  lightbulb: Lightbulb,
  rocket: Rocket,
  search: SearchCheck,
};

function ProjectFeedbackPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectFeedbackCategory>("전체");
  const [sort, setSort] = useState<ProjectFeedbackSort>("likes");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<ProjectPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<ProjectPost[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setErrorMessage("");

    getProjectPosts({
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
        setErrorMessage(error instanceof Error ? error.message : "프로젝트 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, searchQuery, selectedCategory, sort]);

  useEffect(() => {
    getProjectPosts({ page: 1, size: 5, sort: "like" })
      .then((response) => setPopularPosts(response.posts))
      .catch(() => setPopularPosts([]));
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
            {projectSidebarGuides.map(({ icon, title, items }) => {
              const Icon = contentIconByKey[icon];

              return (
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
              );
            })}
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
              placeholder="제목, 내용 검색"
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
              <option value="likes">좋아요 많은 순</option>
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

            {isLoading && <div className="project-empty" role="row">불러오는 중입니다.</div>}
            {errorMessage && <div className="project-empty" role="row">{errorMessage}</div>}

            {!isLoading && !errorMessage && posts.map((post) => (
              <Link className="project-row" key={post.id} to={`/project-feedbacks/${post.id}`} role="row">
                <div className="project-row__title">
                  {post.thumbnail ? (
                    <img className="project-row__thumbnail" src={post.thumbnail} alt="" loading="lazy" />
                  ) : (
                    <span className="project-row__thumbnail project-row__thumbnail--empty" aria-hidden="true">
                      <Rocket size={18} strokeWidth={2.2} />
                    </span>
                  )}
                  <div>
                    <strong>{post.title}</strong>
                    <span>{post.description}</span>
                  </div>
                </div>
                <span className="project-row__category">{post.position}</span>
                <span className="project-row__date">{formatProjectDate(post.created_at)}</span>
                <span className="project-row__author">
                  <span className="project-row__avatar">
                    <img src={profileImage} alt="" />
                  </span>
                  {post.user?.nickname ?? "사용자"}
                </span>
                <span className="project-row__stats">
                  <Heart size={17} strokeWidth={2.1} />
                  {post.likes}
                </span>
              </Link>
            ))}

            {!isLoading && !errorMessage && posts.length === 0 && (
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
                <li key={post.id}>
                  <Link to={`/project-feedbacks/${post.id}`}>
                    <span>{index + 1}</span>
                    <p>{post.title}</p>
                    <Heart size={16} strokeWidth={2.1} />
                    <strong>{post.likes}</strong>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section className="project-side-card">
            <h2>피드백 작성 팁</h2>
            <div className="project-tip-list">
              {projectTips.map(({ icon, title, description }) => {
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

function formatProjectDate(value?: string) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
  }).format(new Date(value));
}

export default ProjectFeedbackPage;
