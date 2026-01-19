import { useState } from 'react'
import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
 import Home from './Components/Home'
import GlassNavbar from './Components/Navbar'
import Login from './pages/Login'
import MainHero from './Components/MainHero'
import ScrollToTop from './Components/scrolltotop'
import Repairers from './Components/Repairers'
import CustomersReq from './Components/CustomersReq'
import Footer from './Components/Footer'
import AboutUs from './pages/ABoutus'
// import SmoothScroll from './Components/Smooth'
function App() {
  return (
    <>
       {/* <GlassNavbar /> */}
       <ScrollToTop/>
       
      <Routes>
        <Route path='/'  element={<MainHero/>}/>
        <Route path='login'  element={<Login/>}/>
        <Route path='repairers'  element={<Repairers/>}/>
        <Route path='customers'  element={<CustomersReq/>}/>
        <Route path='about'  element={<AboutUs/>}/>
      </Routes>
      <Footer/>
     
    </>
  ) 
}

export default App
