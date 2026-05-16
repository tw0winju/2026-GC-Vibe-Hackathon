import DashboardSectionPage from "./DashboardSectionPage";

function LikedPostsPage() {
  return (
    <DashboardSectionPage
      title="좋아요"
      description="좋아요를 누른 글을 모아보고, 다시 참고할 피드백을 빠르게 찾으세요."
      filters={["전체", "이력서", "프로젝트"]}
      summaries={[
        { label: "좋아요 글", value: 34 },
        { label: "이력서 글", value: 19 },
        { label: "프로젝트 글", value: 15 },
      ]}
      items={[
        {
          id: 1,
          category: "이력서",
          title: "신입 개발자 이력서 작성 가이드",
          description: "프로젝트 경험과 기술 스택을 어떻게 연결하면 좋은지 예시가 잘 정리되어 있어요.",
          author: "커리어코치",
          date: "2일 전",
          comments: 24,
          likes: 128,
          status: "저장됨",
          tags: ["신입", "이력서"],
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
          category: "이력서",
          title: "프론트엔드 포트폴리오 구성 피드백 요청합니다",
          description: "화면 캡처보다 문제 해결 과정을 강조하는 구성이 인상적이에요.",
          author: "프론트엔드 개발자",
          date: "5일 전",
          comments: 12,
          likes: 76,
          status: "저장됨",
          tags: ["React", "포트폴리오"],
        },
      ]}
      sideTitle=""
      sideItems={[]}
    />
  );
}

export default LikedPostsPage;
