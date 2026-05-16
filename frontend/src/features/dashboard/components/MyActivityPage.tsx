import { dashboardActivityItems } from "../../../mocks/data/dashboard";
import DashboardSectionPage from "./DashboardSectionPage";

function MyActivityPage() {
  return (
    <DashboardSectionPage
      title="내가 작성한 글"
      description="내가 직접 작성한 게시글만 모아서 확인하세요."
      filters={["전체", "이력서", "프로젝트"]}
      summaries={[]}
      items={dashboardActivityItems}
      sideTitle=""
      sideItems={[]}
    />
  );
}

export default MyActivityPage;
