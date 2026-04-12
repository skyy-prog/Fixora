import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const steps = {
  customer: [
    { num: "01", text: "Unable to find the right repairer?" },
    { num: "02", text: "Create your account in seconds." },
    { num: "03", text: "Post your device problem." },
    { num: "04", text: "Get instant bids from verified professionals." },
  ],
  repairer: [
    { num: "01", text: "Looking for genuine customers?" },
    { num: "02", text: "Create your shop profile." },
    { num: "03", text: "Set your pricing & availability." },
    { num: "04", text: "Start receiving repair requests today." },
  ],
};

const Foursuheader = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .four-root {
          font-family: 'DM Sans', sans-serif;
          background: #f7f5f2;
          padding: 80px 24px 88px;
          position: relative;
          overflow: hidden;
        }

        /* grid texture */
        .four-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
          background-size: 52px 52px;
          pointer-events: none;
        }

        .four-inner {
          position: relative; z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .four-inner.show { opacity: 1; transform: translateY(0); }

        /* ── Header ── */
        .four-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .four-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 1.6px; text-transform: uppercase;
          color: #b0a89e; margin-bottom: 14px;
        }
        .eyebrow-line { width: 28px; height: 1px; background: #d0c8bc; }

        .four-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(30px, 4.5vw, 52px);
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -1.2px;
          margin: 0 0 10px;
          line-height: 1.1;
        }
        .four-title em {
          font-style: italic;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .four-sub { font-size: 14px; color: #a09990; font-weight: 400; margin: 0; }

        /* ── Two columns ── */
        .four-cols {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 48px;
        }
        @media (min-width: 768px) { .four-cols { grid-template-columns: 1fr 1fr; } }

        /* Column card */
        .col-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 24px;
          padding: 32px 28px 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          display: flex; flex-direction: column;
          transition: box-shadow 0.22s, transform 0.22s;
        }
        .col-card:hover { box-shadow: 0 10px 36px rgba(0,0,0,0.09); transform: translateY(-3px); }

        /* dark variant for customer */
        .col-card.dark {
          background: #0a0a0a;
          border-color: rgba(255,255,255,0.08);
        }

        .col-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 14px;
          border-radius: 100px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.5px; text-transform: uppercase;
          margin-bottom: 28px;
          align-self: flex-start;
        }
        .pill-dark  { background: rgba(255,255,255,0.10); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.12); }
        .pill-light { background: #f4f2ef; color: #4a4038; border: 1px solid #e8e3dc; }

        .pill-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dot-blue   { background: #3b82f6; }
        .dot-orange { background: #f97316; }

        /* Step rows */
        .step-list { display: flex; flex-direction: column; gap: 0; flex: 1; }

        .step-row {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 14px 0;
          position: relative;
        }
        /* connector line between steps */
        .step-row:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 15px; top: 42px;
          width: 1px; height: calc(100% - 28px);
          background: rgba(0,0,0,0.08);
        }
        .col-card.dark .step-row:not(:last-child)::after { background: rgba(255,255,255,0.08); }

        .step-num-wrap {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 800;
          flex-shrink: 0;
          letter-spacing: 0.3px;
          position: relative; z-index: 1;
        }
        .num-dark  { background: rgba(255,255,255,0.10); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.12); }
        .num-light { background: #f4f2ef; color: #8a7e72; border: 1px solid #e8e3dc; }

        /* last step = check mark */
        .num-done-dark  { background: #3b82f6; color: #fff; border-color: transparent; }
        .num-done-light { background: #0a0a0a; color: #fff; border-color: transparent; }

        .step-text {
          font-size: 14px; font-weight: 500;
          line-height: 1.55;
          padding-top: 6px;
        }
        .step-text-dark  { color: rgba(255,255,255,0.72); }
        .step-text-light { color: #3a3228; }

        /* CTA line */
        .col-cta {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(0,0,0,0.06);
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 700;
        }
        .col-card.dark .col-cta  { border-top-color: rgba(255,255,255,0.07); color: #ffffff; }
        .cta-light { color: #0a0a0a; }

        /* ── Bottom banner ── */
        .four-banner {
          background: #0a0a0a;
          border-radius: 24px;
          padding: 40px 32px;
          display: flex;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .four-banner::before {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 240px; height: 240px;
          background: radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 65%);
          pointer-events: none;
        }
        .four-banner::after {
          content: '';
          position: absolute; bottom: -40px; left: -40px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 65%);
          pointer-events: none;
        }

        .banner-img-wrap {
          flex-shrink: 0;
          position: relative; z-index: 1;
        }
        .banner-img {
          width: 120px;
          filter: invert(1);
          opacity: 0.9;
        }
        @media (min-width: 768px) { .banner-img { width: 150px; } }

        .banner-text { flex: 1; min-width: 220px; position: relative; z-index: 1; }

        .banner-h3 {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 10px;
          letter-spacing: -0.4px;
          line-height: 1.2;
        }

        .banner-p {
          font-size: 13.5px;
          color: rgba(255,255,255,0.48);
          line-height: 1.7;
          margin: 0;
          max-width: 520px;
        }

        .banner-chips {
          display: flex; gap: 8px; flex-wrap: wrap;
          margin-top: 16px;
        }

        .banner-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 100px;
          font-size: 11.5px; font-weight: 600;
          color: rgba(255,255,255,0.6);
        }
        .chip-check { color: #22c55e; }
      `}</style>

      <section className="four-root" ref={ref}>
        <div className={`four-inner ${visible ? 'show' : ''}`}>

          {/* Header */}
          <div className="four-header">
            <div className="four-eyebrow">
              <span className="eyebrow-line" />
              How It Works
              <span className="eyebrow-line" />
            </div>
            <h2 className="four-title">
              One platform, <em>two sides</em>
            </h2>
            <p className="four-sub">Simple steps for customers and repairers alike</p>
          </div>

          {/* Two columns */}
          <div className="four-cols">

            {/* Customer — dark card */}
            <div className="col-card dark">
              <div className="col-pill pill-dark">
                <span className="pill-dot dot-blue" />
                Customer
              </div>

              <div className="step-list">
                {steps.customer.map((s, i) => (
                  <div key={i} className="step-row">
                    <div className={`step-num-wrap ${i === steps.customer.length - 1 ? 'num-done-dark' : 'num-dark'}`}>
                      {i === steps.customer.length - 1 ? <Check size={13} /> : s.num}
                    </div>
                    <span className="step-text step-text-dark">{s.text}</span>
                  </div>
                ))}
              </div>

              <div className="col-cta">
                Post your problem. Get responses instantly.
                <ArrowRight size={15} style={{ opacity: 0.5, flexShrink: 0 }} />
              </div>
            </div>

            {/* Repairer — light card */}
            <div className="col-card">
              <div className="col-pill pill-light">
                <span className="pill-dot dot-orange" />
                Repairer
              </div>

              <div className="step-list">
                {steps.repairer.map((s, i) => (
                  <div key={i} className="step-row">
                    <div className={`step-num-wrap ${i === steps.repairer.length - 1 ? 'num-done-light' : 'num-light'}`}>
                      {i === steps.repairer.length - 1 ? <Check size={13} /> : s.num}
                    </div>
                    <span className="step-text step-text-light">{s.text}</span>
                  </div>
                ))}
              </div>

              <div className="col-cta cta-light">
                Grow your business with Fixora.
                <ArrowRight size={15} style={{ opacity: 0.4, flexShrink: 0 }} />
              </div>
            </div>

          </div>

          {/* Bottom banner */}
          <div className="four-banner">

            <div className="banner-img-wrap">
              <img src="/bigger2.png" alt="Fixora" className="banner-img" />
            </div>

            <div className="banner-text">
              <h3 className="banner-h3">
                Bringing customers & repairers together — seamlessly.
              </h3>
              <p className="banner-p">
                Fixora removes every barrier between a broken device and a trusted fix.
                Post a problem, receive bids, chat in real-time, and get your device
                repaired — all in one place.
              </p>
              <div className="banner-chips">
                {["No hidden fees", "Verified experts", "Real-time bids", "Instant chat"].map((c, i) => (
                  <span key={i} className="banner-chip">
                    <Check size={11} className="chip-check" />
                    {c}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
};

export default Foursuheader;