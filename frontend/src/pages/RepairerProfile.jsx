import React, { useContext, useEffect, useState, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { GiShop } from "react-icons/gi"
import axios from "axios"
import { RepairContext, backend_url } from "../Context/ALlContext"
import { toast } from "react-hot-toast"
import {
  LuSend, LuStar, LuMapPin, LuShield, LuClock,
  LuMessageCircle, LuUser, LuWrench, LuChevronRight,
  LuBadgeCheck, LuCalendar, LuPhone
} from "react-icons/lu"

const TABS = ["Overview", "Reviews", "Chat"];

const mapRepairerToProfile = (repairer) => {
  const coordinates = Array.isArray(repairer?.location?.coordinates)
    ? repairer.location.coordinates : [];
  const mappedReviews = (Array.isArray(repairer?.reviews) ? repairer.reviews : [])
    .map((item, index) => ({
      id: item?.id || item?._id || `${repairer?._id || "repairer"}-review-${index}`,
      userName: item?.userName || "User",
      rating: Number(item?.rating || 0),
      review: item?.review || "",
      createdAt: item?.createdAt || null,
    }))
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  const computedAverageRating =
    mappedReviews.length > 0
      ? mappedReviews.reduce((sum, item) => sum + Number(item?.rating || 0), 0) / mappedReviews.length
      : 0;
  const incomingRating = Number(repairer?.rating);
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
    rating: Number.isFinite(incomingRating)
      ? incomingRating
      : Number(computedAverageRating.toFixed(1)),
    totalReviews: Number.isFinite(Number(repairer?.totalReviews))
      ? Number(repairer.totalReviews)
      : mappedReviews.length,
    reviews: mappedReviews,
    isVerified: Boolean(repairer?.isPhoneVerified),
    available: repairer?.availability !== false,
    joinedAt: repairer?.createdAt || Date.now(),
  };
};

const RepairerProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const { role } = useContext(RepairContext);
  const [FinalProfile, setFinalProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [reviewText, setReviewText] = useState("");
  const [starHover, setStarHover] = useState(0);
  const [starSelected, setStarSelected] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "repairer", text: "Hey! How can I help you today? 👋", time: "10:00 AM" },
  ]);
  const msgsEndRef = useRef(null);

  useEffect(() => {
    let isActive = true;
    const stateRepairer = location.state?.repairer;
    if (stateRepairer && String(stateRepairer.id) === String(id)) {
      setFinalProfile((prev) => ({
        ...mapRepairerToProfile(stateRepairer),
        reviews: Array.isArray(prev?.reviews) ? prev.reviews : [],
      }));
      setLoadError("");
    }
    const fetchRepairerProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/repairer/public/${id}`, { withCredentials: true });
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
        if (isActive) setLoading(false);
      }
    };
    fetchRepairerProfile();
    return () => { isActive = false; };
  }, [id, location.state]);

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

  const handleSubmitReview = async () => {
    if (role !== "user") {
      toast.error("Only users can submit reviews");
      return;
    }

    const trimmedReview = String(reviewText || "").trim();
    if (!starSelected) {
      toast.error("Please select a rating");
      return;
    }
    if (trimmedReview.length < 3) {
      toast.error("Please write at least 3 characters");
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await axios.post(
        `${backend_url}/api/repairer/public/${id}/reviews`,
        { rating: starSelected, review: trimmedReview },
        { withCredentials: true }
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.msg || "Unable to submit review");
      }

      const updatedRepairer = response?.data?.repairer || {};
      if (updatedRepairer?._id) {
        setFinalProfile(mapRepairerToProfile(updatedRepairer));
      } else {
        setFinalProfile((prev) =>
          prev
            ? {
                ...prev,
                rating: Number(updatedRepairer?.rating || prev.rating || 0),
                totalReviews: Number(updatedRepairer?.totalReviews || prev.totalReviews || 0),
                reviews: Array.isArray(updatedRepairer?.reviews)
                  ? updatedRepairer.reviews.map((item, index) => ({
                    id: item?.id || item?._id || `${prev.id || "repairer"}-review-${index}`,
                    userName: item?.userName || "User",
                    rating: Number(item?.rating || 0),
                    review: item?.review || "",
                    createdAt: item?.createdAt || null,
                  }))
                  : prev.reviews,
              }
            : prev
        );
      }
      setReviewText("");
      setStarSelected(0);
      setStarHover(0);
      toast.success(response?.data?.msg || "Review submitted");
    } catch (error) {
      toast.error(error?.response?.data?.msg || error?.message || "Unable to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2.5px solid #e0e0e5', borderTopColor: '#1d1d1f', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#86868b', letterSpacing: '0.02em' }}>Loading profile…</p>
    </div>
  );

  if (!FinalProfile) return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 600, color: '#1d1d1f' }}>{loadError || "Profile not found"}</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin       { to { transform: rotate(360deg); } }
        @keyframes fadeUp     { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
        @keyframes fadeIn     { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn    { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes msgSlide   { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes dotPulse   { 0%,100%{ transform: scale(1); opacity:1; } 50%{ transform: scale(1.5); opacity:0.6; } }

        :root {
          --bg:       #f5f5f7;
          --white:    #ffffff;
          --black:    #1d1d1f;
          --mid:      #6e6e73;
          --light:    #d2d2d7;
          --lighter:  #e8e8ed;
          --radius-xs: 10px;
          --radius-sm: 16px;
          --radius-md: 22px;
          --radius-lg: 28px;
          --radius-xl: 36px;
          --radius-pill: 100px;
          --shadow-xs: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05);
          --shadow-md: 0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
          --shadow-lg: 0 8px 40px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.05);
        }

        .rp-root {
          font-family: 'Outfit', sans-serif;
          background: var(--bg);
          min-height: 100vh;
          color: var(--black);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* ─── Page wrapper ─── */
        .rp-page {
          width: 100%;
          padding: 24px 16px 80px;
          animation: fadeUp 0.5s ease both;
        }
        @media (min-width: 600px) { .rp-page { padding: 32px 24px 80px; } }
        @media (min-width: 768px) { .rp-page { padding: 40px 40px 80px; } }
        @media (min-width: 1200px) { .rp-page { padding: 40px 60px 80px; } }

        /* ─── Hero card ─── */
        .rp-hero {
          background: var(--white);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          margin-bottom: 16px;
          position: relative;
        }



        /* Hero body */
        .rp-hero-body {
          padding: 24px 20px 24px;
          position: relative;
        }
        @media (min-width: 600px) { .rp-hero-body { padding: 28px 28px 28px; } }

        /* Avatar row */
        .rp-avatar-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .rp-left { display: flex; align-items: center; gap: 14px; min-width: 0; }

        /* Avatar */
        .rp-av-wrap { position: relative; flex-shrink: 0; }
        .rp-avatar {
          width: 80px; height: 80px; border-radius: 50%;
          object-fit: cover; display: block;
          border: 3px solid var(--lighter);
          box-shadow: var(--shadow-md);
          background: var(--lighter);
        }
        @media (min-width: 480px) { .rp-avatar { width: 92px; height: 92px; } }

        .rp-dot {
          position: absolute; bottom: 5px; right: 5px;
          width: 13px; height: 13px; border-radius: 50%;
          border: 2.5px solid var(--white);
        }
        .dot-on  { background: #30d158; }
        .dot-off { background: #ff453a; }

        /* Name block */
        .rp-name { flex: 1; min-width: 0; }
        .rp-name h1 {
          font-size: clamp(20px, 4.5vw, 28px);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--black);
          line-height: 1.1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rp-tagline { font-size: 13px; color: var(--mid); font-weight: 400; margin-top: 4px; }

        /* Status pills */
        .rp-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
        .rp-pill {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 600;
          padding: 4px 11px; border-radius: var(--radius-pill);
          background: var(--lighter);
          color: var(--mid);
          letter-spacing: 0.01em;
        }
        .rp-pill.black { background: var(--black); color: #fff; }
        .rp-pill.outline { background: transparent; border: 1.5px solid var(--light); color: var(--mid); }

        /* Chat CTA */
        .rp-cta {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 11px 20px;
          background: var(--black); color: #fff;
          font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
          border-radius: var(--radius-pill);
          border: none; cursor: pointer;
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
          transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
          white-space: nowrap; flex-shrink: 0;
          letter-spacing: -0.01em;
        }
        .rp-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.22); }
        .rp-cta:active { transform: scale(0.97); }

        /* Stats strip */
        .rp-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          margin-top: 24px;
          background: var(--lighter);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .rp-stat {
          background: var(--bg);
          padding: 16px 12px;
          text-align: center;
        }
        .rp-stat-val {
          font-size: 22px; font-weight: 800; color: var(--black);
          letter-spacing: -0.03em; line-height: 1;
        }
        .rp-stat-lbl {
          font-size: 11px; color: var(--mid); font-weight: 500; margin-top: 4px;
          text-transform: uppercase; letter-spacing: 0.05em;
        }

        /* ─── Tabs ─── */
        .rp-tabs {
          display: flex; gap: 4px;
          background: var(--white);
          border-radius: var(--radius-pill);
          padding: 5px;
          box-shadow: var(--shadow-sm);
          margin-bottom: 14px;
        }
        .rp-tab {
          flex: 1;
          padding: 10px 8px;
          border: none; background: transparent; cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600;
          color: var(--mid);
          border-radius: var(--radius-pill);
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          letter-spacing: -0.01em;
        }
        .rp-tab:hover { color: var(--black); background: var(--lighter); }
        .rp-tab.active {
          background: var(--black); color: #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        /* ─── Panel card ─── */
        .rp-panel {
          background: var(--white);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          animation: scaleIn 0.28s ease both;
        }
        .rp-pad { padding: 24px 20px; }
        @media (min-width: 600px) { .rp-pad { padding: 28px 28px; } }

        /* Section header */
        .rp-sec-label {
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--mid); margin-bottom: 14px;
        }

        /* ─── Info list ─── */
        .rp-info-list { display: flex; flex-direction: column; }
        .rp-info-row {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid var(--lighter);
          transition: background 0.15s;
        }
        .rp-info-row:last-child { border-bottom: none; }
        .rp-info-icon-wrap {
          width: 36px; height: 36px; border-radius: var(--radius-xs);
          background: var(--lighter);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: var(--black);
        }
        .rp-info-content { flex: 1; min-width: 0; }
        .rp-info-lbl { font-size: 11px; color: var(--mid); font-weight: 500; margin-bottom: 2px; }
        .rp-info-val { font-size: 14px; font-weight: 500; color: var(--black); line-height: 1.5; }
        .rp-info-val a { color: var(--black); text-decoration: underline; text-underline-offset: 3px; }
        .rp-info-val a:hover { opacity: 0.6; }
        .rp-info-chevron { color: var(--light); align-self: center; flex-shrink: 0; }

        /* Bio */
        .rp-bio { font-size: 14px; color: var(--mid); line-height: 1.85; font-style: italic; font-family: 'Lora', serif; }

        /* Divider */
        .rp-div { height: 1px; background: var(--lighter); margin: 22px 0; }

        /* ─── Skills ─── */
        .rp-skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .rp-skill {
          padding: 7px 16px; border-radius: var(--radius-pill);
          border: 1.5px solid var(--black);
          background: transparent;
          color: var(--black); font-size: 13px; font-weight: 600;
          font-family: 'Outfit', sans-serif;
          cursor: default;
          transition: background 0.15s, color 0.15s;
          letter-spacing: -0.01em;
        }
        .rp-skill:hover { background: var(--black); color: #fff; }

        /* ─── Contact row ─── */
        .rp-contacts { display: flex; gap: 10px; flex-wrap: wrap; }
        .rp-contact {
          display: flex; align-items: center; gap: 9px;
          padding: 11px 18px;
          background: var(--lighter); border-radius: var(--radius-lg);
          font-size: 14px; font-weight: 500; color: var(--black);
          transition: background 0.15s;
        }
        .rp-contact:hover { background: var(--light); }

        /* ─── Reviews ─── */
        .rp-review-form {
          background: var(--bg);
          border-radius: var(--radius-lg); padding: 20px; margin-bottom: 22px;
        }
        .rp-stars { display: flex; gap: 5px; margin-bottom: 14px; }
        .rp-star {
          font-size: 30px; cursor: pointer;
          transition: transform 0.15s;
          line-height: 1;
          user-select: none;
        }
        .rp-star:hover { transform: scale(1.15); }

        .rp-textarea {
          width: 100%; resize: none;
          background: var(--white);
          border: 1.5px solid var(--lighter);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          color: var(--black);
          font-family: 'Outfit', sans-serif; font-size: 14px;
          outline: none; line-height: 1.6;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .rp-textarea::placeholder { color: var(--light); }
        .rp-textarea:focus { border-color: var(--black); box-shadow: 0 0 0 3px rgba(29,29,31,0.07); }

        .rp-submit {
          margin-top: 12px; width: 100%; padding: 14px;
          background: var(--black); color: #fff;
          font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 600;
          border-radius: var(--radius-lg); border: none; cursor: pointer;
          transition: opacity 0.18s, transform 0.15s;
          letter-spacing: -0.01em;
        }
        .rp-submit:hover { opacity: 0.82; transform: translateY(-1px); }
        .rp-submit:active { transform: scale(0.98); }

        .rp-review-count {
          font-size: 12px; font-weight: 600; color: var(--mid);
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;
        }
        .rp-reviews-list { display: flex; flex-direction: column; gap: 8px; }
        .rp-review-card {
          background: var(--bg); border-radius: var(--radius-lg); padding: 16px 18px;
          transition: background 0.15s;
        }
        .rp-review-card:hover { background: var(--lighter); }
        .rp-review-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 8px;
        }
        .rp-review-user {
          font-size: 13px;
          font-weight: 700;
          color: var(--black);
        }
        .rp-review-rating {
          font-size: 11px;
          font-weight: 700;
          color: var(--black);
          background: #e5e7eb;
          border-radius: 999px;
          padding: 3px 8px;
          white-space: nowrap;
        }
        .rp-review-text { font-size: 14px; color: var(--mid); line-height: 1.75; }
        .rp-review-meta {
          font-size: 11px;
          color: var(--light);
          margin-top: 7px;
        }

        /* ─── Chat ─── */
        .rp-chat-shell {
          display: flex; flex-direction: column;
          height: clamp(480px, calc(100vh - 240px), 680px);
        }

        .rp-chat-head {
          padding: 16px 20px;
          border-bottom: 1px solid var(--lighter);
          display: flex; align-items: center; gap: 12px; flex-shrink: 0;
        }
        @media (min-width: 600px) { .rp-chat-head { padding: 18px 28px; } }

        .rp-chat-av {
          width: 40px; height: 40px; border-radius: 50%;
          object-fit: cover; border: 2px solid var(--lighter);
          flex-shrink: 0; background: var(--lighter);
        }

        .rp-chat-hname {
          font-size: 15px; font-weight: 700; color: var(--black);
          letter-spacing: -0.02em;
        }
        .rp-chat-status {
          display: flex; align-items: center; gap: 5px;
          font-size: 12px; color: #30d158; font-weight: 500;
        }
        .rp-online-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #30d158;
          animation: dotPulse 2s ease infinite;
        }

        .rp-msgs {
          flex: 1; overflow-y: auto;
          padding: 18px 20px;
          display: flex; flex-direction: column; gap: 10px;
          background: var(--bg);
          scrollbar-width: thin; scrollbar-color: var(--light) transparent;
        }
        @media (min-width: 600px) { .rp-msgs { padding: 20px 28px; } }
        .rp-msgs::-webkit-scrollbar { width: 3px; }
        .rp-msgs::-webkit-scrollbar-thumb { background: var(--light); border-radius: 2px; }

        .rp-msg { display: flex; flex-direction: column; max-width: 68%; animation: msgSlide 0.22s ease both; }
        .rp-msg.user     { align-self: flex-end; align-items: flex-end; }
        .rp-msg.repairer { align-self: flex-start; align-items: flex-start; }

        .rp-bubble { padding: 11px 15px; font-size: 14px; line-height: 1.6; border-radius: 22px; }
        .rp-msg.user .rp-bubble {
          background: var(--black); color: #fff; border-bottom-right-radius: 6px;
        }
        .rp-msg.repairer .rp-bubble {
          background: var(--white); color: var(--black); border-bottom-left-radius: 6px;
          box-shadow: var(--shadow-xs);
        }
        .rp-msg-time { font-size: 10px; color: var(--light); margin-top: 5px; padding: 0 4px; }

        .rp-input-row {
          padding: 14px 16px;
          border-top: 1px solid var(--lighter);
          display: flex; gap: 10px; align-items: flex-end; flex-shrink: 0;
          background: var(--white);
        }
        @media (min-width: 600px) { .rp-input-row { padding: 16px 24px; } }

        .rp-chat-input {
          flex: 1; resize: none; max-height: 96px;
          background: var(--bg);
          border: 1.5px solid transparent;
          border-radius: var(--radius-lg); padding: 11px 15px;
          color: var(--black); font-family: 'Outfit', sans-serif; font-size: 14px;
          outline: none; line-height: 1.5;
          transition: border-color 0.18s;
          scrollbar-width: none;
        }
        .rp-chat-input:focus { border-color: var(--black); }
        .rp-chat-input::placeholder { color: var(--light); }
        .rp-chat-input::-webkit-scrollbar { display: none; }

        .rp-send {
          width: 44px; height: 44px; flex-shrink: 0;
          border-radius: 50%;
          background: var(--black); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          box-shadow: 0 3px 10px rgba(0,0,0,0.18);
          transition: transform 0.15s, opacity 0.15s;
        }
        .rp-send:hover { transform: scale(1.07); }
        .rp-send:active { transform: scale(0.94); }
        .rp-send:disabled { opacity: 0.25; cursor: not-allowed; transform: none; }
      `}</style>

      <div className="rp-root">
        <div className="rp-page">

          {/* ─── Hero Card ─── */}
          <div className="rp-hero">
            <div className="rp-hero-body">
              <div className="rp-avatar-row">
                <div className="rp-left">
                  <div className="rp-av-wrap">
                    <img
                      src={FinalProfile.shopDetails.shopImage || "/Repairer.png"}
                      alt="avatar"
                      className="rp-avatar"
                    />
                    <div className={`rp-dot ${FinalProfile.available ? 'dot-on' : 'dot-off'}`} />
                  </div>
                  <div className="rp-name">
                    <h1>{FinalProfile.userName}</h1>
                    <p className="rp-tagline">{FinalProfile.shopDetails.shopName}</p>
                  </div>
                </div>
                <button className="rp-cta" onClick={() => setActiveTab("Chat")}>
                  <LuMessageCircle size={15} /> Chat Now
                </button>
              </div>

              {/* Pills */}
              <div className="rp-pills" style={{ marginTop: 18 }}>
                <span className="rp-pill black">★ {FinalProfile.rating}/5</span>
                {FinalProfile.isVerified
                  ? <span className="rp-pill black"><LuBadgeCheck size={11}/> Verified</span>
                  : <span className="rp-pill outline"><LuShield size={11}/> Unverified</span>}
                <span className="rp-pill">{FinalProfile.available ? '● Available' : '○ Unavailable'}</span>
              </div>

              {/* Stats strip */}
              <div className="rp-stats">
                <div className="rp-stat">
                  <div className="rp-stat-val">{FinalProfile.rating}</div>
                  <div className="rp-stat-lbl">Rating</div>
                </div>
                <div className="rp-stat">
                  <div className="rp-stat-val">{FinalProfile.shopDetails.experience}y</div>
                  <div className="rp-stat-lbl">Experience</div>
                </div>
                <div className="rp-stat">
                  <div className="rp-stat-val">{FinalProfile.totalReviews}</div>
                  <div className="rp-stat-lbl">Reviews</div>
                </div>
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

          {/* ══ OVERVIEW ══ */}
          {activeTab === "Overview" && (
            <div className="rp-panel" key="ov">
              <div className="rp-pad">

                <p className="rp-sec-label">About</p>
                <p className="rp-bio">{FinalProfile.bio}</p>

                <div className="rp-div" />

                <p className="rp-sec-label">Details</p>
                <div className="rp-info-list">
                  <div className="rp-info-row">
                    <div className="rp-info-icon-wrap"><LuWrench size={15} /></div>
                    <div className="rp-info-content">
                      <div className="rp-info-lbl">Shop Name</div>
                      <div className="rp-info-val">{FinalProfile.shopDetails.shopName}</div>
                    </div>
                    <LuChevronRight size={16} className="rp-info-chevron" />
                  </div>
                  <div className="rp-info-row">
                    <div className="rp-info-icon-wrap"><LuClock size={15} /></div>
                    <div className="rp-info-content">
                      <div className="rp-info-lbl">Experience</div>
                      <div className="rp-info-val">{FinalProfile.shopDetails.experience} Years</div>
                    </div>
                    <LuChevronRight size={16} className="rp-info-chevron" />
                  </div>
                  <div className="rp-info-row">
                    <div className="rp-info-icon-wrap"><LuCalendar size={15} /></div>
                    <div className="rp-info-content">
                      <div className="rp-info-lbl">Member Since</div>
                      <div className="rp-info-val">
                        {new Date(FinalProfile.joinedAt).toLocaleDateString("en-IN", { year: 'numeric', month: 'long' })}
                      </div>
                    </div>
                    <LuChevronRight size={16} className="rp-info-chevron" />
                  </div>
                  <div className="rp-info-row">
                    <div className="rp-info-icon-wrap"><LuMapPin size={15} /></div>
                    <div className="rp-info-content">
                      <div className="rp-info-lbl">City / Pincode</div>
                      <div className="rp-info-val">{FinalProfile.shopDetails.city} — {FinalProfile.shopDetails.pincode}</div>
                    </div>
                    <LuChevronRight size={16} className="rp-info-chevron" />
                  </div>
                  <div className="rp-info-row">
                    <div className="rp-info-icon-wrap"><LuMapPin size={15} /></div>
                    <div className="rp-info-content">
                      <div className="rp-info-lbl">Address</div>
                      <div className="rp-info-val">
                        <a href={openmaps(FinalProfile.shopDetails.address)} target="_blank" rel="noopener noreferrer">
                          {FinalProfile.shopDetails.address} ↗
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rp-div" />
                <p className="rp-sec-label">Skills</p>
                <div className="rp-skills">
                  {FinalProfile.shopDetails.skills.map((s, i) => (
                    <span key={i} className="rp-skill">{s}</span>
                  ))}
                </div>

                <div className="rp-div" />
                <p className="rp-sec-label">Contact</p>
                <div className="rp-contacts">
                  <div className="rp-contact">
                    <LuPhone size={14} /> {FinalProfile.PersonalNo || "N/A"}
                  </div>
                  <div className="rp-contact">
                    <GiShop size={15} /> {FinalProfile.shopDetails.ShopPhoneNo || "N/A"}
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
                  <p className="rp-sec-label" style={{ marginBottom: 12 }}>Write a Review</p>
                  <div className="rp-stars">
                    {[1,2,3,4,5].map(n => (
                      <span
                        key={n} className="rp-star"
                        onMouseEnter={() => setStarHover(n)}
                        onMouseLeave={() => setStarHover(0)}
                        onClick={() => setStarSelected(n)}
                        style={{ color: n <= (starHover || starSelected) ? '#1d1d1f' : '#d2d2d7' }}
                      >★</span>
                    ))}
                  </div>
                  <textarea
                    className="rp-textarea" rows={4}
                    placeholder={`Share your experience with ${FinalProfile.userName}…`}
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                  />
                  <button
                    className="rp-submit"
                    type="button"
                    onClick={handleSubmitReview}
                    disabled={submittingReview || role !== "user"}
                  >
                    {submittingReview
                      ? "Submitting..."
                      : role === "user"
                        ? "Submit Review"
                        : "Only users can review"}
                  </button>
                </div>

                <p className="rp-review-count">{FinalProfile.totalReviews || 0} Reviews</p>
                <div className="rp-reviews-list">
                  {Array.isArray(FinalProfile.reviews) && FinalProfile.reviews.length > 0 ? (
                    FinalProfile.reviews.map((item) => (
                      <div key={item.id} className="rp-review-card">
                        <div className="rp-review-head">
                          <p className="rp-review-user">{item.userName || "User"}</p>
                          <span className="rp-review-rating">★ {Number(item.rating || 0).toFixed(1)}</span>
                        </div>
                        <p className="rp-review-text">{item.review}</p>
                        {item.createdAt && (
                          <p className="rp-review-meta">
                            {new Date(item.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="rp-review-card">
                      <p className="rp-review-text">No reviews yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ══ CHAT ══ */}
          {activeTab === "Chat" && (
            <div className="rp-panel" key="ch" style={{ padding: 0 }}>
              <div className="rp-chat-shell">
                <div className="rp-chat-head">
                  <img src={FinalProfile.shopDetails.shopImage || "/Repairer.png"} alt="" className="rp-chat-av" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="rp-chat-hname">{FinalProfile.userName}</div>
                    <div className="rp-chat-status"><span className="rp-online-dot" /> Online now</div>
                  </div>
                  <div className="rp-contact" style={{ fontSize: 13, padding: '8px 14px' }}>
                    <LuPhone size={12} /> {FinalProfile.PersonalNo || "N/A"}
                  </div>
                </div>

                <div className="rp-msgs">
                  {messages.map((msg, i) => (
                    <div key={i} className={`rp-msg ${msg.from}`}>
                      <div className="rp-bubble">{msg.text}</div>
                      <span className="rp-msg-time">{msg.time}</span>
                    </div>
                  ))}
                  <div ref={msgsEndRef} />
                </div>

                <div className="rp-input-row">
                  <textarea
                    className="rp-chat-input" rows={1}
                    placeholder={`Message ${FinalProfile.userName}…`}
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={handleChatKey}
                  />
                  <button className="rp-send" onClick={sendMessage} disabled={!chatInput.trim()}>
                    <LuSend size={16} />
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
