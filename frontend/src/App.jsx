import { useState  , useEffect} from 'react'
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
import Profile from './pages/Profile'
import Problems from './Components/Problems'
import AddProblems from './pages/AddProblems'
import Optsections from './pages/Optsections'
import LoginGuard from '../ProtectedRoute/ProtactedRoute'
import Listofrepairers from './Components/Listofrepairers'
import { useContext } from 'react'
import { RepairContext } from './Context/ALlContext'
import RepairerLogin from './pages/RepairerLogin'
import RepairerProfile from './pages/RepairerProfile'
import Loader from './Components/Loader'
// import SmoothScroll from './Components/Smooth'
function App() {

   const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

    const { verifyifuserisloggedInornot , setverifyifuserisloggedInornot}  = useContext(RepairContext);
  return (
    <>
       {/* <GlassNavbar /> */}
       <ScrollToTop/>
      <Routes>
        <Route path='/'  element={ loading ? <Loader/>:<MainHero/>}/>
        <Route path='login'  element={<LoginGuard><Login/></LoginGuard> }/>
        <Route path='repairers'  element={<Repairers/>}/>
        <Route path='customers'  element={<CustomersReq/>}/>
        <Route path='about'  element={<AboutUs/>}/>
        <Route path='profile'  element={<Profile/>}/>
        <Route path='problems'  element={<Problems/>}/>
        <Route path='addproblems'  element={<AddProblems/>}/>
        <Route path='otp'  element={<Optsections/>}/>
        <Route path='Listofrepairers' element={<Listofrepairers/>}/>
        <Route path='RepairerLogin' element = {<RepairerLogin/>}/>
        <Route path='/repairerProfile/:id' element={<RepairerProfile/>}/>
      </Routes>
      <Footer/>
     
    </>
  ) 
}

export default App
