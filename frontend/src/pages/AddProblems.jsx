import React, { useContext, useState } from "react";
import { RepairContext } from "../Context/ALlContext";
import { indianStates } from "../assets/assets";

const AddProblems = () => {
  const {   repairRequestss, setrepairRequestss,listdeviceTypes } = useContext(RepairContext);

  const [images, setImages] = useState([null, null, null]);

  const [title, setitle] = useState("");
  const [description, setdescription] = useState("");
  const [brand, setbrand] = useState("");
  const [model, setmodel] = useState("");
  const [states, setstates] = useState("");
  const [city, setcity] = useState("");
  const [pincode, setpincode] = useState("");
  const [warrenty, setwarrenty] = useState(false);
  const [urgnecy, seturgency] = useState("");
  const [budget, setbudget] = useState("");
  const [type ,settype] = useState("");
  const [image1, setimage1] = useState(null);
  const [image2, setimage2] = useState(null);
  const [image3, setimage3] = useState(null);

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
 const NewProblems = {
  id: Date.now(), // important: unique id
  userId: "USR_TEST",
  userName: "Test User",
  deviceType: type,  
  
  brand: brand,
  model: model,
  
  problemTitle: title,
  problemDescription: description,
  
  budgetRange: budget,
  urgency: urgnecy,
  
  images: images, 
  
  location: {
    city: city,
    state: states,
    pincode: pincode,
  },
  
  warrantyRequired: warrenty,
  status: "Open",
  createdAt: Date.now(),
};

  const handletopostheporoblem = async (e) => {
    e.preventDefault();

    const FormDatas = new FormData();
    FormDatas.append("title", title);
    FormDatas.append("description", description);
    FormDatas.append("brand", brand);
    FormDatas.append("model", model);
    FormDatas.append("state", states);
    FormDatas.append("city", city);
    FormDatas.append("pincode", pincode);
    FormDatas.append("warrenty", warrenty);
    FormDatas.append("urgency", urgnecy);
    FormDatas.append("budget", budget);

    image1 && FormDatas.append("image1", image1);
    image2 && FormDatas.append("image2", image2);
    image3 && FormDatas.append("image3", image3);
    setrepairRequestss((prev)=> [ ...prev ,NewProblems]);

    setTimeout(()=>{
      console.log(NewProblems);
    },2000)
  };

  

  return (
    <div className="mb-10 mt-10  text-black p-8 rounded-lg max-w-xl mx-auto bg-white border border-gray-200  shadow-sm space-y-5">
{/* <h1>hello world</h1> */}
      <form onSubmit={handletopostheporoblem} className="space-y-5">

        <h1 className="text-2xl font-semibold">Add New Problem</h1>
        <p className="text-sm text-gray-500">Fill details about your device issue</p>

        <div className="flex gap-3 flex-col sm:flex-row">
          {[0,1,2].map((i) => (
            <label key={i} className="relative flex items-center justify-center h-32 w-full border border-gray-300 rounded-lg cursor-pointer bg-gray-50 overflow-hidden">
              {images[i] ? (
                <img src={images[i]} className="absolute inset-0 w-full h-full object-cover" alt="" />
              ) : (
                <span className="text-gray-500 text-sm">Add Image</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, i)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </label>
          ))}
        </div>

        <input
          type="text"
          placeholder="Enter the title of problem"
          value={title}
          onChange={(e) => setitle(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
        />

        <div className=" flex flex-col sm:flex-row justify-around items-center w-full gap-2   "> 
           <select
          value={brand}
          onChange={(e) => setbrand(e.target.value)}
          className=" w-[100%] sm:w-[50%] border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="">Select Brand</option>
          {repairRequestss.map((items) => (
            <option key={items.id} value={items.brand}>
              {items.brand}
            </option>
          ))}
        </select>
        <select 
        value={type}
        onChange={(e)=>settype(e.target.value)}
         className=" w-[100%] sm:w-[50%] border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black">
          <option>Type</option>
          {listdeviceTypes.map((items,index)=>{
            return <option value={items} key={index}> {items}</option>
          })}
        </select>
        </div>

        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => setmodel(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
        />

        <div className="grid grid-cols-3 gap-3">

          <select
            value={states}
            onChange={(e) => setstates(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">Select State</option>
            {indianStates.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setcity(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          />

          <input
            type="number"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setpincode(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <textarea
          placeholder="Explain the problem"
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg h-28 resize-none focus:outline-none focus:ring-1 focus:ring-black"
        />

        <select
          value={warrenty}
          onChange={(e) => setwarrenty(e.target.value === "true")}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
        >
          <option value="true">Warranty Required: Yes</option>
          <option value="false">Warranty Required: No</option>
        </select>

        <div className="grid grid-cols-2 gap-4">

          <select
            value={urgnecy}
            onChange={(e) => seturgency(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value="">Select Urgency</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <input
            type="number"
            placeholder="Budget Range ₹"
            value={budget}
            onChange={(e) => setbudget(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <button className="w-full bg-black text-white p-3 rounded-lg font-medium hover:bg-gray-900 transition">
          Submit Problem
        </button>

      </form>
    </div>
  );
};

export default AddProblems;
