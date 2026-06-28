import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SERVER_URL = import.meta.env.VITE_API_URL;

function ParkingLotsPage() {

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [parkingLots, setParkingLots] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchParkingLots = async () => {

    const res = await axios.get(
      `${SERVER_URL}/parkinglots/get`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setParkingLots(res.data.parkingLots);
  };

  useEffect(() => {
    fetchParkingLots();
  }, []);

  // DELETE PARKING LOT WITH CONFIRMATION
  const deleteParkingLot = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this parking lot?"
    );

    if (!confirmDelete) return;

    await axios.delete(
      `${SERVER_URL}/parkinglots/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchParkingLots();
  };

  // START EDIT
  const startEdit = (lot) => {

    setEditingId(lot._id);

    setFormData({
      name: lot.name,
      city: lot.location.city,
      address: lot.location.address,
      pincode: lot.location.pincode,
      totalSlots: lot.totalSlots,
      pricePerHour: lot.pricePerHour
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // UPDATE PARKING LOT
  const updateParkingLot = async (id) => {

    const data = {
      name: formData.name,
      location: {
        address: formData.address,
        city: formData.city,
        pincode: Number(formData.pincode)
      },
      totalSlots: Number(formData.totalSlots),
      pricePerHour: Number(formData.pricePerHour)
    };

    await axios.put(
      `${SERVER_URL}/parkinglots/update/${id}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditingId(null);

    fetchParkingLots();
  };

  return (

    <div style={{ padding: "20px" }}>

      <h1 style={{ textAlign: "center" }}>📍 Manage Parking Lots</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px"
        }}
      >

        {parkingLots.map((p) => (

          <div key={p._id} style={cardStyle}>

            {editingId === p._id ? (

              <>
                <input name="name" value={formData.name} onChange={handleChange} style={inputStyle}/>
                <input name="city" value={formData.city} onChange={handleChange} style={inputStyle}/>
                <input name="address" value={formData.address} onChange={handleChange} style={inputStyle}/>
                <input name="pincode" value={formData.pincode} onChange={handleChange} style={inputStyle}/>
                <input name="totalSlots" value={formData.totalSlots} onChange={handleChange} style={inputStyle}/>
                <input name="pricePerHour" value={formData.pricePerHour} onChange={handleChange} style={inputStyle}/>

                <button
                  onClick={() => updateParkingLot(p._id)}
                  style={btnSave}
                >
                  Save
                </button>

                <button
                  onClick={cancelEdit}
                  style={btnCancel}
                >
                  Cancel
                </button>
              </>

            ) : (

              <>
                <h3>{p.name}</h3>

                <p><b>City:</b> {p.location.city}</p>
                <p><b>Slots:</b> {p.availableSlots}/{p.totalSlots}</p>
                <p><b>Price:</b> ₹{p.pricePerHour}/hour</p>

                {/* MANAGE SLOTS BUTTON */}
                <button
                  onClick={() => navigate(`/owner/slots/${p._id}`)}
                  style={btnSlots}
                >
                  Manage Slots
                </button>

                {/* EDIT BUTTON */}
                <button
                  onClick={() => startEdit(p)}
                  style={btnEdit}
                >
                  Edit
                </button>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => deleteParkingLot(p._id)}
                  style={btnDelete}
                >
                  Delete
                </button>
              </>

            )}

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

const inputStyle = {
  width: "100%",
  padding: "8px",
  margin: "5px 0",
  border: "1px solid #ccc",
  borderRadius: "6px"
};

const btnSlots = {
  padding: "8px 12px",
  marginRight: "10px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "6px"
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

const btnSave = {
  padding: "8px 12px",
  marginRight: "10px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "6px"
};

const btnCancel = {
  padding: "8px 12px",
  background: "#6b7280",
  color: "white",
  border: "none",
  borderRadius: "6px"
};

export default ParkingLotsPage;