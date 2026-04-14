import React, { useContext, useEffect, useRef, useState } from 'react';
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineInboxIn } from "react-icons/hi";
import { CiCirclePlus } from "react-icons/ci";
import { LuLogOut, LuX, LuWrench, LuShield, LuBanknote, LuMapPin, LuMonitor, LuTrash2, LuChevronDown } from "react-icons/lu";
import { RepairContext } from '../Context/ALlContext';
import { Link } from 'react-router-dom';
import { backend_url } from '../Context/ALlContext';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const [listOfProblems, setListOfProblems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const logoutRef = useRef(null);
  const { repairRequestss = [], user } = useContext(RepairContext);

  useEffect(() => {
    setListOfProblems(repairRequestss || []);
    setTimeout(() => setIsVisible(true), 80);
  }, [repairRequestss]);

  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setModalVisible(true), 10);
    } else {
      document.body.style.overflow = '';
      setModalVisible(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedCard]);

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedCard(null), 260);
  };

  useEffect(() => {
    const handler = (e) => {
      if (logoutRef.current && !logoutRef.current.contains(e.target)) {
        setLogoutOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handletoglout = async () => {
    try {
      const Data = await fetch(backend_url + "/api/user/logout", {
        method: "POST",
        credentials: "include"
      });
      const res = await Data.json();
      if (res.success) {
        toast.success(res.msg);
        window.location.href = "/";
      }
    } catch (error) {
      console.log("error while logout");
    }
  };

  const statusStyles = {
    Pending:       'bg-amber-50 text-amber-700 border border-amber-200',
    'In Progress': 'bg-blue-50 text-blue-700 border border-blue-200',
    Completed:     'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Cancelled:     'bg-rose-50 text-rose-600 border border-rose-200',
    Open:          'bg-sky-50 text-sky-700 border border-sky-200',
  };

  const urgencyStyles = {
    High:   'text-rose-500 bg-rose-50 border border-rose-100',
    Medium: 'text-amber-600 bg-amber-50 border border-amber-100',
    Low:    'text-emerald-600 bg-emerald-50 border border-emerald-100',
  };

  const urgencyDot = {
    High:   'bg-rose-400',
    Medium: 'bg-amber-400',
    Low:    'bg-emerald-400',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .profile-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f7f5f2;
          background-image:
            radial-gradient(ellipse at 20% 10%, rgba(255,220,160,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 90%, rgba(180,210,255,0.14) 0%, transparent 55%);
          padding: 14px 12px 60px;
          // width: 100vw;
        }
        @media (min-width: 480px)  { .profile-root { padding: 20px 16px 70px; } }
        @media (min-width: 640px)  { .profile-root { padding: 26px 20px 80px; } }
        @media (min-width: 1024px) { .profile-root { padding: 36px 32px 80px; } }
        @media (min-width: 1280px) { .profile-root { padding: 40px 0 80px; } }

        .profile-inner {
          width: 100%; margin: 0 auto; padding: 15px 12px;
          display: flex; flex-direction: column; gap: 14px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        @media (min-width: 480px) { .profile-inner { gap: 18px; } }
        @media (min-width: 640px) { .profile-inner { gap: 22px; } }
        .profile-inner.visible { opacity: 1; transform: translateY(0); }

        /* ── Hero ── */
        .hero-card {
          background: #fff; border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          padding: 16px; position: relative; overflow: visible;
        }
        @media (min-width: 480px) { .hero-card { padding: 20px; border-radius: 20px; } }
        @media (min-width: 640px) { .hero-card { padding: 22px 24px; border-radius: 22px; } }
        @media (min-width: 768px) { .hero-card { padding: 26px 28px; border-radius: 24px; } }

        .hero-inner {
          display: flex; flex-direction: column; gap: 14px;
        }
        @media (min-width: 640px) {
          .hero-inner { flex-direction: row; align-items: center; flex-wrap: wrap; gap: 16px; }
        }

        .hero-top-row {
          display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;
        }

        .avatar-wrap { position: relative; flex-shrink: 0; }
        .avatar-img {
          width: 50px; height: 50px; border-radius: 50%; object-fit: cover;
          border: 3px solid #f0ece6; box-shadow: 0 4px 10px rgba(0,0,0,0.10);
          display: block;
        }
        @media (min-width: 480px) { .avatar-img { width: 58px; height: 58px; } }
        @media (min-width: 640px) { .avatar-img { width: 64px; height: 64px; } }
        @media (min-width: 768px) { .avatar-img { width: 72px; height: 72px; } }
        .avatar-dot {
          position: absolute; bottom: 2px; right: 2px;
          width: 11px; height: 11px; background: #22c55e;
          border-radius: 50%; border: 2px solid #fff;
        }

        .hero-text { flex: 1; min-width: 0; }
        .hero-greeting {
          font-family: 'Playfair Display', serif;
          font-size: 20px; font-weight: 700; color: #1a1612;
          margin: 0 0 3px; letter-spacing: -0.3px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        @media (min-width: 360px) { .hero-greeting { font-size: 22px; } }
        @media (min-width: 480px) { .hero-greeting { font-size: 26px; } }
        @media (min-width: 640px) { .hero-greeting { font-size: 28px; } }
        @media (min-width: 768px) { .hero-greeting { font-size: 32px; } }
        .hero-greeting em { font-style: italic; }
        .hero-sub { font-size: 11px; color: #a09990; margin: 0; }
        @media (min-width: 480px) { .hero-sub { font-size: 12px; } }
        @media (min-width: 640px) { .hero-sub { font-size: 13px; } }

        /* Actions */
        .hero-actions {
          display: flex; align-items: center; gap: 8px; width: 100%;
        }
        @media (min-width: 640px) { .hero-actions { width: auto; flex-shrink: 0; gap: 10px; } }

        .btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 10px 14px; background: #1a1612; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          border-radius: 12px; border: none; cursor: pointer; text-decoration: none;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
          white-space: nowrap; flex: 1;
        }
        @media (min-width: 480px) { .btn-primary { padding: 11px 18px; border-radius: 13px; } }
        @media (min-width: 640px) { .btn-primary { flex: none; padding: 11px 22px; border-radius: 14px; } }
        .btn-primary:hover { background: #2d2620; transform: translateY(-1px); }

        /* ── LOGOUT — uses position:absolute so it NEVER goes off-screen ── */
        .logout-root {
          position: relative;   /* <-- anchor for the dropdown */
          flex: 1; flex-shrink: 0;
        }
        @media (min-width: 640px) { .logout-root { flex: none; } }
        

        .btn-logout {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 10px 12px; background: transparent; color: #b04040;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          border-radius: 12px; border: 1.5px solid #f0d0d0; cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          white-space: nowrap; width: 100%;
        }
        @media (min-width: 480px) { .btn-logout { padding: 11px 16px; border-radius: 13px; } }
        @media (min-width: 640px) { .btn-logout { width: auto; padding: 11px 18px; border-radius: 14px; } }
        .btn-logout:hover { background: #fff5f5; border-color: #e8b0b0; }

        .chev-logout { transition: transform 0.22s ease; opacity: 0.55; }
        .chev-logout.open { transform: rotate(180deg); }

        /* Dropdown: absolute from .logout-root, so always in-bounds */
        .logout-dropdown {
          position: absolute;
          bottom: calc(100% + 8px);   /* opens UPWARD on mobile (hero is near top) */
          left: 0;
          min-width: 205px;
          background: #111; border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px; padding: 8px;
          box-shadow: 0 -16px 40px rgba(0,0,0,0.35);
          z-index: 500;
          opacity: 0; visibility: hidden; pointer-events: none;
          transform: translateY(6px) scale(0.97);
          transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34,1.2,0.64,1), visibility 0.2s;
        }
        /* On wider screens open downward */
        @media (min-width: 640px) {
          .logout-dropdown {
            bottom: auto; top: calc(100% + 8px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.35);
            transform: translateY(-6px) scale(0.97);
          }
        }
            @media (min-width: 320px) {
          .logout-dropdown {
            bottom: auto; top: calc(100% + 8px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.35);
            transform: translateY(-6px) scale(0.97);
            margin-top:30px;
          }
        }
        .logout-dropdown.open {
          opacity: 1; visibility: visible; pointer-events: auto;
          transform: translateY(0) scale(1);
        }

        .dd-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 11px;
          cursor: pointer; border: none; width: 100%; text-align: left;
          font-family: 'DM Sans', sans-serif; background: transparent;
          transition: background 0.15s;
        }
        .dd-item.normal { color: rgba(255,255,255,0.82); }
        .dd-item.normal:hover { background: rgba(255,255,255,0.08); }
        .dd-item.danger { color: #f87171; }
        .dd-item.danger:hover { background: rgba(248,113,113,0.12); }
        .dd-icon {
          width: 30px; height: 30px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dd-icon.normal-bg { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.65); }
        .dd-icon.danger-bg { background: rgba(248,113,113,0.15); color: #f87171; }
        .dd-label { font-size: 13px; font-weight: 600; line-height: 1.2; }
        .dd-sub { font-size: 11px; font-weight: 400; opacity: 0.45; margin-top: 1px; }
        .dd-sep { height: 1px; background: rgba(255,255,255,0.07); margin: 5px 0; }

        /* ── Section header ── */
        .section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 10px; padding: 0 2px;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; font-style: italic;
          color: #1a1612; margin: 0 0 3px;
        }
        @media (min-width: 480px) { .section-title { font-size: 20px; } }
        @media (min-width: 640px) { .section-title { font-size: 22px; } }
        @media (min-width: 768px) { .section-title { font-size: 24px; } }
        .section-sub { font-size: 11px; color: #a09990; margin: 0; }
        @media (min-width: 480px) { .section-sub { font-size: 13px; } }
        .count-badge {
          background: #1a1612; color: #f7f5f2;
          font-size: 11px; font-weight: 700;
          padding: 5px 13px; border-radius: 100px; white-space: nowrap;
        }
        @media (min-width: 480px) { .count-badge { font-size: 12px; } }

        /* ── Cards grid ── */
        .cards-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
        @media (min-width: 560px)  { .cards-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
        @media (min-width: 900px)  { .cards-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; } }
        @media (min-width: 1200px) { .cards-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }

        /* ── Repair card — matches reference screenshot ── */
        .repair-card {
          background: #fff; border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 1px 5px rgba(0,0,0,0.04);
          padding: 18px 18px 0;
          display: flex; flex-direction: column;
          cursor: pointer;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
        }
        @media (min-width: 480px) { .repair-card { padding: 20px 20px 0; border-radius: 18px; } }
        @media (min-width: 768px) { .repair-card { padding: 22px 22px 0; border-radius: 20px; } }
        .repair-card:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.10);
          transform: translateY(-3px); border-color: rgba(0,0,0,0.12);
        }

        /* Title row */
        .card-head {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 10px; margin-bottom: 4px;
        }
        .card-title {
          font-size: 14px; font-weight: 700; color: #1a1612; margin: 0;
          display: -webkit-box; -webkit-line-clamp: 1;
          -webkit-box-orient: vertical; overflow: hidden; line-height: 1.35;
        }
        @media (min-width: 480px) { .card-title { font-size: 15px; } }

        .device-tag {
          flex-shrink: 0; padding: 3px 10px;
          background: #f4f2ef; border: 1px solid #e8e3dc;
          color: #8a7e72; font-size: 10px; font-weight: 600;
          border-radius: 100px; white-space: nowrap;
        }
        @media (min-width: 480px) { .device-tag { font-size: 11px; padding: 4px 11px; } }

        .card-model { font-size: 11px; color: #b0a89e; margin: 0 0 10px; }
        @media (min-width: 480px) { .card-model { font-size: 12px; margin-bottom: 12px; } }

        .card-desc {
          font-size: 12px; color: #6b5f56; line-height: 1.65; margin: 0 0 12px;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        @media (min-width: 480px) { .card-desc { font-size: 13px; margin-bottom: 14px; } }

        .card-chips {
          display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 10px;
        }
        @media (min-width: 480px) { .card-chips { margin-bottom: 12px; } }

        .urgency-chip {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 600; padding: 4px 10px;
          border-radius: 100px;
        }
        .urgency-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        .budget-chip {
          font-size: 13px; font-weight: 700; color: #1a1612;
          background: #f4f2ef; border: 1px solid #e8e3dc;
          padding: 4px 12px; border-radius: 100px;
        }

        .card-location {
          display: flex; align-items: center; gap: 4px;
          font-size: 11px; color: #b0a89e; margin-bottom: 14px; overflow: hidden;
        }
        @media (min-width: 480px) { .card-location { font-size: 12px; margin-bottom: 16px; } }
        .card-location span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* Footer — matches reference: status | Repair:X Warranty:Y | Responses */
        .card-footer {
          border-top: 1px solid #f0ece6; padding: 12px 0 16px;
          display: flex; align-items: center;
          gap: 6px; flex-wrap: nowrap;
        }
        @media (min-width: 480px) { .card-footer { padding: 14px 0 18px; gap: 8px; } }

        .status-badge {
          font-size: 11px; font-weight: 700;
          padding: 4px 12px; border-radius: 100px; white-space: nowrap; flex-shrink: 0;
        }

        /* "Repair: Pickup  Warranty: Yes" — hidden on ≤399px */
        .footer-info {
          display: none;
          flex: 1; min-width: 0; align-items: center; gap: 8px;
          font-size: 11px; color: #b0a89e; flex-wrap: nowrap; overflow: hidden;
        }
        @media (min-width: 400px) { .footer-info { display: flex; } }
        @media (min-width: 480px) { .footer-info { gap: 10px; font-size: 12px; } }
        .footer-info strong { color: #4a4038; font-weight: 600; }
        .warranty-yes { color: #16a34a !important; }
        .warranty-no  { color: #e03030 !important; }

        .responses-btn {
          display: flex; align-items: center; gap: 5px; flex-shrink: 0;
          font-size: 11px; font-weight: 700; color: #1a1612;
          background: #f4f2ef; border: 1px solid #e8e3dc;
          border-radius: 10px; padding: 6px 12px;
          cursor: pointer; transition: background 0.15s; white-space: nowrap;
          margin-left: auto;
        }
        .responses-btn:hover { background: #ece8e2; }

        /* ── Empty ── */
        .empty-card {
          background: #fff; border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.07);
          padding: 48px 20px; text-align: center;
        }
        @media (min-width: 480px) { .empty-card { padding: 64px 24px; } }
        .empty-icon {
          width: 48px; height: 48px; background: #f4f2ef; border-radius: 14px;
          margin: 0 auto 14px; display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #1a1612; margin: 0 0 6px;
        }
        .empty-sub { font-size: 12px; color: #a09990; margin: 0 0 22px; }
        @media (min-width: 480px) { .empty-sub { font-size: 13px; margin-bottom: 24px; } }

        /* ── Modal ── */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(20,16,10,0.45);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex; align-items: flex-end; justify-content: center;
          opacity: 0; transition: opacity 0.25s ease;
          background-color: rgba(26,22,18,0.75);
        }
        @media (min-width: 540px) { .modal-overlay { align-items: center; padding: 16px; } }
        .modal-overlay.show { opacity: 1; }

        .modal-box {
          background: #fff; border-radius: 22px 22px 0 0;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 24px 80px rgba(0,0,0,0.18);
          width: 100%; max-height: 94vh;
          overflow-y: auto; scrollbar-width: none;
          transform: translateY(100%); opacity: 0;
          transition: transform 0.3s cubic-bezier(0.34,1.1,0.64,1), opacity 0.25s ease;
        }
        .modal-box::-webkit-scrollbar { display: none; }
        @media (min-width: 540px) {
          .modal-box {
            border-radius: 26px; max-width: 500px;
            transform: translateY(24px) scale(0.97); max-height: 88vh;
          }
        }
        @media (min-width: 768px) { .modal-box { max-width: 540px; border-radius: 28px; } }
        .modal-overlay.show .modal-box { transform: translateY(0); opacity: 1; }
        @media (min-width: 540px) {
          .modal-overlay.show .modal-box { transform: translateY(0) scale(1); }
        }

        .modal-drag-handle {
          display: block; width: 38px; height: 4px; border-radius: 2px;
          background: rgba(255,255,255,0.28); margin: 0 auto 16px;
        }
        @media (min-width: 540px) { .modal-drag-handle { display: none; } }

        .modal-header-strip {
          background: #1a1612; border-radius: 22px 22px 0 0;
          padding: 16px; position: relative; overflow: hidden;
        }
        @media (min-width: 480px) { .modal-header-strip { padding: 20px 20px 18px; } }
        @media (min-width: 540px) { .modal-header-strip { border-radius: 26px 26px 0 0; padding: 22px 24px 20px; } }
        @media (min-width: 768px) { .modal-header-strip { border-radius: 28px 28px 0 0; padding: 26px 28px 22px; } }
        .modal-header-strip::before {
          content: ''; position: absolute; top: -30px; right: -30px;
          width: 140px; height: 140px;
          background: radial-gradient(circle, rgba(255,200,100,0.15) 0%, transparent 70%);
        }
        .modal-strip-top {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 12px; margin-bottom: 12px;
        }
        .modal-device-tag {
          padding: 4px 11px; background: rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.75); font-size: 11px; font-weight: 600;
          border-radius: 100px; border: 1px solid rgba(255,255,255,0.15);
        }
        .modal-close {
          width: 28px; height: 28px; background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15); border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: rgba(255,255,255,0.8); flex-shrink: 0;
        }
        @media (min-width: 540px) { .modal-close { width: 32px; height: 32px; border-radius: 10px; } }
        .modal-close:hover { background: rgba(255,255,255,0.2); }
        .modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #fff; margin: 0 0 4px;
        }
        @media (min-width: 480px) { .modal-title { font-size: 20px; } }
        @media (min-width: 540px) { .modal-title { font-size: 22px; } }
        .modal-model { font-size: 12px; color: rgba(255,255,255,0.5); margin: 0; }
        @media (min-width: 540px) { .modal-model { font-size: 13px; } }

        .modal-body {
          padding: 16px 16px 24px; display: flex; flex-direction: column; gap: 14px;
        }
        @media (min-width: 480px) { .modal-body { padding: 18px 18px 26px; gap: 16px; } }
        @media (min-width: 540px) { .modal-body { padding: 20px 22px 28px; gap: 18px; } }

        .modal-label {
          font-size: 10px; font-weight: 700; color: #b0a89e;
          letter-spacing: 1px; text-transform: uppercase; margin: 0 0 8px; display: block;
        }
        .modal-desc { font-size: 13px; color: #4a4038; line-height: 1.75; margin: 0; }
        @media (min-width: 540px) { .modal-desc { font-size: 14px; } }
        .modal-divider { height: 1px; background: #f0ece6; }
        .modal-pills-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }

        .modal-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        @media (min-width: 480px) { .modal-info-grid { gap: 10px; } }
        .modal-info-item {
          background: #f9f7f4; border: 1px solid #ede8e0;
          border-radius: 12px; padding: 12px 14px;
          display: flex; flex-direction: column; gap: 4px;
        }
        @media (min-width: 540px) { .modal-info-item { border-radius: 14px; padding: 14px 16px; } }
        .modal-info-icon { color: #b0a89e; margin-bottom: 2px; }
        .modal-info-label {
          font-size: 9px; font-weight: 700; color: #b0a89e;
          letter-spacing: 0.8px; text-transform: uppercase;
        }
        @media (min-width: 480px) { .modal-info-label { font-size: 10px; } }
        .modal-info-value { font-size: 12px; font-weight: 600; color: #1a1612; }
        @media (min-width: 480px) { .modal-info-value { font-size: 13px; } }
        @media (min-width: 540px) { .modal-info-value { font-size: 14px; } }

        .modal-location-box {
          background: #f9f7f4; border: 1px solid #ede8e0;
          border-radius: 12px; padding: 12px 14px;
          display: flex; align-items: center; gap: 10px;
        }
        @media (min-width: 540px) { .modal-location-box { border-radius: 14px; padding: 14px 16px; } }
        .modal-location-text { font-size: 12px; color: #4a4038; font-weight: 500; }
        @media (min-width: 540px) { .modal-location-text { font-size: 13px; } }

        .modal-footer-row {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 10px;
        }
        .modal-responses-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 11px 18px; background: #1a1612; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          border-radius: 13px; border: none; cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
          flex: 1; justify-content: center;
          transition: background 0.2s, transform 0.15s;
        }
        @media (min-width: 380px) { .modal-responses-btn { flex: none; padding: 11px 22px; } }
        .modal-responses-btn:hover { background: #2d2620; transform: translateY(-1px); }
        .modal-close-text {
          background: none; border: none; cursor: pointer;
          font-size: 13px; color: #b0a89e; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
        }
        .modal-close-text:hover { color: #8a7e72; }
      `}</style>

      {/* ── Modal ── */}
      {selectedCard && (
        <div className={`modal-overlay ${modalVisible ? 'show' : ''}`} onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header-strip">
              <span className="modal-drag-handle" />
              <div className="modal-strip-top">
                <span className="modal-device-tag">{selectedCard?.deviceType}</span>
                <button className="modal-close" onClick={closeModal}><LuX size={13} /></button>
              </div>
              <h2 className="modal-title">{selectedCard?.problemTitle || selectedCard?.title}</h2>
              <p className="modal-model">{selectedCard?.brand} · {selectedCard?.model}</p>
            </div>
            <div className="modal-body">
              <div>
                <span className="modal-label">Description</span>
                <p className="modal-desc">{selectedCard?.problemDescription || selectedCard?.description}</p>
              </div>
              <div className="modal-divider" />
              <div>
                <span className="modal-label">Overview</span>
                <div className="modal-pills-row">
                  <span className={`status-badge ${statusStyles[selectedCard?.status] || 'bg-gray-100 text-gray-500'}`}>
                    {selectedCard?.status}
                  </span>
                  <span className={`urgency-chip ${urgencyStyles[selectedCard?.urgency] || ''}`}>
                    <span className={`urgency-dot ${urgencyDot[selectedCard?.urgency] || 'bg-gray-400'}`} />
                    {selectedCard?.urgency} urgency
                  </span>
                  <span className="budget-chip">₹{selectedCard?.budgetRange || selectedCard?.budget}</span>
                </div>
              </div>
              <div className="modal-divider" />
              <div>
                <span className="modal-label">Details</span>
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <LuWrench size={13} className="modal-info-icon" />
                    <span className="modal-info-label">Repair Type</span>
                    <span className="modal-info-value">{selectedCard?.preferredRepairType || '—'}</span>
                  </div>
                  <div className="modal-info-item">
                    <LuShield size={13} className="modal-info-icon" />
                    <span className="modal-info-label">Warranty</span>
                    <span className="modal-info-value" style={{ color: selectedCard?.warrantyRequired || selectedCard?.warrenty ? '#16a34a' : '#e03030' }}>
                      {selectedCard?.warrantyRequired || selectedCard?.warrenty ? 'Required' : 'Not Required'}
                    </span>
                  </div>
                  <div className="modal-info-item">
                    <LuMonitor size={13} className="modal-info-icon" />
                    <span className="modal-info-label">Device</span>
                    <span className="modal-info-value">{selectedCard?.deviceType || '—'}</span>
                  </div>
                  <div className="modal-info-item">
                    <LuBanknote size={13} className="modal-info-icon" />
                    <span className="modal-info-label">Budget</span>
                    <span className="modal-info-value">₹{selectedCard?.budgetRange || selectedCard?.budget}</span>
                  </div>
                </div>
              </div>
              <div className="modal-location-box">
                <LuMapPin size={14} style={{ color: '#b0a89e', flexShrink: 0 }} />
                <span className="modal-location-text">
                  {selectedCard?.location?.city}, {selectedCard?.location?.state} — {selectedCard?.location?.pincode}
                </span>
              </div>
              <div className="modal-footer-row">
                <button className="modal-responses-btn">
                  <HiOutlineInboxIn size={15} /> View Responses
                </button>
                <button className="modal-close-text" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Page ── */}
      <div className="profile-root ">
        <div className={`profile-inner ${isVisible ? 'visible' : ''}`}>

          {/* Hero */}
          <div className="hero-card">
            <div className="hero-inner">
              <div className="hero-top-row">
                <div className="avatar-wrap">
                  <img src="/bigger2.png" alt="Profile" className="avatar-img" />
                  <div className="avatar-dot" />
                </div>
                <div className="hero-text">
                  <h1 className="hero-greeting">Hey, <em>{user?.user?.username || "there"}</em></h1>
                  <p className="hero-sub">Here's an overview of your repair requests</p>
                </div>
              </div>

              <div className="hero-actions">
                {/* Logout — dropdown is position:absolute inside position:relative parent */}
                <div className="logout-root" ref={logoutRef}>
                  <button
                    className="btn-logout"
                    onClick={() => setLogoutOpen(v => !v)}
                  >
                    <LuLogOut size={14} />
                    Logout
                    <LuChevronDown size={12} className={`chev-logout ${logoutOpen ? 'open' : ''}`} />
                  </button>

                  <div className={`logout-dropdown ${logoutOpen ? 'open' : ''}`}>
                    <button className="dd-item normal" onClick={handletoglout}>
                      <span className="dd-icon normal-bg"><LuLogOut size={13} /></span>
                      <span>
                        <div className="dd-label">Logout</div>
                        <div className="dd-sub">Sign out of your account</div>
                      </span>
                    </button>
                    <div className="dd-sep" />
                    <button className="dd-item danger" onClick={() => setLogoutOpen(false)}>
                      <span className="dd-icon danger-bg"><LuTrash2 size={13} /></span>
                      <span>
                        <div className="dd-label">Delete Account</div>
                        <div className="dd-sub">Permanently remove data</div>
                      </span>
                    </button>
                  </div>
                </div>

                <Link to="/addproblems" style={{ flex: 1 }}>
                  <button className="btn-primary" style={{ width: '100%' }}>
                    <CiCirclePlus size={16} />Add New
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Section header */}
          <div className="section-header">
            <div>
              <h2 className="section-title">Your Repair Requests</h2>
              <p className="section-sub">Track all your submitted problems</p>
            </div>
            <span className="count-badge">{listOfProblems?.length || 0} Active</span>
          </div>

          {/* Cards */}
          <div className="cards-grid">
            {(listOfProblems || []).map((item, index) => (
              <div key={item?.id || index} className="repair-card" onClick={() => setSelectedCard(item)}>

                <div className="card-head">
                  <p className="card-title">{item?.problemTitle || item?.title}</p>
                  <span className="device-tag">{item?.deviceType}</span>
                </div>

                <p className="card-model">{item?.brand} {item?.model}</p>

                <p className="card-desc">{item?.problemDescription || item?.description}</p>

                <div className="card-chips">
                  <span className={`urgency-chip ${urgencyStyles[item?.urgency] || ''}`}>
                    <span className={`urgency-dot ${urgencyDot[item?.urgency] || 'bg-gray-400'}`} />
                    {item?.urgency}
                  </span>
                  <span className="budget-chip">₹{item?.budgetRange || item?.budget}</span>
                </div>

                <div className="card-location">
                  <CiLocationOn size={13} style={{ flexShrink: 0, color: '#b0a89e' }} />
                  <span>{item?.location?.city}, {item?.location?.state} — {item?.location?.pincode}</span>
                </div>

                {/* Footer matches reference: status | Repair: X  Warranty: Y | Responses */}
                <div className="card-footer">
                  <span className={`status-badge ${statusStyles[item?.status] || 'bg-gray-100 text-gray-500'}`}>
                    {item?.status}
                  </span>
                  <div className="footer-info">
                    {item?.preferredRepairType && (
                      <span>Repair: <strong>{item?.preferredRepairType}</strong></span>
                    )}
                    <span>
                      Warranty:{" "}
                      <strong className={item?.warrantyRequired || item?.warrenty ? 'warranty-yes' : 'warranty-no'}>
                        {item?.warrantyRequired || item?.warrenty ? 'Yes' : 'No'}
                      </strong>
                    </span>
                  </div>
                  <button className="responses-btn" onClick={e => e.stopPropagation()}>
                    <HiOutlineInboxIn size={12} /> Responses
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Empty */}
          {listOfProblems?.length === 0 && (
            <div className="empty-card">
              <div className="empty-icon">🔧</div>
              <h3 className="empty-title">No repair requests yet</h3>
              <p className="empty-sub">Submit your first repair request to get started</p>
              <Link to="/addproblems">
                <button className="btn-primary" style={{ margin: '0 auto' }}>
                  <CiCirclePlus size={16} />Add a Problem
                </button>
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Profile;