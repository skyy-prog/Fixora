import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ListofRepairers } from '../assets/assets';

const RepairerProfile = () => {
  const { id } = useParams();
  const [FinalProfile, setFinalProfile] = useState(null)

  useEffect(() => {
    const Profile = ListofRepairers.find(
      (item) => item.id === Number(id) 
    );
    setFinalProfile(Profile);
  }, [id])

  return (
    <>
 <div className="px-4 sm:px-8 md:px-16 lg:px-24 py-10">
  <div className="universal bg-white rounded-2xl shadow-md p-6 sm:p-8 flex flex-col gap-6">

    {FinalProfile && (
      <>
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

          {/* Left Side */}
          <div className="flex items-center gap-5">
            <img
              src="/bigger2.png"
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

        </div>

        {/* Shop Info */}
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">

          <p>
            <span className="font-semibold">Shop Name:</span>{" "}
            {FinalProfile.shopDetails.shopName}
          </p>

          <p>
            <span className="font-semibold">Experience:</span>{" "}
            {FinalProfile.shopDetails.experience} Years
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
            {FinalProfile.shopDetails.address}
          </p>

          <p>
            <span className="font-semibold">City:</span>{" "}
            {FinalProfile.shopDetails.city}
          </p>

        </div>

        {/* Skills */}
        <div>
          <p className="font-semibold mb-2">Best Skills</p>
          <div className="flex flex-wrap gap-3">
            {FinalProfile.shopDetails.skills.map((items, index) => (
              <span
                key={index}
                className="bg-gray-100 px-4 py-2 rounded-full text-sm"
              >
                {items}
              </span>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 text-gray-700">
          <span>📞 Personal: {FinalProfile.PersonalNo || "N/A"}</span>
          <span>🏪 Shop: {FinalProfile.shopDetails.ShopPhoneNo || "N/A"}</span>
        </div>

        {/* Button */}
        <div className="w-full">
          <button className="w-full cursor-pointer  sm:w-auto sm:px-8 py-4 bg-black text-white rounded-xl hover:scale-105 transition-all">
            Chat With {FinalProfile.userName}
          </button>
        </div>
      </>
    )}
  </div>
</div>

    </>
  )
}

export default RepairerProfile
