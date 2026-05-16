import {
  Heart,
  Home,
  MessageSquareText,
  Pencil,
  Settings,
  ThumbsUp,
  UserRound,
} from "lucide-react";

import { ROUTES } from "../../../app/routes";

export const dashboardMenuGroups = [
  [
    { label: "내 대시보드", icon: Home, to: ROUTES.mypage },
    { label: "내가 작성한 글", icon: ThumbsUp, to: ROUTES.myActivity },
    { label: "작성한 피드백", icon: Pencil, to: ROUTES.writtenFeedbacks },
    { label: "좋아요", icon: Heart, to: ROUTES.likedPosts },
    { label: "내 커뮤니티", icon: MessageSquareText, to: ROUTES.myCommunity },
  ],
  [
    { label: "내 프로필", icon: UserRound, to: ROUTES.mypageEdit },
    { label: "계정 설정", icon: Settings, to: ROUTES.accountSettings },
  ],
] as const;
