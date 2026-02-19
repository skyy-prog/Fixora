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
  const [listdeviceTypes, setlistDeviceTypes] = useState([
    "Phone",
    "Laptop",
    "Headphones",
    "Console",
    "Tablet",
    "Smartwatch",
  ]);

  useEffect(() => {
    const UserInfo = async () => {
      try {
        const response = await axios.get(backend_url + "/api/user/me",{
          withCredentials:'include'
        });
        const Data = await  response.data;
        if (Data.success) {
          setuser(Data.user);
          setisverified(Data.user.isVerified ? true : false);
          console.log(Data);
        } else {
          setuser(null);
        }
      } catch (error) {
        console.log("errror");
        setuser(null);
      }
    };

    UserInfo();
  }, []);
  useEffect(() => {
    setrepairRequestss(repairRequests);
    setIndianSates(indianStates);
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
     setverifyifuserisloggedInornot
  };

  return (
    <RepairContext.Provider value={value}>{children}</RepairContext.Provider>
  );
};

export default AllContext;
