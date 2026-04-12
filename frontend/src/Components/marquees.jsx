import React from "react";

const Marquees = () => {
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Uttar Pradesh", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttarakhand", "West Bengal"
  ];

  const row1 = states.slice(0, 14);
  const row2 = states.slice(14);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&family=DM+Sans:wght@500;600;700&display=swap');

        .marquee-section {
          font-family: 'DM Sans', sans-serif;
          padding: 64px 0 56px;
          background: #fafaf8;
          position: relative;
          overflow: hidden;
        }

        /* decorative grid lines */
        .marquee-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .marquee-header {
          position: relative;
          z-index: 1;
          text-align: center;
          margin-bottom: 40px;
          padding: 0 24px;
        }

        .marquee-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: #b0a89e;
          margin-bottom: 12px;
        }

        .eyebrow-line {
          width: 28px;
          height: 1px;
          background: #d0c8bc;
        }

        .marquee-title {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -1px;
          margin: 0;
          line-height: 1.1;
        }

        .marquee-title span {
          display: inline-block;
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .marquee-sub {
          margin-top: 10px;
          font-size: 14px;
          color: #a09990;
          font-weight: 400;
        }

        /* track container */
        .marquee-tracks {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        /* fade edges */
        .marquee-track-outer {
          position: relative;
        }
        .marquee-track-outer::before,
        .marquee-track-outer::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 120px;
          z-index: 2;
          pointer-events: none;
        }
        .marquee-track-outer::before {
          left: 0;
          background: linear-gradient(to right, #fafaf8, transparent);
        }
        .marquee-track-outer::after {
          right: 0;
          background: linear-gradient(to left, #fafaf8, transparent);
        }

        /* scrolling row */
        .marquee-row {
          display: flex;
          gap: 10px;
          width: max-content;
        }

        .marquee-row.forward  { animation: scroll-fwd 22s linear infinite; }
        .marquee-row.backward { animation: scroll-bwd 22s linear infinite; }

        @keyframes scroll-fwd {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-bwd {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        /* pill chip */
        .state-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          transition: transform 0.2s ease;
          cursor: default;
          user-select: none;
        }

        /* dark row */
        .chip-dark {
          background: #0a0a0a;
          color: rgba(255,255,255,0.88);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .chip-dark .chip-dot { background: rgba(255,255,255,0.25); }

        /* light row */
        .chip-light {
          background: #ffffff;
          color: #0a0a0a;
          border: 1px solid rgba(0,0,0,0.10);
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .chip-light .chip-dot { background: #3b82f6; }

        .chip-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* bottom stat strip */
        .marquee-footer {
          position: relative; z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 36px;
          flex-wrap: wrap;
          padding: 0 24px;
        }

        .footer-stat {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 18px;
          background: #fff;
          border: 1px solid #e8e3dc;
          border-radius: 100px;
          font-size: 12px;
          color: #4a4038;
          font-weight: 600;
        }

        .footer-sep {
          width: 4px; height: 4px;
          background: #d0c8bc;
          border-radius: 50%;
        }
      `}</style>

      <section className="marquee-section">

        {/* Header */}
        <div className="marquee-header">
          <div className="marquee-eyebrow">
            <span className="eyebrow-line" />
            Coverage
            <span className="eyebrow-line" />
          </div>
          <h2 className="marquee-title">
            Serving <span>All Over</span> India
          </h2>
          <p className="marquee-sub">28 states · Verified local repairers in every city</p>
        </div>

        {/* Marquee tracks */}
        <div className="marquee-tracks">

          {/* Row 1 — dark chips, scrolls forward */}
          <div className="marquee-track-outer">
            <div className="marquee-row forward">
              {[...row1, ...row1, ...row1, ...row1].map((state, i) => (
                <div key={i} className="state-chip chip-dark">
                  <span className="chip-dot" />
                  {state}
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 — light chips, scrolls backward */}
          <div className="marquee-track-outer">
            <div className="marquee-row backward">
              {[...row2, ...row2, ...row2, ...row2].map((state, i) => (
                <div key={i} className="state-chip chip-light">
                  <span className="chip-dot" />
                  {state}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer strip */}
        <div className="marquee-footer">
          <div className="footer-stat">🇮🇳 28 States</div>
          <div className="footer-sep" />
          <div className="footer-stat">⚡ Same-day Service</div>
          <div className="footer-sep" />
          <div className="footer-stat">✓ Verified Repairers</div>
          <div className="footer-sep" />
          <div className="footer-stat">📍 Your City, Your Repairer</div>
        </div>

      </section>
    </>
  );
};

export default Marquees;