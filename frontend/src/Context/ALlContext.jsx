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
    const [verifyuserorrepairer, setverifyuserorrepairer] = useState("");
  const[role , setrole] = useState(null);
  const [profileId , setProfileId] = useState(null);

  const [PostData ,setPostdatas] = useState(null);
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

  const response = await axios.get(backend_url + "/api/user/me", {
    withCredentials: "include"
  });

  const Data = response.data;

  if (Data.success) {
    setuser(Data);
    setrole(Data?.role);
    console.log(Data.role)
    setisverified(Data.Isverified ? true : false);
    setProfileId(Data.user.accountId)
    console.log(Data.user.accountId);
    const formattedPosts = Data.user.PostData.map((post, index) => ({

      id: index + 1,
      userId: Data.user.accountId,
      userName: Data.user.username,

      deviceType: post.type,
      brand: post.brand,
      model: post.model,

      problemTitle: post.title,
      problemDescription: post.description,

      budgetRange: Number(post.budget),
      urgency: post.urgency,

      images: Object.values(post.images || {}),

      location: {
        city: post.city,
        state: post.state,
        pincode: post.pincode
      },

      preferredRepairType: "Pickup",

      status: "Open",

      createdAt: Date.now(),

      tags: [post.brand, post.type],

      warrantyRequired: post.warrenty === "yes" || post.warrenty === "true"

    }));


    setrepairRequestss(formattedPosts);

  } else {
    setrepairRequestss([]);
  }

} catch (error) {
  if (error.response && error.response.status === 401) {
    // User not logged in → normal case
    console.log("User not logged in");

    setuser(null);
    setrole(null);
    setisverified(false);
    setrepairRequestss([]);

  } else {
    // Real error
    console.error(error);
  }
}
    };
 UserInfo();
} , [])
    
 
  useEffect(() => {
    setrepairRequestss(PostData);
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
     setverifyifuserisloggedInornot,
     isverified ,setisverified,
     verifyuserorrepairer, setverifyuserorrepairer,
     role , setrole,
     profileId , setProfileId
  };

  return (
    <RepairContext.Provider value={value}>{children}</RepairContext.Provider>
  );
};

export default AllContext;
