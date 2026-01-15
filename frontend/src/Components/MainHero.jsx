import React from 'react'
 import GlassNavbar from './Navbar'
 import Home from './Home'
const MainHero = () => {
  return (
     <div className=' flex flex-col  justify-between gap-5'>
        <GlassNavbar/> 
        <Home/> 
     </div>
  )
}

export default MainHero