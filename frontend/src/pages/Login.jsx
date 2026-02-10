import React, { useState } from "react";
import { useContext } from "react";
import { RepairContext } from "../Context/ALlContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import validator from 'validator'
import { backend_url } from "../Context/ALlContext";
const Login = () => {
    const {contextusermail , setcontextusermail , } = useContext(RepairContext)
    const [username , setusername ] = useState('')
    const [email , setemail ] = useState('')
    const [password , setpassword ] = useState('')
    const [islogin , setislogin] = useState(false);
    const navigate = useNavigate();
    const handleloginorregistor = async()=>{
    const isValidEmail = validator.isEmail(email.trim());
if (!isValidEmail) return alert("Invalid email");
if (!password.trim()) return alert("Password required");
    }
    const handletologin = async(e)=>{
        e.preventDefault();
        try {
         const response = await axios.post(backend_url + '/api/user/login' , { password,  email} , {
          withCredentials:true
         } )
      const data = response.data;
      if(data.success){
        navigate('/profile')
        alert(data.msg)
         
      }else
      {
        alert(data.msg)
      }
      } catch (error) {
        console.log(error)
      }
       
    }
    const handletoregister = async(e)=>{
      e.preventDefault();
      console.log(backend_url)
      try {
         const response = await axios.post(backend_url + '/api/user/register' , {username , password,  email} , {
          withCredentials:true
         })
      const data = response.data;
      if(data.success){
        navigate('/otp')
        alert(data.msg)
      }else
      {
        alert(data.msg)
      }
      } catch (error) {
        
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

          <h1 className="text-4xl font-extrabold"> {islogin ? 'Register' : 'Login'}</h1>
 
          {islogin &&  <input
            type="text"
            value={username}
            required
            onChange={(e)=>setusername(e.target.value)}
            placeholder="Enter your User."
            className="border-2 border-black p-3 w-full rounded-2xl"
          />}

          <input
            type="email"
            value={email}
            required
            onChange={(e) => {
  const value = e.target.value;
  setemail(value);
   if(islogin){
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

          <button  onClick={handleloginorregistor} type='submit' className="bg-black  cursor-pointer  p-4 rounded-2xl text-white w-full">
            {islogin ? 'Register':'Login'}
          </button>

          <button onClick={()=>setislogin(!islogin)} type='button' className="p-2 cursor-pointer  rounded-2xl text-black w-full">
            Already have an account ?
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
};

export default Login;


 