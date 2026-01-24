import React, { useEffect, useRef, useState } from "react";
import repairRequests from "../assets/assets";
import { CiAlignCenterH, CiLocationOn } from "react-icons/ci";
import { HiOutlineInboxIn } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { TbDeviceMobile } from "react-icons/tb";
import { FaTag } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaCalendar } from "react-icons/fa";


function Problems() {
  const [visible, setvisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterdevices, setfiltereddevices] = useState([]);
  const [ListofProblems, setListofProblems] = useState([]);
  const [animatetovisiblecard, setanimatetovisiblecard] = useState(false);
  const [makerepairequest , setmakerepairequest] = useState('');
  const [listofrepairequest ,setlistofrepairequest] = useState([]);
  const [city, setcity] = useState("");
  const [state, setstate] = useState("");
  const [pincode, setpincode] = useState("");
  const scrollRef = useRef(null);
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const urgencyColors = {
    High: " text-red-400 font-bold border-red-200 p-1",
    Medium: " text-orange-400 border-orange-200",
    Low: "text-green-400 border-green-200",
  };

  const handletoshowtheviewoftheprodut = (item) => {
    setSelectedItem(item);
    setvisible(true);
    setanimatetovisiblecard(true);
  };

  const handletofilterthedevices = (deviceType) => {
    if (deviceType === "All") {
      setListofProblems(repairRequests);
      return;
    }
    const filtered = repairRequests.filter(
      (item) => item.deviceType === deviceType,
    );
    setListofProblems(filtered);
  };

  const handletosearneabyarea = (e) => {
    e.preventDefault();

    const searchText = `${city} ${state} ${pincode}`.toLowerCase().trim();

    if (searchText === "") {
      setListofProblems(repairRequests);
      return;
    }

    const result = repairRequests.filter((item) => {
      const FullLocation =
        `${item.location.city} ${item.location.state} ${item.location.pincode}`.toLowerCase();
      return FullLocation.includes(searchText);
    });

    setListofProblems(result);
  };
  const handletomakerequest =(e)=>{
    e.preventDefault();
    setlistofrepairequest((prev)=>[...prev , makerepairequest]);
    console.log(listofrepairequest);
    setmakerepairequest('');
  }
  useEffect(() => {
    const allDeviceTypes = [
      "All",
      ...new Set(repairRequests.map((item) => item.deviceType)),
    ];
    setfiltereddevices(allDeviceTypes);
    setListofProblems(repairRequests);
  }, []);

  return (
    <>
      <div className="p-3 px-5 py-6 flex flex-col gap-10 relative">
        <div
          className="
          p-4 border border-gray-200 rounded-2xl shadow-sm bg-white w-full 
          sm:flex-row flex-col flex justify-around items-center mx-auto
        "
        >
          <div className="flex justify-around items-center gap-4 flex-col sm:flex-row">
            <h1 className="font-semibold sm:text-lg text-gray-800 text-sm">
              Filter Devices
            </h1>

            <select
              onChange={(e) => handletofilterthedevices(e.target.value)}
              className="
                px-4 py-2.5 border border-blue-300 rounded-xl bg-white 
                text-gray-700 font-medium shadow-sm focus:outline-none 
                focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer
              "
            >
              {filterdevices.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div
            className="
            bg-white p-4 flex flex-col sm:flex-row items-center gap-3 
            w-full max-w-2xl mx-auto
          "
          >
            <form
              onSubmit={handletosearneabyarea}
              className="flex justify-around items-center sm:flex-row flex-col gap-5 w-full"
            >
              <input
                value={city}
                onChange={(e) => setcity(e.target.value)}
                type="text"
                placeholder="City"
                className="
                  w-full sm:flex-1 px-4 py-3 rounded-xl border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700
                "
              />
              <input
                value={state}
                onChange={(e) => setstate(e.target.value)}
                type="text"
                placeholder="State"
                className="
                  w-full sm:flex-1 px-4 py-3 rounded-xl border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700
                "
              />
              <input
                value={pincode}
                onChange={(e) => setpincode(e.target.value)}
                type="text"
                maxLength={6}
                placeholder="Pincode"
                className="
                  w-full sm:flex-1 px-4 py-3 rounded-xl border border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700
                "
              />
              <button className="w-full sm:w-auto bg-black cursor-pointer text-white font-medium px-6 py-3 rounded-xl">
                Search
              </button>
            </form>
          </div>
        </div>

        <div className={visible ? "blur-sm  " : ""}>
          {ListofProblems.map((item, index) => (
            <div
              key={index}
              className=" rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition p-4 sm:p-5 mt-5"
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-6 sm:flex-row flex-col">
                      <h3 className="text-sm sm:text-xl font-bold text-gray-800">
                        {item.problemTitle}
                      </h3>

                      <div className="flex gap-5 text-sm">
                        <div
                          className={`${urgencyColors[item.urgency]} text-sm`}
                        >
                          Urgency {item.urgency}
                        </div>
                        <div className="font-semibold text-sm">
                          budgetRange ₹{item.budgetRange}
                        </div>
                        <button
                          onClick={() => handletoshowtheviewoftheprodut(item)}
                          className="cursor-pointer text-blue-600"
                        >
                          View {item.deviceType}
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600">
                      {item.brand} {item.model}
                    </p>
                  </div>

                  <p className="min-w-[90px] px-3 py-1 bg-blue-100 border border-blue-300 rounded-full text-sm text-center">
                    {item.deviceType}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-gray-700">
                  {item.problemDescription}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CiLocationOn size={18} />
                  {item.location.city}, {item.location.state} -{" "}
                  {item.location.pincode}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[item.status]}`}
                >
                  {item.status}
                </span>

                <p className="text-sm">
                  Repair:{" "}
                  <span className="font-medium">
                    {item.preferredRepairType}
                  </span>
                </p>

                <p className="text-sm">
                  Published by:
                  <span className="font-medium">
                    <Link to="/profile"> {item.userName}</Link>
                  </span>
                </p>

                <p className="text-sm">
                  Warranty:
                  <span
                    className={
                      item.warrantyRequired
                        ? "text-green-700 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {item.warrantyRequired ? " Yes" : " No"}
                  </span>
                </p>

                <button className="text-blue-600 cursor-pointer hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                  <HiOutlineInboxIn /> Responses
                </button>
              </div>
            </div>
          ))}
        </div>

       {visible && selectedItem && (
  <div
    className={`fixed inset-0 z-50  pt-20  flex items-center justify-around px-4 sm:px-6 transition-all duration-300 ${animatetovisiblecard ? "opacity-100 visible" : "opacity-0 invisible"}`}
  >
  
    <div
      onClick={() => setvisible(false)}
      className="absolute  inset-0  bg-red-600 backdrop-blur-md"
    ></div>

    
    <div
      className={`relative  bg-white pt-10  rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden transition-all duration-300 transform ${animatetovisiblecard ? "scale-100 translate-y-0" : "scale-95 translate-y-6"}`}
    >
   
      <div className="  text-black p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{selectedItem.problemTitle}</h2>
            <p className="text-black opacity-90">
              {selectedItem.brand} {selectedItem.model}
            </p>
          </div>
          <button
            onClick={() => setvisible(false)}
            className="text-black hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <RxCross2 size={24}  color="black"/>
          </button>
        </div>
      </div>

     
      <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
        <div className="p-10 sm:p-8 space-y-8">
        
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaTools className="text-black" />
              Problem Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {selectedItem.problemDescription}
            </p>
          </div>
 
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TbDeviceMobile className="text-black" />
              Device Images
            </h3>
            <div className="relative">
              <button
                onClick={() =>
                  scrollRef.current.scrollBy({
                    left: -400,
                    behavior: "smooth",
                  })
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white z-10 border border-gray-200"
              >
                <FaChevronLeft className="text-gray-700" />
              </button>

              <div
                ref={scrollRef}
                className="flex gap-4  overflow-x-hidden  scrollbar-hide scroll-smooth py-2 px-1"
              >
                {selectedItem.images.map((img, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-64 h-48 rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                  >
                    <img
                      src={img}
                      alt={`Device ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() =>
                  scrollRef.current.scrollBy({
                    left: 400,
                    behavior: "smooth",
                  })
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white z-10 border border-gray-200"
              >
                <FaAngleRight className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaTag className="text-black" />
                Device Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <TbDeviceMobile className="text-black" />
                    Device
                  </span>
                  <span className="font-medium">{selectedItem.brand} {selectedItem.model}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-black flex items-center gap-2">
                    <FaTools className="text-black" />
                    Repair Type
                  </span>
                  <span>{selectedItem.preferredRepairType}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-blackflex items-center gap-2">
                    <FaCalendarAlt className="text-black" />
                    Warranty
                  </span>
                  <span className={selectedItem.warrantyRequired ? "text-emerald-600 font-medium" : "text-gray-600"}>
                    {selectedItem.warrantyRequired ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaUser className="text-gray-400" />
                    Posted By
                  </span>
                  <Link
                    to="/profile"
                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    {selectedItem.userName}
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-black" />
                Request Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaRupeeSign className="text-gray-400" />
                    Budget
                  </span>
                  <span className="font-bold text-gray-900">₹{selectedItem.budgetRange}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaExclamationTriangle className="text-gray-400" />
                    Urgency
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${urgencyColors[selectedItem.urgency]}`}>
                    {selectedItem.urgency}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 flex items-center gap-2">
                    <FaCalendar className="text-gray-400" />
                    Status
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedItem.status]}`}>
                    {selectedItem.status}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600 flex items-center gap-2">
                    <CiLocationOn className="text-gray-400" />
                    Location
                  </span>
                  <div className="text-right">
                    <div className="font-medium">{selectedItem.location.city}, {selectedItem.location.state}</div>
                    <div className="text-sm text-gray-500">Pincode: {selectedItem.location.pincode}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      <div className="border-t border-gray-200 bg-gray-50 p-5 bottom-15  relative ">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Repair Offer</h3>
        <form onSubmit={handletomakerequest} className="space-y-4">
          <div className="flex gap-4 sm:flex-row flex-col">
            <input
              type="text"
              value={makerepairequest}
              onChange={(e) => setmakerepairequest(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Describe your repair offer, estimated cost, and timeline..."
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow whitespace-nowrap"
            >
              Submit Offer
            </button>
          </div>
          <p className="text-sm text-gray-500 text-center">
            Your offer will be sent to {selectedItem.userName}
          </p>
        </form>
      </div>
    </div>
  </div>
)}
      </div>
    </>
  );
}

export default Problems;
