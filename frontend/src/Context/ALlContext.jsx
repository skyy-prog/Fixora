import React, { createContext, useEffect, useState } from "react";
import { indianStates } from "../assets/assets";
import axios from "axios";
import i18n, { LANGUAGE_OPTIONS } from "../i18n";
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
  const [repairerAccountId, setrepairerAccountId] = useState("");
  const [repairerProfileCreated, setrepairerProfileCreated] = useState(false);
  const [repairerPhoneVerified, setrepairerPhoneVerified] = useState(false);
  const [canApproachCustomers, setcanApproachCustomers] = useState(false);
  const[role , setrole] = useState(null);
  const [profileId , setProfileId] = useState(null);
  const [PostData ,setPostdatas] = useState(null);
  const [preferredLanguage, setPreferredLanguage] = useState(
    localStorage.getItem("fixora_lang") || "en"
  );
  const [listdeviceTypes, setlistDeviceTypes] = useState([
    "Phone",
    "Laptop",
    "Headphones",
    "Console",
    "Tablet",
    "Smartwatch",
  ]);

  const refreshUserInfo = async () => {
try {

  const response = await axios.get(backend_url + "/api/user/me", {
    withCredentials: "include"
  });

  const Data = response.data;

  if (Data.success) {
    setuser(Data);
    setrole(Data?.role);
    setisverified(Data.Isverified ? true : false);
    setrepairerProfileCreated(Boolean(Data?.repairerProfileCreated));
    setrepairerPhoneVerified(Boolean(Data?.repairerPhoneVerified));
    setcanApproachCustomers(Boolean(Data?.canApproachCustomers));
    const validServerLanguage = LANGUAGE_OPTIONS.some(
      (languageItem) => languageItem.code === Data?.preferredLanguage
    )
      ? Data?.preferredLanguage
      : null;
    const locallyStoredLanguage = localStorage.getItem("fixora_lang");
    const selectedLanguage =
      validServerLanguage && validServerLanguage !== "en"
        ? validServerLanguage
        : locallyStoredLanguage || validServerLanguage || "en";
    setPreferredLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
    document.documentElement.dir = selectedLanguage === "ur" ? "rtl" : "ltr";
    localStorage.setItem("fixora_lang", selectedLanguage);
    if (
      validServerLanguage === "en" &&
      locallyStoredLanguage &&
      locallyStoredLanguage !== "en"
    ) {
      axios
        .patch(
          backend_url + "/api/user/language",
          { language: locallyStoredLanguage },
          { withCredentials: true }
        )
        .catch(() => {});
    }

    const currentAccountId = Data?.user?.accountId || Data?.accountId || null;
    setProfileId(currentAccountId);
    setrepairerAccountId(currentAccountId || "");

    const postData = Array.isArray(Data?.user?.PostData) ? Data.user.PostData : [];
    const formattedPosts = postData.map((post, index) => ({
      id: post?.problemId || `${currentAccountId || "user"}-${index + 1}`,
      problemId: post?.problemId || `${currentAccountId || "user"}-${index + 1}`,
      userId: currentAccountId,
      userName: Data?.user?.username || "User",

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

      preferredRepairType: post?.preferredRepairType || "Pickup",

      status: post?.status || "Open",

      createdAt: post?.createdAt || Date.now(),

      tags: [post.brand, post.type],

      warrantyRequired: post.warrenty === "yes" || post.warrenty === "true",
      repairRequests: Array.isArray(post?.repairRequests) ? post.repairRequests : [],
      repairRequestsCount: Array.isArray(post?.repairRequests) ? post.repairRequests.length : 0,
      hasRequestedByCurrentRepairer: false

    }));


    setrepairRequestss(formattedPosts);

  } else {
    setuser(null);
    setrole(null);
    setProfileId(null);
    setrepairerAccountId("");
    setrepairerProfileCreated(false);
    setrepairerPhoneVerified(false);
    setcanApproachCustomers(false);
    setisverified(false);
    setrepairRequestss([]);
  }

} catch (error) {
  if (error.response && error.response.status === 401) {
    // User not logged in → normal case
    console.log("User not logged in");

    setuser(null);
    setrole(null);
    setProfileId(null);
    setrepairerAccountId("");
    setrepairerProfileCreated(false);
    setrepairerPhoneVerified(false);
    setcanApproachCustomers(false);
    setisverified(false);
    setrepairRequestss([]);

  } else {
    // Real error
    console.error(error);
  }
}
  };

  const changePreferredLanguage = async (languageCode) => {
    const normalizedLanguage = String(languageCode || "").trim().toLowerCase();
    const isSupported = LANGUAGE_OPTIONS.some(
      (languageItem) => languageItem.code === normalizedLanguage
    );
    if (!isSupported) return;

    setPreferredLanguage(normalizedLanguage);
    i18n.changeLanguage(normalizedLanguage);
    document.documentElement.dir = normalizedLanguage === "ur" ? "rtl" : "ltr";
    localStorage.setItem("fixora_lang", normalizedLanguage);

    try {
      await axios.patch(
        backend_url + "/api/user/language",
        { language: normalizedLanguage },
        { withCredentials: true }
      );
    } catch (error) {
      if (error?.response?.status === 401) {
        return;
      }
      console.log(error?.response?.data || error?.message);
    }
  };

  useEffect(()=>{
    refreshUserInfo();
  } , [])
    
 
  useEffect(() => {
    if (Array.isArray(PostData)) {
      setrepairRequestss(PostData);
    }
    setIndianSates(indianStates);
    const initialLanguage = localStorage.getItem("fixora_lang") || "en";
    i18n.changeLanguage(initialLanguage);
    document.documentElement.dir = initialLanguage === "ur" ? "rtl" : "ltr";
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
     profileId , setProfileId,
     repairerAccountId,
     setrepairerAccountId,
     repairerProfileCreated,
     setrepairerProfileCreated,
     repairerPhoneVerified,
     setrepairerPhoneVerified,
     canApproachCustomers,
     setcanApproachCustomers,
     refreshUserInfo,
     preferredLanguage,
     setPreferredLanguage,
     changePreferredLanguage
  };

  return (
    <RepairContext.Provider value={value}>{children}</RepairContext.Provider>
  );
};

