import React, { useState, useContext } from "react";
import { RepairContext, backend_url } from "../Context/ALlContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OtpSections = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { contextusermail } = useContext(RepairContext);
  const email = contextusermail;

  const handletoOTPsection = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        backend_url + "/api/user/otpverify",
        { email, otp }
      );

      const data = response.data;

      if (data.success) {
        setMessage("OTP verified successfully");
        alert(data.msg);
        navigate("/");
      } else {
        setMessage(data.msg || "Invalid OTP");
      }
    } catch (error) {
      setMessage("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

     
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-black-600">Fixora</div>
          <h2 className="text-xl font-semibold mt-2">OTP Verification</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter the 6-digit code sent to your email
          </p>
        </div>
  
        <form onSubmit={handletoOTPsection} className="space-y-4">

          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="••••••"
            className="w-full text-center text-2xl tracking-widest border border-gray-300 rounded-xl py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white  hover:bg-indigo-700  py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
 
        {message && (
          <p className="text-center mt-4 text-sm font-medium text-red-500">
            {message}
          </p>
        )}
 
        <div className="text-center mt-6">
          <button
            type="button"
            className="text-black  font-medium hover:underline"
          >
            Resend OTP
          </button>
        </div>

      </div>

    </div>
  );
};

export default OtpSections;