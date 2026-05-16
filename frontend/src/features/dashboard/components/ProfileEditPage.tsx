import {
  BookOpen,
  GitBranch,
  Link as LinkIcon,
  Mail,
  Plus,
  Save,
  X,
} from "lucide-react";
import { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import { profileEditInitialData } from "../../../mocks/data/dashboard";
import { dashboardMenuGroups } from "./dashboardMenu";
import "./DashboardPage.css";
import "./ProfileEditPage.css";

const positionOptions = [
  "웹 개발",
  "앱 개발",
  "백엔드",
  "AI/ML",
  "데이터",
  "인프라",
  "보안",
  "네트워크",
  "기획",
] as const;

const gradeOptions = ["1학년", "2학년", "3학년", "4학년", "졸업생", "기타"];

function ProfileEditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(profileEditInitialData.nickname);
  const [position, setPosition] = useState<(typeof positionOptions)[number]>(
    profileEditInitialData.position as (typeof positionOptions)[number],
  );
  const [tagline, setTagline] = useState(profileEditInitialData.tagline);
  const [school, setSchool] = useState(profileEditInitialData.school);
  const [grade, setGrade] = useState(profileEditInitialData.grade);
  const [email, setEmail] = useState(profileEditInitialData.email);
  const [githubUrl, setGithubUrl] = useState(profileEditInitialData.githubUrl);
  const [blogUrl, setBlogUrl] = useState(profileEditInitialData.blogUrl);
  const [linkedUrl, setLinkedUrl] = useState(profileEditInitialData.linkedUrl);
  const [techStacks, setTechStacks] = useState(profileEditInitialData.techStacks);
  const [stackInput, setStackInput] = useState("");

  const trimmedStackInput = stackInput.trim();

  const payload = useMemo(
    () => ({
      nickname,
      position,
      introduction: tagline,
      git_url: githubUrl,
      linked_url: linkedUrl,
      blog_url: blogUrl,
      stack: techStacks,
    }),
    [blogUrl, githubUrl, linkedUrl, nickname, position, tagline, techStacks],
  );

  const addStack = () => {
    if (!trimmedStackInput || techStacks.length >= 15) return;
    if (techStacks.some((stack) => stack.toLowerCase() === trimmedStackInput.toLowerCase())) {
      setStackInput("");
      return;
    }
    setTechStacks((prev) => [...prev, trimmedStackInput]);
    setStackInput("");
  };

  const handleStackKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addStack();
    }
  };

  const removeStack = (target: string) => {
    setTechStacks((prev) => prev.filter((stack) => stack !== target));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.info("PUT /users/me", payload);
    navigate(ROUTES.mypage);
  };

  return (
    <AppLayout>
      <div className="profile-edit-shell">
        <aside className="dashboard-sidebar" aria-label="마이페이지 메뉴">
          {dashboardMenuGroups.map((group, groupIndex) => (
            <div className="dashboard-sidebar-group" key={groupIndex}>
              {group.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;

                return (
                  <Link
                    className={isActive ? "dashboard-sidebar-item is-active" : "dashboard-sidebar-item"}
                    key={item.label}
                    to={item.to}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </aside>

        <main className="profile-edit-main">
          <header className="profile-edit-header">
            <p>마이페이지</p>
            <h1>프로필 편집</h1>
            <span>내 프로필 정보를 관리하고, 다른 사용자에게 보여질 정보를 설정하세요.</span>
          </header>

          <form className="profile-edit-card" onSubmit={handleSubmit}>
            <section className="profile-edit-section">
              <h2>기본 정보</h2>
              <div className="profile-edit-grid">
                <label>
                  <span>이름 (닉네임) *</span>
                  <input value={nickname} onChange={(event) => setNickname(event.target.value)} maxLength={20} />
                  <small>다른 사용자에게 표시되는 이름입니다.</small>
                </label>
                <label>
                  <span>한 줄 소개</span>
                  <input value={tagline} onChange={(event) => setTagline(event.target.value)} maxLength={50} />
                  <small>{tagline.length}/50</small>
                </label>
                <label>
                  <span>직무 *</span>
                  <select value={position} onChange={(event) => setPosition(event.target.value as typeof position)}>
                    {positionOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>학교</span>
                  <input value={school} onChange={(event) => setSchool(event.target.value)} />
                </label>
                <label>
                  <span>학년</span>
                  <select value={grade} onChange={(event) => setGrade(event.target.value)}>
                    {gradeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label className="profile-edit-grid-wide">
                  <span>이메일</span>
                  <input value={email} onChange={(event) => setEmail(event.target.value)} />
                  <small>로그인 계정 이메일과 다를 경우 인증이 필요합니다.</small>
                </label>
              </div>
            </section>

            <section className="profile-edit-section">
              <h2>링크</h2>
              <div className="profile-edit-links">
                <label>
                  <GitBranch size={18} />
                  <span>GitHub</span>
                  <input value={githubUrl} onChange={(event) => setGithubUrl(event.target.value)} />
                </label>
                <label>
                  <BookOpen size={18} />
                  <span>블로그</span>
                  <input value={blogUrl} onChange={(event) => setBlogUrl(event.target.value)} />
                </label>
                <label>
                  <LinkIcon size={18} />
                  <span>LinkedIn</span>
                  <input value={linkedUrl} onChange={(event) => setLinkedUrl(event.target.value)} />
                </label>
              </div>
            </section>

            <section className="profile-edit-section">
              <div className="profile-edit-section-heading">
                <div>
                  <h2>기술 스택</h2>
                  <p>주로 사용하는 기술을 태그로 추가해주세요. 최대 15개</p>
                </div>
                <span>{techStacks.length}/15</span>
              </div>
              <div className="profile-edit-stack-box">
                <div className="profile-edit-stack-list">
                  {techStacks.map((stack) => (
                    <button key={stack} onClick={() => removeStack(stack)} type="button">
                      {stack}
                      <X size={14} />
                    </button>
                  ))}
                </div>
                <div className="profile-edit-stack-input">
                  <input
                    disabled={techStacks.length >= 15}
                    onChange={(event) => setStackInput(event.target.value)}
                    onKeyDown={handleStackKeyDown}
                    placeholder="추가할 기술을 입력하고 Enter를 눌러주세요."
                    value={stackInput}
                  />
                  <button disabled={!trimmedStackInput || techStacks.length >= 15} onClick={addStack} type="button">
                    <Plus size={16} />
                    추가
                  </button>
                </div>
              </div>
            </section>

            <div className="profile-edit-actions">
              <Link to={ROUTES.mypage}>취소</Link>
              <button type="submit">
                <Save size={18} />
                저장하기
              </button>
            </div>
          </form>
        </main>

        <aside className="profile-preview">
          <h2>프로필 미리보기</h2>
          <div className="profile-preview-card">
            <div className="profile-preview-heading">
              <h3>{nickname || "닉네임"}</h3>
              <span>{position}</span>
            </div>
            <p className="profile-preview-tagline">{tagline}</p>
            <div className="profile-preview-info">
              <span><BookOpen size={16} />{school} {grade}</span>
              <span><Mail size={16} />{email}</span>
              <span><GitBranch size={16} />{githubUrl}</span>
              <span><LinkIcon size={16} />{blogUrl}</span>
            </div>
            <div className="profile-preview-stacks">
              <strong>기술 스택</strong>
              <div>
                {techStacks.map((stack) => (
                  <span key={stack}>{stack}</span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}

export default ProfileEditPage;
