import { useState, useEffect } from "react";
import {
  Search, User, Smartphone, Laptop,
  Gamepad2, Headphones, Menu, X, ChevronDown
} from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";
import Profile from "../pages/Profile";

export default function GlassNavbar({ searchOpen, setSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileItem, setActiveMobileItem] = useState(null);
  const [isprofile , setisprofile] = useState(false);
  const [hide , sethide] = useState(true)

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 10);

    if (window.scrollY > 350) {
      sethide(false);
    } else {
      sethide(true);
    }
  };

  window.addEventListener("scroll", handleScroll);
 
  handleScroll();

  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  const navItems = [
    { label: "Services", hasDropdown: true },
    { label: "About Us" , to:'about'},
  ];

  const deviceTypes = [
    { icon: Smartphone, label: "Phone" },
    { icon: Laptop, label: "Laptop" },
    { icon: Gamepad2, label: "Console" },
    { icon: Headphones, label: "Audio" }
  ];

  return (
    <> 
      <nav
        className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 
        w-[92%] sm:w-[95%] max-w-6xl rounded-2xl transition-all duration-300  
        ${scrolled ? "bg-black/95 backdrop-blur-xl shadow-2xl" : "bg-black/85 backdrop-blur-lg"}
        border border-white/10 ${hide ? '  opacity-100 duration-800  ' : 'opacity-0 duration-800 '}`}
      >
        <div className="px-4 py-3 sm:px-6">
 
          <div className="flex items-center justify-between">
 
            <img src="/logowhite.png" className="w-28 sm:w-32" alt="logo" />

           
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  <Link to={item.to}>
                   <button className="text-white/90 cursor-pointer  hover:text-white flex items-center gap-1 text-sm font-medium">
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                    )}
                  </button></Link>

                  {item.hasDropdown && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="p-3">
                        {deviceTypes.map((device) => (
                          <div key={device.label} className="flex  cursor-pointer items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                            <device.icon className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{device.label} Repair</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
 
            <div className="flex items-center gap-3">
 
              <button
                onClick={() => setSearchOpen(prev => !prev)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <Search className="w-5 h-5 cursor-pointer  text-white" />
              </button>
 
               {isprofile ? <Link to={'/login'}> <button className="hidden cursor-pointer sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold">
                <User className="w-4 h-4" />   Login In 
              </button>  </Link>:  <Link to={'/profile'}> <button className="hidden cursor-pointer sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold">
                <User className="w-4 h-4" />  Profile 
              </button>  </Link>}

          
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
              >
                {mobileMenuOpen ? <X className="text-white"/> : <Menu className="text-white"/>}
              </button>
            </div>
          </div>
 
          {searchOpen && (
            <div className="w-full flex justify-center mt-3">
              <div className="w-[92%] sm:w-[95%] max-w-5xl">
                <div className="bg-white rounded-xl shadow-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
                  <Search className="w-5 cursor-pointer  h-5 text-gray-500" />
                  <input
                    className="w-full outline-none text-gray-800 placeholder:text-gray-500"
                    placeholder="Search services, devices, or repairers..."
                    autoFocus
                  />
                  <button onClick={() => setSearchOpen(false)}>
                    <X className="w-5 h-5 cursor-pointer  text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </nav>
 
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden mt-20">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-black rounded-2xl p-4">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link to={item.to}>
                 <button
                  onClick={() => setActiveMobileItem(activeMobileItem === item.label ? null : item.label)}
                  className="w-full flex justify-between text-white py-2"
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown className={`${activeMobileItem === item.label ? "rotate-180" : ""}`} />
                  )}
                </button></Link>

                {item.hasDropdown && activeMobileItem === item.label && (
                  <div className="ml-3 space-y-2 mt-2">
                    {deviceTypes.map((device) => (
                      <div key={device.label} className="flex items-center gap-3 text-white/80">
                        <device.icon className="w-4 h-4 text-blue-400" />
                        {device.label} Repair
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
