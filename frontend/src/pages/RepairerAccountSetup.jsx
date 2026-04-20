import React, { useContext, useEffect, useMemo, useState } from "react";
import { RepairContext, backend_url } from "../Context/ALlContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../Components/LanguageSelector";

const DEFAULT_SKILL_OPTIONS = [
  { value: "electrician", label: "Electrician",  },
  { value: "plumber", label: "Plumber",  },
  { value: "carpenter", label: "Carpenter",  },
  { value: "mechanic", label: "Mechanic",  },
  { value: "ac_repair", label: "AC Repair",  },
  { value: "painter", label: "Painter",  },
  { value: "welder", label: "Welder",  },
  { value: "mason", label: "Mason / Civil",  },
  { value: "cctv_security", label: "CCTV & Security",  },
  { value: "appliance_repair", label: "Appliance Repair", icon: "" },
  { value: "pest_control", label: "Pest Control",  },
  { value: "gardener", label: "Gardener",  },
  { value: "glass_work", label: "Glass & Glazing",  },
  { value: "waterproofing", label: "Waterproofing",  },
  { value: "flooring", label: "Flooring",  },
  { value: "solar_panels", label: "Solar Panels", icon: "" },
  { value: "internet_networking", label: "Internet / Networking",  },
  { value: "false_ceiling", label: "False Ceiling",  },
];

const InputField = ({ label, required, className = "", ...props }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    <input
      {...props}
      className="
        bg-white border border-neutral-200 rounded-xl px-4 py-3
        text-neutral-900 placeholder-neutral-400 text-sm
        transition-all duration-200 outline-none
        hover:border-neutral-300
        focus:border-orange-400 focus:ring-2 focus:ring-orange-100
        disabled:bg-neutral-50 disabled:text-neutral-400
      "
    />
  </div>
);

