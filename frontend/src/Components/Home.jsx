import React, { useState  , useEffect} from "react";
import GlassNavbar from "./Navbar";
import { FaWrench } from "react-icons/fa";
// import { Link } from "lucide-react";
import { Link } from "react-router-dom";
import Carousel from "./Corousel";
import Subheader from "./Subheader";
export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [animateleft, setAnimateleft] = useState(false);
  const [animateright, setAnimateright] = useState(false);
  const [animatelogo, setAnimatelogo] = useState(false);




useEffect(() => {
  setAnimate(true);
  setTimeout(() => {
    setAnimateleft(true);
  }, 1000);
  setTimeout(() => {
    setAnimateright(true)
  }, 1200);
  setTimeout(() => {
    setAnimatelogo(true)
  }, 2000);
}, []);


  return (
    <>
    
    <div className="relative  min-h-[80vh]">

       <GlassNavbar searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
 <div className="flex flex-row justify-around items-center h-full">
<div className={`hidden lg:flex w-[28%] flex-col gap-4 p-5 h-100 justify-around items-start
transition-all duration-1200  ease-out
${animateleft ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

 
  <div className="flex flex-row gap-4 justify-around">

    <div className="group flex-1 backdrop-blur-md bg-black border border-white/20  cursor-pointer
                    text-white  p-5 rounded-2xl shadow-lg 
                    hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400
                    hover:-translate-y-1 transition-all duration-300">
      <p className="font-semibold text-sm tracking-wide">
        Post your repair problem and receive instant solutions
      </p>
    </div>

   

  </div>
  <div>
      <div className="group flex-1 backdrop-blur-md  bg-black/35 border border-white/20  cursor-pointer
                    text-white p-5 rounded-2xl shadow-lg 
                    hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-400
                    hover:-translate-y-1 transition-all duration-300">
      <p className="font-semibold text-sm tracking-wide">
        Find the best surgeon for your electronics
      </p>
    </div>
  </div>

 
  <div className="flex justify-center">
    <div className="w-full backdrop-blur-md bg-black/20 border border-white/20  cursor-pointer
                    text-white p-5 rounded-2xl shadow-lg 
                    hover:bg-gradient-to-r hover:from-orange-400 hover:to-yellow-300
                    hover:-translate-y-1 transition-all duration-300 text-center">
      <p className="font-semibold text-sm tracking-wide">
        Be the best customer of our site
      </p>
    </div>
  </div>

</div>

      <section className={`relative min-h-screen flex flex-col bg-white
transition-all duration-700 ease-out
${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
${searchOpen ? " pt-40 sm:pt-36" : " pt-28 sm:pt-24"}`}
>


       
        <div className="absolute bottom-[-6rem] left-[-6rem] w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]"></div>

       
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

        <div className="relative z-10 mt-10 flex justify-center">
          <img 
            src="/bigger2.png"
            className={`w-[70%] sm:w-[50%] md:w-[35%] max-w-xs sm:max-w-sm md:max-w-md transition-all duration-1200  ease-out
${animatelogo ? "opacity-100 translate-x-0" : "opacity-0 translate-y-8"}`}
            alt="hero"
          />
        </div>

      </section>
   <div className={`hidden lg:flex w-[30%] flex-col-reverse gap-4 p-5 h-100 justify-around items-end
transition-all duration-700 ease-out delay-150
${animateright ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

 
  <div className="flex flex-row gap-4 justify-around">

    <div className="group flex-1 backdrop-blur-md bg-black border border-white/20  cursor-pointer
                    text-white  p-5 rounded-2xl shadow-lg 
                    hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-400
                    hover:-translate-y-1 transition-all duration-300">
      <p className="font-semibold text-sm tracking-wide">
        Find customers who need budget-friendly repairs under choice
      </p>
    </div>

   

  </div>
  <div>
      <div className="group flex-1 backdrop-blur-md  bg-black/35 border border-white/20  cursor-pointer
                    text-white p-5 rounded-2xl shadow-lg 
                    hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-400
                    hover:-translate-y-1 transition-all duration-300">
      <p className="font-semibold text-sm tracking-wide">
       Receive repair requests and start fixing instantly
      </p>
    </div>
  </div>
 
  <div className="flex justify-center">
    <div className="w-full backdrop-blur-md bg-black/20 border border-white/20  cursor-pointer
                    text-white p-5 rounded-2xl shadow-lg 
                    hover:bg-gradient-to-r hover:from-orange-400 hover:to-yellow-300
                    hover:-translate-y-1 transition-all duration-300 text-center">
      <p className="font-semibold text-sm tracking-wide">
        Find repair jobs instantly
      </p>
    </div>
  </div>

</div>
      </div>
    </div>
     {/* <Carousel/> */}
      
    </>
  );
}
