import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function OwnerSlotsPage() {

  const { parkingLotId } = useParams();
  const token = localStorage.getItem("token");

  const [slots, setSlots] = useState([]);
  const [slotInput, setSlotInput] = useState("");

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
    fetchSlots();
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50 p-10">

      <h1 className="text-3xl font-bold mb-6">
        Manage Slots
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <p className="mb-3">
          Enter slot names separated by comma
        </p>

        <input
          value={slotInput}
          onChange={(e)=>setSlotInput(e.target.value)}
          placeholder="Example: A1,A2,A3,B1,B2"
          className="border p-2 w-full mb-4 rounded"
        />

        <button
          onClick={createSlots}
          className="bg-black text-white px-5 py-2 rounded"
        >
          Create Slots
        </button>

      </div>


      <div className="grid grid-cols-4 gap-4">

        {slots.map(slot => (

          <div
            key={slot._id}
            className="p-4 bg-white rounded shadow text-center"
          >

            <h3 className="text-xl font-bold">
              {slot.slotNumber}
            </h3>

            <p className="text-sm text-slate-500">
              {slot.status}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default OwnerSlotsPage;