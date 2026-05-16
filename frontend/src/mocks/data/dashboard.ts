import type {
  DashboardLikedPost,
  DashboardPopularFeedback,
  DashboardPost,
  DashboardProfile,
  DashboardStats,
} from "../../features/dashboard/api/dashboardApi";
import type {
  DashboardSectionItem,
  DashboardSectionSummary,
} from "../../features/dashboard/components/DashboardSectionPage";
import { projectFeedbackPosts } from "./projectFeedbacks";
import { resumeFeedbackPosts } from "./resumeFeedbacks";

export const dashboardProfile: DashboardProfile = {
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

export const dashboardStats: DashboardStats = {
  resumePostCount: 12,
  projectPostCount: 8,
  likedPostCount: 34,
  commentCount: 21,
};

export const dashboardRecentPosts: DashboardPost[] = [
  ...resumeFeedbackPosts.slice(0, 2).map((post) => ({
    id: post.id,
    type: "RESUME" as const,
    title: post.title,
    description: post.description,
    created_at: post.created_at,
    likes: post.likes,
  })),
  ...projectFeedbackPosts.slice(0, 1).map((post) => ({
    id: post.id,
    type: "PROJECT" as const,
    title: post.title,
    description: post.description,
    created_at: formatRelativeProjectDate(post.created_at),
    likes: post.likes,
  })),
];

export const dashboardPopularFeedbacks: DashboardPopularFeedback[] = [
  ...resumeFeedbackPosts
    .slice()
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3)
    .map((post) => ({
      id: post.id,
      type: "RESUME" as const,
      title: post.title,
      position: post.position,
      likes: post.likes,
    })),
  ...projectFeedbackPosts
    .slice()
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 2)
    .map((post) => ({
      id: post.id,
      type: "PROJECT" as const,
      title: post.title,
      position: post.position,
      likes: post.likes,
    })),
]
  .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
  .slice(0, 5)
  .map((item, index) => ({ ...item, rank: index + 1 }));

export const dashboardLikedPosts: DashboardLikedPost[] = [
  ...resumeFeedbackPosts.slice(0, 2).map((post) => ({
    id: post.id,
    type: "RESUME" as const,
    title: post.title,
    position: post.position,
    created_at: post.created_at,
  })),
  ...projectFeedbackPosts.slice(0, 1).map((post) => ({
    id: post.id,
    type: "PROJECT" as const,
    title: post.title,
    position: post.position,
    created_at: formatRelativeProjectDate(post.created_at),
  })),
];

export const dashboardActivityItems: DashboardSectionItem[] = [
  {
    id: 1,
    category: "포트폴리오",
    title: "백엔드 개발자 포트폴리오 피드백 요청",
    description: "기술 스택과 프로젝트 경험을 중심으로 피드백을 받고 싶습니다.",
    author: "김개발",
    date: "1일 전",
    comments: 4,
    likes: 15,
    tags: ["Java", "Spring", "백엔드"],
  },
  {
    id: 2,
    category: "프로젝트",
    title: "캠퍼스 지도 앱 프로젝트 피드백 요청",
    description: "지도 검색 경험과 성능 최적화 방향이 괜찮은지 궁금합니다.",
    author: "김개발",
    date: "3일 전",
    comments: 3,
    likes: 8,
    tags: ["React", "지도", "앱 개발"],
  },
  {
    id: 3,
    category: "포트폴리오",
    title: "데이터 분석가 포트폴리오 피드백 부탁드립니다",
    description: "분석 프로젝트 경험을 어떤 순서로 정리하면 좋을지 피드백 받고 싶습니다.",
    author: "김개발",
    date: "5일 전",
    comments: 6,
    likes: 15,
    tags: ["데이터", "SQL", "분석"],
  },
];

export const dashboardLikedSummaries: DashboardSectionSummary[] = [
  { label: "좋아요 글", value: 34 },
  { label: "포트폴리오 글", value: 19 },
  { label: "프로젝트 글", value: 15 },
];

export const dashboardLikedItems: DashboardSectionItem[] = [
  {
    id: 1,
    category: "포트폴리오",
    title: "신입 개발자 포트폴리오 작성 가이드",
    description: "프로젝트 경험과 기술 스택을 어떻게 연결하면 좋은지 예시가 잘 정리되어 있어요.",
    author: "커리어코치",
    date: "2일 전",
    comments: 24,
    likes: 128,
    status: "저장됨",
    tags: ["신입", "포트폴리오"],
  },
  {
    id: 2,
    category: "프로젝트",
    title: "Spring Boot 프로젝트 구조 리뷰 부탁드려요",
    description: "계층 분리와 예외 처리 구조를 참고하기 좋아서 다시 볼 만한 글입니다.",
    author: "자바하는 개발자",
    date: "4일 전",
    comments: 18,
    likes: 98,
    status: "저장됨",
    tags: ["Spring", "백엔드"],
  },
  {
    id: 3,
    category: "포트폴리오",
    title: "프론트엔드 포트폴리오 구성 피드백 요청합니다",
    description: "화면 캡처보다 문제 해결 과정을 강조하는 구성이 인상적이에요.",
    author: "프론트엔드 개발자",
    date: "5일 전",
    comments: 12,
    likes: 76,
    status: "저장됨",
    tags: ["React", "포트폴리오"],
  },
];

