import React, { useContext, useEffect, useState } from 'react'
// import Listofproblems from '../assets/assets'
// import repairRequests from '../assets/assets';
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineInboxIn } from "react-icons/hi";
import { CiCirclePlus } from "react-icons/ci";
import { RepairContext } from '../Context/ALlContext';
import { Link } from 'react-router-dom';
const Profile = () => {
    const [Listofproblems , setListofproblems] = useState([]);
    const [isvisible , setisvisible] = useState(false);
      const {repairRequestss, setrepairRequestss} = useContext(RepairContext)
    
    useEffect(()=>{
        setListofproblems(repairRequestss);
        setisvisible(true);
    },[repairRequestss])
    console.log(Listofproblems)
  return (
    <div className={`min-h-screen bg-black p-4 md:p-6 duration-400 transition-all  ${isvisible ? ' opacity-100  bg-white ' : 'opacity-0'}`}>
     
      <div className=" w-full mx-auto bg-white  rounded-2xl shadow-md p-6 mb-6">
        <div className="flex flex-col  sm:flex-row  justify-center md:flex-row items-center md:items-center gap-6">
      
          <div className="relative">
            <img 
              src="/bigger2.png"  
              alt="Profile"
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-blue-100 object-cover"
            />
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
       
          <div className="flex-1 text-center md:text-left w-full   ">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Hey, Akash! 
            </h1>
            <p className="text-gray-600 mb-4">
              Here's an overview of your repair requests
            </p>
              
          </div>
     <Link  to={'/addproblems'}>
       <div  className='w-full sm:w-40  flex items-center  justify-center'> <button className=' w-full p-5 py-0 py-5 bg-black flex items-center justify-center gap-4  text-white  rounded-full w-30 hover:scale-94 transition-all  cursor-pointer'> Add new<CiCirclePlus color='white' size={30} /></button></div></Link>
        </div>
      </div>
 
      <div className=" ">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Your Repair Requests
            </h2>
            <p className="text-gray-600 mt-1">Track all your submitted problems</p>
          </div>
          
        <span className="bg-blue-100 text-blue-700 text-sm font-medium 
                 px-4 py-1.5 
                 rounded-full 
                 flex items-center justify-center 
                 min-w-[80px]">
  {Listofproblems.length} Active
</span>

        </div>

     
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 md:p-6">
  {Listofproblems.map((item, index) => {

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

    return (
      <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition p-4 sm:p-5">
        <div className="flex flex-col gap-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className={` flex  items-center gap-6  sm:flex-row flex-col`}>
                 <h3 className="text-sm sm:text-xl font-bold text-gray-800 firsthead">
                {item.problemTitle}
              </h3>
              <div className=' flex  gap-5  text-sm firstrows'>
                 <div className={`${urgencyColors[item.urgency]} text-sm firstrows`}>Urgency {item.urgency}</div>
              <div className=' font-semibold text-sm firstrows'> budgetRange ₹{item.budgetRange} </div>
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
            Warranty:
            <span className={item.warrantyRequired ? "text-green-700 font-medium" : "text-red-600 font-medium"}>
              {item.warrantyRequired ? " Yes" : " No"}
            </span>
          </p>

          <button className="text-blue-600 cursor-pointer  hover:text-blue-800 text-sm font-medium flex items-center gap-1">
            <HiOutlineInboxIn /> Responses
          </button>
        </div>

      </div>
    )
  })}
</div>


      
        {Listofproblems.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No repair requests yet</h3>
            <p className="text-gray-500 mb-4">Submit your first repair request to get started</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
              Submit New Request
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile