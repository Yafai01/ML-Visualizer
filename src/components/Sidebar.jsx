import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../context/theme";
import { MODULES } from "../modules";
import { CloseIcon, HomeIcon, MoonIcon, SunIcon, UserIcon } from "./Icons";

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M4 18 10 9l4 5 6-9" />
      </svg>
    </span>
  );
}

export default function Sidebar({ open, onClose }) {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={`backdrop ${open ? "open" : ""}`} onClick={onClose} aria-hidden="true" />
      <nav id="sidebar" className={`sidebar ${open ? "open" : ""}`} aria-label="Main">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" className="brand" onClick={onClose}>
            <BrandMark />
            Yafai ML Lab
          </Link>
          {open ? (
            <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close menu">
              <CloseIcon />
            </button>
          ) : null}
        </div>

        <NavLink to="/" end className="nav-link" onClick={onClose}>
          <HomeIcon /> Overview
        </NavLink>

        <div className="nav-section">Algorithms</div>
        {MODULES.map((m) => (
          <NavLink key={m.path} to={m.path} className="nav-link" onClick={onClose}>
            <m.Icon /> {m.title}
          </NavLink>
        ))}

        <div className="nav-section">Project</div>
        <NavLink to="/about" className="nav-link" onClick={onClose}>
          <UserIcon /> About
        </NavLink>

        <div className="sidebar-footer">
          <button
            type="button"
            className="btn"
            style={{ width: "100%" }}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            {theme === "dark" ? "Light theme" : "Dark theme"}
          </button>
        </div>
      </nav>
    </>
  );
}
