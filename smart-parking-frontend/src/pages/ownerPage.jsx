import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OwnerPage() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // STATE
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    totalSlots: "",
    pricePerHour: ""
  });

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ADD PARKING
  const handleAddParking = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/parkinglots/create",
        {
          name: formData.name,
          location: {
            address: formData.address,
            city: formData.city,
            pincode: formData.pincode
          },
          totalSlots: Number(formData.totalSlots),
          availableSlots: Number(formData.totalSlots),
          pricePerHour: Number(formData.pricePerHour)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("SUCCESS:", res.data);

      alert("Parking Added ✅");

      setFormData({
        name: "",
        address: "",
        city: "",
        pincode: "",
        totalSlots: "",
        pricePerHour: ""
      });

    } catch (error) {

      console.log("FULL ERROR:", error);

      if (error.response) {
        console.log("BACKEND ERROR:", error.response.data);
        alert(error.response.data.message);
      } else {
        alert("Network error");
      }

    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">

      <div className="max-w-7xl mx-auto p-6 md:p-12">

        <header className="mb-10">
          <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900">
            Owner Dashboard
          </h2>
        </header>

        {/* DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
              Total Parking Lots
            </p>
            <p className="text-4xl font-[1000] text-slate-900">0</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
              Total Slots
            </p>
            <p className="text-4xl font-[1000] text-slate-900">0</p>
          </div>

          <div className="bg-[#e0f2fe] p-8 rounded-[2.5rem] shadow-sm border border-sky-100">
            <p className="text-[#0369a1] text-[10px] font-black uppercase tracking-widest mb-1">
              Active Bookings
            </p>
            <p className="text-4xl font-[1000] text-[#0369a1]">0</p>
          </div>

        </div>

        {/* ACTION BUTTONS */}

        <div className="bg-white p-8 md:p-12 rounded-[3rem] border">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* 🔥 NAVIGATE TO PARKING LOT PAGE */}

            <button
              onClick={() => navigate("/owner/parkinglots")}
              className="bg-slate-900 hover:bg-black text-white px-6 py-10 rounded-3xl font-[1000] uppercase tracking-[0.2em] text-[10px]"
            >
              <span className="text-2xl">➕</span>
              Add Parking Lot
            </button>


            <button
              onClick={() => navigate("/owner/parkinglots")}
              className="bg-slate-50 hover:bg-slate-100 text-slate-900 px-6 py-10 rounded-3xl border"
            >
              <span className="text-2xl">📍</span>
              Manage Parking Lots
            </button>


            <button className="bg-slate-50 hover:bg-slate-100 text-slate-900 px-6 py-10 rounded-3xl border">
              <span className="text-2xl">🚗</span>
              Manage Slots
            </button>


            <button className="bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] px-6 py-10 rounded-3xl">
              <span className="text-2xl">📅</span>
              View Bookings
            </button>

          </div>

        </div>

        {/* ADD PARKING FORM */}

        <div className="mt-10 bg-white p-8 rounded-3xl border">

          <h3 className="text-xl font-bold mb-6">Add Parking Lot</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input name="name" placeholder="Parking Name"
              onChange={handleChange}
              value={formData.name}
              className="border p-3 rounded-xl"
            />

            <input name="address" placeholder="Address"
              onChange={handleChange}
              value={formData.address}
              className="border p-3 rounded-xl"
            />

            <input name="city" placeholder="City"
              onChange={handleChange}
              value={formData.city}
              className="border p-3 rounded-xl"
            />

            <input name="pincode" placeholder="Pincode"
              onChange={handleChange}
              value={formData.pincode}
              className="border p-3 rounded-xl"
            />

            <input name="totalSlots" placeholder="Total Slots"
              onChange={handleChange}
              value={formData.totalSlots}
              className="border p-3 rounded-xl"
            />

            <input name="pricePerHour" placeholder="Price per hour"
              onChange={handleChange}
              value={formData.pricePerHour}
              className="border p-3 rounded-xl"
            />

          </div>

          <button
            onClick={handleAddParking}
            className="mt-6 bg-black text-white px-6 py-3 rounded-xl"
          >
            Add Parking
          </button>

        </div>

      </div>
    </div>
  );
}

export default OwnerPage;