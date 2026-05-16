import { Bell, ChevronDown, MessageSquareText, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

import { ROUTES } from "../../app/routes";

const navItems = [
  { label: "홈", to: ROUTES.homepage },
  { label: "이력서 피드백", to: ROUTES.resumeFeedbacks },
  { label: "프로젝트 피드백", to: ROUTES.projectFeedbacks },
  { label: "커뮤니티", to: ROUTES.community },
  { label: "가이드", to: ROUTES.guide },
];

function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <NavLink className="app-header__brand" to={ROUTES.homepage} aria-label="DevFeedback 홈">
          <span className="app-header__brand-mark">
            <MessageSquareText size={17} strokeWidth={2.7} />
          </span>
          <span>DevFeedback</span>
        </NavLink>

        <nav className="app-header__nav" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? "app-header__nav-link is-active" : "app-header__nav-link"
              }
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="app-header__actions">
          <button className="app-header__icon-button" type="button" aria-label="알림">
            <Bell size={21} strokeWidth={2.1} />
          </button>
          <button className="app-header__profile" type="button" aria-label="프로필 메뉴">
            <span className="app-header__avatar">
              <UserRound size={18} strokeWidth={2.5} />
            </span>
            <span>김코딩</span>
            <ChevronDown size={16} strokeWidth={2.3} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
