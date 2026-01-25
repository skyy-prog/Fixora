import React, { useContext, useEffect, useState } from 'react'
import { RepairContext } from '../Context/ALlContext';
import  axios from 'axios';
const AddProblems = () => {
    const { repairRequestss , Indianstates } = useContext(RepairContext);
  const [state, setallstates ] = useState(null);
  return (
  <div className="mb-10 mt-10 text-black p-8 max-w-xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm space-y-5">

  <h1 className="text-2xl font-semibold">Add New Problem</h1>
  <p className="text-sm text-gray-500">Fill details about your device issue</p>

  <input
    type="text"
    placeholder="Enter the title of problem"
    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
  />

  <select className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black">
    <option>Select Brand</option>
    {repairRequestss.map((items) => (
      <option key={items.id}>{items.brand}</option>
    ))}
  </select>

  <input
    type="text"
    placeholder="Model"
    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
  />

  <div className="grid grid-cols-3 gap-3">
    <input type="text" placeholder="State" className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
    <input type="text" placeholder="City" className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
    <input type="number" placeholder="Pincode" className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
  </div>

  <textarea
    placeholder="Explain the problem"
    className="w-full border border-gray-300 p-3 rounded-lg h-28 resize-none focus:outline-none focus:ring-1 focus:ring-black"
  />

  <div>
    <label className="block mb-1 text-sm font-medium">Prefer Warranty?</label>
    <select className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black">
      <option>Yes</option>
      <option>No</option>
    </select>
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block mb-1 text-sm font-medium">Urgency</label>
      <select className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>

    <div>
      <label className="block mb-1 text-sm font-medium">Budget Range (₹)</label>
      <input type="number" placeholder="Enter amount" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-black" />
    </div>
  </div>

  <button className="w-full bg-black text-white p-3 rounded-lg font-medium hover:bg-gray-900 transition">
    Submit Problem
  </button>

</div>


    
  );
};



export default AddProblems;