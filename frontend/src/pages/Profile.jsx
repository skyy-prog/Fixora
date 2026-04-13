import React, { useContext, useEffect, useRef, useState } from 'react';
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineInboxIn } from "react-icons/hi";
import { CiCirclePlus } from "react-icons/ci";
import { LuLogOut, LuX, LuWrench, LuShield, LuBanknote, LuMapPin, LuMonitor, LuTrash2, LuChevronDown } from "react-icons/lu";
import { RepairContext } from '../Context/ALlContext';
import { Link } from 'react-router-dom';
import {backend_url} from '../Context/ALlContext';
import {toast} from 'react-hot-toast';
const Profile = () => {
  const [listOfProblems, setListOfProblems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const logoutRef = useRef(null);
  const logoutBtnRef = useRef(null);
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
  }, [])
  const handletoglout = async()=>{
    try{
      const Data = await fetch(backend_url + "/api/user/logout",{
        method:"POST",
        credentials:"include"
      });
      const res  = await Data.json();
      if(res.success){
        toast.success(res.msg);
        window.location.href = "/";
      }
    }catch(eroor){
      console.log("error while logout");
    }
  }
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
          padding: 20px 16px 80px;
        }
        @media (min-width: 640px) { .profile-root { padding: 28px 20px 80px; } }
        @media (min-width: 1024px) { .profile-root { padding: 36px 24px 80px; } }

        .profile-inner {
          width: 100%; max-width: 100%;
          display: flex; flex-direction: column; gap: 16px;
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        @media (min-width: 640px) { .profile-inner { gap: 20px; } }
        .profile-inner.visible { opacity: 1; transform: translateY(0); }

        /* ── Hero Card ── */
        .hero-card {
          background: #ffffff; border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 2px 20px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.04);
          padding: 20px;
          display: flex; flex-direction: column; gap: 16px;
          position: relative; overflow: hidden;
        }
        @media (min-width: 480px) {
          .hero-card { flex-direction: row; align-items: center; flex-wrap: wrap; padding: 24px; gap: 16px; }
        }
        @media (min-width: 640px) { .hero-card { border-radius: 24px; padding: 28px 28px 24px; } }
        .hero-card::before {
          content: ''; position: absolute; top: -40px; right: -40px;
          width: 160px; height: 160px;
          background: radial-gradient(circle, rgba(255,200,100,0.12) 0%, transparent 70%);
          pointer-events: none; border-radius: 50%;
        }

        /* Avatar + text row on mobile */
        .hero-top-row { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }

        .avatar-wrap { position: relative; flex-shrink: 0; }
        .avatar-img {
          width: 56px; height: 56px; border-radius: 50%; object-fit: cover;
          border: 3px solid #f0ece6; box-shadow: 0 4px 12px rgba(0,0,0,0.10);
        }
        @media (min-width: 480px) { .avatar-img { width: 64px; height: 64px; } }
        @media (min-width: 640px) { .avatar-img { width: 72px; height: 72px; } }
        .avatar-dot {
          position: absolute; bottom: 2px; right: 2px;
          width: 12px; height: 12px; background: #22c55e;
          border-radius: 50%; border: 2px solid #fff;
          box-shadow: 0 0 0 2px rgba(34,197,94,0.25);
        }
        .hero-text { flex: 1; min-width: 0; }
        .hero-greeting {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700; color: #1a1612;
          margin: 0 0 3px; letter-spacing: -0.4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        @media (min-width: 480px) { .hero-greeting { font-size: 26px; } }
        @media (min-width: 640px) { .hero-greeting { font-size: 30px; } }
        .hero-greeting em { font-style: italic; }
        .hero-sub { font-size: 12px; color: #a09990; font-weight: 400; margin: 0; }
        @media (min-width: 480px) { .hero-sub { font-size: 13px; } }

        /* Actions row — full width on mobile, auto on larger */
        .hero-actions {
          display: flex; align-items: center; gap: 8px;
          width: 100%;
        }
        @media (min-width: 480px) { .hero-actions { width: auto; flex-shrink: 0; gap: 10px; } }

        .btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 10px 16px; background: #1a1612; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          border-radius: 12px; border: none; cursor: pointer;
          text-decoration: none; transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18); letter-spacing: 0.1px;
          white-space: nowrap; flex: 1;
        }
        @media (min-width: 480px) { .btn-primary { flex: none; padding: 11px 22px; border-radius: 14px; } }
        .btn-primary:hover { background: #2d2620; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.22); }

        /* Logout dropdown */
        .logout-root { position: relative; flex-shrink: 0; flex: 1; }
        @media (min-width: 480px) { .logout-root { flex: none; } }

        .btn-logout {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 10px 14px; background: transparent; color: #b04040;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          border-radius: 12px; border: 1.5px solid #f0d0d0; cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
          white-space: nowrap; width: 100%;
        }
        @media (min-width: 480px) { .btn-logout { width: auto; padding: 11px 18px; border-radius: 14px; } }
        .btn-logout:hover { background: #fff5f5; border-color: #e8b0b0; transform: translateY(-1px); }

        .chev-logout { transition: transform 0.22s ease; opacity: 0.55; }
        .chev-logout.open { transform: rotate(180deg); }

        .logout-dropdown {
          position: fixed; width: 220px;
          background: #111; border: 1px solid rgba(255,255,255,0.12);
          border-radius: 18px; padding: 8px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.40), 0 4px 16px rgba(0,0,0,0.20);
          z-index: 9999; opacity: 0; visibility: hidden;
          transform: translateY(-8px) scale(0.97);
          transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.2,0.64,1), visibility 0.22s;
        }
        .logout-dropdown.open { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }

        .dd-item {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 12px; border-radius: 12px;
          cursor: pointer; border: none; width: 100%; text-align: left;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          background: transparent; transition: background 0.15s;
        }
        .dd-item.normal { color: rgba(255,255,255,0.82); }
        .dd-item.normal:hover { background: rgba(255,255,255,0.08); }
        .dd-item.danger { color: #f87171; }
        .dd-item.danger:hover { background: rgba(248,113,113,0.12); }
        .dd-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
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
          font-size: 20px; font-weight: 700; font-style: italic;
          color: #1a1612; margin: 0 0 3px; letter-spacing: -0.3px;
        }
        @media (min-width: 480px) { .section-title { font-size: 22px; } }
        @media (min-width: 640px) { .section-title { font-size: 24px; } }
        .section-sub { font-size: 12px; color: #a09990; font-weight: 400; margin: 0; }
        @media (min-width: 480px) { .section-sub { font-size: 13px; } }
        .count-badge {
          background: #1a1612; color: #f7f5f2;
          font-size: 11px; font-weight: 700;
          padding: 5px 13px; border-radius: 100px; letter-spacing: 0.4px;
          white-space: nowrap;
        }
        @media (min-width: 480px) { .count-badge { font-size: 12px; padding: 5px 14px; } }

        /* ── Cards Grid ── */
        .cards-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 600px) { .cards-grid { grid-template-columns: 1fr 1fr; gap: 14px; } }

        .repair-card {
          background: #ffffff; border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          padding: 18px;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
          display: flex; flex-direction: column; gap: 0;
          cursor: pointer;
        }
        @media (min-width: 480px) { .repair-card { padding: 22px; border-radius: 20px; } }
        .repair-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.10); transform: translateY(-3px); border-color: rgba(0,0,0,0.12); }

        .card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
        .card-title { font-size: 14px; font-weight: 700; color: #1a1612; margin: 0 0 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        @media (min-width: 480px) { .card-title { font-size: 15px; } }
        .card-model { font-size: 11px; color: #b0a89e; font-weight: 400; margin: 0; }
        @media (min-width: 480px) { .card-model { font-size: 12px; } }
        .device-tag { padding: 3px 9px; background: #f4f2ef; border: 1px solid #e8e3dc; color: #8a7e72; font-size: 10px; font-weight: 600; border-radius: 100px; white-space: nowrap; letter-spacing: 0.2px; flex-shrink: 0; }
        @media (min-width: 480px) { .device-tag { font-size: 11px; padding: 4px 11px; } }
        .card-desc { font-size: 12px; color: #8a7e72; line-height: 1.6; margin: 0 0 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        @media (min-width: 480px) { .card-desc { font-size: 13px; margin-bottom: 12px; } }
        .card-meta-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; margin-bottom: 8px; }
        @media (min-width: 480px) { .card-meta-row { margin-bottom: 10px; } }
        .urgency-chip { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 600; padding: 3px 9px; border-radius: 100px; letter-spacing: 0.2px; }
        @media (min-width: 480px) { .urgency-chip { font-size: 11px; padding: 4px 10px; } }
        .urgency-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        @media (min-width: 480px) { .urgency-dot { width: 6px; height: 6px; } }
        .budget-chip { font-size: 12px; font-weight: 700; color: #1a1612; background: #f4f2ef; border: 1px solid #e8e3dc; padding: 3px 10px; border-radius: 100px; }
        @media (min-width: 480px) { .budget-chip { font-size: 13px; padding: 4px 12px; } }
        .location-row { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #b0a89e; margin-bottom: 14px; overflow: hidden; }
        @media (min-width: 480px) { .location-row { font-size: 12px; margin-bottom: 16px; } }
        .location-row span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .card-footer { border-top: 1px solid #f0ece6; padding-top: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px; }
        @media (min-width: 480px) { .card-footer { padding-top: 14px; gap: 8px; } }
        .status-badge { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 100px; letter-spacing: 0.3px; }
        @media (min-width: 480px) { .status-badge { font-size: 11px; padding: 4px 12px; } }
        .footer-meta { display: flex; align-items: center; gap: 8px; font-size: 10px; color: #b0a89e; flex-wrap: wrap; }
        @media (min-width: 480px) { .footer-meta { font-size: 11px; gap: 12px; } }
        .footer-meta strong { color: #4a4038; font-weight: 600; }
        .warranty-yes { color: #16a34a !important; }
        .warranty-no  { color: #e03030 !important; }
        .responses-btn { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: #1a1612; background: #f4f2ef; border: 1px solid #e8e3dc; border-radius: 9px; padding: 5px 10px; cursor: pointer; transition: background 0.15s; }
        @media (min-width: 480px) { .responses-btn { font-size: 12px; gap: 6px; border-radius: 10px; padding: 6px 12px; } }
        .responses-btn:hover { background: #ece8e2; }

        /* ── Empty state ── */
        .empty-card { background: #ffffff; border-radius: 20px; border: 1px solid rgba(0,0,0,0.07); box-shadow: 0 1px 6px rgba(0,0,0,0.04); padding: 48px 20px; text-align: center; }
        @media (min-width: 480px) { .empty-card { padding: 64px 24px; } }
        .empty-icon { width: 48px; height: 48px; background: #f4f2ef; border-radius: 14px; margin: 0 auto 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        @media (min-width: 480px) { .empty-icon { width: 52px; height: 52px; border-radius: 16px; margin-bottom: 16px; font-size: 22px; } }
        .empty-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #1a1612; margin: 0 0 6px; }
        @media (min-width: 480px) { .empty-title { font-size: 20px; } }
        .empty-sub { font-size: 12px; color: #a09990; margin: 0 0 22px; }
        @media (min-width: 480px) { .empty-sub { font-size: 13px; margin-bottom: 24px; } }

        /* ── Modal ── */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(20,16,10,0.45);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex; align-items: flex-end; justify-content: center;
          padding: 0;
          opacity: 0; transition: opacity 0.25s ease;
        }
        @media (min-width: 540px) {
          .modal-overlay { align-items: center; padding: 16px; }
        }
        .modal-overlay.show { opacity: 1; }

        .modal-box {
          background: #ffffff;
          border-radius: 24px 24px 0 0;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 24px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08);
          width: 100%; max-width: 100%;
          max-height: 92vh;
          overflow-y: auto;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.34,1.1,0.64,1), opacity 0.25s ease;
          opacity: 0; scrollbar-width: none;
        }
        .modal-box::-webkit-scrollbar { display: none; }
        @media (min-width: 540px) {
          .modal-box {
            border-radius: 28px; max-width: 520px;
            transform: translateY(24px) scale(0.97);
            max-height: 90vh;
          }
        }
        .modal-overlay.show .modal-box {
          transform: translateY(0);
          opacity: 1;
        }
        @media (min-width: 540px) {
          .modal-overlay.show .modal-box { transform: translateY(0) scale(1); }
        }

        /* drag handle for mobile sheet */
        .modal-drag-handle {
          display: block; width: 40px; height: 4px; border-radius: 2px;
          background: rgba(255,255,255,0.3); margin: 0 auto 18px; flex-shrink: 0;
        }
        @media (min-width: 540px) { .modal-drag-handle { display: none; } }

        .modal-header-strip {
          background: #1a1612; border-radius: 24px 24px 0 0;
          padding: 18px 18px 18px;
          position: relative; overflow: hidden;
        }
        @media (min-width: 540px) {
          .modal-header-strip { border-radius: 28px 28px 0 0; padding: 24px 24px 20px; }
        }
        .modal-header-strip::before {
          content: ''; position: absolute; top: -30px; right: -30px;
          width: 140px; height: 140px;
          background: radial-gradient(circle, rgba(255,200,100,0.15) 0%, transparent 70%);
        }
        .modal-strip-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
        @media (min-width: 540px) { .modal-strip-top { margin-bottom: 14px; } }
        .modal-device-tag { padding: 4px 12px; background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.75); font-size: 11px; font-weight: 600; border-radius: 100px; border: 1px solid rgba(255,255,255,0.15); letter-spacing: 0.3px; }
        .modal-close { width: 30px; height: 30px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 9px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(255,255,255,0.8); transition: background 0.15s; flex-shrink: 0; }
        @media (min-width: 540px) { .modal-close { width: 32px; height: 32px; border-radius: 10px; } }
        .modal-close:hover { background: rgba(255,255,255,0.2); }
        .modal-title { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 700; color: #ffffff; margin: 0 0 4px; letter-spacing: -0.3px; }
        @media (min-width: 540px) { .modal-title { font-size: 22px; } }
        .modal-model { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 400; margin: 0; }
        @media (min-width: 540px) { .modal-model { font-size: 13px; } }

        .modal-body { padding: 18px 18px 28px; display: flex; flex-direction: column; gap: 16px; }
        @media (min-width: 540px) { .modal-body { padding: 22px 24px 28px; gap: 18px; } }
        .modal-label { font-size: 10px; font-weight: 700; color: #b0a89e; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 8px; display: block; }
        .modal-desc { font-size: 13px; color: #4a4038; line-height: 1.75; margin: 0; }
        @media (min-width: 540px) { .modal-desc { font-size: 14px; } }
        .modal-divider { height: 1px; background: #f0ece6; }
        .modal-pills-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }

        .modal-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        @media (min-width: 540px) { .modal-info-grid { gap: 10px; } }
        .modal-info-item { background: #f9f7f4; border: 1px solid #ede8e0; border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; }
        @media (min-width: 540px) { .modal-info-item { border-radius: 14px; padding: 14px 16px; } }
        .modal-info-icon { color: #b0a89e; margin-bottom: 2px; }
        .modal-info-label { font-size: 9px; font-weight: 700; color: #b0a89e; letter-spacing: 0.8px; text-transform: uppercase; }
        @media (min-width: 540px) { .modal-info-label { font-size: 10px; } }
        .modal-info-value { font-size: 13px; font-weight: 600; color: #1a1612; }
        @media (min-width: 540px) { .modal-info-value { font-size: 14px; } }

        .modal-location-box { background: #f9f7f4; border: 1px solid #ede8e0; border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; }
        @media (min-width: 540px) { .modal-location-box { border-radius: 14px; padding: 14px 16px; } }
        .modal-location-text { font-size: 12px; color: #4a4038; font-weight: 500; }
        @media (min-width: 540px) { .modal-location-text { font-size: 13px; } }

        .modal-footer-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding-top: 2px; }
        .modal-responses-btn { display: flex; align-items: center; gap: 7px; padding: 11px 20px; background: #1a1612; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; border-radius: 14px; border: none; cursor: pointer; transition: background 0.2s, transform 0.15s; box-shadow: 0 2px 8px rgba(0,0,0,0.18); flex: 1; justify-content: center; }
        @media (min-width: 380px) { .modal-responses-btn { flex: none; } }
        .modal-responses-btn:hover { background: #2d2620; transform: translateY(-1px); }
        .modal-close-text { background: none; border: none; cursor: pointer; font-size: 13px; color: #b0a89e; font-weight: 600; font-family: 'DM Sans', sans-serif; }
        .modal-close-text:hover { color: #8a7e72; }
      `}</style>

      {/* ── Modal ── */}
      {selectedCard && (
        <div
          className={`modal-overlay ${modalVisible ? 'show' : ''}`}
          onClick={closeModal}
        >
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header-strip">
              <span className="modal-drag-handle" />
              <div className="modal-strip-top">
                <span className="modal-device-tag">{selectedCard?.deviceType}</span>
                <button className="modal-close" onClick={closeModal}>
                  <LuX size={14} />
                </button>
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
                <LuMapPin size={15} style={{ color: '#b0a89e', flexShrink: 0 }} />
                <span className="modal-location-text">
                  {selectedCard?.location?.city}, {selectedCard?.location?.state} — {selectedCard?.location?.pincode}
                </span>
              </div>

              <div className="modal-footer-row">
                <button className="modal-responses-btn">
                  <HiOutlineInboxIn size={15} />
                  View Responses
                </button>
                <button className="modal-close-text" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Page ── */}
      <div className="profile-root">
        <div className={`profile-inner ${isVisible ? 'visible' : ''}`}>

          {/* Hero */}
          <div className="hero-card">
            {/* Top row: avatar + text always together */}
            <div className="hero-top-row">
              <div className="avatar-wrap">
                <img src="/bigger2.png" alt="Profile" className="avatar-img" />
                <div className="avatar-dot" />
              </div>
              <div className="hero-text">
                <h1 className="hero-greeting">Hey, <em>{user?.user?.username || "there"}</em> </h1>
                <p className="hero-sub">Here's an overview of your repair requests</p>
              </div>
            </div>

            {/* Actions row: full-width on mobile */}
            <div className="hero-actions">
              <div className="logout-root" ref={logoutRef}>
                <button
                  ref={logoutBtnRef}
                  className="btn-logout"
                  onClick={() => {
                    if (!logoutOpen && logoutBtnRef.current) {
                      const r = logoutBtnRef.current.getBoundingClientRect();
                      setDropdownPos({ top: r.bottom + 10, right: window.innerWidth - r.right });
                    }
                    setLogoutOpen(v => !v);
                handletoglout  }}
                >
                  <LuLogOut size={14} />
                  Logout
                  <LuChevronDown size={12} className={`chev-logout ${logoutOpen ? 'open' : ''}`} />
                </button>

                <div
                  className={`logout-dropdown ${logoutOpen ? 'open' : ''}`}
                  style={{ top: dropdownPos.top, right: dropdownPos.right }}
                >
                  <button className="dd-item normal" onClick={handletoglout}>
                    <span className="dd-icon normal-bg"><LuLogOut size={14} /></span>
                    <span>
                      <div className="dd-label">Logout</div>
                      <div className="dd-sub">Sign out of your account</div>
                    </span>
                  </button>
                  <div className="dd-sep" />
                  <button className="dd-item danger" onClick={() => { setLogoutOpen(false); }}>
                    <span className="dd-icon danger-bg"><LuTrash2 size={14} /></span>
                    <span>
                      <div className="dd-label">Delete Account</div>
                      <div className="dd-sub">Permanently remove data</div>
                    </span>
                  </button>
                </div>
              </div>

              <Link to="/addproblems" style={{ flex: 1 }}>
                <button className="btn-primary" style={{ width: '100%' }}>
                  <CiCirclePlus size={17} />Add New
                </button>
              </Link>
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
                <div className="card-top">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="card-title">{item?.problemTitle || item?.title}</p>
                    <p className="card-model">{item?.brand} {item?.model}</p>
                  </div>
                  <span className="device-tag">{item?.deviceType}</span>
                </div>

                <p className="card-desc">{item?.problemDescription || item?.description}</p>

                <div className="card-meta-row">
                  <span className={`urgency-chip ${urgencyStyles[item?.urgency] || ''}`}>
                    <span className={`urgency-dot ${urgencyDot[item?.urgency] || 'bg-gray-400'}`} />
                    {item?.urgency}
                  </span>
                  <span className="budget-chip">₹{item?.budgetRange || item?.budget}</span>
                </div>

                <div className="location-row">
                  <CiLocationOn size={13} style={{ flexShrink: 0, color: '#b0a89e' }} />
                  <span>{item?.location?.city}, {item?.location?.state} — {item?.location?.pincode}</span>
                </div>

                <div className="card-footer">
                  <span className={`status-badge ${statusStyles[item?.status] || 'bg-gray-100 text-gray-500'}`}>
                    {item?.status}
                  </span>
                  <div className="footer-meta">
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
                    <HiOutlineInboxIn size={13} />
                    Responses
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {listOfProblems?.length === 0 && (
            <div className="empty-card">
              <div className="empty-icon">🔧</div>
              <h3 className="empty-title">No repair requests yet</h3>
              <p className="empty-sub">Submit your first repair request to get started</p>
              <Link to="/addproblems">
                <button className="btn-primary" style={{ margin: '0 auto' }}>
                  <CiCirclePlus size={17} />Add a Problem
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