import React from 'react'
import  { useState } from "react";
import { useContext } from "react";
import { RepairContext } from "../Context/ALlContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import validator from 'validator'
import { backend_url } from "../Context/ALlContext";
import toast from "react-hot-toast";
const RepairerLogin = () => {
   const { setcontextusermail, setrepairerAccountId, setrole, setverifyuserorrepairer, refreshUserInfo } = useContext(RepairContext)
     const [email , setemail ] = useState('')
     const [password , setpassword ] = useState('')
     const [islogin , setislogin] = useState(false);
     const navigate = useNavigate();
     const handletologin = async(e)=>{
      e.preventDefault();
      if (!validator.isEmail(email.trim())) {
        return toast.error("Invalid email");
      }
      if (!password.trim()) {
        return toast.error("Password required");
      }
      try {
        const response = await axios.post(
          backend_url + "/api/repairer/repairerlogin",
          { email, password },
          { withCredentials: true }
        );
        const data = response.data;
        if (data.success) {
          setrole("repairer");
          setverifyuserorrepairer("repairer");
          await refreshUserInfo();
          toast.success(data.msg || "Login successful");
          navigate("/repairer/account");
          return;
        }
        toast.error(data.msg || "Invalid credentials");
      } catch (error) {
        console.error("Error occurred while logging in repairer:", error);
        toast.error(error?.response?.data?.msg || "An error occurred while logging in");
      }
     }
      const handletoregister = async(e)=>{
        e.preventDefault();
        if (!validator.isEmail(email.trim())) {
          return toast.error("Invalid email");
        }
        if (!password.trim()) {
          return toast.error("Password required");
        }
        try {
           const response = await axios.post(backend_url + '/api/repairer/register' , {password,  email} , {
            withCredentials:true
           })
        const data = response.data;
        if(data.success){
          setcontextusermail(email);
          setrepairerAccountId(data.accountId || "");
          setverifyuserorrepairer("repairer");
          navigate('/otprepairer')
          toast.success(data.msg || "OTP sent successfully");
        }else
        {
          toast.error(data.msg || "Unable to register");
        }
        } catch (error) {
          console.error("Error occurred while registering repairer:", error);
          toast.error(error?.response?.data?.msg || "An error occurred while registering");
        }
      }
   return (
     <>
       <div className="px-4 py-6 flex flex-col md:flex-row     items-center justify-center h-screen gap-6">
         <img 
           src="/fixora_part1.png"
           alt="Fixora"
           className="hidden md:block w-60 lg:w-80 opacity-8"
         />
  
         <form  onSubmit={ islogin ? handletoregister : handletologin } className="p-5 flex border-0 border-black rounded-2xl  justify-center items-center flex-col gap-3 w-full max-w-md">
 
           <h1 className="text-4xl font-extrabold"> {islogin ? 'Register Repairer' : 'Login Repairer'}</h1>
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
 
             placeholder="Enter your email."
             className="border-2 border-black p-3 w-full rounded-2xl"
           />
 
           <input
             type="password"
             required
             value={password}
             onChange={(e)=>setpassword(e.target.value)}
             placeholder="Enter your password."
             className="border-2 border-black p-3 w-full rounded-2xl"
           />
 
            <button type='submit' className="bg-black  cursor-pointer  p-4 rounded-2xl text-white w-full">
              {islogin ? 'Register':'Login'}
            </button>
  
            <button onClick={()=>setislogin(!islogin)} type='button' className="p-2 cursor-pointer  rounded-2xl text-black w-full">
              {islogin ? "Already have an account? Login" : "Create new account"}
            </button>
         </form>
  
         <img
           src="/ora.png"
           alt="Ora"
           className="hidden opacity-10 md:block w-60 lg:w-80"
         />
 
       </div>
     </>
   );
}

export default RepairerLogin;
