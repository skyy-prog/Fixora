import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Mail, ArrowUpRight, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Home",     to: "/" },
  { label: "About",    to: "/about" },
  { label: "Services", to: "/" },
  { label: "Contact",  to: "/" },
];

const repairs = [
  "Mobile Repair",
  "Laptop Repair",
  "Appliance Repair",
  "Gaming Console Repair",
  "Audio Device Repair",
];

const socials = [
  { Icon: Facebook,  href: "#", hoverColor: "#60a5fa", label: "Facebook" },
  { Icon: Instagram, href: "#", hoverColor: "#f472b6", label: "Instagram" },
  { Icon: Twitter,   href: "#", hoverColor: "#38bdf8", label: "Twitter" },
  { Icon: Linkedin,  href: "#", hoverColor: "#60a5fa", label: "LinkedIn" },
  { Icon: Mail,      href: "#", hoverColor: "#34d399", label: "Email" },
];

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .footer-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
        }

        /* grid texture */
        .footer-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 52px 52px;
          pointer-events: none;
        }

        /* blobs */
        .f-blob-1 {
          position: absolute; top: -80px; left: -80px;
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 65%);
          border-radius: 50%; pointer-events: none;
        }
        .f-blob-2 {
          position: absolute; bottom: 0; right: -60px;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%);
          border-radius: 50%; pointer-events: none;
        }

        /* ── CTA banner ── */
        .footer-cta {
          position: relative; z-index: 1;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 52px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .cta-left {}
        .cta-eyebrow {
          font-size: 11px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          margin-bottom: 10px;
        }
        .cta-h2 {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(24px, 3.5vw, 38px);
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.8px;
          line-height: 1.15;
        }
        .cta-h2 span {
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px;
          background: #fff; color: #0a0a0a;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 700;
          border-radius: 14px; border: none;
          cursor: pointer; text-decoration: none;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(255,255,255,0.12);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .cta-btn:hover { background: #f0f0f0; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,255,255,0.18); }

        /* ── Main grid ── */
        .footer-grid {
          position: relative; z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 52px 28px 44px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        @media (min-width: 640px)  { .footer-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .footer-grid { grid-template-columns: 2fr 1fr 1fr 1.4fr; gap: 32px; } }

        /* Brand column */
        .brand-col {}

        .footer-logo { width: 120px; margin-bottom: 16px; opacity: 0.92; }

        .brand-desc {
          font-size: 13.5px;
          color: rgba(255,255,255,0.42);
          line-height: 1.75;
          margin: 0 0 20px;
          max-width: 260px;
        }

        .brand-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px;
          background: rgba(34,197,94,0.10);
          border: 1px solid rgba(34,197,94,0.20);
          border-radius: 100px;
          font-size: 11px; font-weight: 600;
          color: #4ade80;
        }
        .live-dot {
          width: 5px; height: 5px;
          background: #22c55e; border-radius: 50%;
          animation: blink 1.4s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        /* Link columns */
        .footer-col-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          margin-bottom: 18px;
        }

        .footer-link-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }

        .footer-link {
          display: flex; align-items: center; gap: 4px;
          font-size: 13.5px; font-weight: 500;
          color: rgba(255,255,255,0.52);
          text-decoration: none; cursor: pointer;
          transition: color 0.15s, gap 0.15s;
        }
        .footer-link:hover { color: #ffffff; gap: 8px; }
        .footer-link .link-arrow { opacity: 0; transition: opacity 0.15s; flex-shrink: 0; }
        .footer-link:hover .link-arrow { opacity: 1; }

        /* Contact column */
        .contact-items { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        .contact-item {
          display: flex; align-items: flex-start; gap: 10px;
        }
        .contact-icon-wrap {
          width: 30px; height: 30px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: rgba(255,255,255,0.45);
        }
        .contact-text { font-size: 13px; color: rgba(255,255,255,0.50); line-height: 1.5; }

        /* Socials */
        .social-row { display: flex; gap: 8px; }
        .social-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          color: rgba(255,255,255,0.45);
          cursor: pointer; text-decoration: none;
          transition: background 0.18s, color 0.18s, transform 0.15s, border-color 0.18s;
        }
        .social-btn:hover { background: rgba(255,255,255,0.13); transform: translateY(-2px); border-color: rgba(255,255,255,0.18); }

        /* ── Bottom bar ── */
        .footer-bottom {
          position: relative; z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 20px 28px;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .bottom-copy { font-size: 12px; color: rgba(255,255,255,0.25); font-weight: 400; }

        .bottom-links { display: flex; gap: 20px; }
        .bottom-link {
          font-size: 12px; color: rgba(255,255,255,0.25);
          text-decoration: none; cursor: pointer;
          transition: color 0.15s;
        }
        .bottom-link:hover { color: rgba(255,255,255,0.6); }

        .bottom-tag {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.18);
        }
        .bottom-tag span { color: rgba(249,115,22,0.6); }
      `}</style>

      <footer className="footer-root">
        <div className="f-blob-1" />
        <div className="f-blob-2" />

        {/* ── CTA banner ── */}
        <div className="footer-cta">
          <div className="cta-left">
            <p className="cta-eyebrow">Get started today</p>
            <h2 className="cta-h2">
              Your device deserves<br />a <span>smarter fix</span>
            </h2>
          </div>
          <Link to="/" className="cta-btn">
            Post a Repair Request
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* ── Main grid ── */}
        <div className="footer-grid">

          {/* Brand */}
          <div className="brand-col">
            <img src="/logowhite.png" alt="Fixora" className="footer-logo" />
            <p className="brand-desc">
              India's first real-time repair bidding marketplace — connecting users with
              verified repair experts instantly.
            </p>
            <div className="brand-badge">
              <span className="live-dot" />
              Live in 50+ Cities
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="footer-col-label">Quick Links</p>
            <ul className="footer-link-list">
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <Link to={l.to} className="footer-link">
                    {l.label}
                    <ArrowUpRight size={12} className="link-arrow" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Repairs */}
          <div>
            <p className="footer-col-label">Repairs</p>
            <ul className="footer-link-list">
              {repairs.map((r, i) => (
                <li key={i}>
                  <span className="footer-link">
                    {r}
                    <ArrowUpRight size={12} className="link-arrow" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="footer-col-label">Contact</p>
            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-icon-wrap"><Mail size={13} /></div>
                <span className="contact-text">support@fixora.in</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon-wrap"><Phone size={13} /></div>
                <span className="contact-text">+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon-wrap"><MapPin size={13} /></div>
                <span className="contact-text">Mumbai, Maharashtra, India</span>
              </div>
            </div>

            <div className="social-row">
              {socials.map(({ Icon, href, hoverColor, label }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  className="social-btn"
                  onMouseEnter={e => { e.currentTarget.style.color = hoverColor; }}
                  onMouseLeave={e => { e.currentTarget.style.color = ''; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <span className="bottom-copy">
            © {new Date().getFullYear()} Fixora. All rights reserved.
          </span>
          <div className="bottom-links">
            <span className="bottom-link">Privacy Policy</span>
            <span className="bottom-link">Terms of Use</span>
            <span className="bottom-link">Sitemap</span>
          </div>
          <span className="bottom-tag">Made with <span>♥</span> in India</span>
        </div>

      </footer>
    </>
  );
};

export default Footer;