import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
 
        <div>
          <h2 className="text-3xl font-bold mb-3"><img src="./public/logowhite.png" alt="" /></h2>
          <p className="text-white/70">
            Fixora is India’s real-time repair marketplace connecting users with trusted repair experts instantly.
          </p>
        </div>
 
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-white/70">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">About</li>
            <li className="hover:text-white cursor-pointer">Services</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

 
        <div>
          <h3 className="text-xl font-semibold mb-3">Repairs</h3>
          <ul className="space-y-2 text-white/70">
            <li>Mobile Repair</li>
            <li>Laptop Repair</li>
            <li>Appliance Repair</li>
            <li>Gaming Console Repair</li>
          </ul>
        </div>
 
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact</h3>
          <p className="text-white/70">support@fixora.in</p>
          <p className="text-white/70">+91 98765 43210</p>
 
          <div className="flex gap-4 mt-4">
            <Facebook className="hover:text-blue-400 cursor-pointer" />
            <Instagram className="hover:text-pink-400 cursor-pointer" />
            <Twitter className="hover:text-sky-400 cursor-pointer" />
            <Linkedin className="hover:text-blue-500 cursor-pointer" />
            <Mail className="hover:text-green-400 cursor-pointer" />
          </div>
        </div>
      </div>
 
      <div className="border-t border-white/20 mt-10 pt-5 text-center text-white/60">
        © {new Date().getFullYear()} Fixora. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
