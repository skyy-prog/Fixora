import React, { useState, useContext } from "react";
import { RepairContext } from "../Context/ALlContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import { backend_url } from "../Context/ALlContext";
import toast from "react-hot-toast";

const Login = () => {
  const { setcontextusermail, verifyuserorrepairer } =
    useContext(RepairContext);

  const [username, setusername] = useState("");
  const [address, setaddress] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [islogin, setislogin] = useState(false);

  const navigate = useNavigate();

  // 🔐 LOGIN
  const handletologin = async (e) => {
    e.preventDefault();

    // Validation
    if (!validator.isEmail(email.trim())) {
      return toast.error("Invalid email");
    }

    if (!password.trim()) {
      return toast.error("Password required");
    }

    try {
      const response = await axios.post(
        backend_url + "/api/user/login",
        { email, password },
        { withCredentials: true }
      );

      const data = response.data;

      if (data.success) {
        const accountId = data.accountInfo.accountId;

        navigate(`/profile/${accountId}`);
        toast.success("Logged In");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  // 📝 REGISTER
  const handletoregister = async (e) => {
    e.preventDefault();

    // Validation
    if (!username.trim() || !address.trim()) {
      return toast.error("Fill all fields");
    }

    if (!validator.isEmail(email.trim())) {
      return toast.error("Invalid email");
    }

    if (!password.trim()) {
      return toast.error("Password required");
    }
    try {
      const response = await axios.post(
        backend_url + "/api/user/register",
        { username, password, email, address , verifyuserorrepairer },
        { withCredentials: true }
      );

      const data = response.data;

      if (data.success) {
        setcontextusermail(email);
        navigate("/otp");
        toast.success("Registered successfully. Enter OTP");
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="px-4 py-6 flex flex-col md:flex-row items-center justify-center h-screen gap-6">
      <img
        src="/fixora_part1.png"
        alt="Fixora"
        className="hidden md:block w-60 lg:w-80 opacity-10"
      />

      <form
        onSubmit={islogin ? handletoregister : handletologin}
        className="p-5 flex rounded-2xl justify-center items-center flex-col gap-3 w-full max-w-md"
      >
        <h1 className="text-4xl font-extrabold">
          {islogin ? "Register" : "Login"}
        </h1>
        {islogin && (
          <>
            <input
              type="text"
              value={username}
              required
              onChange={(e) => setusername(e.target.value)}
              placeholder="Enter your username"
              className="border-2 border-black p-3 w-full rounded-2xl"
            />

            <input
              type="text"
              value={address}
              required
              onChange={(e) => setaddress(e.target.value)}
              placeholder="Enter your address"
              className="border-2 border-black p-3 w-full rounded-2xl"
            />
          </>
        )}

        {/* Email */}
        <input
          type="email"
          value={email}
          required
          onChange={(e) => {
            const value = e.target.value;
            setemail(value);

            if (islogin) {
              setcontextusermail(value);
            }
          }}
          placeholder="Enter your email"
          className="border-2 border-black p-3 w-full rounded-2xl"
        />

        {/* Password */}
        <input
          type="password"
          value={password}
          required
          onChange={(e) => setpassword(e.target.value)}
          placeholder="Enter your password"
          className="border-2 border-black p-3 w-full rounded-2xl"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-black cursor-pointer p-4 rounded-2xl text-white w-full"
        >
          {islogin ? "Register" : "Login"}
        </button>

        {/* Toggle */}
        <button
          onClick={() => setislogin(!islogin)}
          type="button"
          className="p-2 cursor-pointer rounded-2xl text-black w-full"
        >
          {islogin
            ? "Already have an account? Login"
            : "Create new account"}
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

export default Login;