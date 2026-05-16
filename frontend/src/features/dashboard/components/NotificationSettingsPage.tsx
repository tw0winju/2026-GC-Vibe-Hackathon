import { BellOff } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import AppLayout from "../../../components/layout/AppLayout";
import { dashboardMenuGroups } from "./dashboardMenu";
import "./SettingsPage.css";

function NotificationSettingsPage() {
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
            <h1>알림 설정</h1>
            <span>알림 설정 API는 백엔드 명세에 없어 비활성화했습니다.</span>
          </section>

          <section className="settings-card">
            <h2>백엔드 미지원</h2>
            <button className="settings-row" disabled type="button">
              <span className="settings-row-icon">
                <BellOff size={20} />
              </span>
              <span className="settings-row-main">
                <strong>알림 토글, 방해 금지, 푸시 알림</strong>
                <span>현재 API 명세에 endpoint가 없어 실제 연동 대상에서 제외했습니다.</span>
              </span>
            </button>
          </section>
        </main>
      </div>
    </AppLayout>
  );
}

export default NotificationSettingsPage;
