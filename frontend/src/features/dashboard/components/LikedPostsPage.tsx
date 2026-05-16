import { dashboardLikedItems, dashboardLikedSummaries } from "../../../mocks/data/dashboard";
import DashboardSectionPage from "./DashboardSectionPage";

function LikedPostsPage() {
  return (
    <DashboardSectionPage
      title="좋아요"
      description="좋아요를 누른 글을 모아보고, 다시 참고할 피드백을 빠르게 찾으세요."
      filters={["전체", "이력서", "프로젝트"]}
      summaries={dashboardLikedSummaries}
      items={dashboardLikedItems}
      sideTitle=""
      sideItems={[]}
    />
  );
}

export default LikedPostsPage;
