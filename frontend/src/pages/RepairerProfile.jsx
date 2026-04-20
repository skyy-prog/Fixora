import React, { useEffect, useState, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { FaPhone } from "react-icons/fa6"
import { repairerReviews } from '../assets/assets'
import { GiShop } from "react-icons/gi"
import axios from "axios"
import { backend_url } from "../Context/ALlContext"
import {
  LuSend, LuStar, LuMapPin, LuShield, LuClock,
  LuMessageCircle, LuUser, LuWrench
} from "react-icons/lu"

const TABS = ["Overview", "Reviews", "Chat"];

const mapRepairerToProfile = (repairer) => {
  const coordinates = Array.isArray(repairer?.location?.coordinates)
    ? repairer.location.coordinates
    : [];

  return {
    id: repairer?._id,
    userName: repairer?.username || "Repairer",
    bio: repairer?.bio || `${repairer?.username || "Repairer"} is available for repair work.`,
    PersonalNo: repairer?.personalPhone || "",
    shopDetails: {
      shopName: repairer?.shopName || "Repair Shop",
      experience: Number(repairer?.experience || 0),
      skills: Array.isArray(repairer?.skills) ? repairer.skills : [],
      address: repairer?.address || "",
      city: repairer?.city || "",
      ShopPhoneNo: repairer?.shopPhone || "",
      shopImage: repairer?.shopImage || "",
      pincode: repairer?.pincode || "",
      location: {
        lat: coordinates.length > 1 ? coordinates[1] : null,
        lng: coordinates.length > 0 ? coordinates[0] : null,
      },
    },
    rating: Number(repairer?.rating || 0),
    totalReviews: Number(repairer?.totalReviews || 0),
    isVerified: Boolean(repairer?.isPhoneVerified),
    available: repairer?.availability !== false,
    joinedAt: repairer?.createdAt || Date.now(),
  };
};

const RepairerProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const [FinalProfile, setFinalProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
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
    let isActive = true;

    const stateRepairer = location.state?.repairer;
    if (stateRepairer && String(stateRepairer.id) === String(id)) {
      setFinalProfile(stateRepairer);
      setLoadError("");
      setLoading(false);
      return () => {
        isActive = false;
      };
    }

    const fetchRepairerProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/repairer/public/${id}`, {
          withCredentials: true,
        });

        if (!isActive) return;

        if (response.data?.success && response.data?.repairer) {
          setFinalProfile(mapRepairerToProfile(response.data.repairer));
          setLoadError("");
          return;
        }

        setFinalProfile(null);
        setLoadError(response.data?.msg || "Repairer profile not found");
      } catch (error) {
        if (!isActive) return;
        setFinalProfile(null);
        setLoadError(error?.response?.data?.msg || "Unable to load repairer profile");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchRepairerProfile();

    return () => {
      isActive = false;
    };
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

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#e8eaf0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #d0d4de', borderTopColor: '#111', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!FinalProfile) return (
    <div style={{ minHeight: '100vh', background: '#e8eaf0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 600 }}>
      {loadError || "Repairer profile not found"}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes page-in  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes panel-in { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: none; } }
        @keyframes msg-in   { from { opacity: 0; transform: translateY(5px);  } to { opacity: 1; transform: none; } }
        @keyframes avail-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0.5);} 60%{box-shadow:0 0 0 6px rgba(22,163,74,0);} }

        /* ─── Design tokens ───
           Base bg:   #e8eaf0
           Light shd: #ffffff
           Dark shd:  #c8cad4
           Accent:    #1d4ed8 (blue)
           Text:      #111
        */

        .rp-root {
          font-family: 'DM Sans', sans-serif;
          background: #e8eaf0;
          min-height: 100vh;
          color: #111;
          width: 100%;
          overflow-x: hidden;
        }

        .rp-page {
          width: 100%;
          padding-bottom: 80px;
          animation: page-in 0.5s ease both;
          overflow-x: hidden;
        }

        /* Side padding for everything below hero */
        .rp-inner {
          padding: 0 12px;
        }
        @media (min-width: 480px)  { .rp-inner { padding: 0 16px; } }
        @media (min-width: 640px)  { .rp-inner { padding: 0 24px; } }
        @media (min-width: 768px)  { .rp-inner { padding: 0 32px; } }
        @media (min-width: 1024px) { .rp-inner { padding: 0 48px; } }

        /* ── Neu helper mixins as classes ──
           Raised:  convex, pops out
           Inset:   concave, pushed in
        */
        .neu-raised {
          background: #e8eaf0;
          box-shadow: 6px 6px 14px #c5c7d0, -6px -6px 14px #ffffff;
        }
        .neu-inset {
          background: #e8eaf0;
          box-shadow: inset 4px 4px 10px #c5c7d0, inset -4px -4px 10px #ffffff;
        }
        .neu-card {
          background: #e8eaf0;
          box-shadow: 8px 8px 18px #c5c7d0, -8px -8px 18px #ffffff;
          border-radius: 20px;
        }
        @media (min-width: 640px) { .neu-card { border-radius: 24px; } }

        /* ── Hero banner ── */
        .rp-hero {
          width: 100%;
          margin-bottom: 0;
          overflow: visible;
          position: relative;
        }

        .rp-banner {
          width: 100%;
          height: 130px;
          background: #111;
          position: relative; overflow: hidden;
        }
        @media (min-width: 480px) { .rp-banner { height: 150px; } }
        @media (min-width: 640px) { .rp-banner { height: 170px; } }
        /* Diagonal pattern */
        .rp-banner::before {
          content: ''; position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px,
            transparent 1px, transparent 22px
          );
        }
        /* Blue glow */
        .rp-banner::after {
          content: ''; position: absolute;
          top: -60px; right: -60px;
          width: 260px; height: 260px; border-radius: 50%;
          background: radial-gradient(circle, rgba(37,99,235,0.40) 0%, transparent 70%);
        }

        /* Hero body — sits on the neumorphic background */
        .rp-hero-body {
          background: #e8eaf0;
          padding: 0 14px 24px;
          position: relative;
        }
        @media (min-width: 480px) { .rp-hero-body { padding: 0 18px 26px; } }
        @media (min-width: 640px) { .rp-hero-body { padding: 0 28px 28px; } }
        @media (min-width: 768px) { .rp-hero-body { padding: 0 36px 30px; } }

        /* Avatar row */
        .rp-avatar-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: -44px; /* pulls avatar up to overlap banner */
        }
        @media (min-width: 480px) { .rp-avatar-row { margin-top: -50px; } }
        @media (min-width: 640px) { .rp-avatar-row { margin-top: -56px; } }

        .rp-left { display: flex; align-items: flex-end; gap: 14px; flex: 1; min-width: 0; }

        .rp-avatar-wrap { position: relative; flex-shrink: 0; }
        .rp-avatar {
          width: 72px; height: 72px; border-radius: 50%; object-fit: cover;
          /* Neumorphic ring */
          box-shadow: 4px 4px 10px #c5c7d0, -4px -4px 10px #ffffff, 0 0 0 4px #e8eaf0;
          background: #d0d4de; display: block;
        }
        @media (min-width: 480px) { .rp-avatar { width: 84px; height: 84px; } }
        @media (min-width: 640px) { .rp-avatar { width: 96px; height: 96px; } }

        .rp-avail-dot {
          position: absolute; bottom: 4px; right: 4px;
          width: 14px; height: 14px; border-radius: 50%;
          border: 3px solid #e8eaf0;
        }
        .dot-yes { background: #16a34a; animation: avail-pulse 2s infinite; }
        .dot-no  { background: #dc2626; }

        /* Name + gap from banner */
        .rp-name { flex: 1; min-width: 0; }
        .rp-name h1 {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(18px, 4vw, 28px); color: #111;
          letter-spacing: -0.03em; line-height: 1.1;
          /* gap between name and banner bottom */
          margin-top: 14px;
        }
        @media (min-width: 640px) { .rp-name h1 { margin-top: 18px; } }

        .rp-pills {
          display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 7px;
        }
        .pill {
          font-size: 11px; font-weight: 600; padding: 4px 11px;
          border-radius: 100px; display: flex; align-items: center; gap: 4px;
          /* Neu pill — raised */
          box-shadow: 2px 2px 5px #c5c7d0, -2px -2px 5px #ffffff;
          background: #e8eaf0;
        }
        .pill-rating  { color: #92400e; }
        .pill-ver-yes { color: #166534; }
        .pill-ver-no  { color: #991b1b; }
        .pill-avail-yes { color: #166534; }
        .pill-avail-no  { color: #991b1b; }

        /* Chat CTA */
        .rp-chat-cta {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 18px; background: #111; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          border-radius: 14px; border: none; cursor: pointer; flex-shrink: 0;
          box-shadow: 4px 4px 10px #c5c7d0, -2px -2px 6px #ffffff;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .rp-chat-cta:hover {
          background: #1d4ed8;
          box-shadow: 6px 6px 14px #c5c7d0, -3px -3px 8px #ffffff;
          transform: translateY(-1px);
        }
        .rp-chat-cta:active {
          transform: scale(0.97);
          box-shadow: inset 2px 2px 6px rgba(0,0,0,0.2), inset -1px -1px 3px rgba(255,255,255,0.1);
        }

        /* ── Tabs ── */
        .rp-tabs {
          display: flex; gap: 6px;
          margin-top: 20px; margin-bottom: 16px;
          /* Inset track */
          box-shadow: inset 4px 4px 10px #c5c7d0, inset -4px -4px 10px #ffffff;
          background: #e8eaf0;
          border-radius: 16px; padding: 5px;
          width: 100%;
        }
        .rp-tab {
          flex: 1; padding: 10px 6px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          border-radius: 12px; border: none; cursor: pointer;
          background: transparent; color: #8a8d9a;
          transition: all 0.22s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .rp-tab:hover { color: #111; }
        .rp-tab.active {
          background: #111; color: #fff;
          /* Raised button on inset track */
          box-shadow: 3px 3px 8px rgba(0,0,0,0.25), -1px -1px 4px rgba(255,255,255,0.08);
        }

        /* ── Panel ── */
        .rp-panel {
          width: 100%;
          background: #e8eaf0;
          box-shadow: 8px 8px 20px #c5c7d0, -8px -8px 20px #ffffff;
          border-radius: 20px; overflow: hidden;
          animation: panel-in 0.3s ease both;
        }
        @media (min-width: 640px) { .rp-panel { border-radius: 24px; } }
        .rp-pad { padding: 20px 16px; }
        @media (min-width: 480px) { .rp-pad { padding: 22px 20px; } }
        @media (min-width: 640px) { .rp-pad { padding: 26px 26px; } }
        @media (min-width: 768px) { .rp-pad { padding: 30px 32px; } }

        .rp-section-label {
          font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: #9a9daa; margin-bottom: 14px;
        }

        /* ── Info grid ── */
        .rp-info-grid {
          display: grid; grid-template-columns: 1fr; gap: 10px;
        }
        @media (min-width: 500px) { .rp-info-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 860px) { .rp-info-grid { grid-template-columns: 1fr 1fr 1fr; } }

        .rp-info-card {
          background: #e8eaf0;
          /* Inset — looks pressed into surface */
          box-shadow: inset 3px 3px 8px #c5c7d0, inset -3px -3px 8px #ffffff;
          border-radius: 14px; padding: 14px 16px;
          display: flex; flex-direction: column; gap: 5px;
          transition: box-shadow 0.22s;
        }
        .rp-info-card:hover {
          box-shadow: inset 4px 4px 10px #bbbdca, inset -4px -4px 10px #ffffff;
        }
        .rp-info-card.span-full { grid-column: 1 / -1; }
        .rp-info-icon { color: #9a9daa; margin-bottom: 2px; }
        .rp-info-lbl {
          font-size: 9px; font-weight: 700; letter-spacing: 0.9px;
          text-transform: uppercase; color: #9a9daa;
        }
        .rp-info-val { font-size: 14px; font-weight: 500; color: #111; line-height: 1.5; }
        .rp-info-val a { color: #1d4ed8; text-decoration: none; }
        .rp-info-val a:hover { text-decoration: underline; }

        .rp-divider { height: 1px; background: #d4d6e0; margin: 22px 0; }
        .rp-bio { font-size: 13px; color: #52525b; line-height: 1.8; }

        /* ── Skills ── */
        .rp-skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .rp-skill {
          padding: 6px 14px; border-radius: 100px;
          background: #e8eaf0;
          box-shadow: 3px 3px 7px #c5c7d0, -3px -3px 7px #ffffff;
          color: #1d4ed8; font-size: 12px; font-weight: 600;
          transition: box-shadow 0.18s;
        }
        .rp-skill:hover {
          box-shadow: 4px 4px 10px #c5c7d0, -4px -4px 10px #ffffff;
        }

        /* ── Contacts ── */
        .rp-contacts { display: flex; gap: 10px; flex-wrap: wrap; }
        .rp-contact-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 16px;
          background: #e8eaf0;
          box-shadow: 3px 3px 7px #c5c7d0, -3px -3px 7px #ffffff;
          border-radius: 12px; color: #3f3f46; font-size: 13px; font-weight: 500;
          transition: box-shadow 0.18s;
        }
        .rp-contact-pill:hover {
          box-shadow: 5px 5px 12px #c5c7d0, -5px -5px 12px #ffffff;
        }

        /* ── Reviews ── */
        .rp-review-form {
          background: #e8eaf0;
          box-shadow: inset 3px 3px 8px #c5c7d0, inset -3px -3px 8px #ffffff;
          border-radius: 16px; padding: 18px; margin-bottom: 18px;
        }
        .rp-star-row { display: flex; gap: 6px; margin-bottom: 12px; }
        .rp-star { font-size: 26px; cursor: pointer; transition: transform 0.15s; line-height: 1; }
        .rp-star:hover { transform: scale(1.18); }

        .rp-textarea {
          width: 100%; resize: none;
          background: #e8eaf0;
          box-shadow: inset 3px 3px 8px #c5c7d0, inset -3px -3px 8px #ffffff;
          border: none;
          border-radius: 12px; padding: 13px 15px;
          color: #111; font-family: 'DM Sans', sans-serif; font-size: 13px;
          outline: none; line-height: 1.65;
          transition: box-shadow 0.18s;
        }
        .rp-textarea::placeholder { color: #9a9daa; }
        .rp-textarea:focus {
          box-shadow: inset 4px 4px 12px #bbbdca, inset -4px -4px 12px #ffffff;
        }

        .rp-review-submit {
          margin-top: 12px; width: 100%; padding: 13px;
          background: #111; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          border-radius: 12px; border: none; cursor: pointer;
          box-shadow: 4px 4px 10px #c5c7d0, -2px -2px 6px #ffffff;
          transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
        }
        .rp-review-submit:hover {
          background: #1d4ed8;
          box-shadow: 6px 6px 14px #c5c7d0, -3px -3px 8px #ffffff;
          transform: translateY(-1px);
        }
        .rp-review-submit:active { transform: scale(0.98); }

        .rp-reviews-count {
          font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
          color: #9a9daa; margin-bottom: 12px; text-transform: uppercase;
        }
        .rp-reviews-list { display: flex; flex-direction: column; gap: 9px; }
        .rp-review-card {
          background: #e8eaf0;
          box-shadow: inset 3px 3px 7px #c5c7d0, inset -3px -3px 7px #ffffff;
          border-radius: 14px; padding: 14px 16px;
          transition: box-shadow 0.18s;
        }
        .rp-review-card:hover {
          box-shadow: inset 4px 4px 10px #bbbdca, inset -4px -4px 10px #ffffff;
        }
        .rp-review-text { font-size: 13px; color: #52525b; line-height: 1.75; }

        /* ── Chat ── */
        .rp-chat-shell {
          display: flex; flex-direction: column;
          height: calc(100vh - 220px); min-height: 460px;
        }
        @media (min-width: 480px) { .rp-chat-shell { height: calc(100vh - 200px); min-height: 480px; } }
        @media (min-width: 640px) { .rp-chat-shell { height: calc(100vh - 180px); } }

        .rp-chat-header {
          padding: 14px 20px;
          border-bottom: 1px solid #d4d6e0;
          display: flex; align-items: center; gap: 12px; flex-shrink: 0;
          background: #e8eaf0;
        }
        @media (min-width: 640px) { .rp-chat-header { padding: 16px 28px; } }

        .rp-chat-av {
          width: 38px; height: 38px; border-radius: 50%; object-fit: cover;
          box-shadow: 2px 2px 6px #c5c7d0, -2px -2px 6px #ffffff;
          flex-shrink: 0;
        }
        .rp-chat-hname {
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #111;
        }
        .rp-chat-online {
          display: flex; align-items: center; gap: 5px; margin-top: 2px;
          font-size: 11px; color: #16a34a; font-weight: 500;
        }
        .chat-online-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #16a34a;
          animation: avail-pulse 2s infinite;
        }

        .rp-chat-msgs {
          flex: 1; overflow-y: auto;
          padding: 18px;
          display: flex; flex-direction: column; gap: 10px;
          background: #e8eaf0;
          scrollbar-width: thin; scrollbar-color: #c5c7d0 transparent;
        }
        @media (min-width: 640px) { .rp-chat-msgs { padding: 22px 28px; gap: 12px; } }
        .rp-chat-msgs::-webkit-scrollbar { width: 4px; }
        .rp-chat-msgs::-webkit-scrollbar-thumb { background: #c5c7d0; border-radius: 2px; }

        .rp-msg { display: flex; flex-direction: column; max-width: 72%; animation: msg-in 0.22s ease both; }
        .rp-msg.user     { align-self: flex-end; align-items: flex-end; }
        .rp-msg.repairer { align-self: flex-start; align-items: flex-start; }

        .rp-bubble { padding: 10px 14px; font-size: 13px; line-height: 1.6; border-radius: 18px; }
        .rp-msg.user .rp-bubble {
          background: #111; color: #fff; font-weight: 500; border-bottom-right-radius: 4px;
          box-shadow: 3px 3px 8px #c5c7d0;
        }
        .rp-msg.repairer .rp-bubble {
          background: #e8eaf0; color: #3f3f46; border-bottom-left-radius: 4px;
          box-shadow: 3px 3px 8px #c5c7d0, -3px -3px 8px #ffffff;
        }
        .rp-msg-time { font-size: 10px; color: #9a9daa; margin-top: 4px; padding: 0 4px; }

        .rp-chat-input-row {
          padding: 14px 16px;
          border-top: 1px solid #d4d6e0;
          display: flex; gap: 10px; align-items: flex-end; flex-shrink: 0;
          background: #e8eaf0;
        }
        @media (min-width: 640px) { .rp-chat-input-row { padding: 16px 24px; } }

        .rp-chat-input {
          flex: 1; resize: none; max-height: 96px;
          background: #e8eaf0;
          box-shadow: inset 3px 3px 8px #c5c7d0, inset -3px -3px 8px #ffffff;
          border: none;
          border-radius: 14px; padding: 11px 15px;
          color: #111; font-family: 'DM Sans', sans-serif; font-size: 14px;
          outline: none; line-height: 1.5;
          transition: box-shadow 0.18s;
          scrollbar-width: none;
        }
        .rp-chat-input:focus {
          box-shadow: inset 4px 4px 12px #bbbdca, inset -4px -4px 12px #ffffff;
        }
        .rp-chat-input::placeholder { color: #9a9daa; }
        .rp-chat-input::-webkit-scrollbar { display: none; }

        .rp-send-btn {
          width: 44px; height: 44px; flex-shrink: 0; border-radius: 14px;
          background: #111; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          box-shadow: 4px 4px 10px #c5c7d0, -2px -2px 6px #ffffff;
          transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
        }
        .rp-send-btn:hover {
          background: #1d4ed8;
          box-shadow: 5px 5px 12px #c5c7d0, -3px -3px 8px #ffffff;
          transform: translateY(-1px);
        }
        .rp-send-btn:active {
          transform: scale(0.94);
          box-shadow: inset 2px 2px 6px rgba(0,0,0,0.3);
        }
        .rp-send-btn:disabled {
          background: #d0d2dc; color: #9a9daa; cursor: not-allowed;
          transform: none;
          box-shadow: 2px 2px 5px #c5c7d0, -2px -2px 5px #ffffff;
        }
      `}</style>

      <div className="rp-root">
        <div className="rp-page">

          {/* ─── Hero ─── */}
          <div className="rp-hero">
            {/* Full-bleed black banner */}
            <div className="rp-banner" />

            {/* Neumorphic body — sits below banner, avatar overlaps seam */}
            <div className="rp-hero-body">
              <div className="rp-avatar-row">

                <div className="rp-left">
                  <div className="rp-avatar-wrap">
                    <img
                      src={FinalProfile.shopDetails.shopImage || "/Repairer.png"}
                      alt="Repairer"
                      className="rp-avatar"
                    />
                    <div className={`rp-avail-dot ${FinalProfile.available ? 'dot-yes' : 'dot-no'}`} />
                  </div>
                  <div className="rp-name">
                    <h1>{FinalProfile.userName}</h1>
                    <div className="rp-pills">
                      <span className="pill pill-rating">★ {FinalProfile.rating}/5</span>
                      <span className={`pill ${FinalProfile.isVerified ? 'pill-ver-yes' : 'pill-ver-no'}`}>
                        <LuShield size={10} />
                        {FinalProfile.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                      <span className={`pill ${FinalProfile.available ? 'pill-avail-yes' : 'pill-avail-no'}`}>
                        {FinalProfile.available ? '● Available' : '● Unavailable'}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="rp-chat-cta" onClick={() => setActiveTab("Chat")}>
                  <LuMessageCircle size={14} /> Chat Now
                </button>

              </div>
            </div>
          </div>

          {/* ─── Tabs + Panels ─── */}
          <div className="rp-inner">

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

            {/* ══ OVERVIEW ══ */}
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
                      <span className="rp-info-val">{FinalProfile.shopDetails.city} — {FinalProfile.shopDetails.pincode}</span>
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

            {/* ══ REVIEWS ══ */}
            {activeTab === "Reviews" && (
              <div className="rp-panel" key="rv">
                <div className="rp-pad">
                  <div className="rp-review-form">
                    <p className="rp-section-label" style={{ marginBottom: 10 }}>Leave a review</p>
                    <div className="rp-star-row">
                      {[1,2,3,4,5].map(n => (
                        <span
                          key={n} className="rp-star"
                          onMouseEnter={() => setStarHover(n)}
                          onMouseLeave={() => setStarHover(0)}
                          onClick={() => setStarSelected(n)}
                          style={{ color: n <= (starHover || starSelected) ? '#f59e0b' : '#c5c7d0' }}
                        >★</span>
                      ))}
                    </div>
                    <textarea
                      className="rp-textarea" rows={5}
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

            {/* ══ CHAT ══ */}
            {activeTab === "Chat" && (
              <div className="rp-panel" key="ch" style={{ padding: 0 }}>
                <div className="rp-chat-shell">
                  <div className="rp-chat-header">
                    <img
                      src={FinalProfile.shopDetails.shopImage || "/Repairer.png"}
                      alt=""
                      className="rp-chat-av"
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="rp-chat-hname">{FinalProfile.userName}</div>
                      <div className="rp-chat-online">
                        <span className="chat-online-dot" /> Online now
                      </div>
                    </div>
                    <div className="rp-contact-pill" style={{ fontSize: 12, padding: '6px 13px' }}>
                      <FaPhone size={11} /> {FinalProfile.PersonalNo || "N/A"}
                    </div>
                  </div>

                  <div className="rp-chat-msgs">
                    {messages.map((msg, i) => (
                      <div key={i} className={`rp-msg ${msg.from}`}>
                        <div className="rp-bubble">{msg.text}</div>
                        <span className="rp-msg-time">{msg.time}</span>
                      </div>
                    ))}
                    <div ref={msgsEndRef} />
                  </div>

                  <div className="rp-chat-input-row">
                    <textarea
                      className="rp-chat-input" rows={1}
                      placeholder={`Message ${FinalProfile.userName}…`}
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={handleChatKey}
                    />
                    <button className="rp-send-btn" onClick={sendMessage} disabled={!chatInput.trim()}>
                      <LuSend size={17} />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>{/* end rp-inner */}
        </div>
      </div>
    </>
  );
};

export default RepairerProfile;


// VA84ddc19eb9d9536a52d277003a75d92a
