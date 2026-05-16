export type MockUser = {
  id: number;
  nickname: string;
  position?: string;
  introduction?: string;
  git_url?: string;
  linked_url?: string;
  blog_url?: string;
  tag?: string[];
  created_at?: string;
  updated_at?: string;
};

export const mockUsers: MockUser[] = [
  {
    id: 1,
    nickname: "김개발",
    position: "백엔드",
    introduction: "꾸준히 성장하는 개발자가 되고 싶습니다.",
    git_url: "https://github.com/kimgvaebal",
    linked_url: "https://linkedin.com/in/kimgvaebal",
    blog_url: "https://blog.devkim.com",
    tag: ["Java", "Spring Boot", "React", "TypeScript", "MySQL", "AWS"],
    created_at: "2026-05-01T09:00:00+09:00",
    updated_at: "2026-05-16T18:00:00+09:00",
  },
  { id: 101, nickname: "지도장인", position: "앱 개발" },
  { id: 102, nickname: "매칭메이커", position: "웹 개발" },
  { id: 103, nickname: "면접코치", position: "데이터" },
  { id: 104, nickname: "동아리총무", position: "백엔드" },
  { id: 105, nickname: "픽셀정리", position: "웹 개발" },
  { id: 106, nickname: "찾아드림", position: "기획" },
  { id: 107, nickname: "소켓러", position: "인프라" },
  { id: 108, nickname: "화이트체커", position: "보안" },
  { id: 109, nickname: "냉장고파수꾼", position: "앱 개발" },
  { id: 110, nickname: "차트깎이", position: "데이터" },
  { id: 111, nickname: "패킷러", position: "네트워크" },
  { id: 112, nickname: "프로덕트눈", position: "기획" },
];

export function getMockUserById(userId?: number) {
  return mockUsers.find((user) => user.id === userId);
}
