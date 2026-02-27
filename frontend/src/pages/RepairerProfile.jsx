import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ListofRepairers } from '../assets/assets';
import { FaPhone } from "react-icons/fa6";
import { repairerReviews } from '../assets/assets';
import { GiShop } from "react-icons/gi";

const RepairerProfile = () => {
  const { id } = useParams();
  const [FinalProfile, setFinalProfile] = useState(null)
  const [length , setlenght] = useState(repairerReviews.length)
  useEffect(() => {
    const Profile = ListofRepairers.find(
      (item) => item.id === Number(id) 
    );
    setFinalProfile(Profile);
  }, [id])

   const openmaps = (address)=>{
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  return (
    <>
 <div className=" px-0 sm:px-8 md:px-16 lg:px-24 md:py-10">
  <div className="universal  bg-gray-100 rounded-2xl shadow-md p-6 sm:p-8 flex flex-col gap-6">

    {FinalProfile && (
      <>
         
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

        
          <div className="flex items-center flex-col md:flex-col lg:flex-row sm:flex-col  gap-5">
            <img
              src="/Repairer.png"
              alt="Profile"
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-blue-100 object-cover"
            />

            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {FinalProfile.userName}
              </h1>

              <p className="text-gray-500 mt-1">
                Rating  {FinalProfile.rating}/5
              </p>
            </div>
          </div>
          <div className='  bg-gray-100 flex justify-between gap-3  p-3 px-2 pl-2  rounded-2xl'>
            Available ?{FinalProfile.available ? <span className=' text-green-500'>Yes</span> : <span className=' text-red-600'>No</span>}
          </div>
        </div>

    
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">

          <p>
            <span className="font-semibold">Shop Name:</span>{" "}
            {FinalProfile.shopDetails.shopName}
          </p>

          <p>
            <span className="font-semibold ">Experience:</span>{" "}
            {FinalProfile.shopDetails.experience} Years
          </p>
          <p>
            <span className="font-semibold ">Joined at: { new Date(FinalProfile.joinedAt).toLocaleDateString("en-IN") }</span>{" "}
          </p>
             <p className=' flex gap-3 '>
            <span className="font-semibold   ">Isverified  ? </span>{" "}
            {FinalProfile.isVerified ? <div className=' text-green-400'>Yes</div>:  <div className=' text-red-400 '>No</div>} 
          </p>

          <p className="md:col-span-2">
            <span className="font-semibold">Bio:</span> {FinalProfile.bio}
          </p>

          <p className="md:col-span-2">
            <span className="font-semibold">Address:</span>{" "}
              <a
  href={openmaps(FinalProfile.shopDetails.address)}
  target="_blank"
  rel="noopener noreferrer"
  className="text-black  "
>
  {FinalProfile.shopDetails.address}
</a>
          </p>

          <p>
            <span className="font-semibold">City:</span>{" "}
            {FinalProfile.shopDetails.city} {FinalProfile.shopDetails.pincode}
          </p>

        </div>

        
        <div>
          <p className="font-semibold mb-2">Best Skills</p>
          <div className="flex flex-wrap gap-3">
            {FinalProfile.shopDetails.skills.map((items, index) => (
              <span
                key={index}
                className="bg-gray-200 px-4 py-2 rounded-full text-sm"
              >
                {items}
              </span>
            ))}
          </div>
        </div>

       
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 text-gray-700">
          <span className=' flex  gap-2 items-center'><FaPhone/> Personal: {FinalProfile.PersonalNo || "N/A"}</span>
          <span className=' flex  gap-2  items-center '><GiShop/> Shop: {FinalProfile.shopDetails.ShopPhoneNo || "N/A"}</span>
        </div>
        <div className="w-full">
          <button className="w-full cursor-pointer  sm:w-auto sm:px-8 py-4 bg-black text-white rounded-xl hover:scale-105 transition-all">
            Chat With {FinalProfile.userName}
          </button>
        </div>
    <div className="w-full flex flex-col lg:flex-row gap-6 px-4 py-6 border-t border-black/10">

   
  <div className="w-full lg:w-1/2">
    <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4">

      <textarea
        placeholder={`Share your experience with ${FinalProfile.userName}...`}
        rows="12"
        className="w-full resize-none border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
      />

      <button className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition duration-200">
        Submit Review
      </button>

    </div>
  </div>


  
  <div className="w-full lg:w-1/2">
    <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col ">
      <div className=' flex justify-end items-center p-2  '>
            <h2 className="text-xl font-extralight mb-4  ">
        Reviews {length}
      </h2>

      </div>
      <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
        {repairerReviews.map((item) => (
          <div
            key={item.id}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
          >
            <p className="text-gray-700 text-sm leading-relaxed">
              {item.review}
            </p>
          </div>
        ))}
      </div>

    </div>
  </div>

</div>
      </>
    )}
  </div>
</div>

    </>
  )
}

export default RepairerProfile
