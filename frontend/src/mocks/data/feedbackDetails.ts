export const resumeFeedbackComments = [
  {
    id: 1,
    author: "백엔드진자",
    role: "전문가",
    createdAt: "3시간 전",
    content:
      "프로젝트 경험이 잘 정리되어 있고 기술 스택도 적절합니다. 다만 각 프로젝트에서 본인의 역할과 성과를 조금 더 구체적으로 작성하면 좋을 것 같아요.",
    helpful: 12,
  },
  {
    id: 2,
    author: "커리어멘토",
    role: "멘토",
    createdAt: "5시간 전",
    content:
      "백엔드 직무와 연결되는 경험은 충분합니다. 성능 개선이나 장애 대응처럼 실무에서 강점으로 보일 수 있는 항목을 상단 요약에 한 줄 추가해보세요.",
    helpful: 8,
  },
] as const;

export const resumeFeedbackDetail = {
  authorName: "김개발",
  authorInfo: "컴퓨터공학과 · 4학년",
  createdAt: "2024.05.10 14:30",
  request:
    "안녕하세요! 백엔드 개발자로 취업을 준비하고 있는 4학년 학생입니다. 이력서에 부족한 부분이나 개선할 점이 있다면 피드백 부탁드립니다. 감사합니다!",
  attachment: {
    fileName: "김개발_이력서.pdf",
    fileSize: "245KB",
  },
};

export const resumeRelatedTagsByCategory: Record<string, string[]> = {
  "웹 개발": ["웹 개발", "React", "UI 구현", "성능 개선"],
  "앱 개발": ["앱 개발", "모바일", "배포 경험", "사용자 흐름"],
  백엔드: ["백엔드", "API 설계", "DB 설계", "성능 개선"],
  "AI/ML": ["AI/ML", "모델링", "실험 설계", "모델 서빙"],
  데이터: ["데이터", "SQL", "대시보드", "지표 분석"],
  인프라: ["인프라", "CI/CD", "클라우드", "운영"],
  보안: ["보안", "취약점 분석", "리포트", "대응"],
  네트워크: ["네트워크", "장애 분석", "라우팅", "운영"],
  기획: ["기획", "문제 정의", "요구사항", "협업"],
};

export const projectFeedbackDetailsByPostId: Record<
  number,
  { features: string[]; stacks: string[]; link: string; request: string }
> = {
  1: {
    features: ["강의실과 건물명 검색", "현재 위치 기준 이동 경로 표시", "자주 찾는 건물 즐겨찾기"],
    stacks: ["React Native", "Kakao Map", "Firebase"],
    link: "https://github.com/devfeedback/campus-map",
    request: "지도 SDK 선택과 이동 경로 UX가 적절한지, MVP 단계에서 기능을 더 줄여야 할지 피드백 받고 싶습니다.",
  },
  2: {
    features: ["관심 기술 기반 스터디 추천", "가능 시간대 필터", "모집 글 작성과 참여 신청"],
    stacks: ["React", "Spring", "MySQL"],
    link: "https://github.com/devfeedback/study-match",
    request: "첫 방문자가 스터디 생성까지 자연스럽게 도달하는지, 매칭 기준을 더 단순화해야 하는지 궁금합니다.",
  },
};

export const projectFeedbackFallbackDetail = {
  features: ["핵심 기능 설계", "사용자 플로우 구성", "피드백 기반 개선"],
  stacks: ["React", "TypeScript", "API"],
  link: "https://github.com/devfeedback/project",
  request: "프로젝트 방향성과 구현 우선순위가 적절한지 피드백 받고 싶습니다.",
};

export const projectFeedbackComments = [
  {
    id: 1,
    author: "구조리뷰어",
    role: "백엔드",
    createdAt: "2시간 전",
    content:
      "MVP 범위가 명확해서 좋아요. 다만 지도 검색, 경로 표시, 즐겨찾기를 한 번에 구현하기보다 검색과 경로 표시를 먼저 안정화하면 완성도가 더 높아질 것 같습니다.",
    helpful: 15,
  },
  {
    id: 2,
    author: "UX멘토",
    role: "프로덕트",
    createdAt: "4시간 전",
    content:
      "사용자가 건물명을 정확히 모를 수 있으니 초성 검색이나 카테고리 탐색을 고려해보세요. 경로 결과 화면에는 예상 소요 시간을 함께 보여주면 좋겠습니다.",
    helpful: 9,
  },
] as const;
