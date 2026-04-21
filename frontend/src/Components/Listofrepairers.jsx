import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoLocationSharp, IoStarOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { backend_url } from "../Context/ALlContext";
import GeoMap from "./GeoMap";
import { LuSlidersHorizontal, LuSearch, LuX, LuStar, LuMapPin, LuClock, LuBadgeCheck, LuChevronRight } from "react-icons/lu";

const mapRepairerToCard = (repairer) => {
  const coordinates = Array.isArray(repairer?.location?.coordinates)
    ? repairer.location.coordinates : [];
  const fallbackLatitude = Number(repairer?.location?.latitude ?? repairer?.location?.lat);
  const fallbackLongitude = Number(repairer?.location?.longitude ?? repairer?.location?.lng);
  const latitude = coordinates.length > 1 ? Number(coordinates[1]) : fallbackLatitude;
  const longitude = coordinates.length > 0 ? Number(coordinates[0]) : fallbackLongitude;

  return {
    id: String(repairer?._id || ""),
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
        lat: Number.isFinite(latitude) ? latitude : null,
        lng: Number.isFinite(longitude) ? longitude : null,
      },
    },
    rating: Number(repairer?.rating || 0),
    totalReviews: Number(repairer?.totalReviews || 0),
    distanceFromUserKm: typeof repairer?.distanceFromUserKm === "number" ? repairer.distanceFromUserKm : null,
    isVerified: Boolean(repairer?.isPhoneVerified),
    available: repairer?.availability !== false,
    joinedAt: repairer?.createdAt || Date.now(),
  };
};

