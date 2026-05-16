import DashboardSectionPage from "./DashboardSectionPage";

function WrittenFeedbackPage() {
  return (
    <DashboardSectionPage
      title="작성한 피드백"
      description="내가 다른 개발자에게 작성한 피드백과 반응을 관리하세요."
      heroMetric={{ label: "작성한 피드백", value: 28 }}
      filters={["전체", "이력서", "프로젝트"]}
      summaries={[]}
      items={[
        {
          id: 1,
          category: "이력서",
          title: "데이터 분석가 이력서 피드백",
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
          category: "이력서",
          title: "프론트엔드 포트폴리오 구성",
          description: "역할, 문제, 해결, 결과 순서로 카드 내용을 정리하면 읽는 사람이 빠르게 이해할 수 있어요.",
          author: "프론트엔드리",
          date: "3일 전",
          comments: 4,
          likes: 18,
          status: "도움됨 11",
          tags: ["React", "UI"],
        },
      ]}
      sideTitle=""
      sideItems={[]}
    />
  );
}

export default WrittenFeedbackPage;
