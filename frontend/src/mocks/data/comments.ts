export type MockComment = {
  id: number;
  user_id: number;
  post_type: "RESUME" | "PROJECT";
  post_id: number;
  comment_parent_id?: number | null;
  content: string;
  created_at?: string;
  updated_at?: string;
};

export const mockComments: MockComment[] = [
  {
    id: 1,
    user_id: 102,
    post_type: "RESUME",
    post_id: 1,
    comment_parent_id: null,
    content:
      "프로젝트 경험이 잘 정리되어 있고 기술 스택도 적절합니다. 다만 각 프로젝트에서 본인의 역할과 성과를 조금 더 구체적으로 작성하면 좋을 것 같아요.",
    created_at: "2026-05-17T09:00:00+09:00",
  },
  {
    id: 2,
    user_id: 103,
    post_type: "RESUME",
    post_id: 1,
    comment_parent_id: null,
    content:
      "백엔드 직무와 연결되는 경험은 충분합니다. 성능 개선이나 장애 대응처럼 실무에서 강점으로 보일 수 있는 항목을 상단 요약에 한 줄 추가해보세요.",
    created_at: "2026-05-17T07:00:00+09:00",
  },
  {
    id: 3,
    user_id: 104,
    post_type: "PROJECT",
    post_id: 1,
    comment_parent_id: null,
    content:
      "MVP 범위가 명확해서 좋아요. 다만 지도 검색, 경로 표시, 즐겨찾기를 한 번에 구현하기보다 검색과 경로 표시를 먼저 안정화하면 완성도가 더 높아질 것 같습니다.",
    created_at: "2026-05-17T10:00:00+09:00",
  },
  {
    id: 4,
    user_id: 105,
    post_type: "PROJECT",
    post_id: 1,
    comment_parent_id: null,
    content:
      "사용자가 건물명을 정확히 모를 수 있으니 초성 검색이나 카테고리 탐색을 고려해보세요. 경로 결과 화면에는 예상 소요 시간을 함께 보여주면 좋겠습니다.",
    created_at: "2026-05-17T08:00:00+09:00",
  },
];

export function getMockComments(postType: MockComment["post_type"], postId: number) {
  return mockComments.filter((comment) => comment.post_type === postType && comment.post_id === postId);
}
