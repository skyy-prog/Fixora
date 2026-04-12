import { useEffect, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Shield, MessageCircle, BadgeDollarSign, ArrowRight } from "lucide-react";

const stats = [
  { value: "10K+", label: "Successful Repairs",  sub: "and counting" },
  { value: "5K+",  label: "Verified Experts",    sub: "across India" },
  { value: "50+",  label: "Cities Covered",      sub: "& expanding" },
  { value: "4.8★", label: "Average Rating",      sub: "by real users" },
];

const features = [
  { icon: Zap,               label: "Instant Bidding",       desc: "Repairers bid in real-time so you get the fastest offer." },
  { icon: Shield,            label: "Verified Experts",       desc: "Every expert is background-checked before joining." },
  { icon: MessageCircle,     label: "Real-time Chat",         desc: "Talk directly with your repairer before you commit." },
  { icon: BadgeDollarSign,   label: "Transparent Pricing",    desc: "Compare bids side-by-side. No hidden fees, ever." },
];

const AboutUs = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .about-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #0a0a0a;
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        /* ── Background textures ── */
        .about-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 52px 52px;
          pointer-events: none; z-index: 0;
        }

        .blob-tl {
          position: fixed; top: -140px; left: -140px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%);
          border-radius: 50%; pointer-events: none; z-index: 0;
        }
        .blob-br {
          position: fixed; bottom: -120px; right: -120px;
          width: 440px; height: 440px;
          background: radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 65%);
          border-radius: 50%; pointer-events: none; z-index: 0;
        }
        .blob-center {
          position: fixed; top: 40%; left: 50%; transform: translate(-50%, -50%);
          width: 700px; height: 280px;
          background: radial-gradient(ellipse, rgba(255,200,100,0.05) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }

        /* ── Page wrapper ── */
        .about-page {
          position: relative; z-index: 1;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .about-page.show { opacity: 1; transform: translateY(0); }

        /* ── Nav bar ── */
        .about-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .back-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 18px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          color: rgba(255,255,255,0.8);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .back-btn:hover { background: rgba(255,255,255,0.13); transform: translateY(-1px); }

        .nav-logo { width: 110px; opacity: 0.9; }

        /* ── Hero ── */
        .about-hero {
          text-align: center;
          padding: 72px 24px 48px;
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 1.6px; text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 20px;
        }
        .eyebrow-line { width: 28px; height: 1px; background: rgba(255,255,255,0.15); }

        .hero-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 6vw, 68px);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.08;
          letter-spacing: -2px;
          margin: 0 0 24px;
        }
        .hero-h1 em {
          font-style: italic;
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-logo-inline {
          display: inline-block;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          padding: 6px 14px;
          margin: 0 6px;
          vertical-align: middle;
          position: relative; top: -4px;
        }
        .hero-logo-inline img { width: 100px; display: block; }

        .hero-lead {
          font-size: 17px;
          color: rgba(255,255,255,0.60);
          font-weight: 400;
          line-height: 1.75;
          max-width: 580px;
          margin: 0 auto 16px;
        }

        .hero-lead strong { color: rgba(255,255,255,0.85); font-weight: 600; }

        /* orange accent divider */
        .accent-divider {
          width: 44px; height: 3px;
          background: linear-gradient(90deg, #f59e0b, #f97316);
          border-radius: 3px;
          margin: 32px auto;
        }

        /* ── Stats grid ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          max-width: 820px;
          margin: 0 auto 64px;
          padding: 0 24px;
        }
        @media (min-width: 768px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          padding: 24px 20px;
          text-align: center;
          transition: background 0.22s, transform 0.22s, border-color 0.22s;
          cursor: default;
        }
        .stat-card:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-3px);
          border-color: rgba(255,255,255,0.16);
        }
        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 36px; font-weight: 700;
          color: #ffffff; letter-spacing: -1px;
          margin-bottom: 6px;
        }
        .stat-label { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.65); margin-bottom: 3px; }
        .stat-sub   { font-size: 11px; color: rgba(255,255,255,0.28); font-weight: 400; }

        /* ── Features ── */
        .features-section {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }

        .section-label {
          font-size: 11px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          text-align: center; margin-bottom: 28px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (min-width: 768px) { .features-grid { grid-template-columns: repeat(4, 1fr); } }

        .feat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          padding: 22px 18px;
          text-align: left;
          display: flex; flex-direction: column; gap: 10px;
          transition: background 0.22s, transform 0.22s, border-color 0.22s;
          cursor: default;
          opacity: 0;
          animation: fade-up 0.5s ease forwards;
        }
        .feat-card:hover {
          background: rgba(255,255,255,0.09);
          transform: translateY(-3px);
          border-color: rgba(255,255,255,0.16);
        }
        @keyframes fade-up { to { opacity: 1; transform: translateY(0); } }

        .feat-icon-wrap {
          width: 40px; height: 40px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.7);
        }
        .feat-label { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.88); }
        .feat-desc  { font-size: 12px; color: rgba(255,255,255,0.38); line-height: 1.55; }

        /* ── CTA footer ── */
        .about-cta {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 48px 24px 56px;
          text-align: center;
        }
        .cta-h3 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 3vw, 36px);
          font-style: italic;
          color: #fff;
          margin: 0 0 14px;
          letter-spacing: -0.5px;
        }
        .cta-sub { font-size: 14px; color: rgba(255,255,255,0.4); margin-bottom: 28px; }

        .cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px;
          background: #fff; color: #0a0a0a;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          border-radius: 14px; border: none;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(255,255,255,0.15);
        }
        .cta-btn:hover { background: #f0f0f0; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,255,255,0.2); }
      `}</style>

      <div className="about-root">
        <div className="blob-tl" />
        <div className="blob-br" />
        <div className="blob-center" />

        <div className={`about-page ${animate ? 'show' : ''}`}>

          {/* ── Top nav ── */}
          <nav className="about-nav">
            <Link to="/" className="back-btn">
              <ArrowLeft size={14} />
              Go Back
            </Link>
            <img src="/logowhite.png" alt="Fixora" className="nav-logo" />
            <div style={{ width: 96 }} /> {/* spacer to center logo */}
          </nav>

          {/* ── Hero ── */}
          <div className="about-hero">
            <div className="hero-eyebrow">
              <span className="eyebrow-line" />
              Our Story
              <span className="eyebrow-line" />
            </div>

            <h1 className="hero-h1">
              About
              <span className="hero-logo-inline">
                <img src="/logowhite.png" alt="Fixora" />
              </span>
            </h1>

            <p className="hero-lead">
              <strong>India's first real-time repair bidding marketplace.</strong> Built to
              remove the frustration of finding reliable repair services — users post their
              device problem, and verified experts compete to offer the best price and
              fastest service, in real time.
            </p>
            <p className="hero-lead">
              No waiting. No hidden costs. Just <strong>transparent, fast, affordable repair</strong> —
              from smartphones and laptops to home appliances and gaming consoles.
            </p>

            <div className="accent-divider" />
          </div>

          {/* ── Stats ── */}
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* ── Features ── */}
          <div className="features-section">
            <p className="section-label">What makes us different</p>
            <div className="features-grid">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="feat-card"
                  style={{ animationDelay: `${120 + i * 80}ms` }}
                >
                  <div className="feat-icon-wrap">
                    <f.icon size={18} />
                  </div>
                  <span className="feat-label">{f.label}</span>
                  <span className="feat-desc">{f.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA footer ── */}
          <div className="about-cta">
            <h3 className="cta-h3">Ready to get your device fixed?</h3>
            <p className="cta-sub">Join thousands of happy customers across India</p>
            <Link to="/" className="cta-btn">
              Get Started <ArrowRight size={15} />
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default AboutUs;