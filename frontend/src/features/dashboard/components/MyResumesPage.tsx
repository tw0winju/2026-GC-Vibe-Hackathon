import { useEffect, useState } from "react";

import { getMyPosts } from "../../../lib/api/devfeedback";
import type { DashboardSectionItem } from "./DashboardSectionPage";
import DashboardSectionPage from "./DashboardSectionPage";

function MyResumesPage() {
  const [items, setItems] = useState<DashboardSectionItem[]>([]);

  useEffect(() => {
    getMyPosts({ page: 1, size: 50, post_type: "resume" }).then((response) => {
      setItems(response.posts.map((post) => ({
        id: post.post_id,
        category: "이력서",
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
      title="내 이력서"
      description="등록한 이력서와 피드백 요청 내역을 확인할 수 있어요."
      filters={["전체", "이력서"]}
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

export default MyResumesPage;
