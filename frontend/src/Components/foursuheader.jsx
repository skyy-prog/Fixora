import React from "react";

const Step = ({ text }) => (
  <div className="flex flex-col items-center">
    <div className="text-center text-lg md:text-xl font-medium tracking-wide max-w-md">
      {text}
    </div>
    <div className="w-px h-10 bg-black my-6 opacity-30"></div>
  </div>
);

const Foursuheader = () => {
  return (
    <div  className="min-h-screen universal  bg-gray-100 rounded-4xl  px-6 md:px-20 py-20  flex  flex-col ">
    
      <div className="grid md:grid-cols-2 gap-16   ">

     
        <div className="flex flex-col border-r border-gray-300   font-extrabold  items-center mainbgimginit  ">
          
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-12 border-b pb-4">
            CUSTOMER
          </h1>

          <Step text="Unable to find the right repairer?" />
          <Step text="Create your account." />
          <Step text="Connect with verified professionals." />

          <div className="text-xl font-semibold mt-6">
            Post your problem. Get responses instantly.
          </div>

        </div>

        {/* Repairer Section */}
        <div className="flex flex-col items-center">
          
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-12 border-b pb-4">
            REPAIRER
          </h1>

          <Step text="Looking for genuine customers?" />
          <Step text="Create your shop profile." />
          <Step text="Set your pricing." />

          <div className="text-xl font-semibold mt-6">
            Grow your business with FIXORA.
          </div>

        </div>

      </div>
      <div className=" flex   mt-10  flex-col items-center justify-center ">
        <img src="bigger2.png" className=" mr-15" width={300} height={300} alt="" />
        <p className=" p-3">
              Fixora brings customers and repair experts together on one seamless platform.
          Customers can post their device issues and receive responses from trusted professionals.
          Repairers can create their shop profile, set their pricing, and connect with genuine clients —
          without unnecessary barriers.
        </p>
      </div>
      
    </div>
  );
};

export default Foursuheader;