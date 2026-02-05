import React, { createContext, useEffect, useState } from "react";
import {repairRequests, indianStates  }from "../assets/assets";
export const RepairContext = createContext();

const AllContext = ({ children }) => {
  const [repairRequestss, setrepairRequestss] = useState([]);
  const [Indianstates , setIndianSates] = useState([])
  const [contextusermail , setcontextusermail] = useState("")
  const [listdeviceTypes, setlistDeviceTypes] = useState([
  "Phone",
  "Laptop",
  "Headphones",
  "Console",
  "Tablet",
  "Smartwatch"
]);

  useEffect(() => {
    setrepairRequestss(repairRequests);
    setIndianSates(indianStates);
  }, []);

  const value = {
    repairRequestss,
    setrepairRequestss,
    Indianstates , setIndianSates,
   listdeviceTypes, setlistDeviceTypes,
   contextusermail , setcontextusermail
  };
  

  return (
    <RepairContext.Provider value={value}>
      {children}
    </RepairContext.Provider>
  );
};

export default AllContext;
