import { Navigate, Route, Routes } from "react-router-dom";

import SignupPage from "../features/auth/components/SignupPage";
import { GuideDetailPage, GuideIndexPage } from "../features/guide/components/GuidePage";
import Homepage from "../features/home/components/Homepage";
import ResumeFeedbackPage from "../features/resume-feedback/components/ResumeFeedbackPage";
import { ROUTES } from "./routes";

function ReadyPage({ title }: { title: string }) {
  return (
    <main className="ready-page">
      <section>
        <p>DevFeedback</p>
        <h1>{title}</h1>
      </section>
    </main>
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.root} element={<Navigate to={ROUTES.signup} replace />} />
      <Route path={ROUTES.signup} element={<SignupPage />} />
      <Route path={ROUTES.onboarding} element={<ReadyPage title="가입 후 설문" />} />
      <Route path={ROUTES.homepage} element={<Homepage />} />
      <Route path={ROUTES.home} element={<ReadyPage title="홈" />} />
      <Route path={ROUTES.resumeFeedbacks} element={<ResumeFeedbackPage />} />
      <Route path={ROUTES.resumeFeedbackWrite} element={<ReadyPage title="이력서 피드백 작성" />} />
      <Route path={ROUTES.resumeFeedbackDetail} element={<ReadyPage title="이력서 피드백 상세" />} />
      <Route path={ROUTES.resumeFeedbackEdit} element={<ReadyPage title="이력서 피드백 수정" />} />
      <Route path={ROUTES.projectFeedbacks} element={<ReadyPage title="프로젝트 피드백" />} />
      <Route path={ROUTES.projectFeedbackWrite} element={<ReadyPage title="프로젝트 피드백 작성" />} />
      <Route path={ROUTES.projectFeedbackDetail} element={<ReadyPage title="프로젝트 피드백 상세" />} />
      <Route path={ROUTES.projectFeedbackEdit} element={<ReadyPage title="프로젝트 피드백 수정" />} />
      <Route path={ROUTES.mypage} element={<ReadyPage title="마이페이지" />} />
      <Route path={ROUTES.mypageEdit} element={<ReadyPage title="마이페이지 편집" />} />
      <Route path={ROUTES.community} element={<ReadyPage title="커뮤니티" />} />
      <Route path={ROUTES.guide} element={<GuideIndexPage />} />
      <Route path={ROUTES.guideDetail} element={<GuideDetailPage />} />
      <Route path={ROUTES.terms} element={<ReadyPage title="이용약관" />} />
      <Route path={ROUTES.privacy} element={<ReadyPage title="개인정보처리방침" />} />
      <Route path="*" element={<Navigate to={ROUTES.signup} replace />} />
    </Routes>
  );
}

export default AppRouter;
