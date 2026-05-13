import React, { useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { backend_url } from "../Context/ALlContext";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "incomplete", label: "Incomplete" },
  { value: "all", label: "All" },
];

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const RepairerVerificationReview = () => {
  const [adminKey, setAdminKey] = useState(localStorage.getItem("fixora_admin_key") || "");
  const [showKey, setShowKey] = useState(false);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [repairers, setRepairers] = useState([]);
  const [reviewNotesByAccount, setReviewNotesByAccount] = useState({});

  const pendingCount = useMemo(
    () =>
      repairers.filter(
        (repairerItem) => String(repairerItem?.status || "").toLowerCase() === "pending"
      ).length,
    [repairers]
  );

  const syncReviewNotesState = (items) => {
    const nextMap = {};
    (Array.isArray(items) ? items : []).forEach((repairerItem) => {
      const accountId = String(repairerItem?.accountId || "");
      if (!accountId) return;
      nextMap[accountId] = String(repairerItem?.verification?.reviewNotes || "");
    });
    setReviewNotesByAccount(nextMap);
  };

  const loadRepairers = async () => {
    if (!adminKey.trim()) {
      toast.error("Admin key is required");
      return;
    }

    try {
      setLoading(true);
      localStorage.setItem("fixora_admin_key", adminKey.trim());
      const response = await axios.get(`${backend_url}/api/repairer/profile/review`, {
        params: { status: statusFilter },
        headers: {
          "x-admin-key": adminKey.trim(),
        },
      });

      if (!response.data?.success) {
        toast.error(response.data?.msg || "Unable to load verification requests");
        return;
      }

      const items = Array.isArray(response.data?.repairers) ? response.data.repairers : [];
      setRepairers(items);
      syncReviewNotesState(items);
      toast.success("Verification list loaded");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Unable to load verification requests");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewDecision = async (accountId, status) => {
    if (!adminKey.trim()) {
      toast.error("Admin key is required");
      return;
    }

    const reviewNotes = String(reviewNotesByAccount[accountId] || "").trim();

    try {
      setActionLoadingId(accountId);
      const response = await axios.patch(
        `${backend_url}/api/repairer/profile/review`,
        {
          accountId,
          status,
          reviewNotes,
        },
        {
          headers: {
            "x-admin-key": adminKey.trim(),
          },
        }
      );

      if (!response.data?.success) {
        toast.error(response.data?.msg || "Unable to update review status");
        return;
      }

      toast.success(response.data?.msg || "Review updated");
      setRepairers((prev) => {
        if (statusFilter === "pending") {
          return prev.filter((item) => String(item?.accountId) !== String(accountId));
        }

        return prev.map((item) =>
          String(item?.accountId) === String(accountId)
            ? {
                ...item,
                status,
                isPhoneVerified: status === "approved",
                verification: {
                  ...(item?.verification || {}),
                  reviewNotes,
                  reviewedAt: new Date().toISOString(),
                },
              }
            : item
        );
      });
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Unable to update review status");
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-900">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Repairer Verification Review</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Review identity submissions and approve/reject repairer accounts.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-[1.4fr_0.8fr_auto]">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Admin Key
              </label>
              <div className="flex gap-2">
                <input
                  type={showKey ? "text" : "password"}
                  value={adminKey}
                  onChange={(event) => setAdminKey(event.target.value)}
                  placeholder="Enter REPAIRER_ADMIN_KEY"
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((prev) => !prev)}
                  className="rounded-xl border border-neutral-300 px-3 text-sm"
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Filter
              </label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600"
              >
                {STATUS_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={loadRepairers}
                disabled={loading}
                className="w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Loading..." : "Load requests"}
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Pending in current list: <span className="font-semibold">{pendingCount}</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {!loading && repairers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
              No repairer submissions found for this filter.
            </div>
          )}

          {repairers.map((repairerItem) => {
            const accountId = String(repairerItem?.accountId || "");
            const verification = repairerItem?.verification || {};
            const isActionLoading = actionLoadingId === accountId;
            const currentStatus = String(repairerItem?.status || "").toLowerCase();

            return (
              <div
                key={accountId || String(repairerItem?._id || Math.random())}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {repairerItem?.username || "Unnamed repairer"}
                    </h2>
                    <p className="text-sm text-neutral-600">
                      {repairerItem?.email || "-"} · Account ID: {accountId || "-"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                      currentStatus === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : currentStatus === "rejected"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {currentStatus || "pending"}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-neutral-700 md:grid-cols-2">
                  <p>
                    <span className="font-semibold">Shop:</span> {repairerItem?.shopName || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">City:</span> {repairerItem?.city || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Personal phone:</span>{" "}
                    {repairerItem?.personalPhone || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Experience:</span>{" "}
                    {Number(repairerItem?.experience || 0)} years
                  </p>
                  <p className="md:col-span-2">
                    <span className="font-semibold">Address:</span>{" "}
                    {[repairerItem?.address, repairerItem?.city, repairerItem?.pincode]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </p>
                  <p className="md:col-span-2">
                    <span className="font-semibold">Skills:</span>{" "}
                    {Array.isArray(repairerItem?.skills) && repairerItem.skills.length
                      ? repairerItem.skills.join(", ")
                      : "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Submitted:</span>{" "}
                    {formatDate(verification?.submittedAt)}
                  </p>
                  <p>
                    <span className="font-semibold">Reviewed:</span>{" "}
                    {formatDate(verification?.reviewedAt)}
                  </p>
                </div>

                <div className="mt-4 grid gap-2 text-sm md:grid-cols-3">
                  <a
                    href={verification?.idDocumentImage || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`rounded-lg border px-3 py-2 text-center font-medium ${
                      verification?.idDocumentImage
                        ? "border-neutral-300 hover:bg-neutral-50"
                        : "pointer-events-none border-neutral-200 text-neutral-400"
                    }`}
                  >
                    ID Document
                  </a>
                  <a
                    href={verification?.selfieImage || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`rounded-lg border px-3 py-2 text-center font-medium ${
                      verification?.selfieImage
                        ? "border-neutral-300 hover:bg-neutral-50"
                        : "pointer-events-none border-neutral-200 text-neutral-400"
                    }`}
                  >
                    Selfie
                  </a>
                  <a
                    href={verification?.skillProofImage || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`rounded-lg border px-3 py-2 text-center font-medium ${
                      verification?.skillProofImage
                        ? "border-neutral-300 hover:bg-neutral-50"
                        : "pointer-events-none border-neutral-200 text-neutral-400"
                    }`}
                  >
                    Skill Proof
                  </a>
                </div>

                <p className="mt-3 text-sm text-neutral-700">
                  <span className="font-semibold">Declaration code:</span>{" "}
                  {verification?.declarationCode || "-"}
                </p>

                <div className="mt-4">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Review Notes
                  </label>
                  <textarea
                    value={reviewNotesByAccount[accountId] || ""}
                    onChange={(event) =>
                      setReviewNotesByAccount((prev) => ({
                        ...prev,
                        [accountId]: event.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Add notes for decision"
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-600"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={isActionLoading}
                    onClick={() => handleReviewDecision(accountId, "approved")}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {isActionLoading ? "Saving..." : "Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={isActionLoading}
                    onClick={() => handleReviewDecision(accountId, "rejected")}
                    className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {isActionLoading ? "Saving..." : "Reject"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RepairerVerificationReview;
