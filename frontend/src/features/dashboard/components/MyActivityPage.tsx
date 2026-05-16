import { useEffect, useState } from "react";

import { getMyPosts } from "../../../lib/api/devfeedback";
import type { DashboardSectionItem } from "./DashboardSectionPage";
import DashboardSectionPage from "./DashboardSectionPage";
import { getPostDetailPath, getPostTags, getPostTypeLabel } from "./dashboardPostUtils";

function MyActivityPage() {
  const [items, setItems] = useState<DashboardSectionItem[]>([]);

  useEffect(() => {
    getMyPosts({ page: 1, size: 50 }).then((response) => {
      setItems(response.posts.map((post) => ({
        id: post.post_id,
        href: getPostDetailPath(post.type, post.post_id),
        category: getPostTypeLabel(post.type),
        title: post.title,
        description: post.description,
        author: post.user?.nickname ?? "나",
        date: formatDate(post.created_at),
        comments: post.comments ?? 0,
        likes: post.likes,
        tags: getPostTags(post),
      })));
    });
  }, []);

  return (
    <DashboardSectionPage
      title="내가 작성한 글"
      description="내가 직접 작성한 게시글만 모아서 확인하세요."
      filters={["전체", "포트폴리오", "프로젝트", "커뮤니티"]}
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
