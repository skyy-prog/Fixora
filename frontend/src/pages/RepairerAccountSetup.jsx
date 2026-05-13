import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { startRegistration } from "@simplewebauthn/browser";
import toast from "react-hot-toast";
import { RepairContext, backend_url } from "../Context/ALlContext";
import LanguageSelector from "../Components/LanguageSelector";

const DEFAULT_SKILLS = [
  "electrician",
  "plumber",
  "carpenter",
  "mechanic",
  "ac_repair",
  "painter",
  "welder",
  "mason",
  "cctv_security",
  "appliance_repair",
  "pest_control",
  "gardener",
  "glass_work",
  "waterproofing",
  "flooring",
  "solar_panels",
  "internet_networking",
  "false_ceiling",
];

const InputField = ({ label, required, className = "", ...props }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    <input
      {...props}
      className="bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
    />
  </div>
);

const FileField = ({ label, required, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-700 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-neutral-900 file:text-white"
    />
  </div>
);

const RepairerAccountSetup = () => {
  const navigate = useNavigate();
  const {
    role,
    user,
    canApproachCustomers,
    repairerProfileCreated,
    refreshUserInfo,
  } = useContext(RepairContext);

  const profileData = useMemo(() => user?.user || {}, [user]);
  const verificationStatus = String(
    user?.repairerVerificationStatus || profileData?.status || "incomplete"
  ).toLowerCase();
  const passkeyConfigured = Boolean(user?.repairerPasskeyConfigured);

  const [username, setUsername] = useState(profileData?.username || "");
  const [personalPhone, setPersonalPhone] = useState(profileData?.personalPhone || "");
  const [shopName, setShopName] = useState(profileData?.shopName || "");
  const [experience, setExperience] = useState(profileData?.experience || 0);
  const [skills, setSkills] = useState(
    Array.isArray(profileData?.skills) ? profileData.skills : []
  );
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [address, setAddress] = useState(profileData?.address || "");
  const [city, setCity] = useState(profileData?.city || "");
  const [pincode, setPincode] = useState(profileData?.pincode || "");
  const [shopPhone, setShopPhone] = useState(profileData?.shopPhone || "");
  const [availability, setAvailability] = useState(profileData?.availability !== false);

  const [shopImageFile, setShopImageFile] = useState(null);
  const [idDocumentFile, setIdDocumentFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [skillProofFile, setSkillProofFile] = useState(null);
  const [declarationCode, setDeclarationCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registeringPasskey, setRegisteringPasskey] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const hasApprovedRepairerProfile =
    repairerProfileCreated && canApproachCustomers && verificationStatus === "approved";

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
    setAvailability(profileData?.availability !== false);
    setDeclarationCode(profileData?.verification?.declarationCode || "");
  }, [profileData]);

  const toggleSkill = (skill) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((item) => item !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const cleaned = customSkillInput.trim().toLowerCase().replace(/\s+/g, "_");
    if (!cleaned) return;
    if (skills.includes(cleaned)) {
      toast.error("Skill already added");
      return;
    }
    setSkills((prev) => [...prev, cleaned]);
    setCustomSkillInput("");
  };

  const createBaseFormData = () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("personalPhone", personalPhone);
    formData.append("shopName", shopName);
    formData.append("experience", String(Number(experience || 0)));
    formData.append("skills", skills.join(","));
    formData.append("address", address);
    formData.append("city", city);
    formData.append("pincode", pincode);
    formData.append("shopPhone", shopPhone || "");
    formData.append("availability", String(Boolean(availability)));
    if (shopImageFile) formData.append("shopImage", shopImageFile);
    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !personalPhone || !shopName || !address || !city || !pincode) {
      return toast.error("Please fill all required fields");
    }

    try {
      setSubmitting(true);
      const formData = createBaseFormData();

      if (hasApprovedRepairerProfile) {
        const response = await axios.put(backend_url + "/api/repairer/profile", formData, {
          withCredentials: true,
        });
        if (!response.data?.success) {
          return toast.error(response.data?.msg || "Unable to update profile");
        }
        await refreshUserInfo();
        toast.success(response.data?.msg || "Profile updated successfully");
        return;
      }

      if (!declarationCode.trim()) {
        return toast.error("Declaration code is required");
      }

      formData.append("declarationCode", declarationCode.trim().toUpperCase());
      if (idDocumentFile) formData.append("idDocumentImage", idDocumentFile);
      if (selfieFile) formData.append("selfieImage", selfieFile);
      if (skillProofFile) formData.append("skillProofImage", skillProofFile);

      const response = await axios.post(backend_url + "/api/repairer/profile/submit", formData, {
        withCredentials: true,
      });
      if (!response.data?.success) {
        return toast.error(response.data?.msg || "Unable to submit verification");
      }

      await refreshUserInfo();
      toast.success(response.data?.msg || "Verification submitted");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Unable to save profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterPasskey = async () => {
    try {
      setRegisteringPasskey(true);
      const optionsRes = await axios.post(
        backend_url + "/api/repairer/passkey/register/options",
        {},
        { withCredentials: true }
      );
      if (!optionsRes.data?.success || !optionsRes.data?.options) {
        return toast.error(optionsRes.data?.msg || "Unable to start passkey setup");
      }

      const attestationResponse = await startRegistration({
        optionsJSON: optionsRes.data.options,
      });

      const verifyRes = await axios.post(
        backend_url + "/api/repairer/passkey/register/verify",
        { attestationResponse },
        { withCredentials: true }
      );
      if (!verifyRes.data?.success) {
        return toast.error(verifyRes.data?.msg || "Passkey setup failed");
      }

      await refreshUserInfo();
      toast.success(verifyRes.data?.msg || "Passkey registered");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Passkey setup failed");
    } finally {
      setRegisteringPasskey(false);
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
        toast.success(response.data?.msg || "Logged out");
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Repairer Security & Profile</h1>
          <p className="text-neutral-500 mt-2">
            {hasApprovedRepairerProfile
              ? "Your repairer profile is approved. Keep details up to date."
              : "Submit strong identity proof for admin approval."}
          </p>

          <div className="mt-5 border border-neutral-200 bg-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <LanguageSelector className="bg-white border border-neutral-200 rounded-lg px-4 py-2 text-sm text-neutral-700 outline-none" />
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

        <div className="mb-6 border rounded-xl p-4 bg-white">
          <p className="text-sm font-semibold">
            Verification status:{" "}
            <span className="uppercase">
              {verificationStatus === "incomplete" ? "not submitted" : verificationStatus}
            </span>
          </p>
          {verificationStatus === "pending" && (
            <p className="text-sm text-amber-700 mt-1">
              Your profile is under review. You can edit and resubmit if needed.
            </p>
          )}
          {verificationStatus === "rejected" && (
            <p className="text-sm text-rose-700 mt-1">
              Your profile was rejected. Update details and submit again with clear documents.
            </p>
          )}
          {hasApprovedRepairerProfile && (
            <p className="text-sm text-emerald-700 mt-1">
              Approved. You can now approach customers and send repair offers.
            </p>
          )}
        </div>

        <div className="mb-6 border rounded-xl p-4 bg-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Passkey security</p>
              <p className="text-xs text-neutral-500 mt-1">
                Use fingerprint/Face ID from your device for phishing-resistant login.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRegisterPasskey}
              disabled={registeringPasskey}
              className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
            >
              {registeringPasskey
                ? "Setting up..."
                : passkeyConfigured
                  ? "Add another passkey"
                  : "Set up passkey"}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-neutral-200 rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Rahul Sharma"
            />
            <InputField
              label="Personal Mobile"
              required
              value={personalPhone}
              onChange={(e) => setPersonalPhone(e.target.value)}
              placeholder="10-digit number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Shop Name"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="e.g. Sharma Electricals"
            />
            <InputField
              label="Experience (Years)"
              type="number"
              min="0"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 5"
            />
          </div>

          <InputField
            label="Address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street, locality"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="City"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Pune"
            />
            <InputField
              label="Pincode"
              required
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="e.g. 411001"
            />
            <InputField
              label="Shop Phone (optional)"
              value={shopPhone}
              onChange={(e) => setShopPhone(e.target.value)}
              placeholder="Landline / alternate"
            />
          </div>

          <div className="border border-neutral-200 rounded-xl p-4">
            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase mb-2">Skills</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {DEFAULT_SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    skills.includes(skill)
                      ? "bg-orange-50 border-orange-300 text-orange-700"
                      : "border-neutral-200"
                  }`}
                >
                  {skill.replace(/_/g, " ")}
                </button>
              ))}
              {skills
                .filter((skill) => !DEFAULT_SKILLS.includes(skill))
                .map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className="px-3 py-2 rounded-lg border text-sm bg-orange-50 border-orange-300 text-orange-700"
                  >
                    {skill.replace(/_/g, " ")}
                  </button>
                ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm"
                placeholder="Add custom skill"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="bg-orange-500 text-white px-4 rounded-lg text-sm"
              >
                Add
              </button>
            </div>
          </div>

          <div
            onClick={() => setAvailability((prev) => !prev)}
            className={`cursor-pointer rounded-xl border p-4 ${
              availability ? "bg-emerald-50 border-emerald-200" : "bg-neutral-50 border-neutral-200"
            }`}
          >
            <p className="text-sm font-semibold">
              {availability ? "Available for jobs" : "Currently unavailable"}
            </p>
          </div>

          <FileField
            label="Shop Image"
            required={!profileData?.shopImage && !shopImageFile}
            onChange={(e) => setShopImageFile(e.target.files?.[0] || null)}
          />

          {!hasApprovedRepairerProfile && (
            <>
              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-3">Identity verification (mandatory)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileField
                    label="Government ID"
                    required
                    onChange={(e) => setIdDocumentFile(e.target.files?.[0] || null)}
                  />
                  <FileField
                    label="Selfie Photo"
                    required
                    onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="mt-4">
                  <FileField
                    label="Skill Proof (certificate/workshop/job card)"
                    required
                    onChange={(e) => setSkillProofFile(e.target.files?.[0] || null)}
                  />
                </div>
                <InputField
                  label="Selfie Declaration Code"
                  required
                  value={declarationCode}
                  onChange={(e) => setDeclarationCode(e.target.value.toUpperCase())}
                  placeholder="Write this code on paper in selfie, e.g. FIXORA-2026"
                  className="mt-4"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-neutral-900 text-white font-semibold rounded-xl py-3.5 text-sm disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : hasApprovedRepairerProfile
                ? "Save Profile Changes"
                : "Submit for Verification"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RepairerAccountSetup;
