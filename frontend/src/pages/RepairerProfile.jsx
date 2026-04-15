import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { ListofRepairers } from '../assets/assets'
import { FaPhone } from "react-icons/fa6"
import { repairerReviews } from '../assets/assets'
import { GiShop } from "react-icons/gi"
import {
  LuSend, LuStar, LuMapPin, LuShield, LuClock,
  LuMessageCircle, LuUser, LuWrench
} from "react-icons/lu"

const TABS = ["Overview", "Reviews", "Chat"];

const RepairerProfile = () => {
  const { id } = useParams();
  const [FinalProfile, setFinalProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [reviewText, setReviewText] = useState("");
  const [starHover, setStarHover] = useState(0);
  const [starSelected, setStarSelected] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "repairer", text: "Hey! How can I help you today? 👋", time: "10:00 AM" },
  ]);
  const msgsEndRef = useRef(null);

  useEffect(() => {
    const Profile = ListofRepairers.find(item => item.id === Number(id));
    setFinalProfile(Profile);
  }, [id]);

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openmaps = (address) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { from: "user", text: chatInput.trim(), time: now }]);
    setChatInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, {
        from: "repairer",
        text: "Thanks for reaching out! I'll get back to you shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 900);
  };

  const handleChatKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (!FinalProfile) return (
    <div style={{ minHeight: '100vh', background: '#08080c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(52,211,153,0.2)', borderTopColor: '#34d399', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes page-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes panel-in{ from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes msg-in  { from { opacity: 0; transform: translateY(6px);  } to { opacity: 1; transform: none; } }
        @keyframes pulse-dot{ 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes badge-glow { 0%,100% { box-shadow: 0 0 8px #34d399; } 50% { box-shadow: 0 0 18px #34d399; } }

        .rp-root {
          font-family: 'DM Sans', sans-serif;
          background: #08080c;
          min-height: 100vh;
          color: #e8e8f0;
          position: relative;
          overflow-x: hidden;
        }
        /* Grid bg */
        .rp-root::before {
          content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse at 50% 0%, black 10%, transparent 75%);
        }
        .glow-tl {
          position: fixed; top: -160px; left: -100px; width: 600px; height: 600px;
          border-radius: 50%; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%);
        }
        .glow-br {
          position: fixed; bottom: -200px; right: -80px; width: 500px; height: 500px;
          border-radius: 50%; pointer-events: none; z-index: 0;
          background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
        }

        /* ── Page ── */
        .rp-page {
          position: relative; z-index: 1;
          width: 100%; max-width: 1200px; margin: 0 auto;
          padding: 24px 14px 80px;
          animation: page-in 0.55s ease both;
        }
        @media (min-width: 640px)  { .rp-page { padding: 32px 24px 80px; } }
        @media (min-width: 1024px) { .rp-page { padding: 40px 32px 80px; } }

        /* ── Hero banner ── */
        .rp-hero {
          width: 100%; margin-bottom: 16px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px; overflow: hidden;
        }
        .rp-hero-banner {
          height: 100px; position: relative; overflow: hidden;
          background: linear-gradient(135deg,
            rgba(52,211,153,0.16) 0%,
            rgba(6,182,212,0.10) 40%,
            rgba(99,102,241,0.10) 100%);
        }
        @media (min-width: 640px) { .rp-hero-banner { height: 120px; } }
        .rp-hero-banner::before {
          content: ''; position: absolute; inset: 0;
          background-image: linear-gradient(rgba(52,211,153,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .rp-hero-body { padding: 0 20px 22px; }
        @media (min-width: 640px) { .rp-hero-body { padding: 0 28px 26px; } }

        .rp-avatar-row {
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 12px; margin-top: -38px;
        }
        .rp-left-block { display: flex; align-items: flex-end; gap: 14px; flex: 1; min-width: 0; }
        .rp-avatar-wrap { position: relative; flex-shrink: 0; }
        .rp-avatar {
          width: 76px; height: 76px; border-radius: 50%; object-fit: cover;
          border: 3px solid #08080c;
          box-shadow: 0 0 0 1.5px rgba(52,211,153,0.35), 0 8px 24px rgba(0,0,0,0.5);
          background: #1a1a22; display: block;
        }
        @media (min-width: 640px) { .rp-avatar { width: 92px; height: 92px; } }
        .rp-avail-dot {
          position: absolute; bottom: 4px; right: 4px;
          width: 15px; height: 15px; border-radius: 50%; border: 2.5px solid #08080c;
        }
        .dot-yes { background: #34d399; animation: badge-glow 2.5s infinite; }
        .dot-no  { background: #ef4444; }

        .rp-name { flex: 1; min-width: 0; padding-bottom: 2px; }
        .rp-name h1 {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(20px, 5vw, 30px); color: #f0f0fa;
          letter-spacing: -0.03em; line-height: 1.1;
        }
        .rp-name-pills {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 7px;
        }
        .pill {
          font-size: 11px; font-weight: 600; padding: 3px 10px;
          border-radius: 100px; letter-spacing: 0.1px;
          display: flex; align-items: center; gap: 4px;
        }
        .pill-rating  { color: #fbbf24; background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.20); }
        .pill-verified-yes { color: #34d399; background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.20); }
        .pill-verified-no  { color: #f87171; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15); }
        .pill-avail-yes { color: #34d399; }
        .pill-avail-no  { color: #f87171; }

        .rp-chat-btn {
          position: relative; overflow: hidden;
          display: flex; align-items: center; gap: 8px;
          padding: 10px 20px; background: #34d399; color: #08080c;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
          border-radius: 12px; border: none; cursor: pointer; flex-shrink: 0;
          box-shadow: 0 0 22px rgba(52,211,153,0.22);
          transition: transform 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .rp-chat-btn::before {
          content: ''; position: absolute; top: 0; left: -100%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transform: skewX(-20deg); transition: left 0.5s ease;
        }
        .rp-chat-btn:hover { transform: translateY(-2px); box-shadow: 0 0 36px rgba(52,211,153,0.36); }
        .rp-chat-btn:hover::before { left: 160%; }
        .rp-chat-btn:active { transform: scale(0.97); }

        /* ── Tabs ── */
        .rp-tabs {
          display: flex; gap: 4px; margin-bottom: 16px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 5px;
        }
        .rp-tab {
          flex: 1; padding: 10px 6px; text-align: center;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          border-radius: 11px; border: none; cursor: pointer;
          background: transparent; color: rgba(232,232,240,0.38);
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .rp-tab:hover { color: rgba(232,232,240,0.68); }
        .rp-tab.active {
          background: rgba(52,211,153,0.10);
          border: 1px solid rgba(52,211,153,0.22);
          color: #34d399;
        }

        /* ── Panel ── */
        .rp-panel {
          width: 100%;
          background: rgba(255,255,255,0.022);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px; overflow: hidden;
          animation: panel-in 0.32s ease both;
        }
        .rp-pad { padding: 22px 18px; }
        @media (min-width: 640px) { .rp-pad { padding: 26px 28px; } }

        .rp-section-label {
          font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: rgba(232,232,240,0.28); margin-bottom: 14px;
        }

        /* ── Info grid ── */
        .rp-info-grid {
          display: grid; grid-template-columns: 1fr; gap: 9px;
        }
        @media (min-width: 500px) { .rp-info-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 860px) { .rp-info-grid { grid-template-columns: 1fr 1fr 1fr; } }

        .rp-info-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 14px 16px;
          display: flex; flex-direction: column; gap: 5px;
          transition: border-color 0.2s;
        }
        .rp-info-card:hover { border-color: rgba(255,255,255,0.13); }
        .rp-info-card.span-full { grid-column: 1 / -1; }
        .rp-info-icon { color: rgba(232,232,240,0.28); margin-bottom: 2px; }
        .rp-info-lbl {
          font-size: 9px; font-weight: 700; letter-spacing: 0.9px;
          text-transform: uppercase; color: rgba(232,232,240,0.28);
        }
        .rp-info-val { font-size: 14px; font-weight: 500; color: #f0f0fa; line-height: 1.5; }
        .rp-info-val a { color: #34d399; text-decoration: none; }
        .rp-info-val a:hover { text-decoration: underline; }

        .rp-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 22px 0; }

        .rp-bio { font-size: 13px; color: rgba(232,232,240,0.58); line-height: 1.8; }

        /* ── Skills ── */
        .rp-skills { display: flex; flex-wrap: wrap; gap: 7px; }
        .rp-skill {
          padding: 6px 14px; border-radius: 100px;
          background: rgba(52,211,153,0.07); border: 1px solid rgba(52,211,153,0.18);
          color: #34d399; font-size: 12px; font-weight: 600;
          transition: background 0.2s;
        }
        .rp-skill:hover { background: rgba(52,211,153,0.14); }

        /* ── Contacts ── */
        .rp-contacts { display: flex; gap: 10px; flex-wrap: wrap; }
        .rp-contact-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 16px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px; color: rgba(232,232,240,0.65); font-size: 13px; font-weight: 500;
          transition: border-color 0.2s;
        }
        .rp-contact-pill:hover { border-color: rgba(255,255,255,0.20); color: #e8e8f0; }

        /* ── Reviews ── */
        .rp-review-form {
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 18px; margin-bottom: 18px;
        }
        .rp-star-row { display: flex; gap: 6px; margin-bottom: 12px; }
        .rp-star { font-size: 24px; cursor: pointer; transition: transform 0.15s; line-height: 1; }
        .rp-star:hover { transform: scale(1.2); }
        .rp-textarea {
          width: 100%; resize: none;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10);
          border-radius: 12px; padding: 13px 15px;
          color: #e8e8f0; font-family: 'DM Sans', sans-serif; font-size: 13px;
          outline: none; line-height: 1.65; transition: border-color 0.2s;
        }
        .rp-textarea::placeholder { color: rgba(232,232,240,0.22); }
        .rp-textarea:focus { border-color: rgba(52,211,153,0.38); }
        .rp-review-submit {
          margin-top: 12px; width: 100%; padding: 13px;
          background: #34d399; color: #08080c;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
          border-radius: 12px; border: none; cursor: pointer;
          box-shadow: 0 0 22px rgba(52,211,153,0.18);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .rp-review-submit:hover { transform: translateY(-2px); box-shadow: 0 0 36px rgba(52,211,153,0.30); }
        .rp-review-submit:active { transform: scale(0.98); }

        .rp-reviews-count {
          font-size: 12px; font-weight: 700; letter-spacing: 0.4px;
          color: rgba(232,232,240,0.30); margin-bottom: 12px;
          text-transform: uppercase;
        }
        .rp-reviews-list { display: flex; flex-direction: column; gap: 9px; }
        .rp-review-card {
          background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 15px 16px;
          transition: border-color 0.2s, background 0.2s;
        }
        .rp-review-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); }
        .rp-review-text { font-size: 13px; color: rgba(232,232,240,0.62); line-height: 1.75; }

        /* ── Chat ── */
        .rp-chat-shell {
          display: flex; flex-direction: column;
          height: calc(100vh - 260px); min-height: 500px;
        }
        @media (min-width: 640px) { .rp-chat-shell { height: calc(100vh - 230px); } }

        .rp-chat-header {
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; gap: 12px; flex-shrink: 0;
        }
        @media (min-width: 640px) { .rp-chat-header { padding: 16px 28px; } }

        .rp-chat-av {
          width: 38px; height: 38px; border-radius: 50%; object-fit: cover;
          border: 2px solid rgba(52,211,153,0.28); flex-shrink: 0;
        }
        .rp-chat-hname {
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #f0f0fa;
        }
        .rp-chat-online {
          display: flex; align-items: center; gap: 5px; margin-top: 2px;
          font-size: 11px; color: #34d399; font-weight: 500;
        }
        .chat-online-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #34d399;
          box-shadow: 0 0 6px #34d399; animation: pulse-dot 2s infinite;
        }

        .rp-chat-msgs {
          flex: 1; overflow-y: auto; padding: 18px 18px;
          display: flex; flex-direction: column; gap: 10px;
          scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.07) transparent;
        }
        @media (min-width: 640px) { .rp-chat-msgs { padding: 22px 28px; gap: 12px; } }
        .rp-chat-msgs::-webkit-scrollbar { width: 4px; }
        .rp-chat-msgs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }

        .rp-msg { display: flex; flex-direction: column; max-width: 74%; animation: msg-in 0.24s ease both; }
        .rp-msg.user    { align-self: flex-end; align-items: flex-end; }
        .rp-msg.repairer{ align-self: flex-start; align-items: flex-start; }

        .rp-bubble {
          padding: 10px 15px; font-size: 13px; line-height: 1.6; border-radius: 18px;
        }
        .rp-msg.user     .rp-bubble {
          background: #34d399; color: #08080c; font-weight: 500; border-bottom-right-radius: 4px;
        }
        .rp-msg.repairer .rp-bubble {
          background: rgba(255,255,255,0.05); color: rgba(232,232,240,0.80);
          border: 1px solid rgba(255,255,255,0.08); border-bottom-left-radius: 4px;
        }
        .rp-msg-time { font-size: 10px; color: rgba(232,232,240,0.22); margin-top: 4px; padding: 0 4px; }

        .rp-chat-input-row {
          padding: 14px 16px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex; gap: 10px; align-items: flex-end; flex-shrink: 0;
        }
        @media (min-width: 640px) { .rp-chat-input-row { padding: 16px 24px; } }

        .rp-chat-input {
          flex: 1; resize: none; max-height: 96px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.10);
          border-radius: 14px; padding: 11px 15px;
          color: #e8e8f0; font-family: 'DM Sans', sans-serif; font-size: 14px;
          outline: none; line-height: 1.5; transition: border-color 0.2s;
          scrollbar-width: none;
        }
        .rp-chat-input:focus { border-color: rgba(52,211,153,0.38); }
        .rp-chat-input::placeholder { color: rgba(232,232,240,0.22); }
        .rp-chat-input::-webkit-scrollbar { display: none; }

        .rp-send-btn {
          width: 44px; height: 44px; flex-shrink: 0; border-radius: 13px;
          background: #34d399; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #08080c;
          box-shadow: 0 0 16px rgba(52,211,153,0.18);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .rp-send-btn:hover { transform: translateY(-2px) scale(1.05); box-shadow: 0 0 26px rgba(52,211,153,0.34); }
        .rp-send-btn:active { transform: scale(0.93); }
        .rp-send-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; box-shadow: none; }
      `}</style>

      <div className="rp-root">
        <div className="glow-tl" />
        <div className="glow-br" />

        <div className="rp-page">

          {/* ─── Hero banner ─── */}
          <div className="rp-hero">
            <div className="rp-hero-banner" />
            <div className="rp-hero-body">
              <div className="rp-avatar-row">

                {/* Left: avatar + name */}
                <div className="rp-left-block">
                  <div className="rp-avatar-wrap">
                    <img src="/Repairer.png" alt="Repairer" className="rp-avatar" />
                    <div className={`rp-avail-dot ${FinalProfile.available ? 'dot-yes' : 'dot-no'}`} />
                  </div>
                  <div className="rp-name">
                    <h1>{FinalProfile.userName}</h1>
                    <div className="rp-name-pills">
                      <span className="pill pill-rating">
                        ★ {FinalProfile.rating}/5
                      </span>
                      <span className={`pill ${FinalProfile.isVerified ? 'pill-verified-yes' : 'pill-verified-no'}`}>
                        <LuShield size={10} />
                        {FinalProfile.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                      <span className={`pill ${FinalProfile.available ? 'pill-avail-yes' : 'pill-avail-no'}`}>
                        {FinalProfile.available ? '● Available' : '● Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: chat CTA */}
                <button className="rp-chat-btn" onClick={() => setActiveTab("Chat")}>
                  <LuMessageCircle size={14} />
                  Chat Now
                </button>

              </div>
            </div>
          </div>

          {/* ─── Tabs ─── */}
          <div className="rp-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`rp-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "Overview" && <LuUser size={13} />}
                {tab === "Reviews"  && <LuStar size={13} />}
                {tab === "Chat"     && <LuMessageCircle size={13} />}
                {tab}
              </button>
            ))}
          </div>

          {/* ══════ OVERVIEW ══════ */}
          {activeTab === "Overview" && (
            <div className="rp-panel" key="ov">
              <div className="rp-pad">

                <p className="rp-section-label">Shop Details</p>
                <div className="rp-info-grid">
                  <div className="rp-info-card">
                    <LuWrench size={13} className="rp-info-icon" />
                    <span className="rp-info-lbl">Shop Name</span>
                    <span className="rp-info-val">{FinalProfile.shopDetails.shopName}</span>
                  </div>
                  <div className="rp-info-card">
                    <LuClock size={13} className="rp-info-icon" />
                    <span className="rp-info-lbl">Experience</span>
                    <span className="rp-info-val">{FinalProfile.shopDetails.experience} Years</span>
                  </div>
                  <div className="rp-info-card">
                    <LuShield size={13} className="rp-info-icon" />
                    <span className="rp-info-lbl">Member Since</span>
                    <span className="rp-info-val">
                      {new Date(FinalProfile.joinedAt).toLocaleDateString("en-IN", { year: 'numeric', month: 'long' })}
                    </span>
                  </div>
                  <div className="rp-info-card">
                    <LuMapPin size={13} className="rp-info-icon" />
                    <span className="rp-info-lbl">City / Pincode</span>
                    <span className="rp-info-val">
                      {FinalProfile.shopDetails.city} — {FinalProfile.shopDetails.pincode}
                    </span>
                  </div>
                  <div className="rp-info-card span-full">
                    <LuMapPin size={13} className="rp-info-icon" />
                    <span className="rp-info-lbl">Address</span>
                    <span className="rp-info-val">
                      <a href={openmaps(FinalProfile.shopDetails.address)} target="_blank" rel="noopener noreferrer">
                        {FinalProfile.shopDetails.address} ↗
                      </a>
                    </span>
                  </div>
                  <div className="rp-info-card span-full">
                    <span className="rp-info-lbl">Bio</span>
                    <p className="rp-bio">{FinalProfile.bio}</p>
                  </div>
                </div>

                <div className="rp-divider" />

                <p className="rp-section-label">Skills</p>
                <div className="rp-skills">
                  {FinalProfile.shopDetails.skills.map((s, i) => (
                    <span key={i} className="rp-skill">{s}</span>
                  ))}
                </div>

                <div className="rp-divider" />

                <p className="rp-section-label">Contact</p>
                <div className="rp-contacts">
                  <div className="rp-contact-pill">
                    <FaPhone size={12} /> {FinalProfile.PersonalNo || "N/A"}
                  </div>
                  <div className="rp-contact-pill">
                    <GiShop size={14} /> {FinalProfile.shopDetails.ShopPhoneNo || "N/A"}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ══════ REVIEWS ══════ */}
          {activeTab === "Reviews" && (
            <div className="rp-panel" key="rv">
              <div className="rp-pad">

                <div className="rp-review-form">
                  <p className="rp-section-label" style={{ marginBottom: 10 }}>Leave a review</p>
                  <div className="rp-star-row">
                    {[1, 2, 3, 4, 5].map(n => (
                      <span
                        key={n} className="rp-star"
                        onMouseEnter={() => setStarHover(n)}
                        onMouseLeave={() => setStarHover(0)}
                        onClick={() => setStarSelected(n)}
                        style={{ color: n <= (starHover || starSelected) ? '#fbbf24' : 'rgba(232,232,240,0.15)' }}
                      >★</span>
                    ))}
                  </div>
                  <textarea
                    className="rp-textarea"
                    rows={5}
                    placeholder={`Share your experience with ${FinalProfile.userName}…`}
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                  />
                  <button className="rp-review-submit">Submit Review</button>
                </div>

                <p className="rp-reviews-count">{repairerReviews.length} Reviews</p>
                <div className="rp-reviews-list">
                  {repairerReviews.map(item => (
                    <div key={item.id} className="rp-review-card">
                      <p className="rp-review-text">{item.review}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* ══════ CHAT ══════ */}
          {activeTab === "Chat" && (
            <div className="rp-panel" key="ch" style={{ padding: 0 }}>
              <div className="rp-chat-shell">

                {/* Header */}
                <div className="rp-chat-header">
                  <img src="/Repairer.png" alt="" className="rp-chat-av" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="rp-chat-hname">{FinalProfile.userName}</div>
                    <div className="rp-chat-online">
                      <span className="chat-online-dot" /> Online now
                    </div>
                  </div>
                  <div className="rp-contact-pill" style={{ fontSize: 12, padding: '7px 14px' }}>
                    <FaPhone size={11} /> {FinalProfile.PersonalNo || "N/A"}
                  </div>
                </div>

                {/* Messages */}
                <div className="rp-chat-msgs">
                  {messages.map((msg, i) => (
                    <div key={i} className={`rp-msg ${msg.from}`}>
                      <div className="rp-bubble">{msg.text}</div>
                      <span className="rp-msg-time">{msg.time}</span>
                    </div>
                  ))}
                  <div ref={msgsEndRef} />
                </div>

                {/* Input */}
                <div className="rp-chat-input-row">
                  <textarea
                    className="rp-chat-input"
                    rows={1}
                    placeholder={`Message ${FinalProfile.userName}…`}
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={handleChatKey}
                  />
                  <button
                    className="rp-send-btn"
                    onClick={sendMessage}
                    disabled={!chatInput.trim()}
                  >
                    <LuSend size={17} />
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default RepairerProfile;