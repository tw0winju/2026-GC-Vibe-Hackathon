import { BellRing, ChevronRight, Clock3, MessageCircle, Moon, Smartphone, Volume2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import AppLayout from "../../../components/layout/AppLayout";
import { notificationSettingsGroups } from "../../../mocks/data/dashboard";
import { dashboardMenuGroups } from "./dashboardMenu";
import "./SettingsPage.css";

const notificationIconByKey = {
  bell: BellRing,
  clock: Clock3,
  message: MessageCircle,
  moon: Moon,
  phone: Smartphone,
  volume: Volume2,
};

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
            <span>카카오톡처럼 필요한 알림만 켜고, 조용히 받을 시간을 설정하세요.</span>
          </section>

          {notificationSettingsGroups.map((group) => (
            <section className="settings-card" key={group.title}>
              <h2>{group.title}</h2>
              <div className="settings-list">
                {group.items.map((item) => {
                  const Icon = notificationIconByKey[item.icon];

                  return (
                    <button className="settings-row" key={item.label} type="button">
                      <span className="settings-row-icon">
                        <Icon size={20} />
                      </span>
                      <span className="settings-row-main">
                        <strong>{item.label}</strong>
                        <span>{item.description}</span>
                      </span>
                      <span className={item.enabled ? "settings-toggle is-on" : "settings-toggle"} aria-hidden="true">
                        <span />
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}

          <section className="settings-card">
            <h2>알림 미리보기</h2>
            <button className="settings-row" type="button">
              <span className="settings-row-icon">
                <BellRing size={20} />
              </span>
              <span className="settings-row-main">
                <strong>피드백 도착 알림</strong>
                <span>새로운 피드백이 도착하면 알림 센터에 표시됩니다.</span>
              </span>
              <ChevronRight size={20} />
            </button>
          </section>
        </main>
      </div>
    </AppLayout>
  );
}

export default NotificationSettingsPage;