export const dashboardWrittenFeedbackHero = { label: "작성한 피드백", value: 28 };

export const dashboardWrittenFeedbackItems: DashboardSectionItem[] = [
  {
    id: 1,
    category: "포트폴리오",
    title: "데이터 분석가 포트폴리오 피드백",
    description: "분석 프로젝트의 문제 정의, 사용 데이터, 결과 지표를 같은 흐름으로 묶어보면 좋겠습니다.",
    author: "데이터꿈나무",
    date: "오늘",
    comments: 6,
    likes: 15,
    status: "도움됨 8",
    tags: ["데이터", "포트폴리오"],
  },
  {
    id: 2,
    category: "프로젝트",
    title: "Spring Boot 프로젝트 구조 리뷰",
    description: "패키지 책임을 도메인 기준으로 나누고 테스트 코드를 함께 배치하면 유지보수가 쉬워집니다.",
    author: "자바하는 개발자",
    date: "1일 전",
    comments: 3,
    likes: 12,
    status: "답글 2",
    tags: ["Spring", "테스트"],
  },
  {
    id: 3,
    category: "포트폴리오",
    title: "프론트엔드 포트폴리오 구성",
    description: "역할, 문제, 해결, 결과 순서로 카드 내용을 정리하면 읽는 사람이 빠르게 이해할 수 있어요.",
    author: "프론트엔드리",
    date: "3일 전",
    comments: 4,
    likes: 18,
    status: "도움됨 11",
    tags: ["React", "UI"],
  },
];

export const profileEditInitialData = {
  nickname: "김개발",
  position: "웹 개발",
  tagline: "꾸준히 성장하는 개발자가 되고 싶습니다.",
  school: "컴퓨터공학과",
  grade: "3학년",
  email: "kimgvaebal@univ.ac.kr",
  githubUrl: "https://github.com/kimgvaebal",
  blogUrl: "https://blog.devkim.com",
  linkedUrl: "https://linkedin.com/in/kimgvaebal",
  techStacks: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "AWS", "Docker"],
};

export const accountSettingsSections = [
  {
    title: "기본 정보",
    items: [
      { icon: "user", label: "프로필 정보", value: "김개발 · 컴퓨터공학과 3학년" },
      { icon: "mail", label: "이메일", value: "kimgvaebal@univ.ac.kr" },
      { icon: "phone", label: "휴대폰 번호", value: "010-****-2026" },
    ],
  },
  {
    title: "로그인 및 보안",
    items: [
      { icon: "key", label: "비밀번호 변경", value: "최근 변경 32일 전" },
      { icon: "shield", label: "2단계 인증", value: "사용 안 함" },
      { icon: "link", label: "연결된 소셜 계정", value: "Google, Kakao" },
    ],
  },
] as const;

export const notificationSettingsGroups = [
  {
    title: "알림 받기",
    items: [
      { icon: "bell", label: "전체 알림", description: "새 피드백, 댓글, 좋아요 알림을 받습니다.", enabled: true },
      { icon: "message", label: "채팅 및 댓글 알림", description: "댓글과 답글이 달리면 알려줍니다.", enabled: true },
      { icon: "phone", label: "푸시 알림", description: "브라우저와 모바일 푸시로 알림을 받습니다.", enabled: false },
    ],
  },
  {
    title: "방해 금지",
    items: [
      { icon: "moon", label: "방해 금지 모드", description: "설정한 시간 동안 알림을 조용히 받습니다.", enabled: false },
      { icon: "clock", label: "야간 알림 끄기", description: "오후 10시부터 오전 8시까지 알림을 끕니다.", enabled: true },
      { icon: "volume", label: "소리 및 진동", description: "알림 도착 시 소리와 진동을 사용합니다.", enabled: true },
    ],
  },
] as const;

function formatRelativeProjectDate(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const now = new Date("2026-05-17T12:00:00+09:00");
  const diffHours = Math.max(1, Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60)));

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  return `${Math.round(diffHours / 24)}일 전`;
}
