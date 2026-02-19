import React, { useEffect, useState } from "react";
import { ListofRepairers } from "../assets/assets";

const Listofrepairers = () => {
  const [ListRepairer, setListRepairer] = useState([]);
  const [Sortype, setSortype] = useState("Relevent");
const [ Sortypebyrating ,setSortypebyrating ]= useState('Relevent')
 
  useEffect(() => {
    setListRepairer(ListofRepairers);
 
  }, []);
 
  const sortedRepairers = [...ListRepairer].sort((a, b) => {
    if (Sortype === "Experienced")  return b.shopDetails.experience - a.shopDetails.experience;  
     if (Sortype === "NewBe") return a.shopDetails.experience - b.shopDetails.experience; 
    if(Sortypebyrating === 'Best')
      if(  b.rating !== a.rating){
         return b.rating - a.rating;
      }
    if(Sortypebyrating === 'Lest')
      if( a.rating !== b.rating){
        return a.rating - b.rating;
      }
    else {
      return 0;  
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <h1 className="text-4xl font-extrabold text-center mb-10">
        Our Repairers
      </h1>

      <div className="flex flex-col sm:flex-row items-center justify-between bg-white shadow-md rounded-xl p-4 mb-6 border">
        <div className="flex gap-2 items-center bg-gray-100 p-3 rounded-2xl">
          <h1 className="text-lg font-semibold text-gray-700">
            Sort by Experience
          </h1>

          <select
            onChange={(e) => setSortype(e.target.value)}
            className="px-4 py-2 border rounded-xl outline-none focus:ring-2 transition cursor-pointer"
          >
            <option value="Relevent">Relevent</option>
            <option value="Experienced">Most Experienced</option>
            <option value="NewBe">Newly Joined</option>
          </select>
        </div>
           <div className="flex gap-2 items-center bg-gray-100 p-3 rounded-2xl">
          <h1 className="text-lg font-semibold text-gray-700">
            Sort by Ratings
          </h1>

          <select
            onChange={(e) => setSortypebyrating(e.target.value)}
            className="px-4 py-2 border rounded-xl outline-none focus:ring-2 transition cursor-pointer"
          >
            <option value="Relevent">Relevent</option>
            <option value="Best">Best</option>
            <option value="Least">Least</option>
          </select>
        </div>
      </div>
      

      <div className="grid md:grid-cols-3 gap-6 w-full">
        {sortedRepairers.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 border"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">{item.userName}</h2>
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  item.available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {item.available ? "Available" : "Busy"}
              </span>
            </div>

            <p className="text-gray-600 text-sm">
              {item.shopDetails.shopName}
            </p>

            <p className="text-gray-500 text-sm mb-2">
              📍 {item.shopDetails.city}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Experience:</span>{" "}
              {item.shopDetails.experience} years
            </p>

            <p className="text-sm">
              <span className="font-semibold">Rating:</span> ⭐ {item.rating} (
              {item.totalReviews} reviews)
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {item.shopDetails.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>

            <button className="mt-5 cursor-pointer w-full bg-black text-white py-2 rounded-xl font-semibold hover:bg-gray-800 transition">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listofrepairers;
