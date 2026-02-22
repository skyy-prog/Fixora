import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { testimonials } from "../assets/assets";

const Testimonial = () => {
 
    let Finaltestimonials = testimonials.sort(()=> 0.5 - Math.random()).slice(0,5);
    const [finalTestimonials, setFinalTestimonials] = useState([]);

const shuffleTestimonials = () => {
  const shuffled = [...testimonials]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  setFinalTestimonials(shuffled);
};

useEffect(() => {
  shuffleTestimonials();
}, []);
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-full mx-auto px-4">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            What Our Users Say
          </h2>
          <p className="text-gray-500 mt-2">
            Real feedback from our happy customers
          </p>
        </div>

        
        <div className=" p-6  ">
            <button  onClick={shuffleTestimonials} className=" active:scale-100 hover:scale-105 cursor-pointer  bg-gray-100 p-3  rounded-3xl shadow">See More</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Finaltestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
            >
              {/* User Info */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
 
              <p className="text-gray-600 mb-4">
                “{item.message} ”
              </p>

              {/* Rating */}
              <div className="flex">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonial;