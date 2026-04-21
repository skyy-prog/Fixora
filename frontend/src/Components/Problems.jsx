import React, { useContext, useEffect, useRef, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineInboxIn } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { FaAngleRight, FaChevronLeft, FaTools, FaTag, FaCalendarAlt, FaUser, FaInfoCircle, FaRupeeSign, FaExclamationTriangle, FaCalendar } from "react-icons/fa";
import { TbDeviceMobile } from "react-icons/tb";
import { Link } from "react-router-dom";
import { RepairContext, backend_url } from "../Context/ALlContext";
import { Search, SlidersHorizontal, MapPin, ExternalLink, ArrowRight } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Request from "../pages/Request";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import GeoMap from "./GeoMap";

function Problems() {
  const { t } = useTranslation();
  const [visible, setVisible]               = useState(false);
  const [selectedItem, setSelectedItem]     = useState(null);
  const { repairRequestss = [], role }      = useContext(RepairContext);
  const [filterdevices, setFilterDevices]   = useState([]);
  const [ListofProblems, setListofProblems] = useState([]);
  const [problemSource, setProblemSource]   = useState([]);
  const [animateCard, setAnimateCard]       = useState(false);
  const [makerepairequest, setMakeRepairRequest] = useState("");
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [requestViewerOpen, setRequestViewerOpen] = useState(false);
  const [requestViewerList, setRequestViewerList] = useState([]);
  const [requestViewerTitle, setRequestViewerTitle] = useState("Requests");
  const [city, setCity]     = useState("");
  const [state, setState]   = useState("");
  const [pincode, setPincode] = useState("");
  const scrollRef = useRef(null);

  const statusStyles = {
    Pending:      { bg: "#fef9c3", color: "#854d0e", border: "#fde047" },
    "In Progress":{ bg: "#dbeafe", color: "#1e40af", border: "#93c5fd" },
    Completed:    { bg: "#dcfce7", color: "#166534", border: "#86efac" },
    Cancelled:    { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
    Open:         { bg: "#e0f2fe", color: "#075985", border: "#7dd3fc" },
  };

  const urgencyConfig = {
    High:   { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", dot: "#ef4444" },
    Medium: { color: "#d97706", bg: "#fffbeb", border: "#fde68a", dot: "#f59e0b" },
    Low:    { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", dot: "#22c55e" },
  };

  const openView = (item) => {
    setSelectedItem(item);
    setVisible(true);
    setTimeout(() => setAnimateCard(true), 10);
  };

  const closeView = () => {
    setAnimateCard(false);
    setTimeout(() => { setVisible(false); setSelectedItem(null); setMakeRepairRequest(""); }, 260);
  };

  const handleFilter = (deviceType) => {
    if (deviceType === "All") { setListofProblems(problemSource); return; }
    setListofProblems((problemSource || []).filter(i => i?.deviceType === deviceType));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = `${city} ${state} ${pincode}`.toLowerCase().trim();
    if (!q) { setListofProblems(problemSource); return; }
    setListofProblems((problemSource || []).filter(item => {
      const loc = `${item?.location?.city || ""} ${item?.location?.state || ""} ${item?.location?.pincode || ""}`.toLowerCase();
      return loc.includes(q);
    }));
  };

  const syncProblemRequestState = (problemId, repairRequestsCount, requestItem) => {
    const applyUpdates = (list = []) =>
      list.map((problem) =>
        problem?.problemId === problemId
          ? {
              ...problem,
              hasRequestedByCurrentRepairer: true,
              repairRequestsCount,
              repairRequests: requestItem
                ? [...(Array.isArray(problem?.repairRequests) ? problem.repairRequests : []), requestItem]
                : problem?.repairRequests,
            }
          : problem
      );

    setProblemSource((prev) => applyUpdates(prev));
    setListofProblems((prev) => applyUpdates(prev));
    setSelectedItem((prev) =>
      prev?.problemId === problemId
        ? {
            ...prev,
            hasRequestedByCurrentRepairer: true,
            repairRequestsCount,
            repairRequests: requestItem
              ? [...(Array.isArray(prev?.repairRequests) ? prev.repairRequests : []), requestItem]
              : prev?.repairRequests,
          }
        : prev
    );
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    if (submittingOffer || selectedItem?.hasRequestedByCurrentRepairer) return;

    if (!selectedItem?.problemId) {
      toast.error("Problem id missing");
      return;
    }

    try {
      setSubmittingOffer(true);
      const response = await axios.post(
        `${backend_url}/api/product/problems/${selectedItem.problemId}/request`,
        { offerMessage: makerepairequest },
        { withCredentials: true }
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.msg || "Unable to send repair request");
      }

      const totalRequests =
        Number(response?.data?.repairRequestsCount) ||
        Number(selectedItem?.repairRequestsCount || 0) + 1;

      syncProblemRequestState(selectedItem.problemId, totalRequests, response?.data?.request);
      setMakeRepairRequest("");
      toast.success("Repair request sent");
    } catch (error) {
      toast.error(error?.response?.data?.msg || error?.message || "Unable to send repair request");
    } finally {
      setSubmittingOffer(false);
    }
  };

  const openRequestViewer = (item) => {
    const list = Array.isArray(item?.repairRequests)
      ? item.repairRequests.map((requestItem) => ({
          ...requestItem,
          problemId: item?.problemId || item?.id,
          problemTitle: item?.problemTitle || item?.title || "Repair discussion",
          userAccountId: item?.userId,
          userName: item?.userName,
        }))
      : [];
    setRequestViewerList(list);
    setRequestViewerTitle(item?.problemTitle || item?.title || t("requests"));
    setRequestViewerOpen(true);
  };

  useEffect(() => {
    const source = Array.isArray(problemSource) ? problemSource : [];
    const types = ["All", ...new Set(source.map(i => i?.deviceType).filter(Boolean))];
    setFilterDevices(types);
    setListofProblems(source);
  }, [problemSource]);

  useEffect(() => {
    const loadProblemsForView = async () => {
      if (role !== "repairer") {
        setProblemSource(Array.isArray(repairRequestss) ? repairRequestss : []);
        return;
      }

      try {
        const response = await axios.get(
          backend_url + "/api/product/all-problems",
          { withCredentials: true }
        );

        if (response?.data?.success) {
          setProblemSource(Array.isArray(response.data.problems) ? response.data.problems : []);
          return;
        }

        setProblemSource([]);
      } catch (error) {
        console.log(error?.response?.data || error?.message);
        setProblemSource([]);
      }
    };

    loadProblemsForView();
  }, [role, repairRequestss]);

  const mapsUrl = (city, state, pincode) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${city}, ${state}, ${pincode}`)}`;
  const formatDistance = (distanceInKm) =>
    typeof distanceInKm === "number" ? `${distanceInKm.toFixed(1)} km` : null;
  const customerMapPoints = (ListofProblems || []).map((item, index) => ({
      id: item?.problemId || item?.id || `problem-${index}`,
      lat: Number(item?.customerLocation?.lat),
      lng: Number(item?.customerLocation?.lng),
      title: item?.problemTitle || item?.title || "Customer Problem",
      subtitle: item?.userName || "Customer",
      meta: item?.location?.city
        ? `${item.location.city}${item?.location?.state ? `, ${item.location.state}` : ""}`
        : null,
    }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .prob-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f7f5f2;
          padding: 32px 20px 80px;
        }

        /* ── Filter bar ── */
        .filter-bar {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 20px;
          padding: 20px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 28px;
        }
        @media(min-width:768px) {
          .filter-bar { flex-direction: row; align-items: center; }
        }

        .filter-left {
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0;
        }
        .filter-label {
          font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.8px;
          color: #b0a89e;
        }
        .filter-select {
          padding: 9px 34px 9px 14px;
          border-radius: 12px;
          border: 1.5px solid #e8e3dc;
          background: #fafaf8;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 600; color: #1a1612;
          outline: none; cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          transition: border-color 0.2s;
        }
        .filter-select:focus { border-color: #0a0a0a; }

        .search-form {
          display: flex; gap: 8px; flex: 1; flex-wrap: wrap;
        }
        .search-input {
          flex: 1; min-width: 80px;
          padding: 9px 14px;
          border-radius: 12px;
          border: 1.5px solid #e8e3dc;
          background: #fafaf8;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; color: #1a1612;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input:focus { border-color: #0a0a0a; box-shadow: 0 0 0 3px rgba(0,0,0,0.05); }
        .search-input::placeholder { color: #c0b8b0; }

        .search-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 20px;
          background: #0a0a0a; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          border-radius: 12px; border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          white-space: nowrap;
        }
        .search-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .search-btn:active { transform: scale(0.97); }

        /* ── Problem cards ── */
        .prob-list { display: flex; flex-direction: column; gap: 14px; }

        .prob-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 20px;
          padding: 24px 26px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.04);
          transition: box-shadow 0.22s, transform 0.22s, border-color 0.22s;
          width: 100%;
          box-sizing: border-box;
        }
        .prob-card:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.09);
          transform: translateY(-2px);
          border-color: rgba(0,0,0,0.11);
        }

        /* card top row */
        .prob-card-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 12px;
          margin-bottom: 12px; flex-wrap: wrap;
        }

        .prob-title {
          font-size: 17px; font-weight: 700;
          color: #0a0a0a; margin: 0 0 4px;
          letter-spacing: -0.2px;
        }
        .prob-device {
          font-size: 13px; color: #b0a89e;
          font-weight: 400; margin: 0;
        }
        .edited-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 6px;
          padding: 3px 9px;
          border-radius: 999px;
          border: 1px solid #fecaca;
          background: #fff5f5;
          color: #b42318;
          font-size: 11px;
          font-weight: 700;
          width: fit-content;
        }

        .device-tag {
          padding: 5px 13px;
          background: #f4f2ef;
          border: 1px solid #e8e3dc;
          border-radius: 100px;
          font-size: 11.5px; font-weight: 700;
          color: #8a7e72; white-space: nowrap;
          letter-spacing: 0.2px; flex-shrink: 0;
        }

        /* meta chips row */
        .prob-meta {
          display: flex; align-items: center; gap: 8px;
          flex-wrap: wrap; margin-bottom: 14px;
        }

        .urgency-chip {
          display: flex; align-items: center; gap: 5px;
          padding: 4px 11px;
          border-radius: 100px;
          font-size: 11.5px; font-weight: 700;
          border-width: 1px; border-style: solid;
        }
        .urgency-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

        .budget-chip {
          display: flex; align-items: center; gap: 4px;
          padding: 4px 12px;
          background: #f4f2ef;
          border: 1px solid #e8e3dc;
          border-radius: 100px;
          font-size: 12px; font-weight: 700; color: #0a0a0a;
        }

        /* description */
        .prob-desc {
          font-size: 14px; color: #5a5048;
          line-height: 1.72; margin: 0 0 16px;
        }

        /* location */
        .prob-loc {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: #b0a89e;
          text-decoration: none;
          transition: color 0.15s;
          margin-bottom: 18px;
        }
        .prob-loc:hover { color: #0a0a0a; }

        .prob-distance {
          font-size: 12.5px;
          color: #4a4038;
          margin: -6px 0 14px;
          font-weight: 600;
        }

        /* footer row */
        .prob-footer {
          display: flex; align-items: center;
          flex-wrap: wrap; gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #f0ece6;
          justify-content: space-between;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11.5px; font-weight: 700;
          border-width: 1px; border-style: solid;
          white-space: nowrap;
        }

        .footer-meta-group {
          display: flex; align-items: center; gap: 16px;
          flex-wrap: wrap;
        }
        .footer-meta-item {
          font-size: 12px; color: #b0a89e; font-weight: 400;
        }
        .footer-meta-item strong { color: #4a4038; font-weight: 600; }
        .footer-meta-item a { color: #3b82f6; text-decoration: none; }
        .footer-meta-item a:hover { text-decoration: underline; }

        .view-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 18px;
          background: #0a0a0a; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 700;
          border-radius: 12px; border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          white-space: nowrap;
        }
        .view-btn:hover { opacity: 0.82; transform: translateY(-1px); }

        .responses-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          background: #f4f2ef;
          border: 1px solid #e8e3dc;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px; font-weight: 700;
          color: #0a0a0a; cursor: pointer;
          transition: background 0.15s;
        }
        .responses-btn:hover { background: #ece8e2; }

        /* empty state */
        .empty-state {
          text-align: center; padding: 64px 24px;
          background: #fff; border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.07);
        }
        .empty-icon { font-size: 36px; margin-bottom: 12px; }
        .empty-title { font-size: 18px; font-weight: 700; color: #0a0a0a; margin: 0 0 6px; }
        .empty-sub { font-size: 14px; color: #b0a89e; margin: 0; }

        /* ── Modal ── */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          background: rgba(10,10,10,0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          opacity: 0; transition: opacity 0.26s ease;
        }
        .modal-overlay.show { opacity: 1; }

        .modal-box {
          background: #ffffff;
          border-radius: 24px;
          width: 100%; max-width: 760px;
          max-height: 90vh;
          overflow: hidden;
          display: flex; flex-direction: column;
          box-shadow: 0 24px 80px rgba(0,0,0,0.22);
          transform: translateY(20px) scale(0.97);
          transition: transform 0.28s cubic-bezier(0.34,1.3,0.64,1), opacity 0.26s ease;
          opacity: 0;
        }
        .modal-overlay.show .modal-box { transform: translateY(0) scale(1); opacity: 1; }

        /* modal header */
        .modal-header {
          background: #0a0a0a;
          padding: 24px 26px 20px;
          flex-shrink: 0;
          position: relative; overflow: hidden;
        }
        .modal-header::before {
          content: '';
          position: absolute; top: -40px; right: -40px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 65%);
        }
        .modal-header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .modal-title { font-family: 'Playfair Display', serif; font-style: italic; font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 5px; letter-spacing: -0.3px; }
        .modal-device { font-size: 13px; color: rgba(255,255,255,0.45); margin: 0; }
        .modal-edited-chip {
          display: inline-flex;
          align-items: center;
          margin-top: 8px;
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid rgba(254, 202, 202, 0.65);
          background: rgba(255, 245, 245, 0.16);
          color: #fecaca;
          font-size: 11px;
          font-weight: 700;
        }
        .modal-close-btn {
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px; cursor: pointer; color: rgba(255,255,255,0.8);
          transition: background 0.15s; flex-shrink: 0;
        }
        .modal-close-btn:hover { background: rgba(255,255,255,0.18); }

        /* modal body */
        .modal-body { flex: 1; overflow-y: auto; padding: 24px 26px; scrollbar-width: thin; }
        .modal-body::-webkit-scrollbar { width: 4px; }
        .modal-body::-webkit-scrollbar-track { background: transparent; }
        .modal-body::-webkit-scrollbar-thumb { background: #e8e3dc; border-radius: 4px; }

        .modal-section-title {
          font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
          color: #b0a89e; margin: 0 0 12px; display: flex; align-items: center; gap: 7px;
        }

        .desc-block {
          background: #f9f7f4;
          border: 1px solid #ede8e0;
          border-radius: 14px;
          padding: 16px 18px;
          margin-bottom: 24px;
          font-size: 14px; color: #4a4038; line-height: 1.75;
        }

        /* image carousel */
        .carousel-wrap { position: relative; margin-bottom: 24px; }
        .carousel-track {
          display: flex; gap: 12px; overflow-x: hidden;
          scroll-behavior: smooth; padding: 4px 2px;
        }
        .carousel-img {
          flex-shrink: 0; width: 220px; height: 160px;
          border-radius: 14px; overflow: hidden;
          border: 1px solid #e8e3dc;
        }
        .carousel-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
        .carousel-img:hover img { transform: scale(1.05); }
        .carousel-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 34px; height: 34px;
          background: #fff; border: 1px solid #e8e3dc;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 2; box-shadow: 0 2px 8px rgba(0,0,0,0.10);
          transition: background 0.15s, box-shadow 0.15s;
          color: #4a4038;
        }
        .carousel-btn:hover { background: #f4f2ef; box-shadow: 0 4px 14px rgba(0,0,0,0.14); }
        .carousel-btn.left { left: 8px; }
        .carousel-btn.right { right: 8px; }

        /* info grid */
        .info-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 24px; }
        @media(min-width: 600px) { .info-grid { grid-template-columns: 1fr 1fr; } }

        .info-section { display: flex; flex-direction: column; gap: 0; }
        .info-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 11px 0;
          border-bottom: 1px solid #f0ece6;
          font-size: 13px;
        }
        .info-row:last-child { border-bottom: none; }
        .info-key { display: flex; align-items: center; gap: 7px; color: #b0a89e; font-weight: 500; }
        .info-val { font-weight: 600; color: #0a0a0a; text-align: right; }

        /* offer form */
        .offer-section {
          background: #f9f7f4;
          border-top: 1px solid #f0ece6;
          padding: 20px 26px;
          flex-shrink: 0;
        }
        .offer-title { font-size: 14px; font-weight: 700; color: #0a0a0a; margin: 0 0 14px; }
        .offer-form { display: flex; gap: 10px; flex-direction: column; }
        @media(min-width:500px) { .offer-form { flex-direction: row; } }
        .offer-input {
          flex: 1;
          padding: 12px 15px;
          border-radius: 12px;
          border: 1.5px solid #e8e3dc;
          background: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #0a0a0a;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .offer-input:focus { border-color: #0a0a0a; box-shadow: 0 0 0 3px rgba(0,0,0,0.05); }
        .offer-input::placeholder { color: #c0b8b0; }
        .offer-input:disabled {
          background: #f3f3f3;
          cursor: not-allowed;
        }
        .offer-submit {
          display: flex; align-items: center; gap: 7px;
          padding: 12px 22px;
          background: #0a0a0a; color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 700;
          border-radius: 12px; border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          white-space: nowrap;
        }
        .offer-submit:hover { opacity: 0.84; transform: translateY(-1px); }
        .offer-submit:disabled {
          opacity: 0.58;
          cursor: not-allowed;
          transform: none;
        }
        .offer-hint { font-size: 11.5px; color: #b0a89e; margin: 10px 0 0; text-align: center; }
      `}</style>

      <div className="prob-root">

        {/* ── Filter / Search bar ── */}
        <div className="filter-bar">
          <div className="filter-left">
            <SlidersHorizontal size={14} style={{ color: '#b0a89e', flexShrink: 0 }} />
            <span className="filter-label">{t("filter")}</span>
            <select className="filter-select" onChange={(e) => handleFilter(e.target.value)}>
              {filterdevices.map((item, idx) => (
                <option key={idx} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSearch} className="search-form">
            <input className="search-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
            <input className="search-input" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
            <input className="search-input" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" maxLength={6} />
            <button type="submit" className="search-btn">
              <Search size={14} /> {t("search")}
            </button>
            <Link to="/chats" className="search-btn" style={{ textDecoration: "none" }}>
              Chats
            </Link>
            <LanguageSelector className="search-input" />
          </form>
        </div>

        {role === "repairer" && (
          <GeoMap
            title="Available Customers Map"
            points={customerMapPoints}
            emptyText="Customer map locations are not available yet."
            height={380}
          />
        )}

        {/* ── Problem list ── */}
        <div className="prob-list">
          {(ListofProblems || []).length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p className="empty-title">{t("noResultsFound")}</p>
                <p className="empty-sub">{t("tryAdjustingFilters")}</p>
              </div>
            )}

          {(ListofProblems || []).map((item, index) => {
            const urg = urgencyConfig[item?.urgency] || {};
            const sta = statusStyles[item?.status] || { bg: "#f4f2ef", color: "#8a7e72", border: "#e8e3dc" };
            return (
              <div key={index} className="prob-card">

                {/* Top */}
                <div className="prob-card-top">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 className="prob-title">{item?.problemTitle || item?.title}</h3>
                    <p className="prob-device">{item?.brand} · {item?.model}</p>
                    {item?.isEdited && <span className="edited-chip">Edited</span>}
                  </div>
                  <span className="device-tag">{item?.deviceType}</span>
                </div>

                {/* Meta chips */}
                <div className="prob-meta">
                  {item?.urgency && (
                    <span className="urgency-chip" style={{ color: urg.color, background: urg.bg, borderColor: urg.border }}>
                      <span className="urgency-dot" style={{ background: urg.dot }} />
                      {item.urgency} urgency
                    </span>
                  )}
                  {(item?.budgetRange || item?.budget) && (
                    <span className="budget-chip">₹{item?.budgetRange || item?.budget}</span>
                  )}
                </div>

                {/* Description */}
                <p className="prob-desc">{item?.problemDescription || item?.description}</p>

                {/* Location */}
                <a
                  href={mapsUrl(item?.location?.city, item?.location?.state, item?.location?.pincode)}
                  target="_blank" rel="noopener noreferrer"
                  className="prob-loc"
                >
                  <MapPin size={14} style={{ flexShrink: 0 }} />
                  {item?.location?.city}, {item?.location?.state} — {item?.location?.pincode}
                  <ExternalLink size={12} style={{ opacity: 0.5 }} />
                </a>
                {formatDistance(item?.distanceFromRepairerKm) && (
                  <p className="prob-distance">
                    Distance from your shop: {formatDistance(item.distanceFromRepairerKm)}
                  </p>
                )}

                {/* Footer */}
                <div className="prob-footer">
                  <span className="status-badge" style={{ background: sta.bg, color: sta.color, borderColor: sta.border }}>
                    {item?.status}
                  </span>

                  <div className="footer-meta-group">
                    {item?.preferredRepairType && (
                      <span className="footer-meta-item">
                        Repair: <strong>{item.preferredRepairType}</strong>
                      </span>
                    )}
                    <span className="footer-meta-item">
                      Warranty: <strong style={{ color: item?.warrantyRequired ? '#16a34a' : '#dc2626' }}>
                        {item?.warrantyRequired ? "Yes" : "No"}
                      </strong>
                    </span>
                    {item?.userName && (
                      <span className="footer-meta-item">
                        By: <Link to={`/profile/${item?.userId}`}>{item.userName}</Link>
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                    <button className="responses-btn" type="button" onClick={() => openRequestViewer(item)}>
                      <HiOutlineInboxIn size={14} />
                      {t("requests")} ({item?.repairRequestsCount || 0})
                    </button>
                    <button className="view-btn" onClick={() => openView(item)}>
                      {t("view")} <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modal ── */}
      {visible && selectedItem && (
        <div
          className={`modal-overlay ${animateCard ? 'show' : ''}`}
          onClick={closeView}
        >
          <div className="modal-box" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="modal-header">
              <div className="modal-header-row">
                <div>
                  <h2 className="modal-title">{selectedItem?.problemTitle || selectedItem?.title}</h2>
                  <p className="modal-device">{selectedItem?.brand} · {selectedItem?.model}</p>
                  {selectedItem?.isEdited && (
                    <span className="modal-edited-chip">
                      Edited{selectedItem?.editedAt ? ` • ${new Date(selectedItem.editedAt).toLocaleDateString("en-IN")}` : ""}
                    </span>
                  )}
                </div>
                <button className="modal-close-btn" onClick={closeView}>
                  <RxCross2 size={15} />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="modal-body">

              {/* Description */}
              <p className="modal-section-title"><FaTools size={11} /> Problem Description</p>
              <div className="desc-block">{selectedItem?.problemDescription || selectedItem?.description}</div>

              {/* Images */}
              {Object.values(selectedItem?.images || {}).some(Boolean) && (
                <>
                  <p className="modal-section-title"><TbDeviceMobile size={13} /> Device Images</p>
                  <div className="carousel-wrap">
                    <button className="carousel-btn left" onClick={() => scrollRef.current?.scrollBy({ left: -240, behavior: "smooth" })}>
                      <FaChevronLeft size={12} />
                    </button>
                    <div className="carousel-track" ref={scrollRef}>
                      {Object.values(selectedItem?.images || {}).map((img, i) => (
                        img && <div key={i} className="carousel-img"><img src={img} alt={`Device ${i + 1}`} /></div>
                      ))}
                    </div>
                    <button className="carousel-btn right" onClick={() => scrollRef.current?.scrollBy({ left: 240, behavior: "smooth" })}>
                      <FaAngleRight size={12} />
                    </button>
                  </div>
                </>
              )}

              {/* Info grid */}
              <div className="info-grid">
                {/* Device details */}
                <div className="info-section">
                  <p className="modal-section-title"><FaTag size={11} /> Device Details</p>
                  <div className="info-row">
                    <span className="info-key"><TbDeviceMobile size={13} />Device</span>
                    <span className="info-val">{selectedItem?.brand} {selectedItem?.model}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-key"><FaTools size={11} />Repair Type</span>
                    <span className="info-val">{selectedItem?.preferredRepairType || "—"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-key"><FaCalendarAlt size={11} />Warranty</span>
                    <span className="info-val" style={{ color: selectedItem?.warrantyRequired ? '#16a34a' : '#dc2626' }}>
                      {selectedItem?.warrantyRequired ? "Required" : "Not required"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-key"><FaUser size={11} />Posted By</span>
                    <span className="info-val">
                      <Link to={`/profile/${selectedItem?.userId || ""}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                        {selectedItem?.userName || "—"}
                      </Link>
                    </span>
                  </div>
                </div>

                {/* Request info */}
                <div className="info-section">
                  <p className="modal-section-title"><FaInfoCircle size={11} /> Request Info</p>
                  <div className="info-row">
                    <span className="info-key"><FaRupeeSign size={11} />Budget</span>
                    <span className="info-val">₹{selectedItem?.budgetRange || selectedItem?.budget}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-key"><FaExclamationTriangle size={11} />Urgency</span>
                    <span className="info-val" style={{
                      color: urgencyConfig[selectedItem?.urgency]?.color,
                      background: urgencyConfig[selectedItem?.urgency]?.bg,
                      padding: '3px 10px', borderRadius: '100px', fontSize: '12px',
                    }}>
                      {selectedItem?.urgency}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-key"><FaCalendar size={11} />Status</span>
                    <span className="info-val" style={{
                      color: statusStyles[selectedItem?.status]?.color,
                      background: statusStyles[selectedItem?.status]?.bg,
                      padding: '3px 10px', borderRadius: '100px', fontSize: '12px',
                    }}>
                      {selectedItem?.status}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-key"><CiLocationOn size={14} />Location</span>
                    <span className="info-val" style={{ fontSize: '12px' }}>
                      {selectedItem?.location?.city}, {selectedItem?.location?.state}
                      <span style={{ color: '#b0a89e', display: 'block', fontWeight: 400 }}>
                        Pincode: {selectedItem?.location?.pincode}
                      </span>
                    </span>
                  </div>
                  {formatDistance(selectedItem?.distanceFromRepairerKm) && (
                    <div className="info-row">
                      <span className="info-key"><MapPin size={12} />Distance</span>
                      <span className="info-val">
                        {formatDistance(selectedItem.distanceFromRepairerKm)} from your shop
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Offer form */}
            <div className="offer-section">
              <p className="offer-title">{t("submitOffer")}</p>
              <form className="offer-form" onSubmit={handleSubmitOffer}>
                <input
                  type="text"
                  className="offer-input"
                  value={makerepairequest}
                  onChange={(e) => setMakeRepairRequest(e.target.value)}
                  placeholder="Describe your offer, estimated cost & timeline…"
                  disabled={selectedItem?.hasRequestedByCurrentRepairer || submittingOffer}
                  required
                />
                <button
                  type="submit"
                  className="offer-submit"
                  disabled={selectedItem?.hasRequestedByCurrentRepairer || submittingOffer}
                >
                  {selectedItem?.hasRequestedByCurrentRepairer ? t("requestSent") : t("submitOffer")} <ArrowRight size={14} />
                </button>
              </form>
              {selectedItem?.hasRequestedByCurrentRepairer ? (
                <p className="offer-hint">You already sent a request for this problem.</p>
              ) : (
                selectedItem?.userName && (
                  <p className="offer-hint">{t("submitOffer")} → {selectedItem.userName}</p>
                )
              )}
            </div>

          </div>
        </div>
      )}
      <Request
        open={requestViewerOpen}
        onClose={() => setRequestViewerOpen(false)}
        list={requestViewerList}
        title={requestViewerTitle}
        emptyText="No request details for this problem."
      />
    </>
  );
}

export default Problems;
