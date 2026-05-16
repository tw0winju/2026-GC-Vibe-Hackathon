import { useEffect, useState } from "react";

import { getMyPosts } from "../../../lib/api/devfeedback";
import type { DashboardSectionItem } from "./DashboardSectionPage";
import DashboardSectionPage from "./DashboardSectionPage";

function MyCommunityPage() {
  const [items, setItems] = useState<DashboardSectionItem[]>([]);

  useEffect(() => {
    getMyPosts({ page: 1, size: 50, post_type: "community" }).then((response) => {
      setItems(response.posts.map((post) => ({
        id: post.post_id,
        href: `/community/${post.post_id}`,
        category: "커뮤니티",
        title: post.title,
        description: post.description,
        author: post.user?.nickname ?? "나",
        date: formatDate(post.created_at),
        comments: post.comments ?? 0,
        likes: post.likes,
        tags: post.category ? [post.category] : [],
      })));
    });
  }, []);

  return (
    <DashboardSectionPage
      title="내 커뮤니티"
      description="커뮤니티에 작성한 글과 반응을 한 곳에서 확인하세요."
      filters={["전체", "커뮤니티"]}
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

export default MyCommunityPage;
