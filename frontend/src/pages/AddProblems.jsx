import React, { useContext, useState } from "react";
import { backend_url, RepairContext } from "../Context/ALlContext";
import { indianStates } from "../assets/assets";
import axios from "axios";

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
  const [finalProblems , setfinalproblems] = useState(null)
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
 const handletopostheporoblem = (e) => {
  e.preventDefault();

  const NewProblems = {
    deviceType: type,
    brand,
    model,
    title: title,
    description: description,
    budget: budget,
    urgency: urgnecy,
    images,
    location: {
      city,
      state: states,
      pincode,
    },
    warrenty: warrenty,
    status: "Open",
    createdAt: Date.now(),
  };

  setrepairRequestss((prev) => [...prev, NewProblems]);

  // reset form
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
  setImages([null,null,null]);
  setimage1(null);
  setimage2(null);
  setimage3(null);

  console.log(NewProblems);
  setfinalproblems(NewProblems);
  postProblems();
};

const postProblems = async () => {
  try {

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("brand", brand);
    formData.append("model", model);
    formData.append("state", states);
    formData.append("city", city);
    formData.append("pincode", pincode);
    formData.append("warrenty", warrenty);
    formData.append("urgency", urgnecy);
    formData.append("budget", budget);
    formData.append("type", type);

    formData.append("image1", image1);
    formData.append("image2", image2);
    formData.append("image3", image3);

    const response = await axios.post(
      backend_url + "/api/product/post",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data);

  } catch (error) {
    console.log(error.message);
  }
};
  return (
    <div className="mb-10 mt-10  text-black p-8 rounded-lg max-w-xl mx-auto bg-white border border-gray-200  shadow-sm space-y-5">
      <form onSubmit={handletopostheporoblem} className="space-y-5">
  <h1 className="text-2xl font-semibold">Add New Problem</h1>
  <p className="text-sm text-gray-500">Fill details about your device issue</p>

  <div className="flex gap-3 flex-col sm:flex-row">
    {[0,1,2].map((i) => (
      <label
        key={i}
        className="relative flex items-center justify-center h-32 w-full border border-gray-300 rounded-lg cursor-pointer bg-gray-50 overflow-hidden"
      >
        {images[i] ? (
          <img src={images[i]} className="absolute inset-0 w-full h-full object-cover" alt="" />
        ) : (
          <span className="text-gray-500 text-sm">Add Image</span>
        )}
        <input
          type="file"
          accept="image/*"
          required
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
    required
    onChange={(e) => setitle(e.target.value)}
    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
  />

  <div className="flex flex-col sm:flex-row justify-around items-center w-full gap-2">
    <select
      value={brand}
      required
      onChange={(e) => setbrand(e.target.value)}
      className="w-[100%] sm:w-[50%] border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
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
      required
      onChange={(e)=>settype(e.target.value)}
      className="w-[100%] sm:w-[50%] border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
    >
      <option value="">Type</option>
      {listdeviceTypes.map((items,index)=>(
        <option value={items} key={index}>{items}</option>
      ))}
    </select>
  </div>

  <input
    type="text"
    placeholder="Model"
    value={model}
    required
    onChange={(e) => setmodel(e.target.value)}
    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
  />

  <div className="grid grid-cols-3 gap-3">
    <select
      value={states}
      required
      onChange={(e) => setstates(e.target.value)}
      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
    >
      <option value="">Select State</option>
      {indianStates.map((item) => (
        <option key={item} value={item}>{item}</option>
      ))}
    </select>

    <input
      type="text"
      placeholder="City"
      value={city}
      required
      onChange={(e) => setcity(e.target.value)}
      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
    />

    <input
      type="number"
      placeholder="Pincode"
      value={pincode}
      required
      onChange={(e) => setpincode(e.target.value)}
      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
    />
  </div>

  <textarea
    placeholder="Explain the problem"
    value={description}
    required
    onChange={(e) => setdescription(e.target.value)}
    className="w-full border border-gray-300 p-3 rounded-lg h-28 resize-none focus:outline-none focus:ring-1 focus:ring-black"
  />

  <select
    value={warrenty}
    required
    onChange={(e) => setwarrenty(e.target.value === "true")}
    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
  >
    <option value="true">Warranty Required: Yes</option>
    <option value="false">Warranty Required: No</option>
  </select>

  <div className="grid grid-cols-2 gap-4">
    <select
      value={urgnecy}
      required
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
      required
      onChange={(e) => setbudget(e.target.value)}
      className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
    />
  </div>

  <button className="w-full bg-black text-white p-3 rounded-lg font-medium hover:bg-gray-900 transition  cursor-pointer ">
    Submit Problem
  </button>
</form>
    </div>
  );
};

export default AddProblems;
