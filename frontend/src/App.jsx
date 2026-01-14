import { useState } from 'react'
import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
 import Home from './Components/Home'
import GlassNavbar from './Components/Navbar'
function App() {
  return (
    <>
      <Routes>
        <Route path='/'  element={<Home/>}/>
      </Routes>
    </>
  ) 
}

export default App
