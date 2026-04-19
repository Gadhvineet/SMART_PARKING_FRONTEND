import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function OwnerSlotsPage() {

  const { parkingLotId } = useParams();
  const token = localStorage.getItem("token");

  const [slots, setSlots] = useState([]);
  const [slotInput, setSlotInput] = useState("");

  const [prefix, setPrefix] = useState("");
  const [totalSlots, setTotalSlots] = useState("");

  const [layoutView, setLayoutView] = useState(false);

  const SERVER = "http://localhost:5000";


  const fetchSlots = async () => {
    try {

      const res = await axios.get(
        `${SERVER}/slots/lot/${parkingLotId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSlots(res.data.slots);

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {

    fetchSlots()

    const interval = setInterval(() => {
      fetchSlots()
    },15000)

    return ()=>clearInterval(interval)

  },[])



  const createSlots = async () => {

    const slotArray = slotInput.split(",").map(s => s.trim());

    try {

      await axios.post(
        `${SERVER}/slots/create-multiple`,
        {
          parkingLot: parkingLotId,
          slots: slotArray
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSlotInput("");
      fetchSlots();

    } catch (error) {
      alert("Error creating slots");
    }

  };


  const generateSlots = async () => {

    try {

      await axios.post(
        `${SERVER}/slots/generate`,
        {
          parkingLot: parkingLotId,
          prefix,
          totalSlots
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPrefix("");
      setTotalSlots("");
      fetchSlots();

    } catch (error) {
      alert("Error generating slots");
    }

  };


  const deleteSlot = async (id) => {

    try {

      await axios.delete(
        `${SERVER}/slots/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchSlots();

    } catch (error) {
      alert("Error deleting slot");
    }

  };


  const getSlotColor = (status) => {

    if(status==="available") return "bg-green-500 text-white"

    if(status==="reserved") return "bg-yellow-400 text-black"

    if(status==="occupied") return "bg-red-500 text-white"

    return "bg-gray-200"

  }


  return (

    <div className="min-h-screen bg-slate-50 p-10">

      <h1 className="text-3xl font-bold mb-6">
        Manage Slots
      </h1>


      <div className="mb-6">

        <button
          onClick={()=>setLayoutView(false)}
          className={`px-4 py-2 mr-3 rounded ${!layoutView?"bg-black text-white":"bg-white border"}`}
        >
          List View
        </button>

        <button
          onClick={()=>setLayoutView(true)}
          className={`px-4 py-2 rounded ${layoutView?"bg-black text-white":"bg-white border"}`}
        >
          Layout View
        </button>

      </div>


      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="font-bold mb-3">
          Auto Generate Slots
        </h2>

        <input
          placeholder="Prefix (Example A)"
          value={prefix}
          onChange={(e)=>setPrefix(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="number"
          placeholder="Total Slots"
          value={totalSlots}
          onChange={(e)=>setTotalSlots(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />

        <button
          onClick={generateSlots}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Generate Slots
        </button>

      </div>


      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <p className="mb-3">
          Enter slot names separated by comma
        </p>

        <input
          value={slotInput}
          onChange={(e)=>setSlotInput(e.target.value)}
          placeholder="Example: A1,A2,A3"
          className="border p-2 w-full mb-4 rounded"
        />

        <button
          onClick={createSlots}
          className="bg-black text-white px-5 py-2 rounded"
        >
          Create Slots
        </button>

      </div>


      {!layoutView && (

        <div className="grid grid-cols-4 gap-4">

          {slots.map(slot => (

            <div
              key={slot._id}
              className="p-4 bg-white rounded shadow text-center"
            >

              <h3 className="text-xl font-bold">
                {slot.slotNumber}
              </h3>

              <p className="text-sm text-slate-500 mb-2">
                {slot.status}
              </p>

              <button
                onClick={()=>deleteSlot(slot._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>

            </div>

          ))}

        </div>

      )}



      {layoutView && (

        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="font-bold mb-4">
            Parking Layout
          </h2>

          <div className="grid grid-cols-8 gap-3">

            {slots.map(slot => (

              <div
                key={slot._id}
                className={`p-3 rounded text-center font-bold ${getSlotColor(slot.status)}`}
              >
                {slot.slotNumber}
              </div>

            ))}

          </div>

        </div>

      )}



      {layoutView && (

        <div className="mt-6 flex gap-6">

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500"></div>
            <span>Available</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400"></div>
            <span>Reserved</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500"></div>
            <span>Occupied</span>
          </div>

        </div>

      )}

    </div>

  );

}

export default OwnerSlotsPage;