import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import AllContext, { backend_url, RepairContext } from "../src/Context/ALlContext";
const LoginGuard = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { verifyifuserisloggedInornot , setverifyifuserisloggedInornot}  = useContext(RepairContext);
 
useEffect(() => {
  axios.get( backend_url + "/api/user/me" , {withCredentials:true})
    .then(res => {setAuthenticated(res.data.success) , setverifyifuserisloggedInornot(res.data.success)})
    .catch(() => {setAuthenticated(false) , setverifyifuserisloggedInornot(false)})
    .finally(() => setChecking(false));
}, []);

  if (checking) return <p>Loading...</p>;

  if (authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default LoginGuard;
