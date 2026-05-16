import gachonLogo from "../../assets/images/footer/gachon-logo.png";

function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__school">
          <img src={gachonLogo} alt="가천대학교 Gachon University" />
          <p>2026 GC Vibe Hackathon</p>
        </div>
        <p className="app-footer__copy">가천 개발자들의 도전을 응원합니다.</p>
      </div>
    </footer>
  );
}

export default AppFooter;
