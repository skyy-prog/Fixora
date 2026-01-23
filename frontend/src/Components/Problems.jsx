import React, { useEffect, useState } from 'react'
import repairRequests from '../assets/assets'
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineInboxIn } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { Link } from 'react-router-dom'

function Problems() {
  const [visible, setvisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterdevices, setfiltereddevices] = useState([]);
  const [ListofProblems, setListofProblems] = useState([]);
  const [animatetovisiblecard ,setanimatetovisiblecard ] = useState(false);
  const [city, setcity] = useState('');
  const [state, setstate] = useState('');
  const [pincode, setpincode] = useState('');

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800'
  }

  const urgencyColors = {
    High: ' text-red-400 font-bold border-red-200 p-1',
    Medium: ' text-orange-400 border-orange-200',
    Low: 'text-green-400 border-green-200'
  }

  // Open popup with clicked item
  const handletoshowtheviewoftheprodut = (item) => {
    setSelectedItem(item);
    setvisible(true);
    setanimatetovisiblecard(true);
  }

  // Device filter
  const handletofilterthedevices = (deviceType) => {
    if (deviceType === "All") {
      setListofProblems(repairRequests);
      return;
    }
    const filtered = repairRequests.filter(
      item => item.deviceType === deviceType
    );
    setListofProblems(filtered);
  }

  // Area search
  const handletosearneabyarea = (e) => {
    e.preventDefault();

    const searchText = `${city} ${state} ${pincode}`.toLowerCase().trim();

    if (searchText === "") {
      setListofProblems(repairRequests);
      return;
    }

    const result = repairRequests.filter((item) => {
      const FullLocation = `${item.location.city} ${item.location.state} ${item.location.pincode}`.toLowerCase();
      return FullLocation.includes(searchText);
    });

    setListofProblems(result);
  }

  // Initialize
  useEffect(() => {
    const allDeviceTypes = ["All", ...new Set(repairRequests.map(item => item.deviceType))];
    setfiltereddevices(allDeviceTypes);
    setListofProblems(repairRequests);
  }, []);

  return (
    <>
      <div className='p-3 px-5 py-6 flex flex-col gap-10 relative'>

      
        <div className="
          p-4 border border-gray-200 rounded-2xl shadow-sm bg-white w-full 
          sm:flex-row flex-col flex justify-around items-center mx-auto
        ">

          <div className='flex justify-around items-center gap-4 flex-col sm:flex-row'>
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

          <div className="
            bg-white p-4 flex flex-col sm:flex-row items-center gap-3 
            w-full max-w-2xl mx-auto
          ">
            <form onSubmit={handletosearneabyarea} className='flex justify-around items-center sm:flex-row flex-col gap-5 w-full'>
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
            <div key={index} className=" rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition p-4 sm:p-5 mt-5">

              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-6 sm:flex-row flex-col">
                      <h3 className="text-sm sm:text-xl font-bold text-gray-800">
                        {item.problemTitle}
                      </h3>

                      <div className='flex gap-5 text-sm'>
                        <div className={`${urgencyColors[item.urgency]} text-sm`}>
                          Urgency {item.urgency}
                        </div>
                        <div className='font-semibold text-sm'>
                          budgetRange ₹{item.budgetRange}
                        </div>
                        <button
                          onClick={() => handletoshowtheviewoftheprodut(item)}
                          className='cursor-pointer text-blue-600'
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
                  {item.location.city}, {item.location.state} - {item.location.pincode}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[item.status]}`}>
                  {item.status}
                </span>

                <p className="text-sm">
                  Repair: <span className="font-medium">{item.preferredRepairType}</span>
                </p>

                <p className="text-sm">
                  Published by:
                  <span className="font-medium">
                    <Link to='/profile'> {item.userName}</Link>
                  </span>
                </p>

                <p className="text-sm">
                  Warranty:
                  <span className={item.warrantyRequired ? "text-green-700 font-medium" : "text-red-600 font-medium"}>
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
  className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 
  ${animatetovisiblecard ? "opacity-100 visible" : "opacity-0 invisible"}`}
>
 
  <div
    onClick={() => setvisible(false)}
    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
  ></div>

   <div
    className={`relative bg-white text-black rounded-2xl shadow-xl w-full max-w-5xl 
    transition-all duration-500 transform 
    ${animatetovisiblecard ? "scale-100" : "scale-95"}`}
  >
   
    <button
      onClick={() => setvisible(false)}
      className="absolute top-4 right-4 text-black hover:text-gray-600"
    >
      <RxCross2 size={32} />
    </button>
 
    <div className="p-6 space-y-5">
 
      <div>
        <h2 className="text-2xl font-bold mb-2">
          {selectedItem.problemTitle}
        </h2>
        <p className="text-gray-600">
          {selectedItem.problemDescription}
        </p>
      </div>

      
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/2 flex justify-center">
          {selectedItem.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="device"
              className="w-72 h-72 object-cover rounded-lg border"
            />
          ))}
        </div>

       
        <div className="w-full md:w-1/2 text-sm sm:text-base space-y-2">
          <p><b>Device:</b> {selectedItem.brand} {selectedItem.model}</p>
          <p><b>Urgency:</b> {selectedItem.urgency}</p>
          <p><b>Budget:</b> ₹{selectedItem.budgetRange}</p>
          <p><b>Preferred Repair:</b> {selectedItem.preferredRepairType}</p>
          <p><b>Warranty:</b> {selectedItem.warrantyRequired ? "Yes" : "No"}</p>
          <p>
            <b>Location:</b> {selectedItem.location.city},{" "}
            {selectedItem.location.state} - {selectedItem.location.pincode}
          </p>
          <p>
            <b>Posted By:</b>{" "}
            <Link to="/profile" className="text-blue-600 hover:underline">
              {selectedItem.userName}
            </Link>
          </p>
        </div>

      </div>
    </div>
  </div>
</div>

        )}

      </div>
    </>
  )
}

export default Problems;
