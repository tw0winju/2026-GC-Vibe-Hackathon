import { useEffect, useState } from "react";

import { getMe, getMyLikes } from "../../../lib/api/devfeedback";
import type { DashboardSectionItem, DashboardSectionSummary } from "./DashboardSectionPage";
import DashboardSectionPage from "./DashboardSectionPage";
import { getPostDetailPath, getPostTags, getPostTypeLabel } from "./dashboardPostUtils";

function LikedPostsPage() {
  const [items, setItems] = useState<DashboardSectionItem[]>([]);
  const [summaries, setSummaries] = useState<DashboardSectionSummary[]>([]);

  useEffect(() => {
    Promise.all([getMyLikes({ page: 1, size: 50 }), getMe()]).then(([likes, me]) => {
      setItems(likes.posts.map((post) => ({
        id: post.post_id,
        href: getPostDetailPath(post.type, post.post_id),
        category: getPostTypeLabel(post.type),
        title: post.title,
        description: post.description,
        author: post.user?.nickname ?? "사용자",
        date: formatDate(post.created_at),
        comments: post.comments ?? 0,
        likes: post.likes,
        tags: getPostTags(post),
      })));
      setSummaries([
        { label: "전체 좋아요", value: me.counts.like },
        { label: "피드백 글", value: likes.posts.filter((post) => post.type !== "community").length },
        { label: "커뮤니티", value: likes.posts.filter((post) => post.type === "community").length },
      ]);
    });
  }, []);

  return (
    <DashboardSectionPage
      title="좋아요"
      description="좋아요를 누른 글을 모아보고, 다시 참고할 피드백을 빠르게 찾으세요."
      filters={["전체", "포트폴리오", "프로젝트", "커뮤니티"]}
      summaries={summaries}
      items={items}
      sideTitle=""
      sideItems={[]}
    />
  );
}

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat("ko-KR").format(new Date(value)) : "";
}

export default LikedPostsPage;
