import React, { useEffect, useState, useRef } from 'react';

const features = [
  { icon: "⚡", label: "Instant Repair Bids",    desc: "Get quotes in under 2 minutes" },
  { icon: "🔒", label: "Verified Experts",        desc: "Every repairer is background-checked" },
  { icon: "💬", label: "Real-time Chat",           desc: "Talk directly with your repairer" },
  { icon: "💰", label: "Best Price Guarantee",    desc: "Compare & choose the best deal" },
];

const Subheader = () => {
  const [visible, setVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .sub-section {
          font-family: 'DM Sans', sans-serif;
          background: #f7f5f2;
          padding: 88px 24px 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        /* grid texture */
        .sub-section::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 52px 52px;
          pointer-events: none;
        }

        /* warm glow top */
        .sub-section::after {
          content: '';
          position: absolute;
          top: -80px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 360px;
          background: radial-gradient(ellipse, rgba(255,210,130,0.12) 0%, transparent 65%);
          pointer-events: none;
        }

        /* ── Fade in ── */
        .sub-inner {
          position: relative; z-index: 1;
          width: 100%; max-width: 860px;
          display: flex; flex-direction: column; align-items: center; gap: 0;
          opacity: 0; transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .sub-inner.show { opacity: 1; transform: translateY(0); }

        /* eyebrow */
        .sub-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 1.6px; text-transform: uppercase;
          color: #b0a89e; margin-bottom: 18px;
        }
        .eyebrow-line { width: 28px; height: 1px; background: #d0c8bc; }

        /* headline */
        .sub-headline {
          display: flex; align-items: center; justify-content: center;
          flex-wrap: wrap; gap: 16px;
          margin-bottom: 32px;
        }

        .sub-h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 5vw, 58px);
          font-weight: 700;
          color: #0a0a0a;
          line-height: 1.1;
          letter-spacing: -1.2px;
          margin: 0;
        }

        .logo-wrap {
          display: inline-flex; align-items: center;
          background: #0a0a0a;
          border-radius: 16px;
          padding: 8px 14px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
        }
        .logo-wrap img { width: 110px; display: block; }
        @media (min-width: 768px) { .logo-wrap img { width: 150px; } }

        .question-mark {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(32px, 5vw, 58px);
          font-weight: 700;
          color: #0a0a0a;
          line-height: 1.1;
        }

        /* description */
        .sub-lead {
          font-size: 17px;
          color: #3a3228;
          font-weight: 500;
          line-height: 1.65;
          max-width: 620px;
          margin: 0 0 18px;
        }

        .sub-para {
          font-size: 14.5px;
          color: rgba(0,0,0,0.52);
          line-height: 1.8;
          max-width: 700px;
          margin: 0 0 14px;
        }

        /* divider */
        .sub-divider {
          width: 48px; height: 2px;
          background: linear-gradient(90deg, #f59e0b, #f97316);
          border-radius: 2px;
          margin: 28px auto 32px;
        }

        /* ── Feature cards ── */
        .feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          width: 100%;
          margin-top: 12px;
        }
        @media (min-width: 768px) {
          .feature-grid { grid-template-columns: repeat(4, 1fr); }
        }

        .feature-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 18px;
          padding: 20px 16px;
          cursor: pointer;
          text-align: left;
          display: flex; flex-direction: column; gap: 8px;
          transition: box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease, background 0.22s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .feature-card:hover, .feature-card.active {
          box-shadow: 0 10px 30px rgba(0,0,0,0.10);
          transform: translateY(-3px);
          border-color: rgba(0,0,0,0.14);
          background: #0a0a0a;
        }
        .feature-card:hover .feat-icon-wrap,
        .feature-card.active .feat-icon-wrap { background: rgba(255,255,255,0.10); }
        .feature-card:hover .feat-label,
        .feature-card.active .feat-label { color: #ffffff; }
        .feature-card:hover .feat-desc,
        .feature-card.active .feat-desc { color: rgba(255,255,255,0.5); }

        .feat-icon-wrap {
          width: 38px; height: 38px;
          background: #f4f2ef;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          transition: background 0.2s;
        }

        .feat-label {
          font-size: 13px; font-weight: 700;
          color: #0a0a0a;
          line-height: 1.3;
          transition: color 0.2s;
        }

        .feat-desc {
          font-size: 11.5px; font-weight: 400;
          color: #a09990;
          line-height: 1.4;
          transition: color 0.2s;
        }

        /* bottom trust */
        .sub-trust {
          display: flex; align-items: center; gap: 8px;
          margin-top: 36px; flex-wrap: wrap; justify-content: center;
        }
        .trust-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 16px;
          background: #ffffff;
          border: 1px solid #e8e3dc;
          border-radius: 100px;
          font-size: 12px; font-weight: 600;
          color: #4a4038;
        }
        .trust-dot { width: 5px; height: 5px; background: #d0c8bc; border-radius: 50%; }

        /* stagger cards */
        .feature-card {
          opacity: 0;
          animation: feat-in 0.45s ease forwards;
        }
        @keyframes feat-in { to { opacity: 1; } }
      `}</style>

      <section className="sub-section">
        <div className={`sub-inner ${visible ? 'show' : ''}`}>

          {/* Eyebrow */}
          <div className="sub-eyebrow">
            <span className="eyebrow-line" />
            About Fixora
            <span className="eyebrow-line" />
          </div>

          {/* Headline with logo */}
          <div className="sub-headline">
            <h2 className="sub-h2">What is</h2>
            <div className="logo-wrap">
              <img src="/bigger2.png" alt="Fixora" />
            </div>
            <span className="question-mark">?</span>
          </div>

          {/* Lead paragraph */}
          <p className="sub-lead">
            Fixora is a real-time repair marketplace that connects users with
            verified repair experts — instantly.
          </p>

          {/* Body text */}
          <p className="sub-para">
            Instead of visiting multiple repair shops or waiting endlessly for quotes,
            simply post your device problem. Trusted repairers bid in real-time, offering
            the best price and fastest service. Compare offers, chat instantly, and choose
            the repairer you trust — all in one place.
          </p>
          <p className="sub-para">
            From smartphones and laptops to home appliances and gaming consoles, Fixora
            covers all major repair categories. Every expert is verified to ensure safety,
            quality, and reliability. Our goal: make repair <em>transparent, fast, and
            affordable</em> for everyone.
          </p>

          {/* Divider */}
          <div className="sub-divider" />

          {/* Feature cards */}
          <div className="feature-grid">
            {features.map((f, i) => (
              <div
                key={i}
                className={`feature-card ${activeFeature === i ? 'active' : ''}`}
                style={{ animationDelay: `${i * 80}ms` }}
                onMouseEnter={() => setActiveFeature(i)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="feat-icon-wrap">{f.icon}</div>
                <span className="feat-label">{f.label}</span>
                <span className="feat-desc">{f.desc}</span>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="sub-trust">
            <div className="trust-pill">🇮🇳 Made for India</div>
            <div className="trust-dot" />
            <div className="trust-pill">⭐ 4.8 Rated</div>
            <div className="trust-dot" />
            <div className="trust-pill">🛡️ Safe & Secure</div>
            <div className="trust-dot" />
            <div className="trust-pill">10,000+ Repairs Done</div>
          </div>

        </div>
      </section>
    </>
  );
};

export default Subheader;