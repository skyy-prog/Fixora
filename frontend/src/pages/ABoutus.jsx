import React from "react";

const AboutUs = () => {
  return (
    <section className="w-full bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-6xl font-bold flex items-center  justify-center ">
          About <span className="text-white/80"><img src="./public/logowhite.png"  width={130} height={130} alt="" /></span>
        </h2>

        {/* Tagline */}
        <p className="mt-6 text-xl text-white/70 max-w-3xl">
          India’s first real-time repair bidding marketplace.
        </p>

        {/* Description */}
        <p className="mt-6 text-lg text-white/60 max-w-4xl leading-relaxed">
          Fixora is built to remove the frustration of finding reliable repair services.
          Users simply post their device issue, and verified repair experts compete
          by offering the best price and fastest service — in real time.
          No waiting. No hidden costs. Just transparent repair.
        </p>

        {/* Highlight Strip */}
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm md:text-base">
          <span className="px-5 py-2 border border-white/30 rounded-full text-white/80">
            ⚡ Instant Bidding
          </span>
          <span className="px-5 py-2 border border-white/30 rounded-full text-white/80">
            🔒 Verified Experts
          </span>
          <span className="px-5 py-2 border border-white/30 rounded-full text-white/80">
            💬 Real-time Chat
          </span>
          <span className="px-5 py-2 border border-white/30 rounded-full text-white/80">
            💰 Transparent Pricing
          </span>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">

          <div className="border border-white/20 rounded-xl p-6">
            <h3 className="text-4xl font-bold">10K+</h3>
            <p className="text-white/60 mt-2">Successful Repairs</p>
          </div>

          <div className="border border-white/20 rounded-xl p-6">
            <h3 className="text-4xl font-bold">5K+</h3>
            <p className="text-white/60 mt-2">Verified Experts</p>
          </div>

          <div className="border border-white/20 rounded-xl p-6">
            <h3 className="text-4xl font-bold">50+</h3>
            <p className="text-white/60 mt-2">Cities Covered</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;
