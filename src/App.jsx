import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar, { BrandMark } from "./components/Sidebar";
import { MenuIcon } from "./components/Icons";
import { MODULES } from "./modules";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function useScrollToTopOnNavigate() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useScrollToTopOnNavigate();

  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Sidebar open={menuOpen} onClose={closeMenu} />
      <div className="main">
        <header className="topbar">
          <Link to="/" className="brand">
            <BrandMark />
            Yafai ML Lab
          </Link>
          <button
            type="button"
            className="btn btn-icon"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="sidebar"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </button>
        </header>
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            {MODULES.map((m) => (
              <Route key={m.path} path={m.path} element={<m.Component />} />
            ))}
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Navigate to="/about" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
