import React, { useEffect, useState } from "react";
import { ListofRepairers } from "../assets/assets";
import { IoLocationSharp } from "react-icons/io5";
import { IoStarOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
const Listofrepairers = () => {
  const [ListRepairer, setListRepairer] = useState([]);
  const [Sortype, setSortype] = useState("Relevent");
  const [Sortypebyrating, setSortypebyrating] = useState("Relevent");
  const [city , setcity] = useState('')
  const [state , setstate] = useState('')
  const [pincode , setpincode] = useState('')

  useEffect(() => {
    setListRepairer(ListofRepairers);
  }, []);
   
  const sortedRepairers = [...ListRepairer].sort((a, b) => {
    if (Sortype === "Experienced") {
      return b.shopDetails.experience - a.shopDetails.experience;
    }

    if (Sortype === "NewBe") {
      return a.shopDetails.experience - b.shopDetails.experience;
    }

    if (Sortypebyrating === "Best") {
      return b.rating - a.rating;
    }

    if (Sortypebyrating === "Least") {
      return a.rating - b.rating;
    }
    return 0;
  });

   const handletosearneabyareaforcustomers = async(e)=>{
    e.preventDefault();
    const FullLocations = `${city} ${state} ${pincode}`.toLocaleLowerCase().trim();
    if(!FullLocations){
      return;
    }
 const Filteredvalues = ListRepairer.filter((items)=>{
      const FullLocation =  `${items.shopDetails.address}`.toLocaleLowerCase().trim();
      return FullLocation.includes(FullLocations);
    })
    setListRepairer(Filteredvalues);
    console.log(Filteredvalues)
  }
  const openmaps = (address) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <h1 className="text-4xl font-extrabold text-center mb-10">
        Our Repairers
      </h1>
<div className="w-full bg-white shadow-md rounded-2xl p-4 mb-6">
  <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
  
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-100 p-4 rounded-2xl w-full lg:w-auto">
      <h1 className="text-base sm:text-lg font-semibold text-gray-700 whitespace-nowrap">
        Sort by Experience
      </h1>

      <select
        onChange={(e) => setSortype(e.target.value)}
        className="w-full sm:w-auto px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-black transition cursor-pointer bg-white"
      >
        <option value="Relevent">Relevant</option>
        <option value="Experienced">Most Experienced</option>
        <option value="NewBe">Newly Joined</option>
      </select>
    </div>
   <div
            className="
            bg-white p-4 flex flex-col sm:flex-row items-center gap-3 
            w-full max-w-2xl mx-auto
          "
          >
            <form
              onSubmit={handletosearneabyareaforcustomers}
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

    <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-100 p-4 rounded-2xl w-full lg:w-auto">
      <h1 className="text-base sm:text-lg font-semibold text-gray-700 whitespace-nowrap">
        Sort by Ratings
      </h1>

      <select
        onChange={(e) => setSortypebyrating(e.target.value)}
        className="w-full sm:w-auto px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-black transition cursor-pointer bg-white"
      >
        <option value="Relevent">Relevant</option>
        <option value="Best">Best</option>
        <option value="Least">Least</option>
      </select>
    </div>

  </div>
</div>

      <div className="grid  lg:grid-cols-3  sm:grid-cols-2  grid-cols-1 gap-6 w-full">
        {sortedRepairers.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 "
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

            <p className="text-gray-600 text-sm">{item.shopDetails.shopName}</p>

            <p className="text-gray-500 text-sm mb-2 flex  gap-3 items-center ">
              <IoLocationSharp /> {item.shopDetails.city}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Experience:</span>{" "}
              {item.shopDetails.experience} years
            </p>

            <p className="text-sm flex items-center  gap-2">
              <span className="font-semibold">Rating:</span>{" "}
              <IoStarOutline color="black" fill="black" /> {item.rating} (
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
            <div className=" p-2 ">
              <b>Address</b> :{" "}
              {
                <a
                  href={openmaps(item.shopDetails.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black  "
                >
                  {item.shopDetails.address}
                </a>
              }
            </div>

            <Link to={`/repairerProfile/${item.id}`}>
              <button className="mt-5 cursor-pointer w-full bg-black text-white py-2 rounded-xl font-semibold hover:bg-gray-800 transition">
                {" "}
                View Profile
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listofrepairers;
