import { useState } from 'react'
import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
 import Home from './Components/Home'
import GlassNavbar from './Components/Navbar'
import Login from './pages/Login'
// import MainHero from './Components/MainHero'
function App() {
  return (
    <>
       {/* <GlassNavbar /> */}
      <Routes>
        <Route path='/'  element={<Home/>}/>
        <Route path='login'  element={<Login/>}/>

      </Routes>
    </>
  ) 
}

export default App
