import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { RepairContext } from "../src/Context/ALlContext";
import React from "react";
const LoginGuard = ({ children }) => {

  const { user } = useContext(RepairContext);

  if (user) {
    return <Navigate to={`/profile/${user.id}`} replace />;
  }

  return children;  
};

export default LoginGuard;