import React, { useEffect, useState } from 'react'

const Subheader = () => {
  const [visible , setvisible] = useState(false)
  useEffect(()=>{
    const handletoshow = ()=>{
      if(window.scrollY >500){
        setvisible(true)
      }else{
        setvisible(false)
      }
    }
    window.addEventListener('scroll' , handletoshow)
      handletoshow();
      return ()=>window.removeEventListener('scroll' , handletoshow)
  },[])
  return (
    <section className={`py-16 px-6 bg-white flex flex-col items-center text-center transition-all duration-600  ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
 
      <h2 className="text-2xl md:text-6xl sm:text-2xl font-bold text-black flex items-center justify-center gap-3 universal">
        What is 
        <img 
          src="./public/bigger2.png" 
          alt="Fixora Logo" 
          className="w-40 md:w-56 mt-6 sm:w-20 "
        />
        ?
      </h2>
 
      <p className="mt-6 text-xl text-black/70 max-w-3xl">
        Fixora is a real-time repair marketplace that connects users with verified repair experts instantly.
      </p>

    
      <p className="mt-4 text-black/60 text-lg max-w-4xl">
        Instead of visiting multiple repair shops or waiting for quotes, users simply post their device problem. 
        Trusted repairers then bid in real-time, offering the best price and fastest service. 
        Users can compare offers, chat instantly, and choose the repairer they trust — all in one place.
      </p>
 
      <p className="mt-4 text-black/60 text-lg max-w-4xl">
        From smartphones and laptops to home appliances and gaming consoles, Fixora covers all major repair categories. 
        Every repair expert on Fixora is verified to ensure safety, quality, and reliability. 
        Our goal is to make device repair transparent, fast, and affordable for everyone.
      </p>
 
      <div className="mt-8 flex flex-col md:flex-row gap-4 text-black/70 text-lg">
        <span className="px-4 py-2 border  cursor-pointer  rounded-full">⚡ Instant Repair Bids</span>
        <span className="px-4 py-2 border cursor-pointer   rounded-full">🔒 Verified Experts</span>
        <span className="px-4 py-2 border cursor-pointer   rounded-full">💬 Real-time Chat</span>
        <span className="px-4 py-2 border cursor-pointer   rounded-full">💰 Best Price Guarantee</span>
      </div>

    </section>
  )
}

export default Subheader
