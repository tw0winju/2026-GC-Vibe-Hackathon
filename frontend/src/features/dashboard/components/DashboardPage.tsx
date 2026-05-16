import {
  Bookmark,
  Code,
  FileText,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Star,
  ThumbsUp,
  UserRound,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import {
  dashboardLikedPosts,
  dashboardPopularFeedbacks,
  dashboardProfile,
  dashboardRecentPosts,
  dashboardStats,
} from "../../../mocks/data/dashboard";
import {
  type DashboardLikedPost,
  type DashboardPopularFeedback,
  type DashboardPost,
} from "../api/dashboardApi";
import { dashboardMenuGroups } from "./dashboardMenu";
import "./DashboardPage.css";

function getTypeLabel(type?: string) {
  return type === "PROJECT" ? "프로젝트" : "이력서";
}

function getFeedbackDetailPath(type: string | undefined, id: number) {
  return type === "PROJECT" ? `/project-feedbacks/${id}` : `/resume-feedbacks/${id}`;
}

function ProfileValue({ icon: Icon, text }: { icon: typeof Mail; text?: string }) {
  if (!text) {
    return null;
  }

  return (
    <span className="dashboard-profile-value">
      <Icon size={17} />
      {text}
    </span>
  );
}

function StatItem({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value?: number }) {
  return (
    <article className="dashboard-stat">
      <span>
        <Icon size={18} />
        {label}
      </span>
      <strong>{value ?? 0}</strong>
    </article>
  );
}

function RecentPost({ post }: { post: DashboardPost }) {
  return (
    <Link className="dashboard-recent-post" to={getFeedbackDetailPath(post.type, post.id)}>
      <span className="dashboard-chip">{getTypeLabel(post.type)}</span>
      <div>
        <h3>{post.title}</h3>
        <p>{post.description}</p>
        <span className="dashboard-post-meta">
          {post.createdAtText ?? "최근"} · 댓글 {post.commentCount ?? 0} · 좋아요 {post.likeCount ?? 0}
        </span>
      </div>
    </Link>
  );
}

function PopularFeedback({ item }: { item: DashboardPopularFeedback }) {
  return (
    <Link className="dashboard-popular-item" to={getFeedbackDetailPath(item.type, item.id)}>
      <span className="dashboard-rank">{item.rank ?? item.id}</span>
      <div className="dashboard-popular-body">
        <h3>{item.title}</h3>
      </div>
      <span className="dashboard-popular-likes">
        <Heart size={16} />
        {item.likeCount ?? 0}
      </span>
    </Link>
  );
}

function LikedPost({ post }: { post: DashboardLikedPost }) {
  return (
    <Link className="dashboard-liked-item" to={getFeedbackDetailPath(post.type, post.id)}>
      <Heart size={18} fill="currentColor" />
      <div>
        <h3>
          {post.title}
          <span className="dashboard-chip">{getTypeLabel(post.type)}</span>
        </h3>
        <p>{post.type === "PROJECT" ? "개발자" : "멘토"} · {post.authorRole ?? "개발자"}</p>
      </div>
      <time>{post.createdAtText ?? "최근"}</time>
    </Link>
  );
}

function DashboardPage() {
  const location = useLocation();
  const profile = dashboardProfile;
  const stats = dashboardStats;
  const recentPosts = dashboardRecentPosts;
  const popularFeedbacks = dashboardPopularFeedbacks;
  const likedPosts = dashboardLikedPosts;

  return (
    <AppLayout>
      <div className="dashboard-shell">
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

        <div className="dashboard-content">
          <section className="dashboard-profile-card">
            <div className="dashboard-avatar">
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : <UserRound size={62} />}
            </div>
            <div className="dashboard-profile-main">
              <div className="dashboard-profile-heading">
                <h1>{profile.name}</h1>
                <span>{profile.major} {profile.grade}</span>
              </div>
              <p>{profile.bio}</p>
              <div className="dashboard-profile-grid">
                <ProfileValue icon={Code} text={profile.githubUrl} />
                <ProfileValue icon={Mail} text={profile.email} />
                <ProfileValue icon={Bookmark} text={profile.blogUrl} />
                <ProfileValue icon={MapPin} text={profile.location} />
              </div>
              <div className="dashboard-tech-stack" aria-label="테크스택">
                <strong>테크스택</strong>
                <div>
                  {profile.techStacks?.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
            <Link className="dashboard-edit-button" to={ROUTES.mypageEdit}>프로필 편집</Link>
            <div className="dashboard-stats">
              <StatItem icon={ThumbsUp} label="이력서 게시글" value={stats.resumePostCount} />
              <StatItem icon={Pencil} label="프로젝트 게시글" value={stats.projectPostCount} />
              <StatItem icon={Star} label="좋아요 누른 게시글" value={stats.likedPostCount} />
              <StatItem icon={Bookmark} label="작성한 댓글" value={stats.commentCount} />
            </div>
          </section>

          <section className="dashboard-card dashboard-recent-card">
            <div className="dashboard-card-header">
              <h2>최근 작성한 게시글</h2>
              <Link to={ROUTES.mypage}>전체 보기</Link>
            </div>
            <div className="dashboard-recent-list">
              {recentPosts.map((post) => (
                <RecentPost post={post} key={post.id} />
              ))}
            </div>
          </section>
        </div>

        <aside className="dashboard-right-column">
          <section className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>인기 피드백 글</h2>
            </div>
            <div className="dashboard-popular-list">
              {popularFeedbacks.map((item) => (
                <PopularFeedback item={item} key={item.id} />
              ))}
            </div>
          </section>

          <section className="dashboard-card">
            <div className="dashboard-card-header">
              <h2>내가 좋아요 누른 게시글</h2>
              <Link to={ROUTES.mypage}>전체 보기</Link>
            </div>
            <div className="dashboard-liked-list">
              {likedPosts.map((post) => (
                <LikedPost post={post} key={post.id} />
              ))}
            </div>
          </section>
        </aside>
      </div>
    </AppLayout>
  );
}

export default DashboardPage;
