import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OwnerPage() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [totalLots, setTotalLots] = useState(0);
  const [totalSlots, setTotalSlots] = useState(0);

  const SERVER_URL = "http://localhost:5000";

  // FETCH OWNER PARKING LOTS
  const fetchParkingLots = async () => {
    try {

      const res = await axios.get(`${SERVER_URL}/parkinglots/get`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const lots = res.data.parkingLots || [];

      // TOTAL PARKING LOTS
      setTotalLots(lots.length);

      // TOTAL SLOTS
      let slotSum = 0;

      lots.forEach((lot) => {
        slotSum += lot.totalSlots;
      });

      setTotalSlots(slotSum);

    } catch (error) {
      console.error("Error fetching parking lots:", error);
    }
  };

  useEffect(() => {
    fetchParkingLots();
  }, []);

  return (

    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">

      <div className="max-w-7xl mx-auto p-6 md:p-12">

        <header className="mb-10">
          <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900">
            Owner Dashboard
          </h2>
        </header>

        {/* DASHBOARD STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          {/* TOTAL PARKING LOTS */}

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">

            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
              Total Parking Lots
            </p>

            <p className="text-4xl font-[1000] text-slate-900">
              {totalLots}
            </p>

          </div>


          {/* TOTAL SLOTS */}

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">

            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
              Total Slots
            </p>

            <p className="text-4xl font-[1000] text-slate-900">
              {totalSlots}
            </p>

          </div>


          {/* ACTIVE BOOKINGS */}

          <div className="bg-[#e0f2fe] p-8 rounded-[2.5rem] shadow-sm border border-sky-100">

            <p className="text-[#0369a1] text-[10px] font-black uppercase tracking-widest mb-1">
              Active Bookings
            </p>

            <p className="text-4xl font-[1000] text-[#0369a1]">
              0
            </p>

          </div>

        </div>


        {/* ACTION BUTTONS */}

        <div className="bg-white p-8 md:p-12 rounded-[3rem] border">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* ADD PARKING LOT */}

            <button
              onClick={() => navigate("/owner/add-parking")}
              className="bg-slate-900 hover:bg-black text-white px-6 py-10 rounded-3xl font-[1000] uppercase tracking-[0.2em] text-[10px]"
            >
              <span className="text-2xl block mb-2">➕</span>
              Add Parking Lot
            </button>


            {/* MANAGE PARKING LOTS */}

            <button
              onClick={() => navigate("/owner/parkinglots")}
              className="bg-slate-50 hover:bg-slate-100 text-slate-900 px-6 py-10 rounded-3xl border"
            >
              <span className="text-2xl block mb-2">📍</span>
              Manage Parking Lots
            </button>


            {/* MANAGE SLOTS */}

            <button
              className="bg-slate-50 hover:bg-slate-100 text-slate-900 px-6 py-10 rounded-3xl border"
            >
              <span className="text-2xl block mb-2">🚗</span>
              Manage Slots
            </button>


            {/* VIEW BOOKINGS */}

            <button
              className="bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] px-6 py-10 rounded-3xl"
            >
              <span className="text-2xl block mb-2">📅</span>
              View Bookings
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default OwnerPage;