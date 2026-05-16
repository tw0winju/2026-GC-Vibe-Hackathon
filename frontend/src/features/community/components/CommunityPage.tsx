import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquareText,
  Pencil,
  Search,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import profileImage from "../../../assets/images/home/gg.png";
import AppLayout from "../../../components/layout/AppLayout";
import {
  getCommunityPosts,
  type CommunityCategory,
  type CommunityPost,
} from "../../../lib/api/devfeedback";
import {
  COMMUNITY_CATEGORIES,
  type CommunityCategoryFilter,
  type CommunitySort,
} from "../model/community";
import "./CommunityPage.css";

const PAGE_SIZE = 10;

const categoryIcon = {
  자유: MessageSquareText,
  "프로젝트 팀 구하기": UsersRound,
  "취업&진로": BriefcaseBusiness,
};

function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategoryFilter>("전체");
  const [sort, setSort] = useState<CommunitySort>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setErrorMessage("");

    getCommunityPosts({
      page,
      size: PAGE_SIZE,
      category: selectedCategory === "전체" ? undefined : selectedCategory as CommunityCategory,
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
        setErrorMessage(error instanceof Error ? error.message : "커뮤니티 글을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, searchQuery, selectedCategory, sort]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleCategoryChange = (category: CommunityCategoryFilter) => {
    setSelectedCategory(category);
    setPage(1);
  };

  return (
    <AppLayout>
      <div className="community-page">
        <aside className="community-sidebar" aria-label="커뮤니티 메뉴">
          <h2>커뮤니티</h2>
          <Link className="community-sidebar__write" to={ROUTES.communityWrite}>
            <Pencil size={18} strokeWidth={2.2} />
            글 작성하기
          </Link>
          <div className="community-sidebar__category-list">
            {COMMUNITY_CATEGORIES.filter((category) => category !== "전체").map((category) => {
              const Icon = categoryIcon[category];
              return (
                <button
                  className={selectedCategory === category ? "is-active" : ""}
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                >
                  <Icon size={18} strokeWidth={2.2} />
                  {category}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="community-content">
          <div className="community-content__heading">
            <div>
              <h1>커뮤니티</h1>
              <p>자유로운 질문, 팀원 모집, 취업과 진로 고민을 함께 나눠보세요.</p>
            </div>
          </div>

          <label className="community-search" htmlFor="community-search">
            <Search size={18} strokeWidth={2.2} />
            <input
              id="community-search"
              placeholder="제목, 내용 검색"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPage(1);
              }}
            />
          </label>

          <div className="community-toolbar">
            <div className="community-categories" aria-label="커뮤니티 카테고리">
              {COMMUNITY_CATEGORIES.map((category) => (
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
              className="community-sort"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as CommunitySort);
                setPage(1);
              }}
            >
              <option value="latest">최신순</option>
              <option value="likes">좋아요 많은 순</option>
            </select>
          </div>

          <div className="community-table" role="table" aria-label="커뮤니티 게시글">
            <div className="community-table__head" role="row">
              <span>글</span>
              <span>카테고리</span>
              <span>작성일</span>
              <span>작성자</span>
              <span>좋아요</span>
            </div>

            {isLoading && <div className="community-empty" role="row">불러오는 중입니다.</div>}
            {errorMessage && <div className="community-empty" role="row">{errorMessage}</div>}

            {!isLoading && !errorMessage && posts.map((post) => (
              <Link className="community-row" key={post.id} to={`/community/${post.id}`} role="row">
                <div className="community-row__title">
                  <strong>{post.title}</strong>
                  <span>{post.content}</span>
                </div>
                <span className="community-row__category">{post.category}</span>
                <span className="community-row__date">{formatDate(post.created_at)}</span>
                <span className="community-row__author">
                  <span className="community-row__avatar">
                    <img src={profileImage} alt="" />
                  </span>
                  {post.user?.nickname ?? "사용자"}
                </span>
                <span className="community-row__stats">
                  <Heart size={17} strokeWidth={2.1} />
                  {post.likes}
                </span>
              </Link>
            ))}

            {!isLoading && !errorMessage && posts.length === 0 && (
              <div className="community-empty" role="row">
                아직 등록된 글이 없습니다.
              </div>
            )}
          </div>

          <div className="community-pagination" aria-label="페이지네이션">
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
      </div>
    </AppLayout>
  );
}

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat("ko-KR").format(new Date(value)) : "";
}

export default CommunityPage;
