import React, { useEffect, useState } from "react";
import axios from "axios";

function ParkingLotsPage() {

  const token = localStorage.getItem("token");
  const [parkingLots, setParkingLots] = useState([]);

  const fetchParkingLots = async () => {

    const res = await axios.get(
      "http://localhost:5000/parkinglots/get",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setParkingLots(res.data.parkingLots);

  };

  useEffect(() => {
    fetchParkingLots();
  }, []);

  const deleteParkingLot = async (id) => {

    await axios.delete(
      `http://localhost:5000/parkinglots/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchParkingLots();
  };

  return (

    <div style={{ padding: "20px" }}>

      <h1 style={{ textAlign: "center" }}>📍 Manage Parking Lots</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: "20px"
      }}>

        {parkingLots.map((p) => (

          <div key={p._id} style={cardStyle}>

            <h3>{p.name}</h3>

            <p><b>City:</b> {p.location.city}</p>
            <p><b>Slots:</b> {p.availableSlots}/{p.totalSlots}</p>
            <p><b>Price:</b> ₹{p.pricePerHour}/hour</p>

            <button style={btnEdit}>Edit</button>

            <button
              onClick={() => deleteParkingLot(p._id)}
              style={btnDelete}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

const cardStyle = {
  border: "1px solid #ddd",
  padding: "15px",
  borderRadius: "10px"
};

const btnEdit = {
  padding: "8px 12px",
  marginRight: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px"
};

const btnDelete = {
  padding: "8px 12px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "6px"
};

export default ParkingLotsPage;