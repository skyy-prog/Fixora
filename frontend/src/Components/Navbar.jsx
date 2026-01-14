import { useState, useEffect } from 'react';
import { Search, User, Sparkles, Smartphone, Laptop, Gamepad2, Headphones, Menu, X, ChevronDown } from 'lucide-react';
import React from 'react';

export default function GlassNavbar() {
  const [scrolled, setScrolled] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileItem, setActiveMobileItem] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Services', hasDropdown: true },
  ];

  const deviceTypes = [
    { icon: Smartphone, label: 'Phone' },
    { icon: Laptop, label: 'Laptop' },
    { icon: Gamepad2, label: 'Console' },
    { icon: Headphones, label: 'Audio' }
  ];

  return (
    <>
      <div className="flex justify-around items-center z-[1000000]">

        {/* Blue Glow */}
        <div className="absolute top-[-6rem] right-[-6rem]
          w-72 h-72 bg-blue-500/30 rounded-full blur-3xl hidden lg:block">
        </div>

        <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100000]
          w-[95%] max-w-5xl transition-all duration-300
          ${scrolled 
            ? 'backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl' 
            : 'backdrop-blur-lg border border-white/10 rounded-2xl'
          }`}>

          <div className="px-6 py-4 rounded-2xl bg-black">

            {/* MAIN ROW */}
            <div className="flex items-center justify-between">

              {/* LOGO */}
              <img src="./public/Logowhite.png" className="cursor-pointer" width={115} alt="logo" />

              {/* DESKTOP NAV + INLINE SEARCH */}
              <div className="hidden lg:flex items-center space-x-1">

                {navItems.map((item) => (
                  <div key={item.label} className="relative group">
                    <button className="px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium flex items-center gap-1">
                      {item.label}
                      {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                    </button>

                    {item.hasDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-64
                        bg-white/90 backdrop-blur-xl border border-black/5 rounded-2xl shadow-2xl
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                        transition-all duration-200 z-50">
                        <div className="p-4">
                          <div className="text-gray-900 text-sm font-semibold mb-3">
                            Popular Repairs
                          </div>
                          <div className="space-y-2">
                            {deviceTypes.map((device) => (
                              <a key={device.label} href="#"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5">
                                <device.icon className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-800 text-sm font-medium">
                                  {device.label} Repair
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* 🔍 INLINE SEARCH */}
                <div className="flex items-center gap-2 ml-3">

                  <Search 
                    onClick={() => setSearchOpen(!searchOpen)} 
                    className="w-5 h-5 cursor-pointer text-white"
                  />

                  <div className={`transition-all duration-300 overflow-hidden
                    ${searchOpen ? 'w-[220px] opacity-100' : 'w-0 opacity-0'}`}>
                    
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg 
                                text-white placeholder-white/50 focus:outline-none text-sm"
                      autoFocus={searchOpen}
                    />
                  </div>

                </div>
              </div>

              {/* RIGHT ICONS */}
              <div className="flex items-center space-x-3">
                <button className="hidden sm:block p-2.5 hover:bg-white/10 rounded-xl">
                  <User className="w-5 h-5 text-white" />
                </button>

                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2.5 hover:bg-white/10 rounded-xl"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                </button>

                <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold rounded-xl">
                  <Sparkles className="w-4 h-4" />
                  Quote
                </button>
              </div>

            </div>

            {/* MOBILE SEARCH */}
            {searchOpen && (
              <div className="lg:hidden mt-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-4 pr-10 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
                    autoFocus
                  />
                  <X 
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-3 top-3 w-5 h-5 text-white cursor-pointer"
                  />
                </div>
              </div>
            )}

          </div>

          {/* MOBILE MENU */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-white/10 mt-4 pt-4">
              {navItems.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => setActiveMobileItem(activeMobileItem === item.label ? null : item.label)}
                    className="w-full flex justify-between px-4 py-3 text-white hover:bg-white/10 rounded-xl">
                    {item.label}
                    {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                  </button>

                  {item.hasDropdown && activeMobileItem === item.label && (
                    <div className="ml-6 mt-2 space-y-2">
                      {deviceTypes.map((device) => (
                        <a key={device.label} href="#"
                          className="flex items-center gap-3 px-4 py-2 text-white/80 hover:text-white">
                          <device.icon className="w-5 h-5" />
                          {device.label} Repair
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </nav>
      </div>
    </>
  );
}
