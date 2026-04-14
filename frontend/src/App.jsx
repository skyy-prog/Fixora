import { useState, useEffect, useContext } from 'react'
import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from "react-hot-toast"
import { useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Home from './Components/Home'
import { useNavigate } from 'react-router-dom'
import GlassNavbar from './Components/Navbar'
import Login from './pages/Login'
import toast from 'react-hot-toast'
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
import { RepairContext } from './Context/ALlContext'
import RepairerLogin from './pages/RepairerLogin'
import RepairerProfile from './pages/RepairerProfile'
import Loader from './Components/Loader'

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  const { verifyifuserisloggedInornot , setverifyifuserisloggedInornot , user , role , profileId}  = useContext(RepairContext);
  const navigate = useNavigate();
 useEffect(() => {
   const path = location.pathname.toLowerCase().replace(/\/$/, "");
 }, [location.pathname, role]);
useEffect(() => {
  if (!role) return;

  const path = location.pathname.toLowerCase().replace(/\/$/, "");

  if (path === "/listofrepairers" && role === "repairer") {
    navigate("/", { replace: true });
    return;
  }
if (path === "/otp" && (role === "user" || role === "repairer")) {
    navigate(`/profile/${profileId}`, { replace: true });
    setTimeout(() => {
      toast.error("You are already logged in");
    }, 1000);
  return;
}
  if (path === "/problems" && role === "user") {
    navigate("/", { replace: true });
    return;
  }

   if (path === "/repairerlogin" && role) {
    navigate(`/profile/${profileId}`, { replace: true });
    return;
  }

}, [location.pathname, role]);
  return (
    <>
     <Toaster
                position= "top-center"
                reverseOrder={false}
                toastOptions={{
                  duration: 3000,
                }}
              />
      <ScrollToTop/>
      <Routes>
        <Route path='/' element={ loading ? <Loader/>:<MainHero/>}/>
        <Route path='login' element={<LoginGuard><Login/></LoginGuard> }/>
        <Route path='repairers' element={<Repairers/>}/>
        <Route path='customers' element={<CustomersReq/>}/>
        <Route path='about' element={<AboutUs/>}/>
        <Route path={`/profile/:id`} element={<Profile/>}/>
        <Route path='problems' element={<Problems/>}/>
        <Route path='addproblems' element={<AddProblems/>}/>
        <Route path='otp' element={<Optsections/>}/>
        <Route path='Listofrepairers' element={<Listofrepairers/>}/>
        <Route path='RepairerLogin' element={<RepairerLogin/>}/>
        <Route path='/repairerProfile/:id' element={<RepairerProfile/>}/>
      </Routes>

      <Footer/>
    </>
  ) 
}

export default App