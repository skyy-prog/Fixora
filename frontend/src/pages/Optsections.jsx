import React, { useState, useEffect } from 'react';

const OtpSections = () => {
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [message, setMessage] = useState("");

  // Generate OTP
  const genRandomOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    console.log("Generated OTP:", otp); // remove in production
  };
  useEffect(() => {
    genRandomOTP();
  }, []);
 
  const verifyOtp = (e) => {
    e.preventDefault();

    if (userOtp === generatedOtp) {
      setMessage("OTP Verified ✅");
    } else {
      setMessage("Wrong OTP ❌");
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white shadow-lg rounded-xl p-8 w-[350px] text-center">
    
    <h1 className="text-2xl font-semibold mb-2">Verify OTP</h1>
    <p className="text-gray-500 text-sm mb-6">
      We sent an OTP to your email
    </p>

    <form onSubmit={verifyOtp} className="space-y-4">
      <input
        type="number"
        placeholder="Enter 6-digit OTP"
        value={userOtp}
        onChange={(e) => setUserOtp(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-center text-lg outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
      >
        Verify OTP
      </button>
    </form>

    {message && (
      <p className="mt-4 text-sm font-medium text-green-600">
        {message}
      </p>
    )}

    <button
      type="button"
      className="mt-4 text-blue-600 text-sm hover:underline"
      onClick={genRandomOTP}
    >
      Resend OTP
    </button>

  </div>
</div>

  );
};

export default OtpSections;
