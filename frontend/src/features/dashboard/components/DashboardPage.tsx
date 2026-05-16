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
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import profileImage from "../../../assets/images/home/gg.png";
import AppLayout from "../../../components/layout/AppLayout";
import {
  adaptFrontPostType,
  getMe,
  getMyLikes,
  getMyPosts,
  getProjectPosts,
  getResumePosts,
} from "../../../lib/api/devfeedback";
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
          {post.created_at ?? "최근"} · 좋아요 {post.likes ?? 0}
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
        {item.likes ?? 0}
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
        <p>{post.position ?? "피드백"}</p>
      </div>
      <time>{post.created_at ?? "최근"}</time>
    </Link>
  );
}

function formatDate(value?: string) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
  }).format(new Date(value));
}

function DashboardPage() {
  const location = useLocation();
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    school: "",
    grade: "",
    email: "",
    githubUrl: "",
    blogUrl: "",
    techStacks: [] as string[],
  });
  const [stats, setStats] = useState({
    resumePostCount: 0,
    projectPostCount: 0,
    likedPostCount: 0,
    commentCount: 0,
  });
  const [recentPosts, setRecentPosts] = useState<DashboardPost[]>([]);
  const [popularFeedbacks, setPopularFeedbacks] = useState<DashboardPopularFeedback[]>([]);
  const [likedPosts, setLikedPosts] = useState<DashboardLikedPost[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    Promise.all([
      getMe(),
      getMyPosts({ page: 1, size: 3 }),
      getMyLikes({ page: 1, size: 3 }),
      getResumePosts({ page: 1, size: 3, sort: "like" }),
      getProjectPosts({ page: 1, size: 2, sort: "like" }),
    ])
      .then(([me, myPosts, myLikes, resumePopular, projectPopular]) => {
        setProfile({
          name: me.nickname,
          bio: me.introduction ?? "",
          school: me.school ?? "",
          grade: me.grade ?? "",
          email: me.email ?? "",
          githubUrl: me.git_url ?? "",
          blogUrl: me.blog_url ?? "",
          techStacks: me.tag ?? [],
        });
        setStats({
          resumePostCount: me.counts.resume_post,
          projectPostCount: me.counts.project_post,
          likedPostCount: me.counts.like,
          commentCount: me.counts.comment,
        });
        setRecentPosts(myPosts.posts.map((post) => ({
          id: post.post_id,
          type: adaptFrontPostType(post.type),
          title: post.title,
          description: post.description,
          created_at: formatDate(post.created_at),
          likes: post.likes,
        })));
        setLikedPosts(myLikes.posts.map((post) => ({
          id: post.post_id,
          type: adaptFrontPostType(post.type),
          title: post.title,
          position: post.position,
          created_at: formatDate(post.created_at),
        })));
        setPopularFeedbacks(
          [
            ...resumePopular.posts.map((post) => ({
              id: post.id,
              type: "RESUME" as const,
              title: post.title,
              position: post.position,
              likes: post.likes,
            })),
            ...projectPopular.posts.map((post) => ({
              id: post.id,
              type: "PROJECT" as const,
              title: post.title,
              position: post.position,
              likes: post.likes,
            })),
          ]
            .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
            .slice(0, 5)
            .map((item, index) => ({ ...item, rank: index + 1 })),
        );
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "대시보드 정보를 불러오지 못했습니다.");
      });
  }, []);

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
              <img src={profileImage} alt="" />
            </div>
            <div className="dashboard-profile-main">
              <div className="dashboard-profile-heading">
                <h1>{profile.name}</h1>
                <span>{[profile.school, profile.grade].filter(Boolean).join(" · ") || "학교/학년 미입력"}</span>
              </div>
              <p>{profile.bio}</p>
              <div className="dashboard-profile-grid">
                <ProfileValue icon={Code} text={profile.githubUrl} />
                <ProfileValue icon={Mail} text={profile.email} />
                <ProfileValue icon={Bookmark} text={profile.blogUrl} />
                <ProfileValue icon={MapPin} text={profile.school} />
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
              {errorMessage && <p>{errorMessage}</p>}
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
