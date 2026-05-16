import { useEffect, useState } from "react";

import { getMe, getMyLikes } from "../../../lib/api/devfeedback";
import type { DashboardSectionItem, DashboardSectionSummary } from "./DashboardSectionPage";
import DashboardSectionPage from "./DashboardSectionPage";

function LikedPostsPage() {
  const [items, setItems] = useState<DashboardSectionItem[]>([]);
  const [summaries, setSummaries] = useState<DashboardSectionSummary[]>([]);

  useEffect(() => {
    Promise.all([getMyLikes({ page: 1, size: 50 }), getMe()]).then(([likes, me]) => {
      setItems(likes.posts.map((post) => ({
        id: post.post_id,
        href: post.type === "project" ? `/project-feedbacks/${post.post_id}` : `/resume-feedbacks/${post.post_id}`,
        category: post.type === "project" ? "프로젝트" : "이력서",
        title: post.title,
        description: post.description,
        author: post.user.nickname,
        date: formatDate(post.created_at),
        likes: post.likes,
        tags: [post.position],
      })));
    });
  }, []);

  return (
    <DashboardSectionPage
      title="좋아요"
      description="좋아요를 누른 글을 모아보고, 다시 참고할 피드백을 빠르게 찾으세요."
      filters={["전체", "이력서", "프로젝트"]}
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
