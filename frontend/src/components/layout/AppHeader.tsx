import { Bell, ChevronDown, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

import { ROUTES } from "../../app/routes";
import ggLogo from "../../assets/images/home/GG_logo.png";

const navItems = [
  { label: "홈", to: ROUTES.homepage },
  { label: "이력서 피드백", to: ROUTES.resumeFeedbacks },
  { label: "프로젝트 피드백", to: ROUTES.projectFeedbacks },
  { label: "가이드", to: ROUTES.guide },
  { label: "마이페이지", to: ROUTES.mypage },
];

function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <NavLink className="app-header__brand" to={ROUTES.homepage} aria-label="DevFeedback 홈">
          <img className="app-header__brand-logo" src={ggLogo} alt="G. G" />
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
          <NavLink className="app-header__profile" to={ROUTES.mypage} aria-label="마이페이지로 이동">
            <span className="app-header__avatar">
              <UserRound size={18} strokeWidth={2.5} />
            </span>
            <span>김코딩</span>
            <ChevronDown size={16} strokeWidth={2.3} />
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
