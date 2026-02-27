import React from 'react'
 import GlassNavbar from './Navbar'
 import Home from './Home'
 import Subheader from './Subheader'
 import Marquees from './marquees'
 import Testimonial from './Testimonials'
import Foursuheader from './foursuheader'
const MainHero = () => {
  return (
     <div className=' flex flex-col  justify-between gap-5'>
        <GlassNavbar/> 
        <Home/> 
        <Marquees/>
        <Subheader/>
        <Testimonial/>
        <Foursuheader/>
     </div>
  )
}

export default MainHero