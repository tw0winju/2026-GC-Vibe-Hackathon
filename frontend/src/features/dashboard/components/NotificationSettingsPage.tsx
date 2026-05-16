import { BellRing, ChevronRight, Clock3, MessageCircle, Moon, Smartphone, Volume2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import AppLayout from "../../../components/layout/AppLayout";
import { dashboardMenuGroups } from "./dashboardMenu";
import "./SettingsPage.css";

const notificationGroups = [
  {
    title: "알림 받기",
    items: [
      { icon: BellRing, label: "전체 알림", description: "새 피드백, 댓글, 좋아요 알림을 받습니다.", enabled: true },
      { icon: MessageCircle, label: "채팅 및 댓글 알림", description: "댓글과 답글이 달리면 알려줍니다.", enabled: true },
      { icon: Smartphone, label: "푸시 알림", description: "브라우저와 모바일 푸시로 알림을 받습니다.", enabled: false },
    ],
  },
  {
    title: "방해 금지",
    items: [
      { icon: Moon, label: "방해 금지 모드", description: "설정한 시간 동안 알림을 조용히 받습니다.", enabled: false },
      { icon: Clock3, label: "야간 알림 끄기", description: "오후 10시부터 오전 8시까지 알림을 끕니다.", enabled: true },
      { icon: Volume2, label: "소리 및 진동", description: "알림 도착 시 소리와 진동을 사용합니다.", enabled: true },
    ],
  },
];

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

          {notificationGroups.map((group) => (
            <section className="settings-card" key={group.title}>
              <h2>{group.title}</h2>
              <div className="settings-list">
                {group.items.map((item) => {
                  const Icon = item.icon;

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
