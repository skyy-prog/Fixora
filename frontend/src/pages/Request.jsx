import React, { useContext } from "react";
import { HiOutlineInboxIn } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { RepairContext } from "../Context/ALlContext";

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
};

const Request = ({ open, onClose, list = [], title = "Responses", emptyText = "No responses yet." }) => {
  const { t } = useTranslation();
  const { role } = useContext(RepairContext);
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        background: "rgba(10,10,10,0.5)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "680px",
          maxHeight: "86vh",
          overflow: "hidden",
          borderRadius: "18px",
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 18px 56px rgba(0,0,0,0.22)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "14px 16px",
            borderBottom: "1px solid #f0ece6",
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, fontSize: "15px", color: "#0a0a0a" }}>
            <HiOutlineInboxIn size={16} style={{ marginRight: 7, verticalAlign: "text-bottom" }} />
            {title} ({list.length})
          </p>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              display: "grid",
              placeItems: "center",
              borderRadius: 8,
              border: "1px solid #ece7e0",
              background: "#faf8f5",
              cursor: "pointer",
            }}
          >
            <RxCross2 size={14} />
          </button>
        </div>

        <div style={{ padding: "12px", overflowY: "auto" }}>
          {list.length === 0 ? (
            <div
              style={{
                border: "1px dashed #e7e2da",
                borderRadius: "14px",
                padding: "22px 16px",
                textAlign: "center",
                color: "#9e9489",
                fontSize: "13px",
              }}
            >
              {emptyText || t("noResponsesYet")}
            </div>
          ) : (
            list.map((item, index) => (
              <div
                key={item?.requestId || index}
                style={{
                  border: "1px solid #eee9e2",
                  borderRadius: "14px",
                  padding: "12px 14px",
                  marginBottom: "10px",
                  background: "#fff",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#1e1a16" }}>
                    {item?.repairerName || "Repairer"}
                  </p>
                  <span
                    style={{
                      fontSize: "11px",
                      textTransform: "capitalize",
                      color: "#075985",
                      background: "#e0f2fe",
                      border: "1px solid #bae6fd",
                      borderRadius: "999px",
                      padding: "2px 8px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item?.status || "pending"}
                  </span>
                </div>

                {(item?.repairerShopName || item?.repairerPhone) && (
                  <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#675d54" }}>
                    {[item?.repairerShopName, item?.repairerPhone].filter(Boolean).join(" • ")}
                  </p>
                )}

                <p style={{ margin: "0 0 7px", fontSize: "13px", color: "#34302c", lineHeight: 1.45 }}>
                  {item?.offerMessage || "No offer message"}
                </p>

                <p style={{ margin: 0, fontSize: "11px", color: "#9d9287" }}>
                  {t("requestSent")}: {formatDateTime(item?.createdAt)}
                </p>
                {((role === "user" && item?.repairerAccountId) ||
                  (role === "repairer" && item?.userAccountId)) && (
                  <div style={{ marginTop: 8 }}>
                    <Link
                      to={`/chats?with=${
                        role === "user" ? item.repairerAccountId : item.userAccountId
                      }${item?.problemId ? `&problemId=${item.problemId}` : ""}`}
                      onClick={onClose}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#111827",
                        border: "1px solid #d1d5db",
                        borderRadius: "999px",
                        padding: "4px 10px",
                        textDecoration: "none",
                        background: "#f9fafb",
                      }}
                    >
                      Open Chat
                    </Link>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Request;
