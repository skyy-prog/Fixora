import React, { useState } from "react";
import GlassNavbar from "./Navbar";
import { FaWrench } from "react-icons/fa";
// import { Link } from "lucide-react";
import { Link } from "react-router-dom";
import Carousel from "./Corousel";
export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
    
    <div className="relative bg-white h-[120vh] ">

       <GlassNavbar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

       <section
        className={`relative min-h-screen flex flex-col bg-white transition-all duration-300
        ${searchOpen ? "pt-40 sm:pt-36" : "pt-28 sm:pt-24"}`}
      >

       
        <div className="absolute bottom-[-6rem] left-[-6rem] w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">

          <div className="inline-flex items-center gap-2 px-4 py-2 mt-15  mb-6 rounded-full bg-white/10 border border-black/20 text-black/80 text-sm">
            <FaWrench />
 Real-Time Repair Marketplace
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
            Get Your Devices Fixed  
            <span className="text-blue-400"> Smarter & Faster</span>
          </h1>

          <p className="mt-6 text-black/70 text-lg max-w-2xl mx-auto">
            Post your repair problem. Verified repairers bid in real-time.  
            Compare prices, chat instantly, and choose the best offer.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
             <Link to={'/login'}>
            <button   className="px-6 py-3  cursor-pointer  bg-black text-white font-semibold rounded-xl hover:scale-105 transition-transform">
               I'm a Customer 
            </button>
            </Link>
            <button className="px-6  cursor-pointer py-3 border border-black/40 font-semibold rounded-xl hover:scale-105 transition-transform">
              I'm a Repairer
            </button>
          </div>

          <div className="mt-12 flex justify-center gap-10 text-black/70 text-sm flex-wrap">
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

        {/* Hero Image */}
        <div className="relative z-10 mt-10 flex justify-center">
          <img 
            src="/bigger2.png"
            className="w-[70%] sm:w-[50%] md:w-[35%] max-w-xs sm:max-w-sm md:max-w-md"
            alt="hero"
          />
        </div>

      </section>
    </div>
     {/* <Carousel/> */}
    </>
  );
}
