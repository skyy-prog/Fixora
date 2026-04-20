import React, { useContext } from "react";
import { RepairContext } from "../Context/ALlContext";
import { LANGUAGE_OPTIONS } from "../i18n";

const LanguageSelector = ({ className = "", compact = false }) => {
  const { preferredLanguage, changePreferredLanguage } = useContext(RepairContext);

  return (
    <select
      value={preferredLanguage || "en"}
      onChange={(e) => changePreferredLanguage(e.target.value)}
      className={className || ""}
      style={
        className
          ? undefined
          : {
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              borderRadius: 10,
              fontSize: compact ? 11 : 12,
              padding: compact ? "6px 8px" : "7px 10px",
              outline: "none",
              maxWidth: compact ? 120 : 170,
            }
      }
      aria-label="Language"
    >
      {LANGUAGE_OPTIONS.map((languageItem) => (
        <option key={languageItem.code} value={languageItem.code} style={{ color: "black" }}>
          {languageItem.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
