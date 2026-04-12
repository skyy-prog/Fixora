import { useEffect, useState } from "react";
import React from "react";

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.5;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setFadeOut(true), 300);
    }
  }, [progress]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .loader-root {
          position: fixed; inset: 0;
          background: #0a0a0a;
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          font-family: 'DM Sans', sans-serif;
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .loader-root.fade-out {
          opacity: 0;
          pointer-events: none;
          transform: scale(1.03);
        }

        /* Grid texture */
        .loader-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* Blobs */
        .loader-blob-1 {
          position: absolute; top: -100px; left: -100px;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 65%);
          border-radius: 50%; pointer-events: none;
          animation: blob-drift 6s ease-in-out infinite alternate;
        }
        .loader-blob-2 {
          position: absolute; bottom: -80px; right: -80px;
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 65%);
          border-radius: 50%; pointer-events: none;
          animation: blob-drift 5s ease-in-out infinite alternate-reverse;
        }
        @keyframes blob-drift {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(20px, 16px) scale(1.06); }
        }

        /* Center content */
        .loader-content {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          align-items: center; gap: 0;
        }

        /* Logo reveal */
        .logo-reveal-wrap {
          position: relative;
          margin-bottom: 36px;
          display: flex; align-items: center; justify-content: center;
        }

        /* Subtle glow under image */
        .logo-glow {
          position: absolute;
          bottom: -16px; left: 50%; transform: translateX(-50%);
          width: 200px; height: 40px;
          background: radial-gradient(ellipse, rgba(59,130,246,0.25) 0%, transparent 70%);
          filter: blur(12px);
          border-radius: 50%;
          pointer-events: none;
          transition: opacity 0.4s ease;
        }

        .logo-img {
          width: 200px;
          display: block;
          filter: invert(1);     /* white logo on dark bg */
          transition: filter 0.3s ease;
        }

        /* Clip reveal animation */
        .logo-clip {
          transition: clip-path 0.08s linear;
        }

        /* Status line */
        .loader-status {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px;
        }
        .status-dot {
          width: 6px; height: 6px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.18);
          animation: pulse-dot 1.4s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.18); }
          50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0.08); }
        }
        .status-text {
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.5px;
        }

        /* Progress track */
        .progress-track {
          width: 240px;
          height: 3px;
          background: rgba(255,255,255,0.08);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 14px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          border-radius: 10px;
          transition: width 0.12s ease;
          position: relative;
        }

        /* shimmer on progress */
        .progress-fill::after {
          content: '';
          position: absolute; top: 0; right: 0;
          width: 40px; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          animation: shimmer-bar 1.2s ease infinite;
        }
        @keyframes shimmer-bar {
          0%   { transform: translateX(-40px); opacity: 0; }
          50%  { opacity: 1; }
          100% { transform: translateX(40px); opacity: 0; }
        }

        /* Percent */
        .progress-pct {
          font-size: 11px; font-weight: 700;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.5px;
        }

        /* Tagline */
        .loader-tagline {
          margin-top: 40px;
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 15px;
          color: rgba(255,255,255,0.18);
          letter-spacing: 0.2px;
        }

        /* Corner watermarks */
        .corner-tl, .corner-br {
          position: absolute;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.10);
        }
        .corner-tl { top: 24px; left: 28px; }
        .corner-br { bottom: 24px; right: 28px; }
      `}</style>

      <div className={`loader-root ${fadeOut ? 'fade-out' : ''}`}>

        {/* Background */}
        <div className="loader-blob-1" />
        <div className="loader-blob-2" />
        <span className="corner-tl">Fixora</span>
        <span className="corner-br">v1.0</span>

        <div className="loader-content">

          {/* Logo with clip reveal */}
          <div className="logo-reveal-wrap">
            <div
              className="logo-clip"
              style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
            >
              <img src="/bigger2.png" alt="Fixora" className="logo-img" />
            </div>
            <div className="logo-glow" style={{ opacity: progress / 100 }} />
          </div>

          {/* Live status */}
          <div className="loader-status">
            <span className="status-dot" />
            <span className="status-text">
              {progress < 40
                ? "Connecting repairers…"
                : progress < 75
                ? "Loading marketplace…"
                : progress < 100
                ? "Almost ready…"
                : "Welcome to Fixora ✓"}
            </span>
          </div>

          {/* Progress bar */}
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* Percent counter */}
          <span className="progress-pct">{Math.round(progress)}%</span>

          {/* Tagline */}
          <p className="loader-tagline">Repair. Smarter. Faster.</p>

        </div>
      </div>
    </>
  );
};

export default Loader;