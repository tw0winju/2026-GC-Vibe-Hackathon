import { LogOut, UserX } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "../../../app/routes";
import AppLayout from "../../../components/layout/AppLayout";
import { logout } from "../../auth/api/authApi";
import { dashboardMenuGroups } from "./dashboardMenu";
import "./SettingsPage.css";

function AccountSettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout().catch(() => null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate(ROUTES.signup);
  };

  const handleWithdraw = () => {
    if (!window.confirm("회원 탈퇴를 진행할까요?")) return;
    window.alert("회원 탈퇴 API가 연결되면 바로 처리할 수 있습니다.");
  };

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
            <span>로그아웃하거나 계정 탈퇴를 진행할 수 있습니다.</span>
          </section>

          <section className="settings-card">
            <h2>계정 관리</h2>
            <div className="settings-actions">
              <button type="button" onClick={handleLogout}>
                <LogOut size={18} />
                로그아웃
              </button>
              <button className="is-danger" type="button" onClick={handleWithdraw}>
                <UserX size={18} />
                회원탈퇴
              </button>
            </div>
          </section>
        </main>
      </div>
    </AppLayout>
  );
}

export default AccountSettingsPage;
