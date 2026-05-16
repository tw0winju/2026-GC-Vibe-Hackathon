import {
  Bell,
  BriefcaseBusiness,
  FileText,
  Heart,
  Home,
  MessageCircle,
  Pencil,
  Settings,
  ThumbsUp,
} from "lucide-react";

import { ROUTES } from "../../../app/routes";

export const dashboardMenuGroups = [
  [
    { label: "내 대시보드", icon: Home, to: ROUTES.mypage },
    { label: "내 활동", icon: ThumbsUp, to: ROUTES.myActivity },
    { label: "받은 피드백", icon: MessageCircle, to: ROUTES.receivedFeedbacks },
    { label: "작성한 피드백", icon: Pencil, to: ROUTES.writtenFeedbacks },
    { label: "좋아요", icon: Heart, to: ROUTES.likedPosts },
  ],
  [
    { label: "내 프로젝트", icon: BriefcaseBusiness, to: ROUTES.myProjects },
    { label: "내 이력서", icon: FileText, to: ROUTES.myResumes },
  ],
  [
    { label: "계정 설정", icon: Settings, to: ROUTES.accountSettings },
    { label: "알림 설정", icon: Bell, to: ROUTES.notificationSettings },
  ],
] as const;
