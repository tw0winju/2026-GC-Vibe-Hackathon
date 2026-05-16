import type { ReactNode } from "react";

import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import "./AppLayout.css";

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-layout">
      <AppHeader />
      <main className="app-layout__main">{children}</main>
      <AppFooter />
    </div>
  );
}

export default AppLayout;
