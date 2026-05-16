import { useEffect, useState } from "react";

import { getMyPosts } from "../../../lib/api/devfeedback";
import type { DashboardSectionItem } from "./DashboardSectionPage";
import DashboardSectionPage from "./DashboardSectionPage";

function MyActivityPage() {
  const [items, setItems] = useState<DashboardSectionItem[]>([]);

  useEffect(() => {
    getMyPosts({ page: 1, size: 50 }).then((response) => {
      setItems(response.posts.map((post) => ({
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
      title="내가 작성한 글"
      description="내가 직접 작성한 게시글만 모아서 확인하세요."
      filters={["전체", "이력서", "프로젝트"]}
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

export default MyActivityPage;
