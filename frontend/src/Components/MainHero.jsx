import React from 'react'
 import GlassNavbar from './Navbar'
 import Home from './Home'
 import Subheader from './Subheader'
const MainHero = () => {
  return (
     <div className=' flex flex-col  justify-between gap-5'>
        <GlassNavbar/> 
        <Home/> 
        <Subheader/>
     </div>
  )
}

export default MainHero