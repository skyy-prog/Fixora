import { useState, useEffect } from 'react';
import { Search, User, Zap, Sparkles, Smartphone, Laptop, Gamepad2, Headphones, Menu, X, ChevronDown } from 'lucide-react';
import React from 'react';

export default function GlassNavbar() {
  const [scrolled, setScrolled] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileItem, setActiveMobileItem] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Services', hasDropdown: true },
    { label: 'Pricing' },
    { label: 'Reviews' },
    { label: 'How It Works' },
    { label: 'Support' },
  ];

  const deviceTypes = [
    { icon: Smartphone, label: 'Phone' },
    { icon: Laptop, label: 'Laptop' },
    { icon: Gamepad2, label: 'Console' },
    { icon: Headphones, label: 'Audio' }
  ];

  return (
    <>
     <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 
w-[95%] max-w-5xl transition-all duration-300 
background-image: radial-gradient( circle farthest-corner at 17.6% 50.7%,  rgba(25,0,184,1) 0%, rgba(0,0,0,1) 90% );
overflow-visible
${
  scrolled 
    ? 'backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl' 
    : 'backdrop-blur-lg border border-white/10 rounded-2xl'
}`}>

        <div className=" sm:px-6 py-4 justify-around rounded-2xl bg-black min-h-12  ">
          <div className="flex items-center justify-around  ">
            
            <div className="flex items-center gap-3">
              <div className="relative">
               <img src="./public/Logowhite.png" className=' cursor-pointer' width={115} height={115} alt="" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-xl blur-sm -z-10"></div>
              </div>
      
            </div>

            
            <div className="hidden lg:flex items-center  justify-around space-x-1">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  <button className="px-4 py-2 cursor-pointer text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-1">
                    {item.label}
                    {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                  </button>
                  
              
               {item.hasDropdown && (
  <div className="absolute top-full left-0 mt-2 w-64
  bg-white/90 backdrop-blur-xl
  border border-black/5 rounded-2xl shadow-2xl
  opacity-0 invisible group-hover:opacity-100 group-hover:visible
  transition-all duration-200 z-50">

    <div className="p-4">
      <div className="text-gray-900 text-sm font-semibold mb-3">
        Popular Repairs
      </div>

      <div className="space-y-2">
        {deviceTypes.map((device) => (
          <a
            key={device.label}
            href="#"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors"
          >
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
              <Search  onClick={()=>setSearchOpen(!searchOpen)} className="w-5 ml-3  h-10 cursor-pointer text-white" />
            </div>


           
            <div className="hidden md:flex lg:hidden items-center ">
              {deviceTypes.map((device) => (
                <button
                  key={device.label}
                  className="p-2 cursor-pointer hover:bg-white/10 rounded-xl transition-colors"
                >
                  <device.icon className="w-5 h-5 text-white/70 hover:text-white" />
                </button>
              ))}
            </div>

           
            <div className="flex items-center space-x-2 sm:space-x-3">
       
              <button 
                onClick={() => setSearchOpen(true)}
                className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
 
              <button className="hidden sm:block p-2.5 hover:bg-white/10 rounded-xl transition-colors">
                <User className="w-5 h-5 text-white" />
              </button>

          
              
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 hover:bg-white/10 rounded-xl transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>

              {/* CTA Button */}
              <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-white to-white/90 text-gray-900 font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
                <Sparkles className="w-4 h-4" />
                <span className="hidden lg:inline">Quick Quote</span>
                <span className="lg:hidden">Quote</span>
              </button>
            </div>
          </div>
          {/* Mobile Search Bar (appears when search is clicked) */}
          {searchOpen && (
            <div className="md:hidden mt-4 animate-in fade-in">
              <div className="relative px-10 ">
                <input
                  type="text"
                  placeholder="Search for devices, issues, or services..."
                  className="w-full place-items-center pl-4 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                  autoFocus
                />
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="absolute mr-5 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-8 h-8 text-white mr-100 cursor-pointer  " />
                </button>
              </div>
            </div>
          )}
           
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 mt-4 pt-4 animate-in slide-in-from-top">
            <div className="pb-4">
              {/* Navigation Items */}
              <div className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <button
                      onClick={() => setActiveMobileItem(activeMobileItem === item.label ? null : item.label)}
                      className="w-full cursor-pointer flex items-center justify-between px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.hasDropdown && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${
                          activeMobileItem === item.label ? 'rotate-180' : ''
                        }`} />
                      )}
                    </button>
                    
                    {/* Mobile Dropdown */}
                    {item.hasDropdown && activeMobileItem === item.label && (
                      <div className="ml-6 mt-2 space-y-2 animate-in fade-in">
                        {deviceTypes.map((device) => (
                          <a
                            key={device.label}
                            href="#"
                            className="flex items-center gap-3 px-4 py-2 text-white/80 hover:text-white rounded-xl hover:bg-white/5"
                          >
                            <device.icon className="w-5 h-5" />
                            <span>{device.label} Repair</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {deviceTypes.map((device) => (
                    <button
                      key={device.label}
                      className="flex flex-col items-center p-3 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <device.icon className="w-6 h-6 text-white mb-2" />
                      <span className="text-xs text-white/80">{device.label}</span>
                    </button>
                  ))}
                </div>

                {/* User & CTA */}
                <div className="space-y-3 px-4">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors">
                    <User className="w-5 h-5" />
                    <span>Sign In</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow">
                    <Sparkles className="w-5 h-5" />
                    <span>Get Instant Quote</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-[95%] max-w-md md:hidden">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 shadow-2xl">
          <div className="flex items-center justify-between">
            {deviceTypes.map((device) => (
              <button
                key={device.label}
                className="flex flex-col items-center p-2 rounded-xl hover:bg-white/10 transition-colors flex-1"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveMobileItem(null);
                }}
              >
                <device.icon className="w-6 h-6 text-white mb-1" />
                <span className="text-xs text-white/80">{device.label}</span>
              </button>
            ))}
            <button 
              className="flex flex-col items-center p-2 rounded-xl hover:bg-white/10 transition-colors flex-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 h-6 flex items-center justify-center mb-1">
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </div>
              <span className="text-xs text-white/80">Menu</span>
            </button>
          </div>
        </div>
      </div>
      

      {/* Spacer for content */}
      <div className={`h-24 transition-all duration-300 ${scrolled ? 'h-20' : 'h-24'}`}></div>

      {/* Full-screen overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
        <div className="hidden md:flex w-full mt-5 fixed  justify-center items-center relative mx-auto transition-all duration-300">
  <div className={`relative ${searchOpen ? 'w-48 lg:w-100' : 'w-10'}`}>
    <input
      type="text"
      placeholder="Search devices..."
      className={`w-full pl-4 pr-12 py-4.5 border-black rounded-xl  text-white  bg-black   placeholder-white/50 focus:outline-none focus:border-white/30 transition-all ${
        searchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    />
  </div>
</div>

    </>
  );
}