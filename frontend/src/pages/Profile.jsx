import React, { useContext, useEffect, useState } from 'react';
import { CiLocationOn } from "react-icons/ci";
import { HiOutlineInboxIn } from "react-icons/hi";
import { CiCirclePlus } from "react-icons/ci";
import { RepairContext } from '../Context/ALlContext';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [listOfProblems, setListOfProblems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const { repairRequestss, user } = useContext(RepairContext);

  useEffect(() => {
    setListOfProblems(repairRequestss);
    setIsVisible(true);
  }, [repairRequestss]);

  return (
    <div
      className={`min-h-screen bg-black p-3 sm:p-4 md:p-6 duration-400 transition-all ${
        isVisible ? 'opacity-100 bg-white' : 'opacity-0'
      }`}
    >
      {/* Profile Header */}
      <div className="w-full mx-auto bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center md:justify-between">
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            <img
              src="/bigger2.png"
              alt="Profile"
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-blue-100 object-cover"
            />
            <div className="absolute bottom-2 right-2 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          {/* Greeting */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
              Hey, {user?.username || 'User'}!
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Here's an overview of your repair requests
            </p>
          </div>

          {/* Add New Button */}
          <Link to="/addproblems" className="w-full sm:w-auto">
            <button className="w-full sm:w-40 py-3 sm:py-4 bg-black flex items-center justify-center gap-2 text-white rounded-full hover:scale-95 transition-transform cursor-pointer text-sm sm:text-base">
              Add new <CiCirclePlus size={24} />
            </button>
          </Link>
        </div>
      </div>

      {/* Repair Requests Section */}
      <div>
        {/* Header with count */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              Your Repair Requests
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Track all your submitted problems
            </p>
          </div>
          <span className="self-start sm:self-center bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full">
            {listOfProblems.length} Active
          </span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {listOfProblems.map((item, index) => {
            const statusColors = {
              Pending: 'bg-yellow-100 text-yellow-800',
              'In Progress': 'bg-blue-100 text-blue-800',
              Completed: 'bg-green-100 text-green-800',
              Cancelled: 'bg-red-100 text-red-800',
            };

            const urgencyColors = {
              High: 'text-red-600 border-red-200',
              Medium: 'text-orange-600 border-orange-200',
              Low: 'text-green-600 border-green-200',
            };

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition p-4 sm:p-5"
              >
                {/* Title Row */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                      {item.problemTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {item.brand} {item.model}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 border border-blue-300 rounded-full text-xs whitespace-nowrap">
                    {item.deviceType}
                  </span>
                </div>

                {/* Urgency, Budget, Description */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                    <span className={`font-semibold ${urgencyColors[item.urgency]}`}>
                      Urgency: {item.urgency}
                    </span>
                    <span className="text-gray-700 font-medium">
                      Budget: ₹{item.budgetRange}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 line-clamp-2">
                    {item.problemDescription}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 mt-2">
                  <CiLocationOn className="flex-shrink-0" />
                  <span className="truncate">
                    {item.location.city}, {item.location.state} - {item.location.pincode}
                  </span>
                </div>

                {/* Footer: Status, Warranty, Responses */}
                <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-100">
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[item.status]}`}
                  >
                    {item.status}
                  </span>
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                    <span>
                      Repair: <span className="font-medium">{item.preferredRepairType}</span>
                    </span>
                    <span>
                      Warranty:{' '}
                      <span
                        className={
                          item.warrantyRequired ? 'text-green-700 font-medium' : 'text-red-600 font-medium'
                        }
                      >
                        {item.warrantyRequired ? 'Yes' : 'No'}
                      </span>
                    </span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 whitespace-nowrap">
                    <HiOutlineInboxIn /> Responses
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {listOfProblems.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No repair requests yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              Submit your first repair request to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;