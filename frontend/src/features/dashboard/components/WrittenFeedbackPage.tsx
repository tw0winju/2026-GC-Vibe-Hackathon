import { useEffect, useState } from "react";

import { getMe, getMyComments } from "../../../lib/api/devfeedback";
import type { DashboardSectionItem } from "./DashboardSectionPage";
import DashboardSectionPage from "./DashboardSectionPage";
import { getPostDetailPath, getPostTypeLabel } from "./dashboardPostUtils";

function WrittenFeedbackPage() {
  const [items, setItems] = useState<DashboardSectionItem[]>([]);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    Promise.all([getMyComments({ page: 1, size: 50 }), getMe()]).then(([comments, me]) => {
      setItems(comments.comments.map((comment) => ({
        id: comment.id,
        href: getPostDetailPath(comment.post_type, comment.post_id),
        category: getPostTypeLabel(comment.post_type),
        title: comment.post_title ?? `게시글 #${comment.post_id}에 작성한 댓글`,
        description: comment.content,
        author: "나",
        date: formatDate(comment.created_at),
        comments: comment.comments ?? 0,
      })));
      setCommentCount(me.counts.comment);
    });
  }, []);

  return (
    <DashboardSectionPage
      title="작성한 피드백"
      description="내가 다른 가천 IT 인재에게 작성한 피드백과 반응을 관리하세요."
      heroMetric={{ label: "작성한 댓글", value: commentCount }}
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

export default WrittenFeedbackPage;
