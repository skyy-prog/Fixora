import React from "react";
 import Navbar from "./Navbar";
export default function Home() {
  return (
  <div className="relative bg-white overflow-hidden">
  
  {/* Navbar at top */}
  <Navbar/>
  {/* Hero Section */}
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white flex-col ">
    
    {/* Glow Background Effects */}
   
    <div className="absolute bottom-[-6rem] left-[-6rem] w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl"></div>

    {/* Subtle Grid Texture */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]"></div>

    {/* Main Content */}
    <div className="relative z-10 max-w-5xl mx-auto text-center px-6">

      {/* Tag */}
      <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/10 border border-black/20 text-black/80 text-sm">
        ⚡ Real-Time Repair Marketplace
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
        Get Your Devices Fixed  
        <span className="text-blue-400"> Smarter & Faster</span>
      </h1>
 
      {/* Subheading */}
      <p className="mt-6 text-black/70 text-lg max-w-2xl mx-auto">
        Post your repair problem. Verified repairers bid in real-time.  
        Compare prices, chat instantly, and choose the best offer.
      </p>

      {/* CTA Buttons */}
      <div className="mt-8 flex justify-center gap-4 flex-wrap">
        <button className="px-6 py-3 bg-black text-white  cursor-pointer font-semibold rounded-xl hover:scale-105 transition-transform">
          I'am a Customer
        </button>
        <button className="px-6 py-3 border border-black/40 cursor-pointer   hover:scale-105 transition-transform text-black rounded-xl hover:bg-white/10 transition-colors">
          I’m a Repairer
        </button>
      </div>

      {/* Stats */}
      <div className="mt-12 flex justify-center gap-10 text-black/70 text-sm">
        <div>
          <p className="text-black font-semibold text-lg">10K+</p>
          <p>Repairs Completed</p>
        </div>
        <div>
          <p className="text-black font-semibold text-lg">4.8★</p>
          <p>Average Rating</p>
        </div>
        <div>
          <p className="text-black font-semibold text-lg">Instant</p>
          <p>Live Bidding</p>
        </div>
      </div>
    </div>
     <div className=" w-100% flex justify-center  items-center">
    <img src="./public/bigger2.png"  width={'30%'} height={'30%'} alt="" />
  </div>
  </section>
  
</div>

  );
}


 