const Listofrepairers = () => {
  const [ListRepairer, setListRepairer] = useState([]);
  const [OriginalList, setOriginalList] = useState([]);
  const [Sortype, setSortype] = useState("Relevent");
  const [Sortypebyrating, setSortypebyrating] = useState("Relevent");
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");
  const [pincode, setpincode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepairers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backend_url}/api/repairer/public`, { withCredentials: true });
        const repairers = Array.isArray(response.data?.repairers)
          ? response.data.repairers.map(mapRepairerToCard) : [];
        setListRepairer(repairers);
        setOriginalList(repairers);
      } catch (error) {
        toast.error(error?.response?.data?.msg || "Unable to load repairers");
        setListRepairer([]);
        setOriginalList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRepairers();
  }, []);

  const sortedRepairers = [...ListRepairer].sort((a, b) => {
    if (Sortype === "Experienced") return b.shopDetails.experience - a.shopDetails.experience;
    if (Sortype === "NewBe") return a.shopDetails.experience - b.shopDetails.experience;
    if (Sortypebyrating === "Best") return b.rating - a.rating;
    if (Sortypebyrating === "Least") return a.rating - b.rating;
    return 0;
  });

  const handletosearneabyareaforcustomers = (e) => {
    e.preventDefault();
    const searchCity = city.toLowerCase().trim();
    const searchState = state.toLowerCase().trim();
    const searchPincode = pincode.trim();
    if (!searchCity && !searchState && !searchPincode) { setListRepairer(OriginalList); return; }
    const Filteredvalues = OriginalList.filter((items) => {
      const repairerCity = items.shopDetails.city?.toLowerCase() || "";
      const repairerPincode = items.shopDetails.pincode || "";
      const repairerAddress = items.shopDetails.address?.toLowerCase() || "";
      const cityMatch = !searchCity || repairerCity.includes(searchCity);
      const stateMatch = !searchState || repairerAddress.includes(searchState);
      const pincodeMatch = !searchPincode || repairerPincode.includes(searchPincode);
      return cityMatch && stateMatch && pincodeMatch;
    });
    setListRepairer(Filteredvalues);
  };

  const handleClearFilters = () => {
    setcity(""); setstate(""); setpincode("");
    setListRepairer(OriginalList);
  };

  const openmaps = (address) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const repairerMapPoints = sortedRepairers.map((item, index) => ({
    id: item.id || `repairer-${index}`,
    lat: Number(item?.shopDetails?.location?.lat),
    lng: Number(item?.shopDetails?.location?.lng),
    title: item.userName,
    subtitle: `${item.shopDetails.shopName || "Repair Shop"} • ${item.shopDetails.city || "Unknown city"}`,
    meta: typeof item?.distanceFromUserKm === "number" ? `${item.distanceFromUserKm.toFixed(1)} km away` : null,
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Lora:ital@1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp   { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes cardIn   { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: none; } }
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes dotPulse { 0%,100%{ transform:scale(1); opacity:1; } 50%{ transform:scale(1.6); opacity:0.5; } }

        :root {
          --bg:      #f5f5f7;
          --white:   #ffffff;
          --black:   #1d1d1f;
          --mid:     #6e6e73;
          --light:   #d2d2d7;
          --lighter: #e8e8ed;
          --shadow-xs: 0 1px 3px rgba(0,0,0,0.06);
          --shadow-sm: 0 2px 10px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04);
          --shadow-md: 0 4px 24px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.04);
          --shadow-hover: 0 8px 36px rgba(0,0,0,0.13), 0 4px 12px rgba(0,0,0,0.05);
          --r-sm: 16px; --r-md: 22px; --r-lg: 28px; --r-xl: 36px; --r-pill: 100px;
        }

        .lr-root {
          font-family: 'Outfit', sans-serif;
          background: var(--bg);
          min-height: 100vh;
          color: var(--black);
          -webkit-font-smoothing: antialiased;
        }

        .lr-page {
          width: 100%;
          padding: 36px 16px 80px;
          animation: fadeUp 0.45s ease both;
        }
        @media (min-width: 600px)  { .lr-page { padding: 40px 24px 80px; } }
        @media (min-width: 768px)  { .lr-page { padding: 48px 40px 80px; } }
        @media (min-width: 1200px) { .lr-page { padding: 48px 60px 80px; } }

        /* ── Page header ── */
        .lr-header {
          margin-bottom: 28px;
        }
        .lr-title {
          font-size: clamp(28px, 5vw, 42px);
          font-weight: 900;
          letter-spacing: -0.04em;
          color: var(--black);
          line-height: 1;
        }
        .lr-subtitle {
          font-size: 15px;
          color: var(--mid);
          margin-top: 6px;
          font-weight: 400;
        }

        /* ── Controls bar ── */
        .lr-controls {
          background: var(--white);
          border-radius: var(--r-xl);
          box-shadow: var(--shadow-sm);
          padding: 16px 20px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        @media (min-width: 900px) {
          .lr-controls { flex-direction: row; align-items: center; gap: 12px; }
        }

        /* Sort selects */
        .lr-sort-group {
          display: flex; align-items: center; gap: 10px;
          background: var(--bg); border-radius: var(--r-lg); padding: 10px 14px;
          flex-shrink: 0;
        }
        .lr-sort-lbl {
          font-size: 12px; font-weight: 600; color: var(--mid);
          white-space: nowrap; text-transform: uppercase; letter-spacing: 0.06em;
        }
        .lr-select {
          background: var(--white);
          border: 1.5px solid var(--lighter);
          border-radius: var(--r-pill);
          padding: 7px 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600; color: var(--black);
          outline: none; cursor: pointer;
          transition: border-color 0.18s;
          appearance: none;
          padding-right: 28px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236e6e73' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
        }
        .lr-select:focus { border-color: var(--black); }

        /* Search form */
        .lr-search-form {
          display: flex; align-items: center; gap: 8px;
          flex: 1; flex-wrap: wrap;
        }
        @media (min-width: 600px) { .lr-search-form { flex-wrap: nowrap; } }

        .lr-input {
          flex: 1; min-width: 90px;
          background: var(--bg);
          border: 1.5px solid transparent;
          border-radius: var(--r-lg);
          padding: 10px 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 14px; color: var(--black);
          outline: none;
          transition: border-color 0.18s;
        }
        .lr-input::placeholder { color: var(--light); }
        .lr-input:focus { border-color: var(--black); background: var(--white); }

        .lr-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 20px;
          border-radius: var(--r-pill);
          border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 13px; font-weight: 600;
          transition: transform 0.15s, opacity 0.15s;
          white-space: nowrap;
          letter-spacing: -0.01em;
        }
        .lr-btn:hover { opacity: 0.82; transform: translateY(-1px); }
        .lr-btn:active { transform: scale(0.97); }
        .lr-btn-primary { background: var(--black); color: #fff; }
        .lr-btn-ghost {
          background: var(--lighter); color: var(--mid);
        }
        .lr-btn-ghost:hover { opacity: 1; background: var(--light); color: var(--black); }

        /* ── Map wrapper ── */
        .lr-map-wrap {
          border-radius: var(--r-xl);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          margin-bottom: 28px;
          padding:15px;
          padding-left:30px;
          padding-right:30px;
        }

        /* ── Count row ── */
        .lr-count-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px;
        }
        .lr-count {
          font-size: 13px; font-weight: 600; color: var(--mid);
          text-transform: uppercase; letter-spacing: 0.08em;
        }

        /* ── Grid ── */
        .lr-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 560px) { .lr-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 900px) { .lr-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1300px) { .lr-grid { grid-template-columns: repeat(4, 1fr); } }

        /* ── Repairer card ── */
        .lr-card {
          background: var(--white);
          border-radius: var(--r-xl);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          display: flex; flex-direction: column;
          transition: box-shadow 0.25s, transform 0.25s;
          animation: cardIn 0.4s ease both;
          cursor: default;
        }
        .lr-card:hover {
          box-shadow: var(--shadow-hover);
          transform: translateY(-3px);
        }

        /* Card image */
        .lr-card-img {
          width: 100%; height: 160px; object-fit: cover;
          background: var(--lighter);
          display: block;
        }

        /* Card body */
        .lr-card-body { padding: 18px 18px 0; flex: 1; display: flex; flex-direction: column; }

        /* Name row */
        .lr-card-name-row {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;
          margin-bottom: 6px;
        }
        .lr-card-name {
          font-size: 17px; font-weight: 800; letter-spacing: -0.03em; color: var(--black);
          line-height: 1.1;
        }
        .lr-avail-badge {
          font-size: 10px; font-weight: 700;
          padding: 4px 10px; border-radius: var(--r-pill);
          flex-shrink: 0; letter-spacing: 0.04em;
          display: flex; align-items: center; gap: 4px;
        }
        .badge-on  { background: #f0f9f1; color: #1a7a32; }
        .badge-off { background: #fff0f0; color: #b91c1c; }

        .lr-avail-dot {
          width: 5px; height: 5px; border-radius: 50%;
        }
        .dot-on  { background: #30d158; animation: dotPulse 2s infinite; }
        .dot-off { background: #ff453a; }

        /* Shop name */
        .lr-shop-name {
          font-size: 13px; color: var(--mid); font-weight: 500; margin-bottom: 10px;
        }

        /* Info rows inside card */
        .lr-card-info { display: flex; flex-direction: column; gap: 7px; margin-bottom: 12px; }
        .lr-card-info-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: var(--mid);
        }
        .lr-card-info-row svg { flex-shrink: 0; color: var(--black); opacity: 0.5; }
        .lr-card-info-row strong { color: var(--black); font-weight: 600; }

        /* Stars inline */
        .lr-stars { display: flex; align-items: center; gap: 2px; }
        .lr-star-filled { color: var(--black); font-size: 12px; }
        .lr-star-empty  { color: var(--light); font-size: 12px; }

        /* Skills */
        .lr-skills { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }
        .lr-skill {
          font-size: 11px; font-weight: 600; padding: 4px 11px;
          border-radius: var(--r-pill);
          border: 1.5px solid var(--lighter);
          color: var(--mid);
          background: var(--bg);
          letter-spacing: 0.01em;
        }

        /* Address */
        .lr-address {
          font-size: 12px; color: var(--mid); margin-bottom: 12px; line-height: 1.5;
        }
        .lr-address a { color: var(--black); text-decoration: underline; text-underline-offset: 2px; }
        .lr-address a:hover { opacity: 0.6; }

        /* Card footer */
        .lr-card-footer { padding: 14px 18px 18px; }
        .lr-view-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 13px;
          background: var(--black); color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 14px; font-weight: 700;
          border-radius: var(--r-lg);
          border: none; cursor: pointer;
          letter-spacing: -0.01em;
          transition: opacity 0.18s, transform 0.15s;
          text-decoration: none;
        }
        .lr-view-btn:hover { opacity: 0.80; transform: translateY(-1px); }
        .lr-view-btn:active { transform: scale(0.98); }

        /* ── Empty / Loading states ── */
        .lr-state {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 60px 20px; gap: 14px;
        }
        .lr-state-icon { font-size: 44px; }
        .lr-state-text { font-size: 15px; font-weight: 600; color: var(--mid); }
        .lr-spinner {
          width: 30px; height: 30px; border-radius: 50%;
          border: 2.5px solid var(--lighter);
          border-top-color: var(--black);
          animation: spin 0.7s linear infinite;
        }
      `}</style>

      <div className="lr-root">
        <div className="lr-page">

          {/* ── Header ── */}
          <div className="lr-header">
            <h1 className="lr-title">Find Repairers</h1>
            <p className="lr-subtitle">{OriginalList.length} repairers available near you</p>
          </div>

          {/* ── Controls ── */}
          <div className="lr-controls">

            {/* Sort by Experience */}
            <div className="lr-sort-group">
              <span className="lr-sort-lbl">Experience</span>
              <select className="lr-select" onChange={(e) => setSortype(e.target.value)}>
                <option value="Relevent">Relevant</option>
                <option value="Experienced">Most Experienced</option>
                <option value="NewBe">Newly Joined</option>
              </select>
            </div>

            {/* Search */}
            <form className="lr-search-form" onSubmit={handletosearneabyareaforcustomers}>
              <input className="lr-input" value={city} onChange={(e) => setcity(e.target.value)} type="text" placeholder="City" />
              <input className="lr-input" value={state} onChange={(e) => setstate(e.target.value)} type="text" placeholder="State" />
              <input className="lr-input" value={pincode} onChange={(e) => setpincode(e.target.value)} type="text" maxLength={6} placeholder="Pincode" />
              <button type="submit" className="lr-btn lr-btn-primary"><LuSearch size={13} /> Search</button>
              <button type="button" className="lr-btn lr-btn-ghost" onClick={handleClearFilters}><LuX size={13} /> Clear</button>
            </form>

            {/* Sort by Rating */}
            <div className="lr-sort-group">
              <span className="lr-sort-lbl">Rating</span>
              <select className="lr-select" onChange={(e) => setSortypebyrating(e.target.value)}>
                <option value="Relevent">Relevant</option>
                <option value="Best">Best</option>
                <option value="Least">Least</option>
              </select>
            </div>

          </div>

          {/* ── Map ── */}
          <div className="lr-map-wrap">
            <GeoMap
              title="Repairers Near You"
              points={repairerMapPoints}
              emptyText="Repairer locations are not available yet."
              height={260}
            />
          </div>

          {/* ── Count ── */}
          {!loading && (
            <div className="lr-count-row">
              <span className="lr-count">{sortedRepairers.length} results</span>
            </div>
          )}

          {/* ── States ── */}
          {loading ? (
            <div className="lr-state">
              <div className="lr-spinner" />
              <span className="lr-state-text">Loading repairers…</span>
            </div>
          ) : sortedRepairers.length === 0 ? (
            <div className="lr-state">
              <span className="lr-state-icon">🔍</span>
              <span className="lr-state-text">No repairers found for the selected filters.</span>
            </div>
          ) : (

            /* ── Grid ── */
            <div className="lr-grid">
              {sortedRepairers.map((item, idx) => (
                <div
                  key={item.id}
                  className="lr-card"
                  style={{ animationDelay: `${Math.min(idx * 0.04, 0.32)}s` }}
                >
                  <img
                    src={item.shopDetails.shopImage || "/Repairer.png"}
                    alt={item.shopDetails.shopName || item.userName}
                    className="lr-card-img"
                  />

                  <div className="lr-card-body">
                    <div className="lr-card-name-row">
                      <span className="lr-card-name">{item.userName}</span>
                      <span className={`lr-avail-badge ${item.available ? 'badge-on' : 'badge-off'}`}>
                        <span className={`lr-avail-dot ${item.available ? 'dot-on' : 'dot-off'}`} />
                        {item.available ? "Available" : "Busy"}
                      </span>
                    </div>

                    <p className="lr-shop-name">{item.shopDetails.shopName}</p>

                    <div className="lr-card-info">
                      <div className="lr-card-info-row">
                        <LuMapPin size={13} />
                        <span>{item.shopDetails.city || "—"}</span>
                        {typeof item.distanceFromUserKm === "number" && (
                          <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600 }}>
                            {item.distanceFromUserKm.toFixed(1)} km
                          </span>
                        )}
                      </div>
                      <div className="lr-card-info-row">
                        <LuClock size={13} />
                        <span><strong>{item.shopDetails.experience}y</strong> experience</span>
                      </div>
                      <div className="lr-card-info-row">
                        <IoStarOutline size={13} />
                        <div className="lr-stars">
                          {[1,2,3,4,5].map(n => (
                            <span key={n} className={n <= Math.round(item.rating) ? 'lr-star-filled' : 'lr-star-empty'}>★</span>
                          ))}
                        </div>
                        <span style={{ fontSize: 12 }}>{item.rating} <span style={{ opacity: 0.5 }}>({item.totalReviews})</span></span>
                        {item.isVerified && <LuBadgeCheck size={13} style={{ marginLeft: 'auto' }} />}
                      </div>
                    </div>

                    {item.shopDetails.skills.length > 0 && (
                      <div className="lr-skills">
                        {item.shopDetails.skills.slice(0, 4).map((skill, index) => (
                          <span key={`${item.id}-${skill}-${index}`} className="lr-skill">{skill}</span>
                        ))}
                        {item.shopDetails.skills.length > 4 && (
                          <span className="lr-skill">+{item.shopDetails.skills.length - 4}</span>
                        )}
                      </div>
                    )}

                    {item.shopDetails.address && (
                      <p className="lr-address">
                        <a href={openmaps(item.shopDetails.address)} target="_blank" rel="noopener noreferrer">
                          {item.shopDetails.address} ↗
                        </a>
                      </p>
                    )}
                  </div>

                  <div className="lr-card-footer">
                    <Link
                      to={`/repairerProfile/${item.id}`}
                      state={{ repairer: item }}
                      className="lr-view-btn"
                    >
                      View Profile <LuChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Listofrepairers;