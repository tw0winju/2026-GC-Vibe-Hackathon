import { ChevronRight, KeyRound, Link2, Mail, ShieldCheck, Smartphone, UserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import AppLayout from "../../../components/layout/AppLayout";
import { dashboardMenuGroups } from "./dashboardMenu";
import "./SettingsPage.css";

const accountSections = [
  {
    title: "기본 정보",
    items: [
      { icon: UserRound, label: "프로필 정보", value: "김개발 · 컴퓨터공학과 3학년" },
      { icon: Mail, label: "이메일", value: "kimgvaebal@univ.ac.kr" },
      { icon: Smartphone, label: "휴대폰 번호", value: "010-****-2026" },
    ],
  },
  {
    title: "로그인 및 보안",
    items: [
      { icon: KeyRound, label: "비밀번호 변경", value: "최근 변경 32일 전" },
      { icon: ShieldCheck, label: "2단계 인증", value: "사용 안 함" },
      { icon: Link2, label: "연결된 소셜 계정", value: "Google, Kakao" },
    ],
  },
];

function AccountSettingsPage() {
  const location = useLocation();

  return (
    <AppLayout>
      <div className="settings-shell">
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

        <main className="settings-content">
          <section className="settings-hero">
            <p>마이페이지</p>
            <h1>계정 설정</h1>
            <span>프로필, 로그인, 보안, 연결 계정을 관리하세요.</span>
          </section>

          {accountSections.map((section) => (
            <section className="settings-card" key={section.title}>
              <h2>{section.title}</h2>
              <div className="settings-list">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button className="settings-row" key={item.label} type="button">
                      <span className="settings-row-icon">
                        <Icon size={20} />
                      </span>
                      <span className="settings-row-main">
                        <strong>{item.label}</strong>
                        <span>{item.value}</span>
                      </span>
                      <ChevronRight size={20} />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}

          <section className="settings-card">
            <h2>계정 관리</h2>
            <div className="settings-actions">
              <button type="button">로그아웃</button>
              <button className="is-danger" type="button">회원 탈퇴</button>
            </div>
          </section>
        </main>
      </div>
    </AppLayout>
  );
}

export default AccountSettingsPage;
