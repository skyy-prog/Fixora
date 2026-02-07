import React, { useState, useContext } from 'react';
import { RepairContext } from '../Context/ALlContext';
import { backend_url } from '../Context/ALlContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const OtpSections = () => {
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otp, setotp] = useState("");
  const [message, setMessage] = useState("");
  const Navigate = useNavigate();
  const {contextusermail} = useContext(RepairContext)
  const email = contextusermail;
  const handletoOTPsection = async(e)=>{
    e.preventDefault();
    try {
      const response = await axios.post(backend_url+'/api/user/otpverify' , {email, otp})
      const data  = response.data;
      if(data.success){
        Navigate('/')
        alert(data.msg);
      }
    } catch (error) {
      
    }
  }
  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white shadow-lg rounded-xl p-8 w-[350px] text-center">
    
    <h1 className="text-2xl font-semibold mb-2">Verify OTP</h1>
    <p className="text-gray-500 text-sm mb-6">
      We sent an OTP to your email
    </p>

    <form onClick={handletoOTPsection} className="space-y-4">
      <input
        type="number"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setotp(e.target.value)}
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
    >
      Resend OTP
    </button>
  </div>
</div>

  );
};

export default OtpSections;