export default AllContext;



// import React, { createContext, useEffect, useState } from "react";
// import { indianStates } from "../assets/assets";
// import axios from "axios";

// export const RepairContext = createContext();
// export const backend_url = import.meta.env.VITE_BACKEND_URL;

// const AllContext = ({ children }) => {

//   const [repairRequestss, setrepairRequestss] = useState([]);
//   const [user, setuser] = useState(null);
//   const [loading, setLoading] = useState(true); // ✅ IMPORTANT
//   const [Indianstates, setIndianSates] = useState([]);
//   const [contextusermail, setcontextusermail] = useState("");
//   const [role, setrole] = useState(null);
//   const [profileId, setProfileId] = useState(null);

//   const [listdeviceTypes, setlistDeviceTypes] = useState([
//     "Phone",
//     "Laptop",
//     "Headphones",
//     "Console",
//     "Tablet",
//     "Smartwatch",
//   ]);

//   // ✅ AUTH + USER FETCH
//   useEffect(() => {
//     const UserInfo = async () => {
//       try {
//         const response = await axios.get(backend_url + "/api/user/me", {
//           withCredentials: "include"
//         });

//         const Data = response.data;

//         if (Data.success) {
//           setuser(Data);  
//           setrole(Data.role);
//           setProfileId(Data.user.accountId);

//           const formattedPosts = Data.user.PostData?.map((post, index) => ({
//             id: index + 1,
//             userId: Data.user.accountId,
//             userName: Data.user.username,

//             deviceType: post.type,
//             brand: post.brand,
//             model: post.model,

//             problemTitle: post.title,
//             problemDescription: post.description,

//             budgetRange: Number(post.budget),
//             urgency: post.urgency,

//             images: Object.values(post.images || {}),

//             location: {
//               city: post.city,
//               state: post.state,
//               pincode: post.pincode
//             },

//             preferredRepairType: "Pickup",
//             status: "Open",
//             createdAt: Date.now(),

//             tags: [post.brand, post.type],
//             warrantyRequired:
//               post.warrenty === "yes" || post.warrenty === "true"
//           })) || [];

//           setrepairRequestss(formattedPosts);

//         } else {
//           setuser(false);
//           setrepairRequestss([]);
//         }

//       } catch (error) {
//         if (error.response?.status === 401) {
//           setuser(false); 
//           setrole(null);
//           setrepairRequestss([]);
//         } else {
//           console.error(error);
//         }
//       } finally {
//         setLoading(false);  
//       }
//     };

//     UserInfo();
//   }, []);

//   // ✅ static data
//   useEffect(() => {
//     setIndianSates(indianStates);
//   }, []);

//   const value = {
//     repairRequestss,
//     setrepairRequestss,
//     Indianstates,
//     listdeviceTypes,
//     contextusermail,
//     setcontextusermail,
//     user,
//     loading, // ✅ expose this
//     role,
//     profileId
//   };

//   return (
//     <RepairContext.Provider value={value}>
//       {children}
//     </RepairContext.Provider>
//   );
// };

// export default AllContext;
