import DashboardSectionPage from "./DashboardSectionPage";

function MyActivityPage() {
  return (
    <DashboardSectionPage
      title="내가 작성한 글"
      description="내가 직접 작성한 게시글만 모아서 확인하세요."
      filters={["전체"]}
      summaries={[]}
      items={[
        {
          id: 1,
          category: "게시글",
          title: "백엔드 개발자 이력서 피드백 요청",
          description: "기술 스택과 프로젝트 경험을 중심으로 피드백을 받고 싶습니다.",
          author: "김개발",
          date: "1일 전",
          comments: 4,
          likes: 15,
          status: "진행중",
          tags: ["Java", "Spring", "이력서"],
        },
        {
          id: 2,
          category: "게시글",
          title: "캠퍼스 지도 앱 프로젝트 피드백 요청",
          description: "지도 검색 경험과 성능 최적화 방향이 괜찮은지 궁금합니다.",
          author: "김개발",
          date: "3일 전",
          comments: 3,
          likes: 8,
          status: "프로젝트",
          tags: ["React", "지도", "프로젝트"],
        },
        {
          id: 3,
          category: "게시글",
          title: "데이터 분석가 이력서 피드백 부탁드립니다",
          description: "분석 프로젝트 경험을 어떤 순서로 정리하면 좋을지 피드백 받고 싶습니다.",
          author: "김개발",
          date: "5일 전",
          comments: 6,
          likes: 15,
          status: "이력서",
          tags: ["데이터", "SQL", "이력서"],
        },
      ]}
      sideTitle=""
      sideItems={[]}
    />
  );
}

export default MyActivityPage;
