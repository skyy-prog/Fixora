import React, { createContext, use, useEffect, useState } from "react";
import { repairRequests, indianStates } from "../assets/assets";
import axios from "axios";
export const RepairContext = createContext();
export const backend_url = import.meta.env.VITE_BACKEND_URL;

const AllContext = ({ children }) => {
  const [repairRequestss, setrepairRequestss] = useState([]);
  const [isverified ,setisverified ] = useState(false);
  const [user, setuser] = useState(null);
  const [Indianstates, setIndianSates] = useState([]);
  const [verifyifuserisloggedInornot , setverifyifuserisloggedInornot] = useState(null)
  const [contextusermail, setcontextusermail] = useState("");
    const [verifyuserorrepairer, setverifyuserorrepairer] = useState("")
  
  const [listdeviceTypes, setlistDeviceTypes] = useState([
    "Phone",
    "Laptop",
    "Headphones",
    "Console",
    "Tablet",
    "Smartwatch",
  ]);

  
  useEffect(()=>{
    const UserInfo = async () => {
      try {
        const response = await axios.get(backend_url + "/api/user/me",{
          withCredentials:'include'
        });
        const Data = await  response.data;
        if (Data.success) {
          setuser(Data.user);
          setisverified(Data.Isverified ? true : false);
        } else {
          setuser(null);
        }
      } catch (error) {
        setuser(null);
      }
    };
 UserInfo();
} , [])
    
 
  useEffect(() => {
    setrepairRequestss(repairRequests);
    setIndianSates(indianStates);
    console.log(verifyuserorrepairer)
  }, []);

  const value = {
    repairRequestss,
    setrepairRequestss,
    Indianstates,
    setIndianSates,
    listdeviceTypes,
    setlistDeviceTypes,
    contextusermail,
    setcontextusermail,
    user,
    setuser,
    verifyifuserisloggedInornot ,
     setverifyifuserisloggedInornot,
     isverified ,setisverified,
     verifyuserorrepairer, setverifyuserorrepairer
  };

  return (
    <RepairContext.Provider value={value}>{children}</RepairContext.Provider>
  );
};

export default AllContext;
