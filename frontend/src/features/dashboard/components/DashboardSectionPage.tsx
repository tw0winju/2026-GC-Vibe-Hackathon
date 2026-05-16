import { Bookmark, CalendarDays, ChevronDown, Heart, MessageCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import AppLayout from "../../../components/layout/AppLayout";
import { dashboardMenuGroups } from "./dashboardMenu";
import "./DashboardSectionPage.css";

export type DashboardSectionItem = {
  id: number;
  category: string;
  title: string;
  description: string;
  author: string;
  date: string;
  comments?: number;
  likes?: number;
  status?: string;
  tags?: string[];
};

export type DashboardSectionSummary = {
  label: string;
  value: number;
};

type DashboardSectionPageProps = {
  title: string;
  description: string;
  actionLabel?: string;
  heroMetric?: {
    label: string;
    value: number;
  };
  filters?: string[];
  summaries?: DashboardSectionSummary[];
  items?: DashboardSectionItem[];
  sideTitle?: string;
  sideItems?: string[];
};

function DashboardSectionPage({
  title,
  description,
  actionLabel = "전체 보기",
  heroMetric,
  filters = ["전체"],
  summaries = [
    { label: "전체 항목", value: 0 },
    { label: "진행중", value: 0 },
    { label: "완료", value: 0 },
  ],
  items = [],
  sideTitle = "바로가기",
  sideItems = ["최근 업데이트", "확인할 항목", "도움말"],
}: DashboardSectionPageProps) {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState(filters[0] ?? "전체");
  const visibleItems = useMemo(
    () => activeFilter === "전체" ? items : items.filter((item) => item.category === activeFilter),
    [activeFilter, items],
  );
  const shouldShowSide = Boolean(sideTitle && sideItems.length);

  return (
    <AppLayout>
      <div className={shouldShowSide ? "dashboard-section-shell" : "dashboard-section-shell dashboard-section-shell--wide"}>
        <aside className="dashboard-sidebar" aria-label="마이페이지 메뉴">
          {dashboardMenuGroups.map((group, groupIndex) => (
            <div className="dashboard-sidebar-group" key={groupIndex}>
              {group.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;

                return (
                  <Link
                    className={isActive ? "dashboard-sidebar-item is-active" : "dashboard-sidebar-item"}
                    key={item.label}
                    to={item.to}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </aside>

        <main className="dashboard-section-content">
          <section className="dashboard-section-hero">
            <div>
              <p>마이페이지</p>
              {heroMetric && (
                <div className="dashboard-section-hero-metric">
                  <strong>{heroMetric.value}</strong>
                  <span>{heroMetric.label}</span>
                </div>
              )}
              <h1>{title}</h1>
              <span>{description}</span>
            </div>
            <button type="button">{actionLabel}</button>
          </section>

          {summaries.length > 0 && (
            <section className="dashboard-section-summary" aria-label={`${title} 요약`}>
              {summaries.map((summary) => (
                <article key={summary.label}>
                  <span>{summary.label}</span>
                  <strong>{summary.value}</strong>
                </article>
              ))}
            </section>
          )}

          <section className="dashboard-section-card">
            <div className="dashboard-section-toolbar">
              <div className="dashboard-section-filters">
                {filters.map((filter, index) => (
                  <button
                    className={activeFilter === filter || (!activeFilter && index === 0) ? "is-active" : undefined}
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <label>
                <Search size={16} />
                <input placeholder="검색어를 입력하세요" />
              </label>
            </div>

            <div className="dashboard-section-list">
              {visibleItems.length ? (
                visibleItems.map((item) => (
                  <article className="dashboard-section-item" key={item.id}>
                    <span className="dashboard-section-chip">{item.category}</span>
                    <div className="dashboard-section-item-main">
                      <div>
                        <h2>{item.title}</h2>
                        {item.status && <span className="dashboard-section-status">{item.status}</span>}
                      </div>
                      <p>{item.description}</p>
                      <div className="dashboard-section-tags">
                        {item.tags?.map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="dashboard-section-meta">
                      <span>{item.author}</span>
                      <span>
                        <CalendarDays size={15} />
                        {item.date}
                      </span>
                      <span>
                        <MessageCircle size={15} />
                        {item.comments ?? 0}
                      </span>
                      <span>
                        <Heart size={15} />
                        {item.likes ?? 0}
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <p className="dashboard-section-empty">아직 표시할 항목이 없습니다.</p>
              )}
            </div>
          </section>
        </main>

        {shouldShowSide && (
          <aside className="dashboard-section-side">
            <section>
              <div className="dashboard-section-side-header">
                <h2>{sideTitle}</h2>
                <ChevronDown size={18} />
              </div>
              <div className="dashboard-section-side-list">
                {sideItems.map((item, index) => (
                  <article key={item}>
                    <Bookmark size={18} />
                    <div>
                      <strong>{item}</strong>
                      <span>{index + 1}개 항목 확인 필요</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        )}
      </div>
    </AppLayout>
  );
}

export default DashboardSectionPage;
