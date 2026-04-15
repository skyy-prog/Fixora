
import { useContext } from "react";
import { RepairContext } from "../context/AllContext";
import { Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import React from "react";
const ProtectedRoute = ({ children }) => {
  const { user, loading, role } = useContext(RepairContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }
  if(role === "repairer"){
    toast.error("You are not authorized to access this page since you're a repairer");
    return <Navigate to="/" />;
  }
  return children;
};
<>
<Toaster
             position= "top-center"
             autoClose={3000}   
                toastOptions={{
                    duration: 3000,

                }}
              />
</>

export default ProtectedRoute;