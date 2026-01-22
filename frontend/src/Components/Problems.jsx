import React, { useEffect, useState } from 'react'
import repairRequests from '../assets/assets'
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineInboxIn } from "react-icons/hi";
import { Link } from 'react-router-dom'
import { RxCross2 } from "react-icons/rx";

function Problems() {
  const [visible , setvisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterdevices , setfiltereddevices] = useState([]);
  const [ListofProblems ,setListofProblems] = useState([]);

  const [city,setcity] = useState('');
  const [state,setstate] = useState('');
  const [pincode , setpincode] = useState('');

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

  const handletoshowtheviewoftheprodut = (item) =>{
    setSelectedItem(item);
    setvisible(true);
  }

   
  const handletofilterthedevices = (deviceType) => {
    if(deviceType === "All"){
      setListofProblems(repairRequests);
      return;
    }
    const clickedfilteredvalue = repairRequests.filter(
      item => item.deviceType === deviceType
    );
    setListofProblems(clickedfilteredvalue);
  }
 
  const handletosearneabyarea =(e)=>{
    e.preventDefault();

    const searchText = `${city} ${state} ${pincode}`.toLowerCase().trim();

    if(searchText === ""){
      setListofProblems(repairRequests);
      return;
    }

    const SearchedByArea = ListofProblems.filter((item)=>{
      const FullLocation = `${item.location.city} ${item.location.state} ${item.location.pincode}`.toLowerCase();
      return FullLocation.includes(searchText);
    })

    setListofProblems(SearchedByArea)
  }

   
  useEffect(() => {
    const allDeviceTypes = ["All", ...new Set(repairRequests.map(item => item.deviceType))];
    setfiltereddevices(allDeviceTypes);
    setListofProblems(repairRequests);
  }, []);    

  return (
    <>
      <div className='p-3 px-5 py-6 flex flex-col gap-10 relative'>
         
      {/* FILTER SECTION */}
      <div className="p-4 border border-gray-200 rounded-2xl shadow-sm bg-white w-full flex justify-around items-center mx-auto flex-col sm:flex-row">

        <div className='flex justify-around items-center gap-4 flex-col sm:flex-row'>
          <h1 className="font-semibold sm:text-lg text-gray-800 text-sm">
            Filter Devices
          </h1>

          <select 
            onChange={(e)=>handletofilterthedevices(e.target.value)}
            className="px-4 py-2.5 border border-blue-300 rounded-xl bg-white text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer"
          >
            {filterdevices.map((item, idx) => (
              <option key={idx} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* SEARCH SECTION */}
        <div className="bg-white p-4 flex flex-col sm:flex-row flex-col items-center gap-3 w-full max-w-2xl mx-auto">
          <form onSubmit={handletosearneabyarea} className='flex justify-around items-center gap-5 sm:flex-row flex-col w-full'>
            
            <input 
              value={city}
              onChange={(e)=>setcity(e.target.value)}
              type="text" 
              placeholder="City"
              className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            />

            <input 
              value={state}
              onChange={(e)=>setstate(e.target.value)}
              type="text" 
              placeholder="State"
              className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            />

            <input 
              value={pincode}
              onChange={(e)=>setpincode(e.target.value)}
              type="text"
              maxLength={6}
              placeholder="Pincode"
              className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            />

            <button className="w-full sm:w-auto bg-black cursor-pointer text-white font-medium px-6 py-3 rounded-xl transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>
 
      <div className={visible ? "blur-sm pointer-events-none" : ""}>
        {ListofProblems.map((item , index)=>(
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition p-4 sm:p-5 mt-5">
            
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
                        onClick={()=>handletoshowtheviewoftheprodut(item)} 
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
                <CiLocationOn size={18}/>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/30"
            onClick={() => setvisible(false)}
          ></div>

          <div className="relative h-[70vh] w-[50vw] bg-red-500 z-50 rounded-2xl ">
            <div>
              <button 
              onClick={() => setvisible(false)}
              className="absolute top-2 right-3 text-white font-bold cursor-pointer " 
            >
             <RxCross2 size={40}/>
            </button>
            </div>
            <div>
              <div className="left">
                <img  alt="" />
              </div>
              <div className="right"></div>
            </div>
          </div>
        </div>
      )}

      </div>
    </>
  )
}

export default Problems;
