// import React, { useContext, useState } from "react";
// import { backend_url, RepairContext } from "../Context/ALlContext";
// import { indianStates } from "../assets/assets";
// import axios from "axios";
// import toast from "react-hot-toast";

// const AddProblems = () => {
//   const {repairRequestss, setrepairRequestss,listdeviceTypes } = useContext(RepairContext);

//   const [images, setImages] = useState([null, null, null]);

//   const [title, setitle] = useState("");
//   const [description, setdescription] = useState("");
//   const [brand, setbrand] = useState("");
//   const [model, setmodel] = useState("");
//   const [states, setstates] = useState("");
//   const [city, setcity] = useState("");
//   const [pincode, setpincode] = useState("");
//   const [warrenty, setwarrenty] = useState(false);
//   const [urgnecy, seturgency] = useState("");
//   const [budget, setbudget] = useState("");
//   const [type ,settype] = useState("");
//   const [image1, setimage1] = useState(null);
//   const [image2, setimage2] = useState(null);
//   const [image3, setimage3] = useState(null);
//   const [finalProblems , setfinalproblems] = useState(null)
//   const handleImageChange = (e, index) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const updated = [...images];
//     updated[index] = URL.createObjectURL(file);
//     setImages(updated);

//     if (index === 0) setimage1(file);
//     if (index === 1) setimage2(file);
//     if (index === 2) setimage3(file);
//   };
//  const handletopostheporoblem = (e) => {
//   e.preventDefault();

//   const NewProblems = {
//     deviceType: type,
//     brand,
//     model,
//     title: title,
//     description: description,
//     budget: budget,
//     urgency: urgnecy,
//     images,
//     location: {
//       city,
//       state: states,
//       pincode,
//     },
//     warrenty: warrenty,
//     status: "Open",
//     createdAt: Date.now(),
//   };

//   setrepairRequestss((prev) => [...prev, NewProblems]);

//   // reset form
//   setitle("");
//   setdescription("");
//   setbrand("");
//   setmodel("");
//   setstates("");
//   setcity("");
//   setpincode("");
//   setwarrenty(false);
//   seturgency("");
//   setbudget("");
//   settype("");
//   setImages([null,null,null]);
//   setimage1(null);
//   setimage2(null);
//   setimage3(null);

//   console.log(NewProblems);
//   setfinalproblems(NewProblems);
//   postProblems();
// };

// const postProblems = async () => {
//   try {

//     const formData = new FormData();

//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("brand", brand);
//     formData.append("model", model);
//     formData.append("state", states);
//     formData.append("city", city);
//     formData.append("pincode", pincode);
//     formData.append("warrenty", warrenty);
//     formData.append("urgency", urgnecy);
//     formData.append("budget", budget);
//     formData.append("type", type);

//     formData.append("image1", image1);
//     formData.append("image2", image2);
//     formData.append("image3", image3);

//     const response = await axios.post(
//       backend_url + "/api/product/post",
//       formData,
//       {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );
//     if(response?.data?.success){
//       toast.success("Problem Published")
//     }

//     console.log(response?.data);

//   } catch (error) {
//     console.log(error?.message);
//   }
// };
//   return (
//     <div className="mb-10 mt-10  text-black p-8 rounded-lg max-w-xl mx-auto bg-white border border-gray-200  shadow-sm space-y-5">
//       <form onSubmit={handletopostheporoblem} className="space-y-5">
//   <h1 className="text-2xl font-semibold">Add New Problem</h1>
//   <p className="text-sm text-gray-500">Fill details about your device issue</p>

