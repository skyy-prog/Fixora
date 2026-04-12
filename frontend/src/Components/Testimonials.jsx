import React, { useEffect, useState } from "react";
import { Star, RefreshCw, Quote } from "lucide-react";
import { testimonials } from "../assets/assets";

const Testimonial = () => {
  const [finalTestimonials, setFinalTestimonials] = useState([]);
  const [shuffling, setShuffling] = useState(false);
  const [visible, setVisible] = useState(false);

  const shuffleTestimonials = () => {
    setShuffling(true);
    setVisible(false);
    setTimeout(() => {
      const shuffled = [...testimonials].sort(() => 0.5 - Math.random()).slice(0, 6);
      setFinalTestimonials(shuffled);
      setShuffling(false);
      setTimeout(() => setVisible(true), 60);
    }, 320);
  };

  useEffect(() => {
    shuffleTestimonials();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .testi-section {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          padding: 72px 24px 80px;
          position: relative;
          overflow: hidden;
        }

        /* subtle warm radial bg */
        .testi-section::before {
          content: '';
          position: absolute;
          top: -80px; left: 50%; transform: translateX(-50%);
          width: 700px; height: 400px;
          background: radial-gradient(ellipse, rgba(255,220,160,0.10) 0%, transparent 65%);
          pointer-events: none;
        }

        /* ── Header ── */
        .testi-header {
          text-align: center;
          margin-bottom: 48px;
          position: relative; z-index: 1;
        }

        .testi-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700;
          letter-spacing: 1.6px; text-transform: uppercase;
          color: #b0a89e; margin-bottom: 14px;
        }
        .eyebrow-line { width: 28px; height: 1px; background: #d0c8bc; }

        .testi-title {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(28px, 4vw, 46px);
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -1px;
          margin: 0 0 10px;
          line-height: 1.12;
        }
        .testi-title span {
          background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .testi-sub {
          font-size: 14px; color: #a09990;
          font-weight: 400; margin: 0;
        }

        /* ── Shuffle btn ── */
        .shuffle-wrap {
          display: flex; justify-content: center;
          margin-bottom: 36px; position: relative; z-index: 1;
        }

        .shuffle-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 22px;
          background: #f4f2ef;
          border: 1px solid #e8e3dc;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          color: #4a4038;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .shuffle-btn:hover { background: #ece8e2; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .shuffle-btn:active { transform: scale(0.97); }

        .spin { animation: spin-once 0.4s ease; }
        @keyframes spin-once { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* ── Grid ── */
        .testi-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          max-width: 1100px;
          margin: 0 auto;
          position: relative; z-index: 1;
          transition: opacity 0.3s ease;
        }
        .testi-grid.hidden-grid { opacity: 0; }
        .testi-grid.show-grid   { opacity: 1; }

        @media (min-width: 640px)  { .testi-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .testi-grid { grid-template-columns: 1fr 1fr 1fr; } }

        /* ── Card ── */
        .testi-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 22px;
          padding: 24px;
          display: flex; flex-direction: column; gap: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          transition: box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease;
          position: relative;
          overflow: hidden;
        }
        .testi-card:hover {
          box-shadow: 0 10px 32px rgba(0,0,0,0.10);
          transform: translateY(-3px);
          border-color: rgba(0,0,0,0.13);
        }

        /* top-right quote watermark */
        .card-quote-mark {
          position: absolute;
          top: 16px; right: 18px;
          color: #f0ece6;
        }

        /* featured card (first one) — dark */
        .testi-card.featured {
          background: #0a0a0a;
          border-color: rgba(255,255,255,0.08);
        }
        .testi-card.featured .card-quote-mark { color: rgba(255,255,255,0.06); }
        .testi-card.featured .card-message    { color: rgba(255,255,255,0.78); }
        .testi-card.featured .card-name       { color: #ffffff; }
        .testi-card.featured .card-role       { color: rgba(255,255,255,0.40); }
        .testi-card.featured .card-avatar-ring { border-color: rgba(255,255,255,0.12); }

        /* avatar */
        .card-top { display: flex; align-items: center; gap: 12px; }

        .card-avatar-wrap { position: relative; flex-shrink: 0; }
        .card-avatar {
          width: 46px; height: 46px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #f0ece6;
        }
        .card-avatar-ring {
          position: absolute; inset: -3px;
          border-radius: 50%;
          border: 1.5px dashed #d0c8bc;
          pointer-events: none;
        }

        .card-name  { font-size: 14px; font-weight: 700; color: #0a0a0a; margin: 0 0 2px; }
        .card-role  { font-size: 12px; color: #b0a89e; font-weight: 400; margin: 0; }

        /* stars */
        .card-stars { display: flex; align-items: center; gap: 2px; }

        /* message */
        .card-message {
          font-size: 13.5px;
          color: #4a4038;
          line-height: 1.72;
          flex: 1;
          margin: 0;
          font-style: italic;
        }

        /* bottom verified tag */
        .card-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid #f0ece6;
        }
        .testi-card.featured .card-footer { border-top-color: rgba(255,255,255,0.08); }

        .verified-tag {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 600;
          color: #22c55e;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.18);
          padding: 3px 10px;
          border-radius: 100px;
        }
        .verified-dot { width: 5px; height: 5px; background: #22c55e; border-radius: 50%; }

        .rating-num {
          font-size: 12px; font-weight: 700;
          color: #f59e0b;
        }

        /* stagger animation */
        .testi-card {
          opacity: 0;
          transform: translateY(12px);
          animation: card-in 0.45s ease forwards;
        }
        @keyframes card-in {
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Bottom strip ── */
        .testi-bottom {
          display: flex; align-items: center; justify-content: center;
          gap: 8px; flex-wrap: wrap;
          margin-top: 44px;
          position: relative; z-index: 1;
        }
        .bottom-stat {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 18px;
          background: #f9f7f4;
          border: 1px solid #e8e3dc;
          border-radius: 100px;
          font-size: 12px; font-weight: 600;
          color: #4a4038;
        }
        .bottom-sep { width: 4px; height: 4px; background: #d0c8bc; border-radius: 50%; }
      `}</style>

      <section className="testi-section w-[100vw] " >

        {/* Header */}
        <div className="testi-header">
          <div className="testi-eyebrow">
            <span className="eyebrow-line" />
            Testimonials
            <span className="eyebrow-line" />
          </div>
          <h2 className="testi-title">
            What Our <span>Users Say</span>
          </h2>
          <p className="testi-sub">Real feedback from verified customers & repairers</p>
        </div>

        {/* Shuffle */}
        <div className="shuffle-wrap">
          <button className="shuffle-btn" onClick={shuffleTestimonials}>
            <RefreshCw size={14} className={shuffling ? 'spin' : ''} />
            Show Different Reviews
          </button>
        </div>

        {/* Grid */}
        <div className={`testi-grid ${visible ? 'show-grid' : 'hidden-grid'}`}>
          {finalTestimonials.map((item, index) => (
            <div
              key={item.id}
              className={`testi-card ${index === 0 ? 'featured' : ''}`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <Quote size={36} className="card-quote-mark" />

              {/* Top: avatar + name */}
              <div className="card-top">
                <div className="card-avatar-wrap">
                  <img src={item.image} alt={item.name} className="card-avatar" />
                  <div className="card-avatar-ring" />
                </div>
                <div>
                  <p className="card-name">{item.name}</p>
                  <p className="card-role">{item.role}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="card-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    style={{
                      color: i < item.rating ? '#f59e0b' : '#e0d8d0',
                      fill: i < item.rating ? '#f59e0b' : '#e0d8d0',
                    }}
                  />
                ))}
              </div>

              {/* Message */}
              <p className="card-message">"{item.message}"</p>

              {/* Footer */}
              <div className="card-footer">
                <span className="verified-tag">
                  <span className="verified-dot" />
                  Verified
                </span>
                <span className="rating-num">{item.rating}.0 / 5</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="testi-bottom">
          <div className="bottom-stat">⭐ 4.8 Average Rating</div>
          <div className="bottom-sep" />
          <div className="bottom-stat">💬 2,400+ Reviews</div>
          <div className="bottom-sep" />
          <div className="bottom-stat">✓ All Verified Customers</div>
        </div>

      </section>
    </>
  );
};

export default Testimonial;