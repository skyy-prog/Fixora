import React from 'react'

const Subheader = () => {
  return (
    <section className="py-16 px-6 bg-white flex flex-col items-center text-center">

      {/* Heading */}
      <h2 className="text-2xl md:text-6xl sm:text-2xl font-bold text-black flex items-center justify-center gap-3 universal">
        What is 
        <img 
          src="./public/bigger2.png" 
          alt="Fixora Logo" 
          className="w-40 md:w-56 mt-6 sm:w-20 "
        />
        ?
      </h2>

      {/* Short tagline */}
      <p className="mt-6 text-xl text-black/70 max-w-3xl">
        Fixora is a real-time repair marketplace that connects users with verified repair experts instantly.
      </p>

      {/* Description */}
      <p className="mt-4 text-black/60 text-lg max-w-4xl">
        Instead of visiting multiple repair shops or waiting for quotes, users simply post their device problem. 
        Trusted repairers then bid in real-time, offering the best price and fastest service. 
        Users can compare offers, chat instantly, and choose the repairer they trust — all in one place.
      </p>

    </section>
  )
}

export default Subheader