//   <div className="flex gap-3 flex-col sm:flex-row">
//     {[0,1,2].map((i) => (
//       <label
//         key={i}
//         className="relative flex items-center justify-center h-32 w-full border border-gray-300 rounded-lg cursor-pointer bg-gray-50 overflow-hidden"
//       >
//         {images[i] ? (
//           <img src={images[i]} className="absolute inset-0 w-full h-full object-cover" alt="" />
//         ) : (
//           <span className="text-gray-500 text-sm">Add Image</span>
//         )}
//         <input
//           type="file"
//           accept="image/*"
//           required
//           onChange={(e) => handleImageChange(e, i)}
//           className="absolute inset-0 opacity-0 cursor-pointer"
//         />
//       </label>
//     ))}
//   </div>

//   <input
//     type="text"
//     placeholder="Enter the title of problem"
//     value={title}
//     required
//     onChange={(e) => setitle(e.target.value)}
//     className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
//   />

//   <div className="flex flex-col sm:flex-row justify-around items-center w-full gap-2">
//     <select
//       value={brand}
//       required
//       onChange={(e) => setbrand(e.target.value)}
//       className="w-[100%] sm:w-[50%] border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
//     >
//       <option value="">Select Brand</option>
//       {(repairRequestss || []).map((items) => (
//         <option key={items?.id} value={items?.brand}>
//           {items?.brand}
//         </option>
//       ))}
//     </select>

//     <select
//       value={type}
//       required
//       onChange={(e)=>settype(e.target.value)}
//       className="w-[100%] sm:w-[50%] border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
//     >
//       <option value="">Type</option>
//       {listdeviceTypes.map((items,index)=>(
//         <option value={items} key={index}>{items}</option>
//       ))}
//     </select>
//   </div>

//   <input
//     type="text"
//     placeholder="Model"
//     value={model}
//     required
//     onChange={(e) => setmodel(e.target.value)}
//     className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
//   />

//   <div className="grid grid-cols-3 gap-3">
//     <select
//       value={states}
//       required
//       onChange={(e) => setstates(e.target.value)}
//       className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
//     >
//       <option value="">Select State</option>
//       {indianStates.map((item) => (
//         <option key={item} value={item}>{item}</option>
//       ))}
//     </select>

//     <input
//       type="text"
//       placeholder="City"
//       value={city}
//       required
//       onChange={(e) => setcity(e.target.value)}
//       className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
//     />

//     <input
//       type="number"
//       placeholder="Pincode"
//       value={pincode}
//       required
//       onChange={(e) => setpincode(e.target.value)}
//       className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
//     />
//   </div>

//   <textarea
//     placeholder="Explain the problem"
//     value={description}
//     required
//     onChange={(e) => setdescription(e.target.value)}
//     className="w-full border border-gray-300 p-3 rounded-lg h-28 resize-none focus:outline-none focus:ring-1 focus:ring-black"
//   />

//   <select
//     value={warrenty}
//     required
//     onChange={(e) => setwarrenty(e.target.value === "true")}
//     className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
//   >
//     <option value="true">Warranty Required: Yes</option>
//     <option value="false">Warranty Required: No</option>
//   </select>

//   <div className="grid grid-cols-2 gap-4">
//     <select
//       value={urgnecy}
//       required
//       onChange={(e) => seturgency(e.target.value)}
//       className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
//     >
//       <option value="">Select Urgency</option>
//       <option value="Low">Low</option>
//       <option value="Medium">Medium</option>
//       <option value="High">High</option>
//     </select>

//     <input
//       type="number"
//       placeholder="Budget Range ₹"
//       value={budget}
//       required
//       onChange={(e) => setbudget(e.target.value)}
//       className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
//     />
//   </div>

//   <button className="w-full bg-black text-white p-3 rounded-lg font-medium hover:bg-gray-900 transition  cursor-pointer ">
//     Submit Problem
//   </button>
// </form>
//     </div>
//   );
// };

// export default AddProblems;

