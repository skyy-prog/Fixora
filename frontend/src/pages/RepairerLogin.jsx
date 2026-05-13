import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import { startAuthentication } from "@simplewebauthn/browser";
import toast from "react-hot-toast";
import { RepairContext, backend_url } from "../Context/ALlContext";

const RepairerLogin = () => {
  const {
    setrepairerAccountId,
    setrole,
    setverifyuserorrepairer,
    refreshUserInfo,
  } = useContext(RepairContext);

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    if (!validator.isEmail(email.trim())) {
      return toast.error("Invalid email");
    }
    if (!password.trim()) {
      return toast.error("Password required");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        backend_url + "/api/repairer/repairerlogin",
        { email, password },
        { withCredentials: true }
      );
      const data = response.data;
      if (!data.success) {
        return toast.error(data.msg || "Invalid credentials");
      }
      setrole("repairer");
      setverifyuserorrepairer("repairer");
      await refreshUserInfo();
      toast.success(data.msg || "Login successful");
      navigate("/repairer/account");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "An error occurred while logging in");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validator.isEmail(email.trim())) {
      return toast.error("Invalid email");
    }
    if (!password.trim()) {
      return toast.error("Password required");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        backend_url + "/api/repairer/register",
        { password, email },
        { withCredentials: true }
      );
      const data = response.data;
      if (!data.success) {
        return toast.error(data.msg || "Unable to register");
      }

      setrepairerAccountId(String(data.accountId || ""));
      setverifyuserorrepairer("repairer");
      setrole("repairer");
      await refreshUserInfo();
      toast.success(data.msg || "Repairer account created");
      navigate("/repairer/account");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "An error occurred while registering");
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    if (isRegisterMode) return;
    if (!validator.isEmail(email.trim())) {
      return toast.error("Enter your email first");
    }

    try {
      setPasskeyLoading(true);
      const optionsRes = await axios.post(
        backend_url + "/api/repairer/passkey/login/options",
        { email },
        { withCredentials: true }
      );
      if (!optionsRes.data?.success || !optionsRes.data?.options) {
        return toast.error(optionsRes.data?.msg || "Unable to start passkey login");
      }

      const assertionResponse = await startAuthentication({
        optionsJSON: optionsRes.data.options,
      });

      const verifyRes = await axios.post(
        backend_url + "/api/repairer/passkey/login/verify",
        { email, assertionResponse },
        { withCredentials: true }
      );

      if (!verifyRes.data?.success) {
        return toast.error(verifyRes.data?.msg || "Passkey login failed");
      }

      setrole("repairer");
      setverifyuserorrepairer("repairer");
      await refreshUserInfo();
      toast.success(verifyRes.data?.msg || "Passkey login successful");
      navigate("/repairer/account");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Passkey login failed");
    } finally {
      setPasskeyLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 flex flex-col md:flex-row items-center justify-center h-screen gap-6">
      <img
        src="/fixora_part1.png"
        alt="Fixora"
        className="hidden md:block w-60 lg:w-80 opacity-8"
      />

      <form
        onSubmit={isRegisterMode ? handleRegister : handlePasswordLogin}
        className="p-5 flex rounded-2xl justify-center items-center flex-col gap-3 w-full max-w-md"
      >
        <h1 className="text-4xl font-extrabold">
          {isRegisterMode ? "Register Repairer" : "Login Repairer"}
        </h1>

        <input
          type="email"
          value={email}
          required
          onChange={(e) => setemail(e.target.value)}
          placeholder="Enter your email."
          className="border-2 border-black p-3 w-full rounded-2xl"
        />

        <input
          type="password"
          required
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          placeholder="Enter your password."
          className="border-2 border-black p-3 w-full rounded-2xl"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black cursor-pointer p-4 rounded-2xl text-white w-full disabled:opacity-60"
        >
          {loading ? "Please wait..." : isRegisterMode ? "Register" : "Login"}
        </button>

        {!isRegisterMode && (
          <button
            type="button"
            onClick={handlePasskeyLogin}
            disabled={passkeyLoading}
            className="border border-black cursor-pointer p-3 rounded-2xl text-black w-full disabled:opacity-60"
          >
            {passkeyLoading ? "Waiting for passkey..." : "Login with Passkey"}
          </button>
        )}

        <button
          onClick={() => setIsRegisterMode((prev) => !prev)}
          type="button"
          className="p-2 cursor-pointer rounded-2xl text-black w-full"
        >
          {isRegisterMode ? "Already have an account? Login" : "Create new account"}
        </button>
      </form>

      <img
        src="/ora.png"
        alt="Ora"
        className="hidden opacity-10 md:block w-60 lg:w-80"
      />
    </div>
  );
};

export default RepairerLogin;
