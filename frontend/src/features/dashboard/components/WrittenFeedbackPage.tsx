import {
  dashboardWrittenFeedbackHero,
  dashboardWrittenFeedbackItems,
} from "../../../mocks/data/dashboard";
import DashboardSectionPage from "./DashboardSectionPage";

function WrittenFeedbackPage() {
  return (
    <DashboardSectionPage
      title="작성한 피드백"
      description="내가 다른 개발자에게 작성한 피드백과 반응을 관리하세요."
      heroMetric={dashboardWrittenFeedbackHero}
      filters={["전체", "이력서", "프로젝트"]}
      summaries={[]}
      items={dashboardWrittenFeedbackItems}
      sideTitle=""
      sideItems={[]}
    />
  );
}

export default WrittenFeedbackPage;