import React, { useContext, useState, useEffect } from "react";
import { backend_url, RepairContext } from "../Context/ALlContext";
import { indianStates } from "../assets/assets";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRef } from "react";
import { Sparkles, ArrowRight, X, Send, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddProblems = () => {
  const { repairRequestss, listdeviceTypes, user, loading, role, refreshUserInfo } = useContext(RepairContext);
    const navigate = useNavigate();
const [shown, setShown] = useState(false);
useEffect(() => {
  if (!loading && !user && !shown && role === "repairer") {
    setShown(true);
    toast.error("Please login to add a problem or you're not authorized to add a problem", {
      autoClose: 2000,
    });
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }
}, [user, loading]);


  const [images, setImages]           = useState([null, null, null]);
  const [title, setitle]              = useState("");
  const [description, setdescription] = useState("");
  const [brand, setbrand]             = useState("");
  const [model, setmodel]             = useState("");
  const [states, setstates]           = useState("");
  const [city, setcity]               = useState("");
  const [pincode, setpincode]         = useState("");
  const [warrenty, setwarrenty]       = useState(false);
  const [urgnecy, seturgency]         = useState("");
  const [budget, setbudget]           = useState("");
  const [type, settype]               = useState("");
  const [image1, setimage1]           = useState(null);
  const [image2, setimage2]           = useState(null);
  const [image3, setimage3]           = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [aiOpen, setAiOpen]           = useState(false);
  const [aiPrompt, setAiPrompt]       = useState("");
  const [aiLoading, setAiLoading]     = useState(false);
  const [disable , setdisable ]= useState(false);
  const [brief , setbrief] = useState("");
 
 
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...images];
    updated[index] = URL.createObjectURL(file);
    setImages(updated);
    if (index === 0) setimage1(file);
    if (index === 1) setimage2(file);
    if (index === 2) setimage3(file);
  };

const handletopostheporoblem = async (e) => {
  e.preventDefault();

  const NewProblems = {
    deviceType: type,
    brand,
    model,
    title,
    description,
    budget,
    urgency: urgnecy,
    images,
    location: { city, state: states, pincode },
    warrenty,
    status: "Open",
    createdAt: Date.now(),
  };

  console.log("Sending:", NewProblems);

  const isPosted = await postProblems(NewProblems);
  if (!isPosted) {
    return;
  }

  await refreshUserInfo();

  // ✅ RESET AFTER API
  setitle("");
  setdescription("");
  setbrand("");
  setmodel("");
  setstates("");
  setcity("");
  setpincode("");
  setwarrenty(false);
  seturgency("");
  setbudget("");
  settype("");
  setImages([null, null, null]);
  setimage1(null);
  setimage2(null);
  setimage3(null);
};
  
