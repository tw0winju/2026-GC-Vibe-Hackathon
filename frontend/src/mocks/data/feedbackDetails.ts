export const resumeFeedbackDetail = {
  request:
    "안녕하세요! 백엔드 개발자로 취업을 준비하고 있는 4학년 학생입니다. 이력서에 부족한 부분이나 개선할 점이 있다면 피드백 부탁드립니다. 감사합니다!",
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
