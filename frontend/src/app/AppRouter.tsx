import { Navigate, Route, Routes } from "react-router-dom";

import SignupPage from "../features/auth/components/SignupPage";
import CommunityDetailPage from "../features/community/components/CommunityDetailPage";
import CommunityPage from "../features/community/components/CommunityPage";
import CommunityWritePage from "../features/community/components/CommunityWritePage";
import AccountSettingsPage from "../features/dashboard/components/AccountSettingsPage";
import DashboardPage from "../features/dashboard/components/DashboardPage";
import LikedPostsPage from "../features/dashboard/components/LikedPostsPage";
import MyActivityPage from "../features/dashboard/components/MyActivityPage";
import MyCommunityPage from "../features/dashboard/components/MyCommunityPage";
import MyProjectsPage from "../features/dashboard/components/MyProjectsPage";
import MyResumesPage from "../features/dashboard/components/MyResumesPage";
import ProfileEditPage from "../features/dashboard/components/ProfileEditPage";
import WrittenFeedbackPage from "../features/dashboard/components/WrittenFeedbackPage";
import { GuideDetailPage, GuideIndexPage } from "../features/guide/components/GuidePage";
import Homepage from "../features/home/components/Homepage";
import ProjectFeedbackDetailPage from "../features/project-feedback/components/ProjectFeedbackDetailPage";
import ProjectFeedbackEditPage from "../features/project-feedback/components/ProjectFeedbackEditPage";
import ProjectFeedbackPage from "../features/project-feedback/components/ProjectFeedbackPage";
import ProjectFeedbackWritePage from "../features/project-feedback/components/ProjectFeedbackWritePage";
import ResumeFeedbackDetailPage from "../features/resume-feedback/components/ResumeFeedbackDetailPage";
import ResumeFeedbackEditPage from "../features/resume-feedback/components/ResumeFeedbackEditPage";
import ResumeFeedbackPage from "../features/resume-feedback/components/ResumeFeedbackPage";
import ResumeFeedbackWritePage from "../features/resume-feedback/components/ResumeFeedbackWritePage";
import { ROUTES } from "./routes";

function ReadyPage({ title }: { title: string }) {
  return (
    <main className="ready-page">
      <section>
        <p>GachonGrow</p>
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
      <Route path="/auth/callback" element={<SignupPage />} />
      <Route path="/login/oauth2/code/kakao" element={<SignupPage />} />
      <Route path="/login/oauth2/code/google" element={<SignupPage />} />
      <Route path={ROUTES.onboarding} element={<ReadyPage title="가입 후 설문" />} />
      <Route path={ROUTES.homepage} element={<Homepage />} />
      <Route path={ROUTES.home} element={<ReadyPage title="홈" />} />
      <Route path={ROUTES.resumeFeedbacks} element={<ResumeFeedbackPage />} />
      <Route path={ROUTES.resumeFeedbackWrite} element={<ResumeFeedbackWritePage />} />
      <Route path={ROUTES.resumeFeedbackDetail} element={<ResumeFeedbackDetailPage />} />
      <Route path={ROUTES.resumeFeedbackEdit} element={<ResumeFeedbackEditPage />} />
      <Route path={ROUTES.projectFeedbacks} element={<ProjectFeedbackPage />} />
      <Route path={ROUTES.projectFeedbackWrite} element={<ProjectFeedbackWritePage />} />
      <Route path={ROUTES.projectFeedbackDetail} element={<ProjectFeedbackDetailPage />} />
      <Route path={ROUTES.projectFeedbackEdit} element={<ProjectFeedbackEditPage />} />
      <Route path={ROUTES.community} element={<CommunityPage />} />
      <Route path={ROUTES.communityWrite} element={<CommunityWritePage />} />
      <Route path={ROUTES.communityDetail} element={<CommunityDetailPage />} />
      <Route path={ROUTES.communityEdit} element={<CommunityWritePage mode="edit" />} />
      <Route path={ROUTES.mypage} element={<DashboardPage />} />
      <Route path={ROUTES.mypageEdit} element={<ProfileEditPage />} />
      <Route path={ROUTES.myActivity} element={<MyActivityPage />} />
      <Route path={ROUTES.writtenFeedbacks} element={<WrittenFeedbackPage />} />
      <Route path={ROUTES.likedPosts} element={<LikedPostsPage />} />
      <Route path={ROUTES.myProjects} element={<MyProjectsPage />} />
      <Route path={ROUTES.myResumes} element={<MyResumesPage />} />
      <Route path={ROUTES.myCommunity} element={<MyCommunityPage />} />
      <Route path={ROUTES.accountSettings} element={<AccountSettingsPage />} />
      <Route path={ROUTES.notificationSettings} element={<Navigate to={ROUTES.accountSettings} replace />} />
      <Route path={ROUTES.guide} element={<GuideIndexPage />} />
      <Route path={ROUTES.guideDetail} element={<GuideDetailPage />} />
      <Route path={ROUTES.terms} element={<ReadyPage title="이용약관" />} />
      <Route path={ROUTES.privacy} element={<ReadyPage title="개인정보처리방침" />} />
      <Route path="*" element={<Navigate to={ROUTES.signup} replace />} />
    </Routes>
  );
}

export default AppRouter;
