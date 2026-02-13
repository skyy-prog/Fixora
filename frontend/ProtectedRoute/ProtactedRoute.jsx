import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { backend_url } from "../src/Context/ALlContext";
const LoginGuard = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

useEffect(() => {
  axios.get( backend_url + "/api/user/me" , {withCredentials:true})
    .then(res => setAuthenticated(res.data.success))
    .catch(() => setAuthenticated(false))
    .finally(() => setChecking(false));
}, []);

  if (checking) return <p>Loading...</p>;

  if (authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default LoginGuard;