const RepairerAccountSetup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    role,
    user,
    canApproachCustomers,
    repairerProfileCreated,
    repairerPhoneVerified,
    refreshUserInfo,
  } = useContext(RepairContext);

  const profileData = useMemo(() => user?.user || {}, [user]);

  const [username, setUsername] = useState(profileData?.username || "");
  const [personalPhone, setPersonalPhone] = useState(profileData?.personalPhone || "");
  const [shopName, setShopName] = useState(profileData?.shopName || "");
  const [experience, setExperience] = useState(profileData?.experience || 0);
  const [skills, setSkills] = useState(
    Array.isArray(profileData?.skills) ? profileData.skills : []
  );
  const [address, setAddress] = useState(profileData?.address || "");
  const [city, setCity] = useState(profileData?.city || "");
  const [pincode, setPincode] = useState(profileData?.pincode || "");
  const [shopPhone, setShopPhone] = useState(profileData?.shopPhone || "");
  const [shopImageFile, setShopImageFile] = useState(null);
  const [shopImagePreview, setShopImagePreview] = useState(profileData?.shopImage || "");
  const [availability, setAvailability] = useState(profileData?.availability !== false);

  const [customSkillInput, setCustomSkillInput] = useState("");
  const [customSkills, setCustomSkills] = useState([]);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const hasVerifiedRepairerProfile =
    repairerProfileCreated && repairerPhoneVerified && canApproachCustomers;

  useEffect(() => {
    if (role && role !== "repairer") {
      navigate("/", { replace: true });
    }
  }, [role, navigate]);

  useEffect(() => {
    setUsername(profileData?.username || "");
    setPersonalPhone(profileData?.personalPhone || "");
    setShopName(profileData?.shopName || "");
    setExperience(profileData?.experience || 0);
    setSkills(Array.isArray(profileData?.skills) ? profileData.skills : []);
    setAddress(profileData?.address || "");
    setCity(profileData?.city || "");
    setPincode(profileData?.pincode || "");
    setShopPhone(profileData?.shopPhone || "");
    setShopImageFile(null);
    setShopImagePreview(profileData?.shopImage || "");
    setAvailability(profileData?.availability !== false);
  }, [profileData]);

  useEffect(() => {
    return () => {
      if (shopImagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(shopImagePreview);
      }
    };
  }, [shopImagePreview]);

  const handleShopImageChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (shopImagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(shopImagePreview);
    }

    setShopImageFile(selectedFile);
    setShopImagePreview(URL.createObjectURL(selectedFile));
  };

  const toggleSkill = (value) => {
    setSkills((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    const val = trimmed.toLowerCase().replace(/\s+/g, "_");
    if (customSkills.find((s) => s.value === val) || DEFAULT_SKILL_OPTIONS.find((s) => s.value === val)) {
      toast.error("Skill already exists");
      return;
    }
    const newSkill = { value: val, label: trimmed, icon: "🛠️", custom: true };
    setCustomSkills((prev) => [...prev, newSkill]);
    setSkills((prev) => [...prev, val]);
    setCustomSkillInput("");
  };

  const removeCustomSkill = (val) => {
    setCustomSkills((prev) => prev.filter((s) => s.value !== val));
    setSkills((prev) => prev.filter((s) => s !== val));
  };

  const allSkillOptions = [...DEFAULT_SKILL_OPTIONS, ...customSkills];
  const selectedCount = skills.length;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!username || !personalPhone || !shopName || !address || !city || !pincode) {
      return toast.error("Please fill all required fields");
    }
    if (!hasVerifiedRepairerProfile && !shopImageFile && !shopImagePreview) {
      return toast.error("Please upload your shop image");
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("personalPhone", personalPhone);
    formData.append("shopName", shopName);
    formData.append("experience", String(Number(experience)));
    formData.append("skills", skills.join(","));
    formData.append("address", address);
    formData.append("city", city);
    formData.append("pincode", pincode);
    formData.append("shopPhone", shopPhone || "");
    formData.append("availability", String(Boolean(availability)));
    if (shopImageFile) {
      formData.append("shopImage", shopImageFile);
    }

    try {
      setSendingOtp(true);
      const response = hasVerifiedRepairerProfile
        ? await axios.put(
            backend_url + "/api/repairer/profile",
            formData,
            { withCredentials: true }
          )
        : await axios.post(
            backend_url + "/api/repairer/profile/send-phone-otp",
            formData,
            { withCredentials: true }
          );
      if (response.data?.success) {
        if (hasVerifiedRepairerProfile) {
          await refreshUserInfo();
          toast.success(response.data.msg || "Profile updated successfully");
          return;
        }
        setOtpSent(true);
        toast.success(response.data.msg || "OTP sent successfully");
        return;
      }
      toast.error(
        response.data?.msg ||
          (hasVerifiedRepairerProfile ? "Unable to update profile" : "Unable to send OTP")
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.msg ||
          (hasVerifiedRepairerProfile ? "Unable to update profile" : "Unable to send OTP")
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      return toast.error("Enter a valid 6-digit OTP");
    }
    try {
      setVerifyingOtp(true);
      const response = await axios.post(
        backend_url + "/api/repairer/profile/verify-phone-otp",
        { otp },
        { withCredentials: true }
      );
      if (response.data?.success) {
        await refreshUserInfo();
        toast.success(response.data.msg || "Profile created successfully");
        navigate("/repairer/account");
        return;
      }
      toast.error(response.data?.msg || "OTP verification failed");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "OTP verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const response = await axios.post(
        backend_url + "/api/user/logout",
        {},
        { withCredentials: true }
      );
      if (response.data?.success) {
        await refreshUserInfo();
        toast.success(response.data.msg || "Logged out successfully");
        navigate("/", { replace: true });
        return;
      }
      toast.error(response.data?.msg || "Unable to logout");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Unable to logout");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 px-4 py-16">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
            {hasVerifiedRepairerProfile ? t("repairerDashboard") : t("repairerOnboarding")}
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">
            {hasVerifiedRepairerProfile ? t("dashboardAndProfile") : t("accountSetup")}
          </h1>
          <p className="text-neutral-500 mt-2 text-base">
            {hasVerifiedRepairerProfile
              ? t("manageProfileDetails")
              : t("completeProfileStart")}
          </p>

          <div className="mt-5 border border-neutral-200 bg-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-neutral-800">{t("accountSession")}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{t("signOutDashboard")}</p>
            </div>
            <LanguageSelector
              className="bg-white border border-neutral-200 rounded-lg px-4 py-2 text-sm text-neutral-700 outline-none"
            />
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loggingOut ? t("loggingOut") : t("logout")}
            </button>
          </div>
        </div>

        {/* Verified Banner */}
        {repairerProfileCreated && repairerPhoneVerified && canApproachCustomers && (
          <div className="mb-6 flex items-start gap-3 border border-emerald-200 bg-emerald-50 rounded-2xl p-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-base flex-shrink-0">✓</div>
            <div>
              <p className="font-semibold text-emerald-800 text-sm">Profile Verified</p>
              <p className="text-emerald-600 text-sm mt-0.5">You can now access customer repair requests.</p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Progress indicator */}
          {!hasVerifiedRepairerProfile && (
            <div className="h-1 bg-neutral-100">
              <div
                className="h-full bg-orange-400 transition-all duration-700 ease-out rounded-full"
                style={{ width: otpSent ? "100%" : "50%" }}
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Step 1 label */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">1</div>
              <span className="text-sm font-semibold text-neutral-700">
                {hasVerifiedRepairerProfile ? "Update Profile Details" : "Personal & Shop Details"}
              </span>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-5">

              {/* Personal Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <InputField
                  label="Personal Mobile"
                  required
                  placeholder="10-digit number"
                  value={personalPhone}
                  onChange={(e) => setPersonalPhone(e.target.value)}
                />
              </div>

              {/* Shop Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Shop Name"
                  required
                  placeholder="e.g. Sharma Electricals"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
                <InputField
                  label="Experience (Years)"
                  type="number"
                  min="0"
                  placeholder="e.g. 5"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                  Shop Image {hasVerifiedRepairerProfile ? "" : <span className="text-orange-500">*</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleShopImageChange}
                  className="bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-700 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-neutral-900 file:text-white file:cursor-pointer hover:border-neutral-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
                />
                {shopImagePreview && (
                  <img
                    src={shopImagePreview}
                    alt="Shop preview"
                    className="w-full max-w-xs h-40 object-cover rounded-xl border border-neutral-200"
                  />
                )}
              </div>

              {/* Address */}
              <InputField
                label="Address"
                required
                placeholder="Street, locality"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="col-span-2"
              />

              {/* City / Pincode / Shop Phone */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="City"
                  required
                  placeholder="e.g. Pune"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <InputField
                  label="Pincode"
                  required
                  placeholder="e.g. 411001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
                <InputField
                  label="Shop Phone (optional)"
                  placeholder="Landline / alternate"
                  value={shopPhone}
                  onChange={(e) => setShopPhone(e.target.value)}
                />
              </div>

              {/* Availability Toggle */}
              <div
                onClick={() => setAvailability((v) => !v)}
                className={`
                  flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none
                  ${availability
                    ? "bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                    : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100"}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-5 rounded-full transition-all duration-300 relative ${availability ? "bg-emerald-500" : "bg-neutral-300"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${availability ? "left-4" : "left-0.5"}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${availability ? "text-emerald-800" : "text-neutral-600"}`}>
                      {availability ? "Available for jobs" : "Currently unavailable"}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">Customers can discover and contact you</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${availability ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-500"}`}>
                  {availability ? "ON" : "OFF"}
                </span>
              </div>

              {/* Skills Section */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-b border-neutral-200">
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">Skills</p>
                    <p className="text-xs text-neutral-400 mt-0.5">Select all that apply</p>
                  </div>
                  {selectedCount > 0 && (
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {selectedCount} selected
                    </span>
                  )}
                </div>

                <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {allSkillOptions.map((skill) => {
                    const isSelected = skills.includes(skill.value);
                    return (
                      <button
                        key={skill.value}
                        type="button"
                        onClick={() => toggleSkill(skill.value)}
                        className={`
                          relative flex items-center gap-2 p-2.5 rounded-xl border text-sm font-medium text-left
                          transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]
                          ${isSelected
                            ? "bg-orange-50 border-orange-300 text-orange-800"
                            : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
                          }
                        `}
                      >
                        <span className="text-base leading-none">{skill.icon}</span>
                        <span className="flex-1">{skill.label}</span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center flex-shrink-0">✓</span>
                        )}
                        {skill.custom && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeCustomSkill(skill.value); }}
                            className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-500 text-xs flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
                          >
                            ×
                          </button>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom skill input */}
                <div className="px-4 pb-4 border-t border-neutral-100 pt-3">
                  <p className="text-xs text-neutral-400 mb-2 font-medium">Don't see your skill? Add it:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Inverter Repair, Roofing..."
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
                      className="
                        flex-1 bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm
                        text-neutral-900 placeholder-neutral-400 outline-none
                        focus:border-orange-400 focus:ring-2 focus:ring-orange-100
                        transition-all duration-200
                      "
                    />
                    <button
                      type="button"
                      onClick={addCustomSkill}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-150 active:scale-95 whitespace-nowrap"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sendingOtp}
                className="
                  w-full bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99]
                  text-white font-semibold rounded-xl py-3.5 text-sm
                  transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                "
              >
                {sendingOtp ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    {hasVerifiedRepairerProfile ? "Saving..." : "Sending OTP..."}
                  </>
                ) : (
                  <>{hasVerifiedRepairerProfile ? "Save Profile Changes" : "Send Mobile OTP →"}</>
                )}
              </button>
            </form>
          </div>

          {/* OTP Section */}
          {!hasVerifiedRepairerProfile && otpSent && (
            <div className="border-t border-neutral-100 bg-neutral-50 p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">2</div>
                <span className="text-sm font-semibold text-neutral-700">Verify Mobile OTP</span>
              </div>

              <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
                <span className="text-blue-500 text-lg">📱</span>
                <p className="text-sm text-blue-700">
                  An OTP has been sent to <span className="font-semibold">{personalPhone}</span>. Enter it below to verify and create your profile.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <input
                    className="
                      w-full bg-white border border-neutral-200 rounded-xl px-4 py-3
                      text-neutral-900 placeholder-neutral-400 text-base tracking-widest font-mono
                      outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100
                      transition-all duration-200
                    "
                    placeholder="— — — — — —"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <button
                  type="submit"
                  disabled={verifyingOtp}
                  className="
                    bg-orange-500 hover:bg-orange-600 active:scale-[0.99]
                    text-white font-semibold rounded-xl px-6 py-3 text-sm
                    transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2 whitespace-nowrap
                  "
                >
                  {verifyingOtp ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    "Verify & Create Profile ✓"
                  )}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="mt-3 text-xs text-neutral-400 hover:text-neutral-600 transition-colors underline underline-offset-2"
              >
                Go back and edit details
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-neutral-400 mt-6">
          Your profile information is used only to connect you with relevant repair requests.
        </p>
      </div>
    </div>
  );
};

export default RepairerAccountSetup;
