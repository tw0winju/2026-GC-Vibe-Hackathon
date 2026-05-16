import { Link, useLocation } from "react-router-dom";

import AppLayout from "../../../components/layout/AppLayout";
import { dashboardMenuGroups } from "./dashboardMenu";
import "./DashboardSectionPage.css";

type DashboardSectionPageProps = {
  title: string;
  description: string;
};

function DashboardSectionPage({ title, description }: DashboardSectionPageProps) {
  const location = useLocation();

  return (
    <AppLayout>
      <div className="dashboard-section-shell">
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

        <section className="dashboard-section-card">
          <p>DevFeedback</p>
          <h1>{title}</h1>
          <span>{description}</span>
        </section>
      </div>
    </AppLayout>
  );
}

export default DashboardSectionPage;
