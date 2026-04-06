import React, { useEffect, useState } from "react";
import axios from "axios";

function FindParkingPage() {

  const [parkingLots, setParkingLots] = useState([]);
  const token = localStorage.getItem("token");

  // 🔹 FETCH ALL PARKING LOTS
  const fetchParkingLots = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/parkinglots/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Parking Lots:", res.data);

      setParkingLots(res.data.parkingLots);

    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  useEffect(() => {
    fetchParkingLots();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-10">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-center mb-10">
        Find Available Parking
      </h1>

      {/* PARKING GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {parkingLots.length === 0 && (
          <p className="text-center col-span-3 text-gray-500">
            No parking lots available
          </p>
        )}

        {parkingLots.map((parking) => (

          <div
            key={parking._id}
            className="bg-white rounded-2xl p-6 shadow border"
          >

            {/* PARKING NAME */}
            <h2 className="text-xl font-bold mb-3">
              {parking.name}
            </h2>

            {/* LOCATION */}
            <p className="text-sm text-gray-600">
              <b>Address:</b> {parking.location?.address}
            </p>

            <p className="text-sm text-gray-600">
              <b>City:</b> {parking.location?.city}
            </p>

            <p className="text-sm text-gray-600 mb-2">
              <b>Pincode:</b> {parking.location?.pincode}
            </p>

            {/* SLOTS */}
            <p className="text-sm">
              <b>Total Slots:</b> {parking.totalSlots}
            </p>

            <p className="text-sm">
              <b>Available Slots:</b> {parking.availableSlots}
            </p>

            {/* PRICE */}
            <p className="text-sm mb-3">
              <b>Price / Hour:</b> ₹{parking.pricePerHour}
            </p>

            {/* STATUS */}
            <p
              className={`text-sm font-semibold mb-4 ${
                parking.availableSlots > 0
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {parking.availableSlots > 0
                ? "Available"
                : "Full"}
            </p>

            {/* BOOK BUTTON */}
            <button
              disabled={parking.availableSlots === 0}
              className={`w-full py-2 rounded-lg text-white ${
                parking.availableSlots > 0
                  ? "bg-black hover:bg-gray-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Book Parking
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default FindParkingPage;