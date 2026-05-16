export const resumeSidebarGuides = [
  {
    icon: "message",
    title: "피드백 요청 전에",
    items: ["지원 직무를 명확히 적기", "궁금한 지점을 2~3개로 좁히기", "이력서 파일 최신본 첨부하기"],
  },
  {
    icon: "lightbulb",
    title: "좋은 요청 예시",
    items: ["백엔드 신입 지원용입니다.", "프로젝트 설명이 충분한지 봐주세요.", "기술 스택 순서가 자연스러운지 궁금해요."],
  },
  {
    icon: "search",
    title: "받기 좋은 피드백",
    items: ["경험 표현 방식", "직무와의 연결성", "빠진 역량이나 키워드"],
  },
] as const;

export const resumeTips = [
  {
    icon: "file",
    title: "경험은 구체적으로 작성하세요",
    description: "프로젝트, 역할, 성과를 구체적으로 작성하면 더 좋은 피드백을 받을 수 있어요.",
  },
  {
    icon: "lightbulb",
    title: "기술 스택은 명확히 정리하세요",
    description: "사용한 기술과 숙련도를 명확히 기재하면 피드백이 더 정확해져요.",
  },
  {
    icon: "search",
    title: "맞춤형 이력서를 작성하세요",
    description: "지원하는 회사와 직무에 맞춰 이력서를 최적화해보세요.",
  },
] as const;

export const projectSidebarGuides = [
  {
    icon: "rocket",
    title: "공유 전에",
    items: ["프로젝트 목표 한 줄로 정리", "데모나 GitHub 링크 준비", "현재 단계와 고민 지점 표시"],
  },
  {
    icon: "branch",
    title: "좋은 요청 포인트",
    items: ["아키텍처 구조가 적절한지", "핵심 기능 우선순위가 맞는지", "사용자 흐름이 자연스러운지"],
  },
  {
    icon: "search",
    title: "받기 좋은 피드백",
    items: ["기술 선택 근거", "확장성과 유지보수성", "UI/UX와 완성도"],
  },
] as const;

export const projectTips = [
  {
    icon: "file",
    title: "프로젝트 목표를 명확히 하세요",
    description: "무엇을 해결하려는 프로젝트인지 알면 기능 피드백도 훨씬 정확해져요.",
  },
  {
    icon: "lightbulb",
    title: "고민 지점을 적어주세요",
    description: "우선순위, 기술 선택, 사용자 흐름처럼 구체적인 질문을 남겨보세요.",
  },
  {
    icon: "search",
    title: "참고 자료를 첨부하세요",
    description: "GitHub, 데모, 화면 캡처가 있으면 리뷰어가 맥락을 빠르게 이해할 수 있어요.",
  },
] as const;
