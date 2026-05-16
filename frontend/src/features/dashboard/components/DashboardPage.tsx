import {
  Bookmark,
  ChevronDown,
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
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import {
  getDashboard,
  type DashboardLikedPost,
  type DashboardPopularFeedback,
  type DashboardPost,
  type DashboardProfile,
  type DashboardResponse,
  type DashboardStats,
} from "../api/dashboardApi";
import { dashboardMenuGroups } from "./dashboardMenu";
import "./DashboardPage.css";

const fallbackProfile: DashboardProfile = {
  name: "김개발",
  major: "컴퓨터공학과",
  grade: "3학년",
  bio: "꾸준히 성장하는 개발자가 되고 싶습니다.",
  githubUrl: "github.com/kimgvaebal",
  email: "kimgvaebal@univ.ac.kr",
  blogUrl: "blog.devkim.com",
  location: "서울, 대한민국",
  techStacks: ["Java", "Spring Boot", "React", "TypeScript", "MySQL", "AWS"],
};

const fallbackStats: DashboardStats = {
  resumePostCount: 12,
  projectPostCount: 8,
  likedPostCount: 34,
  commentCount: 21,
};

const fallbackRecentPosts: DashboardPost[] = [
  {
    id: 1,
    type: "RESUME",
    title: "백엔드 개발자 이력서",
    description: "경력 정리가 잘 되어 있어요. 기술 스택을 강조해보면 더 좋을 것 같습니다.",
    createdAtText: "2일 전",
    commentCount: 4,
    likeCount: 12,
  },
  {
    id: 2,
    type: "PROJECT",
    title: "캠퍼스 지도 앱",
    description: "UI/UX가 직관적이고 예쁘네요! 성능 최적화 부분에서 조금 더 개선해보면 좋을 것 같아요.",
    createdAtText: "3일 전",
    commentCount: 3,
    likeCount: 8,
  },
  {
    id: 3,
    type: "RESUME",
    title: "데이터 분석가 이력서 피드백 부탁드립니다",
    description: "프로젝트 경험을 더 구체적으로 작성하면 좋을 것 같습니다.",
    createdAtText: "5일 전",
    commentCount: 6,
    likeCount: 15,
  },
];

const fallbackPopularFeedbacks: DashboardPopularFeedback[] = [
  {
    id: 1,
    rank: 1,
    type: "RESUME",
    title: "신입 개발자 이력서, 어떤 점을 개선하면 좋을까요?",
    mentorRole: "코드리뷰어",
    commentCount: 24,
    likeCount: 128,
  },
  {
    id: 2,
    rank: 2,
    type: "PROJECT",
    title: "이 기능, 꼭 필요한 기능일까? 사이드 프로젝트 기능 구성 피드백",
    mentorRole: "백엔드 개발자",
    commentCount: 18,
    likeCount: 98,
  },
  {
    id: 3,
    rank: 3,
    type: "RESUME",
    title: "경력 개발자 기술 스택, 이렇게 정리하는 게 좋을까요?",
    mentorRole: "시니어 개발자",
    commentCount: 12,
    likeCount: 76,
  },
  {
    id: 4,
    rank: 4,
    type: "RESUME",
    title: "포트폴리오 구성, 어떤 흐름이 가장 좋을까요?",
    mentorRole: "프론트엔드 개발자",
    commentCount: 11,
    likeCount: 63,
  },
  {
    id: 5,
    rank: 5,
    type: "PROJECT",
    title: "프로젝트 README.md 피드백 부탁드립니다!",
    mentorRole: "오픈소스 기여자",
    commentCount: 9,
    likeCount: 54,
  },
];

const fallbackLikedPosts: DashboardLikedPost[] = [
  {
    id: 1,
    type: "RESUME",
    title: "신입 개발자 이력서 작성 가이드",
    authorRole: "커리어코치",
    createdAtText: "2일 전",
  },
  {
    id: 2,
    type: "PROJECT",
    title: "Spring Boot 프로젝트 구조 리뷰 부탁드려요",
    authorRole: "자바하는 개발자",
    createdAtText: "4일 전",
  },
  {
    id: 3,
    type: "RESUME",
    title: "프론트엔드 포트폴리오 구성 피드백 요청합니다",
    authorRole: "프론트엔드 개발자",
    createdAtText: "5일 전",
  },
];

function getTypeLabel(type?: string) {
  return type === "PROJECT" ? "프로젝트" : "이력서";
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
    <article className="dashboard-recent-post">
      <span className="dashboard-chip">{getTypeLabel(post.type)}</span>
      <div>
        <h3>{post.title}</h3>
        <p>{post.description}</p>
        <span className="dashboard-post-meta">
          {post.createdAtText ?? "최근"} · 댓글 {post.commentCount ?? 0} · 좋아요 {post.likeCount ?? 0}
        </span>
      </div>
    </article>
  );
}

function PopularFeedback({ item }: { item: DashboardPopularFeedback }) {
  return (
    <article className="dashboard-popular-item">
      <span className="dashboard-rank">{item.rank ?? item.id}</span>
      <div className="dashboard-popular-body">
        <h3>{item.title}</h3>
      </div>
      <span className="dashboard-popular-likes">
        <Heart size={16} />
        {item.likeCount ?? 0}
      </span>
    </article>
  );
}

function LikedPost({ post }: { post: DashboardLikedPost }) {
  return (
    <article className="dashboard-liked-item">
      <Heart size={18} fill="currentColor" />
      <div>
        <h3>
          {post.title}
          <span className="dashboard-chip">{getTypeLabel(post.type)}</span>
        </h3>
        <p>{post.type === "PROJECT" ? "개발자" : "멘토"} · {post.authorRole ?? "개발자"}</p>
      </div>
      <time>{post.createdAtText ?? "최근"}</time>
    </article>
  );
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const location = useLocation();

  useEffect(() => {
    let ignore = false;

    getDashboard()
      .then((data) => {
        if (!ignore) {
          setDashboard(data);
        }
      })
      .catch(() => undefined);

    return () => {
      ignore = true;
    };
  }, []);

  const profile = dashboard?.profile ?? fallbackProfile;
  const stats = dashboard?.stats ?? fallbackStats;
  const recentPosts = dashboard?.recentPosts?.length ? dashboard.recentPosts : fallbackRecentPosts;
  const popularFeedbacks = dashboard?.popularFeedbacks?.length
    ? dashboard.popularFeedbacks
    : fallbackPopularFeedbacks;
  const likedPosts = dashboard?.likedPosts?.length ? dashboard.likedPosts : fallbackLikedPosts;

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
                  {(profile.techStacks?.length ? profile.techStacks : fallbackProfile.techStacks)?.map((tech) => (
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
            <button className="dashboard-more-button" type="button">
              더 보기
              <ChevronDown size={18} />
            </button>
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
