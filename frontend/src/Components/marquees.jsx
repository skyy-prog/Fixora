import React from "react";

const Marquees = () => {
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Uttar Pradesh", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
     "Uttarakhand", "West Bengal"
  ];

  return (
    <>
   <div className=" flex justify-between flex-col items-center  gap-4">
      <h1 className=" font-extrabold text-2xl  sm:text-3xl">Service All Over India...</h1>
    <div className="w-full overflow-hidden bg-black py-3 sm:py-6 universal">
         
      <div className="whitespace-nowrap animate-marquee flex gap-10 text-white text-lg font-medium">
        {states.concat(states).map((state, index) => (
          <span key={index} className="px-4">
            {state}
          </span>
        ))}
      </div>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 10s linear infinite;
          }
        `}
      </style>
    </div>
   </div>
    </>
  );
};

export default Marquees;
