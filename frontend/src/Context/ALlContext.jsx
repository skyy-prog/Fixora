import React, { createContext, useEffect, useState } from "react";
import {repairRequests, indianStates }from "../assets/assets";
export const RepairContext = createContext();

const AllContext = ({ children }) => {
  const [repairRequestss, setrepairRequestss] = useState([]);
  const [Indianstates , setIndianSates] = useState([])
  useEffect(() => {
    setrepairRequestss(repairRequests);
    // console.log(repairRequests);
    setIndianSates(indianStates);
  }, []);

  const value = {
    repairRequestss,
    setrepairRequestss,
    Indianstates , setIndianSates
  };

  return (
    <RepairContext.Provider value={value}>
      {children}
    </RepairContext.Provider>
  );
};

export default AllContext;
