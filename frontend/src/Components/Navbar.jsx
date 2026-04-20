import { useState, useEffect, useContext, useRef } from "react";
import {
  Search, Smartphone, Laptop,
  Gamepad2, Headphones, Menu, X, ChevronDown, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";
import { RepairContext } from "../Context/ALlContext";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

export default function GlassNavbar({ searchOpen, setSearchOpen }) {
  const { t } = useTranslation();
  const [scrolled, setScrolled]           = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileItem, setActiveMobileItem] = useState(null);
  const [hide, sethide]                   = useState(true);
  const [servicesOpen, setServicesOpen]   = useState(false);
  const searchRef = useRef(null);
  const { isverified, profileId, role, repairerProfileCreated } = useContext(RepairContext);
  const profileRoute =
    role === "repairer" ? "/repairer/account" : `/profile/${profileId}`;
  const profileButtonLabel =
    role === "repairer"
      ? repairerProfileCreated
        ? t("repairerProfile")
        : t("createProfile")
      : t("myProfile");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      sethide(window.scrollY <= 350);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 80);
    }
  }, [searchOpen]);

  // Close services dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.services-dropdown-root')) setServicesOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const deviceTypes = [
    { icon: Smartphone, label: "Phone",   desc: "Screen, battery & more" },
    { icon: Laptop,     label: "Laptop",  desc: "Hardware & software fixes" },
    { icon: Gamepad2,   label: "Console", desc: "Gaming system repairs" },
    { icon: Headphones, label: "Audio",   desc: "Headphones & speakers" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .nav-root {
          font-family: 'DM Sans', sans-serif;
        }

        /* pill nav */
        .nav-pill {
          position: fixed;
          top: 14px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          width: 92%;
          max-width: 1100px;
          transition: opacity 0.4s ease, transform 0.4s ease, background 0.3s ease, box-shadow 0.3s ease;
        }
        .nav-pill.hidden-nav {
          opacity: 0;
          pointer-events: none;
          transform: translateX(-50%) translateY(-8px);
        }

        .nav-inner {
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.10);
          padding: 10px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
        }
        .nav-inner.scrolled {
          background: rgba(10,10,10,0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset;
        }
        .nav-inner.top {
          background: rgba(12,12,12,0.82);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 4px 24px rgba(0,0,0,0.30);
        }

        /* logo */
        .nav-logo { width: 110px; flex-shrink: 0; }
        @media (min-width: 640px) { .nav-logo { width: 126px; } }

        /* desktop links */
        .nav-links { display: none; align-items: center; gap: 2px; }
        @media (min-width: 1024px) { .nav-links { display: flex; } }

        .nav-link-btn {
          display: flex; align-items: center; gap: 4px;
          padding: 7px 14px;
          background: transparent;
          color: rgba(255,255,255,0.75);
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 500;
          border: none; border-radius: 12px;
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
          text-decoration: none;
          white-space: nowrap;
        }
        .nav-link-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }

        .nav-link-btn .chev {
          transition: transform 0.2s ease;
          opacity: 0.55;
        }
        .nav-link-btn.open .chev { transform: rotate(180deg); opacity: 1; }

        /* services dropdown */
        .services-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%) translateY(-6px);
          width: 280px;
          background: #111;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 18px;
          padding: 10px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
          z-index: 100;
        }
        .services-dropdown.open {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        .dd-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.15s;
          text-decoration: none;
        }
        .dd-item:hover { background: rgba(255,255,255,0.07); }

        .dd-icon-wrap {
          width: 34px; height: 34px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: rgba(255,255,255,0.6);
          transition: background 0.15s, color 0.15s;
        }
        .dd-item:hover .dd-icon-wrap { background: rgba(255,255,255,0.13); color: #fff; }

        .dd-text-label { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.9); }
        .dd-text-desc  { font-size: 11px; color: rgba(255,255,255,0.38); margin-top: 1px; }

        /* right action group */
        .nav-actions { display: flex; align-items: center; gap: 6px; }

        .icon-btn {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 11px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.10);
          cursor: pointer;
          color: rgba(255,255,255,0.75);
          transition: background 0.15s, color 0.15s, transform 0.15s;
        }
        .icon-btn:hover { background: rgba(255,255,255,0.13); color: #fff; transform: scale(1.05); }

        .me-btn {
          display: none;
          align-items: center; gap: 7px;
          padding: 8px 16px;
          background: #fff;
          color: #0a0a0a;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          border-radius: 12px; border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 2px 10px rgba(255,255,255,0.15);
          letter-spacing: 0.1px;
        }
        .me-btn:hover { background: #f0f0f0; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(255,255,255,0.2); }
        @media (min-width: 640px) { .me-btn { display: flex; } }

        /* avatar dot on Me btn */
        .me-dot {
          width: 7px; height: 7px;
          background: #22c55e;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* search bar */
        .search-bar-wrap {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transition: max-height 0.3s ease, opacity 0.25s ease, margin 0.3s ease;
          margin-top: 0;
        }
        .search-bar-wrap.open {
          max-height: 80px;
          opacity: 1;
          margin-top: 10px;
        }
        .search-bar {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          padding: 10px 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .search-input {
          flex: 1;
          background: transparent;
          border: none; outline: none;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.35); }

        /* ── Mobile drawer ── */
        .mobile-overlay {
          position: fixed; inset: 0; z-index: 40;
        }
        .mobile-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
        }
        .mobile-drawer {
          position: fixed;
          top: 80px;
          left: 50%; transform: translateX(-50%);
          width: 92%; max-width: 440px;
          background: #111;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 20px;
          padding: 10px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .mob-item-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 14px;
          background: transparent; border: none;
          color: rgba(255,255,255,0.85);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          border-radius: 13px;
          cursor: pointer;
          transition: background 0.15s;
          text-decoration: none;
        }
        .mob-item-btn:hover { background: rgba(255,255,255,0.07); }

        .mob-subitems { padding: 4px 10px 8px; display: flex; flex-direction: column; gap: 2px; }
        .mob-sub {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px;
          border-radius: 11px;
          color: rgba(255,255,255,0.65);
          font-size: 13px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .mob-sub:hover { background: rgba(255,255,255,0.06); color: #fff; }

        .mob-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 4px 0; }

        .mob-me-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%;
          padding: 12px;
          margin-top: 2px;
          background: #fff; color: #0a0a0a;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 700;
          border-radius: 13px; border: none;
          cursor: pointer; text-decoration: none;
          transition: background 0.15s;
        }
        .mob-me-btn:hover { background: #f0f0f0; }

        .chev-icon { transition: transform 0.2s ease; }
        .chev-icon.rotated { transform: rotate(180deg); }
      `}</style>

      <div className="nav-root">
        <nav className={`nav-pill ${hide ? '' : 'hidden-nav'}`}>
          <div className={`nav-inner ${scrolled ? 'scrolled' : 'top'}`}>

            {/* Logo */}
            <img src="/logowhite.png" className="nav-logo" alt="logo" />

            {/* Desktop links */}
            <div className="nav-links">

              {/* Services with click dropdown */}
              <div className="relative services-dropdown-root" style={{ position: 'relative' }}>
                <button
                  className={`nav-link-btn ${servicesOpen ? 'open' : ''}`}
                  onClick={() => setServicesOpen(v => !v)}
                >
                  {t("services")}
                  <ChevronDown size={14} className="chev" />
                </button>

                <div className={`services-dropdown ${servicesOpen ? 'open' : ''}`}>
                  {deviceTypes.map((device) => (
                    <div key={device.label} className="dd-item" onClick={() => setServicesOpen(false)}>
                      <div className="dd-icon-wrap">
                        <device.icon size={15} />
                      </div>
                      <div>
                        <div className="dd-text-label">{device.label} Repair</div>
                        <div className="dd-text-desc">{device.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="about" className="nav-link-btn">{t("aboutUs")}</Link>
              {isverified && <Link to="chats" className="nav-link-btn">Chats</Link>}
            </div>

            {/* Right actions */}
            <div className="nav-actions">
              <LanguageSelector compact />

              <button
                className="icon-btn"
                onClick={() => setSearchOpen(prev => !prev)}
                aria-label="Search"
              >
                {searchOpen
                  ? <X size={17} />
                  : <Search size={17} />
                }
              </button>

              {isverified && (
                <Link to={profileRoute}>
                  <button className="me-btn">
                    <span className="me-dot" />
                    {profileButtonLabel}
                    <ArrowRight size={13} style={{ opacity: 0.5 }} />
                  </button>
                </Link>
              )}

               

            </div>
          </div>

          {/* Search bar — slides in below */}
          <div className={`search-bar-wrap ${searchOpen ? 'open' : ''}`}>
            <div className="search-bar">
              <Search size={16} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
              <input
                ref={searchRef}
                className="search-input"
                placeholder={t("searchPlaceholder")}
              />
              <button
                onClick={() => setSearchOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex' }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <div className="mobile-overlay lg:hidden">
            <div className="mobile-backdrop" onClick={() => setMobileMenuOpen(false)} />
            <div className="mobile-drawer">

              {/* Services */}
              <button
                className="mob-item-btn"
                onClick={() => setActiveMobileItem(activeMobileItem === 'Services' ? null : 'Services')}
              >
                {t("services")}
                <ChevronDown
                  size={16}
                  className={`chev-icon ${activeMobileItem === 'Services' ? 'rotated' : ''}`}
                  style={{ opacity: 0.5 }}
                />
              </button>

              {activeMobileItem === 'Services' && (
                <div className="mob-subitems">
                  {deviceTypes.map((device) => (
                    <div key={device.label} className="mob-sub" onClick={() => setMobileMenuOpen(false)}>
                      <device.icon size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
                      {device.label} Repair
                    </div>
                  ))}
                </div>
              )}

              <div className="mob-divider" />

              <Link to="about" onClick={() => setMobileMenuOpen(false)}>
                <button className="mob-item-btn">{t("aboutUs")}</button>
              </Link>
              {isverified && (
                <Link to="chats" onClick={() => setMobileMenuOpen(false)}>
                  <button className="mob-item-btn">Chats</button>
                </Link>
              )}

              <div className="mob-divider" />
              <div style={{ padding: "8px 12px" }}>
                <LanguageSelector compact />
              </div>

              {isverified && (
                <>
                  <div className="mob-divider" />
                  <Link to={profileRoute} onClick={() => setMobileMenuOpen(false)}>
                    <button className="mob-me-btn">
                      <span className="me-dot" style={{ background: '#22c55e' }} />
                      {profileButtonLabel}
                    </button>
                  </Link>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    </>
  );
}