const postProblems = async (data) => {
  try {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("brand", data.brand);
    formData.append("model", data.model);
    formData.append("state", data.location.state);
    formData.append("city", data.location.city);
    formData.append("pincode", data.location.pincode);
    formData.append("warrenty", data.warrenty);
    formData.append("urgency", data.urgency);
    formData.append("budget", data.budget);
    formData.append("type", data.deviceType);
    if (image1) formData.append("image1", image1);
    if (image2) formData.append("image2", image2);
    if (image3) formData.append("image3", image3);

    const response = await axios.post(
      backend_url + "/api/product/post",
      formData,
      {
        withCredentials: true,
      }
    );

    if (response?.data?.success) {
      toast.success("Problem Published");
      return true;
    }

    console.log("Response:", response?.data);
    return false;

  } catch (error) {
    console.log("ERROR:", error.response?.data || error.message);
    return false;
  }
};
  
  const handleAiAssist = async () => {
   const formData = new FormData();

const images = [image1, image2, image3];

images.forEach((img, i) => {
  if (img) {
    formData.append(`image${i + 1}`, img);
  }
});

 
formData.append("description", aiPrompt);
 
const Data = await axios.post(
  backend_url + "/api/product/analyze",
  formData,
  {
    withCredentials: true,
  }
);
console.log(Data.data.result);
    const response = Data.data;
    if(response.success){
      setdescription(response.result);
    }

    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      setAiOpen(false);
      setAiPrompt("");
      toast.success("AI filled your description!");
    }, 1200);
  };
  const AIref = useRef();
  const handetovalidate =()=>{
    const hasimage = images.some(img => img != null);
    if(!hasimage){
      toast.error("Add atleast one image of the problem to use AI Assist");
      return;
    }
    setdisable(true);
    setAiOpen(v => !v); setAiPrompt("");
    setAiPrompt(""); 
    setTimeout(() => {
      setdisable(false);
    }, 2000);
  }
  const inputBase = (id) => ({
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 16px",
    borderRadius: "12px",
    border: focusedField === id ? "1.5px solid #000" : "1.5px solid #e5e5e5",
    background: "#fafafa",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "15px",
    color: "#111",
    outline: "none",
    transition: "border 0.2s, box-shadow 0.2s",
    boxShadow: focusedField === id ? "0 0 0 3px rgba(0,0,0,0.06)" : "none",
  });

  const selectBase = (id) => ({
    ...inputBase(id),
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23999' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: "36px",
  });

  const labelStyle = {
    display: "block",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 500,
    color: "#444",
    marginBottom: "7px",
  };

  const sectionTitle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "16px",
    fontWeight: 600,
    color: "#111",
    marginBottom: "18px",
    marginTop: "0",
  };

  const card = {
    background: "#fff",
    borderRadius: "20px",
    padding: "28px",
    border: "1px solid #f0f0f0",
    boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
  };

  return (
    <>
     <Toaster
            position= "top-center"
            autoClose={3000}
            toastOptions={{
              duration: 3000,
            }}
          />
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .spinning { animation: spin-slow 0.9s linear infinite; }

        .ap-page {
          min-height: 100vh;
          background: #f7f7f7;
          font-family: 'DM Sans', sans-serif;
          padding: 48px 16px 80px;
        }

        /* Form column: always 560px, centered, never grows */
        .ap-form-col {
          max-width: 560px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Card 4 wrapper: position: relative so AI panel can anchor to it */
        .card4-wrap {
          position: relative;
          width: 100%;
        }

        /* AI trigger button */
        .ai-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.1px;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.15s;
        }
        .ai-trigger-btn::before {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 200%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transition: left 0.55s ease;
        }
        .ai-trigger-btn:hover::before { left: 100%; }
        .ai-trigger-btn:hover { transform: translateY(-1px); }
        .ai-trigger-btn:active { transform: scale(0.97); }

        /* ── AI Side Panel ──
           Mobile: slides DOWN below the card (normal flow, max-height trick)
           Desktop (≥768px): absolutely positioned to the RIGHT of card4 */

        .ai-panel-mobile {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transform: translateY(-8px);
          transition:
            max-height 0.38s cubic-bezier(0.4,0,0.2,1),
            opacity 0.28s ease,
            transform 0.28s ease;
          margin-top: 0;
        }
        .ai-panel-mobile.open {
          max-height: 600px;
          opacity: 1;
          transform: translateY(0);
          margin-top: 12px;
        }

        /* Desktop: position absolute to the right */
        @media (min-width: 768px) {
          .ai-panel-mobile {
            /* hide the mobile version on desktop */
            display: none !important;
          }
          .ai-panel-desktop {
            display: flex !important;
          }
        }

        .ai-panel-desktop {
          display: none;
          position: absolute;
          top: 0;
          left: calc(100% + 16px);
          width: 300px;
          /* slide in from right */
          opacity: 0;
          transform: translateX(16px);
          pointer-events: none;
          transition:
            opacity 0.32s ease,
            transform 0.32s cubic-bezier(0.4,0,0.2,1);
        }
        .ai-panel-desktop.open {
          opacity: 1;
          transform: translateX(0);
          pointer-events: all;
        }

        /* Shared inner card styles */
        .ai-panel-inner {
          background: #fff;
          border-radius: 20px;
          padding: 22px;
          border: 1px solid #bfdbfe;
          box-shadow: 0 4px 24px rgba(59,130,246,0.12);
          display: flex;
          flex-direction: column;
          gap: 14px;
          width: 100%;
          box-sizing: border-box;
        }

        .ai-panel-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ai-icon-wrap {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ai-panel-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #1e40af;
          font-family: 'DM Sans', sans-serif;
          flex: 1;
          line-height: 1.3;
        }
        .ai-x-btn {
          width: 26px; height: 26px;
          display: flex; align-items: center; justify-content: center;
          background: #f4f4f4;
          border: none; border-radius: 8px;
          cursor: pointer; color: #999;
          transition: background 0.15s, color 0.15s;
          flex-shrink: 0;
        }
        .ai-x-btn:hover { background: #e8e8e8; color: #333; }

        /* suggestion chips */
        .ai-chips { display: flex; flex-direction: column; gap: 5px; }
        .ai-chip-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase;
          color: #93c5fd; font-family: 'DM Sans', sans-serif;
        }
        .ai-chip {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 11px;
          background: #eff6ff;
          border: 1px solid #dbeafe;
          border-radius: 10px;
          font-size: 12px; font-weight: 500;
          color: #1d4ed8;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; text-align: left;
          transition: background 0.15s, transform 0.12s;
        }
        .ai-chip:hover { background: #dbeafe; transform: translateX(3px); }

        /* textarea */
        .ai-textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 13px;
          border-radius: 12px;
          border: 1.5px solid #dbeafe;
          background: #f0f9ff;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #111;
          outline: none;
          resize: none;
          height: 100px;
          line-height: 1.65;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .ai-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.10);
        }
        .ai-textarea::placeholder { color: #93c5fd; }

        /* send button */
        .ai-send-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 11px;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          color: #fff;
          font-size: 13px; font-weight: 700;
          border-radius: 12px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 2px 12px rgba(59,130,246,0.28);
          transition: opacity 0.15s, transform 0.15s;
        }
        .ai-send-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .ai-send-btn:active { transform: scale(0.97); }
        .ai-send-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

        .ai-hint {
          font-size: 11px; color: #93c5fd;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500; margin: 0;
          text-align: center;
        }

        /* submit button */
        .submit-btn {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          background: #111;
          color: #fff;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: opacity 0.2s, transform 0.15s;
        }
        .submit-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .submit-btn:active { transform: scale(0.98); }
      `}</style>

     <form onSubmit={handletopostheporoblem}>
  <div className="ap-page">
    <div className="ap-form-col">

          {/* ── Header ── */}
          <div style={{ paddingLeft: "4px", marginBottom: "16px" }}>
            <h1 style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "28px", fontWeight: 600, color: "#111",
              margin: "0 0 6px", letterSpacing: "-0.3px",
            }}>
              Report a Problem
            </h1>
            <p style={{ margin: 0, fontSize: "15px", color: "#888", fontWeight: 400 }}>
              Tell us about your device and we'll find the right help.
            </p>
          </div>

          {/* ── Card 1: Photos ── */}
          <div style={card}>
            <p style={sectionTitle}>Add Photos</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              {[0, 1, 2].map((i) => (
                <label key={i} style={{
                  position: "relative", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  height: "100px", borderRadius: "14px",
                  border: images[i] ? "none" : "1.5px dashed #d5d5d5",
                  background: images[i] ? "transparent" : "#fafafa",
                  cursor: "pointer", overflow: "hidden",
                }}>
                  {images[i]
                    ? <img src={images[i]} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "14px" }} alt="" />
                    : <div style={{ textAlign: "center", pointerEvents: "none" }}>
                        <div style={{ fontSize: "22px", color: "#bbb" }}>+</div>
                        <div style={{ fontSize: "12px", color: "#bbb", marginTop: "4px", fontWeight: 500 }}>Photo {i + 1}</div>
                      </div>
                  }
                  <input type="file" accept="image/*" required onChange={(e) => handleImageChange(e, i)}
                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                </label>
              ))}
            </div>
          </div>

          {/* ── Card 2: Device Details ── */}
          <div style={card}>
            <p style={sectionTitle}>Device Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Brand</label>
                  <select value={brand} required onChange={(e) => setbrand(e.target.value)}
                    onFocus={() => setFocusedField("brand")} onBlur={() => setFocusedField(null)}
                    style={selectBase("brand")}>
                    <option value="">Select brand</option>
                    {(repairRequestss || []).map((item) => (
                      <option key={item?.id} value={item?.brand}>{item?.brand}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Device Type</label>
                  <select value={type} required onChange={(e) => settype(e.target.value)}
                    onFocus={() => setFocusedField("type")} onBlur={() => setFocusedField(null)}
                    style={selectBase("type")}>
                    <option value="">Select type</option>
                    {(listdeviceTypes || []).map((item, i) => (
                      <option key={i} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Model</label>
                <input type="text" placeholder="e.g. iPhone 15, Galaxy S24" value={model} required
                  onChange={(e) => setmodel(e.target.value)}
                  onFocus={() => setFocusedField("model")} onBlur={() => setFocusedField(null)}
                  style={inputBase("model")} />
              </div>
            </div>
          </div>

          {/* ── Card 3: Location ── */}
          <div style={card}>
            <p style={sectionTitle}>Your Location</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>State</label>
                <select value={states} required onChange={(e) => setstates(e.target.value)}
                  onFocus={() => setFocusedField("states")} onBlur={() => setFocusedField(null)}
                  style={selectBase("states")}>
                  <option value="">State</option>
                  {indianStates.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input type="text" placeholder="City" value={city} required
                  onChange={(e) => setcity(e.target.value)}
                  onFocus={() => setFocusedField("city")} onBlur={() => setFocusedField(null)}
                  style={inputBase("city")} />
              </div>
              <div>
                <label style={labelStyle}>Pincode</label>
                <input type="number" placeholder="000000" value={pincode} required
                  onChange={(e) => setpincode(e.target.value)}
                  onFocus={() => setFocusedField("pincode")} onBlur={() => setFocusedField(null)}
                  style={inputBase("pincode")} />
              </div>
            </div>
          </div>

          {/* ── Card 4: Describe Problem (with AI panel anchored here) ── */}
          <div className="card4-wrap">
            <div style={card}>
              <p style={sectionTitle}>Describe the Problem</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={labelStyle}>Title</label>
                  <input type="text" placeholder="Short summary of the issue" value={title} required
                    onChange={(e) => setitle(e.target.value)}
                    onFocus={() => setFocusedField("title")} onBlur={() => setFocusedField(null)}
                    style={inputBase("title")} />
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    placeholder="When did it start? What have you tried?"
                    value={description} required
                    onChange={(e) => setdescription(e.target.value)}
                    onFocus={() => setFocusedField("desc")} onBlur={() => setFocusedField(null)}
                    style={{ ...inputBase("desc"), height: "120px", resize: "none", lineHeight: "1.6", paddingTop: "13px" }}
                  />

                  {/* AI trigger button */}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                    <button
                    ref={AIref}
                      type="button"
                      className="ai-trigger-btn"
                      disabled={disable}
                      style={{
                        background: aiOpen
                          ? "linear-gradient(135deg,#111,#333)"
                          : "linear-gradient(135deg,#3b82f6,#06b6d4)",
                        boxShadow: aiOpen
                          ? "0 2px 10px rgba(0,0,0,0.20)"
                          : "0 2px 14px rgba(59,130,246,0.32)",
                      }}
                      onClick={handetovalidate}
                    >
                      <Sparkles size={14} className={aiLoading ? "spinning" : ""} />
                      {disable ? "wait for 2 sec" : (aiOpen ? "Close AI" : "AI Assist")}
                      {aiOpen
                        ? <X size={13} style={{ opacity: 0.6 }} />
                        : <ArrowRight size={13} style={{ opacity: 0.6 }} />
                      }
                    </button>
                  </div>

                  {/* Mobile: slides down below button */}
                  <div className={`ai-panel-mobile ${aiOpen ? 'open' : ''}`}>
                    <AiPanelInner
                      aiPrompt={aiPrompt}
                      setAiPrompt={setAiPrompt}
                      aiLoading={aiLoading}
                      onGenerate={handleAiAssist}
                      onClose={() => { setAiOpen(false); setAiPrompt(""); }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: absolutely to the right of card4 */}
            <div className={`ai-panel-desktop ${aiOpen ? 'open' : ''}`}>
              <AiPanelInner
                aiPrompt={aiPrompt}
                setAiPrompt={setAiPrompt}
                aiLoading={aiLoading}
                onGenerate={handleAiAssist}
                onClose={() => { setAiOpen(false); setAiPrompt(""); }}
              />
            </div>
          </div>

          {/* ── Card 5: Preferences ── */}
          <div style={card}>
            <p style={sectionTitle}>Preferences</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Warranty</label>
                <select value={warrenty} required onChange={(e) => setwarrenty(e.target.value === "true")}
                  onFocus={() => setFocusedField("war")} onBlur={() => setFocusedField(null)}
                  style={selectBase("war")}>
                  <option value="true">Required</option>
                  <option value="false">Not required</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Urgency</label>
                <select value={urgnecy} required onChange={(e) => seturgency(e.target.value)}
                  onFocus={() => setFocusedField("urg")} onBlur={() => setFocusedField(null)}
                  style={selectBase("urg")}>
                  <option value="">Select</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Budget (INR)</label>
                <input type="number" placeholder="0" value={budget} required
                  onChange={(e) => setbudget(e.target.value)}
                  onFocus={() => setFocusedField("bud")} onBlur={() => setFocusedField(null)}
                  style={inputBase("bud")} />
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <div>
            <button type="submit" className="submit-btn" >
              Submit Repair Request
            </button>
            <p style={{ textAlign: "center", fontSize: "13px", color: "#aaa", marginTop: "12px", fontWeight: 400 }}>
              Shared only with verified repair professionals near you.
            </p>
          </div>

        </div>
      </div>
      </form>
    </>
  );
};

/* ── Reusable AI panel inner content ── */
const AiPanelInner = ({ aiPrompt, setAiPrompt, aiLoading, onGenerate, onClose }) => {
  const suggestions = [
    "Phone screen cracked after drop",
    "Laptop won't turn on",
    "Battery drains too fast",
  ];

  return (
    <div className="ai-panel-inner">

      {/* Header */}
      <div className="ai-panel-header">
        <div className="ai-icon-wrap">
          <Wand2 size={16} color="#fff" />
        </div>
        <span className="ai-panel-title">Describe it your way — AI will refine it</span>
        <button type="button" className="ai-x-btn" onClick={onClose}>
          <X size={12} />
        </button>
      </div>

      {/* Suggestions */}
      <div className="ai-chips">
        <span className="ai-chip-label">Quick starters</span>
        {suggestions.map((s, i) => (
          <button key={i} type="button" className="ai-chip" onClick={() => setAiPrompt(s)}>
            <Sparkles size={11} style={{ flexShrink: 0, color: "#60a5fa" }} />
            {s}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        className="ai-textarea"
        placeholder="e.g. My phone fell in water, the screen is flickering…"
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onGenerate(); }
        }}
      />

      {/* Generate button */}
      <button
        type="button"
        className="ai-send-btn"
        onClick={onGenerate}
        disabled={aiLoading || !aiPrompt.trim()}
      >
        {aiLoading
          ? <><Sparkles size={13} className="spinning" /> Writing…</>
          : <><Send size={13} /> Generate Description</>
        }
      </button>

      <p className="ai-hint">⏎ Enter to generate · Shift+Enter for new line</p>
    </div>
  );
};

export default AddProblems;
