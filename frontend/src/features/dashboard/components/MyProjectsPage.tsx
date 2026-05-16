import { useEffect, useState } from "react";

import { getMyPosts } from "../../../lib/api/devfeedback";
import type { DashboardSectionItem } from "./DashboardSectionPage";
import DashboardSectionPage from "./DashboardSectionPage";

function MyProjectsPage() {
  const [items, setItems] = useState<DashboardSectionItem[]>([]);

  useEffect(() => {
    getMyPosts({ page: 1, size: 50, post_type: "project" }).then((response) => {
      setItems(response.posts.map((post) => ({
        id: post.post_id,
        href: `/project-feedbacks/${post.post_id}`,
        category: "프로젝트",
        title: post.title,
        description: post.description,
        author: post.user?.nickname ?? "나",
        date: formatDate(post.created_at),
        comments: post.comments ?? 0,
        likes: post.likes,
        tags: post.position ? [post.position] : [],
      })));
    });
  }, []);

  return (
    <DashboardSectionPage
      title="내 프로젝트"
      description="등록한 프로젝트와 피드백 요청 현황을 확인할 수 있어요."
      filters={["전체", "프로젝트"]}
      summaries={[]}
      items={items}
      sideTitle=""
      sideItems={[]}
    />
  );
}

function formatDate(value?: string) {
  return value ? new Intl.DateTimeFormat("ko-KR").format(new Date(value)) : "";
}

export default MyProjectsPage;
