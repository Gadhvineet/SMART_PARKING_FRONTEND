import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddParkingPage() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    totalSlots: "",
    pricePerHour: "",
    googleMapsLink: ""
  });

  const [supportedVehicleTypes, setSupportedVehicleTypes] = useState([
    "2-wheeler",
    "3-wheeler",
    "4-wheeler"
  ]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleVehicleTypeToggle = (type) => {
    setSupportedVehicleTypes((prev) => {
      if (prev.includes(type)) {
        // Don't allow removing all types
        if (prev.length === 1) return prev;
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: form.name,
      location: {
        address: form.address,
        city: form.city,
        pincode: Number(form.pincode),
        googleMapsLink: form.googleMapsLink
      },
      totalSlots: Number(form.totalSlots),
      availableSlots: Number(form.totalSlots),
      pricePerHour: Number(form.pricePerHour),
      supportedVehicleTypes
    };

    try {

      await axios.post(
        "http://localhost:5000/parkinglots/create",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Parking Lot Added Successfully");

      navigate("/owner/parkinglots");

    } catch (error) {
      alert("Error adding parking lot");
    }
  };

  const vehicleTypeOptions = [
    { value: "2-wheeler", label: "🏍️ 2-Wheeler" },
    { value: "3-wheeler", label: "🛺 3-Wheeler" },
    { value: "4-wheeler", label: "🚗 4-Wheeler" }
  ];

  return (

    <div style={{ padding: "40px" }}>

      <h1 style={{ textAlign: "center" }}>➕ Add Parking Lot</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          margin: "30px auto",
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px"
        }}
      >

        <input name="name" placeholder="Parking Name" onChange={handleChange} required style={inputStyle}/>
        <input name="address" placeholder="Address" onChange={handleChange} style={inputStyle}/>
        <input name="city" placeholder="City" onChange={handleChange} style={inputStyle}/>
        <input name="pincode" placeholder="Pincode" onChange={handleChange} style={inputStyle}/>
        <input name="googleMapsLink" placeholder="Google Maps Link (Optional)" type="url" onChange={handleChange} style={inputStyle}/>
        <input name="totalSlots" placeholder="Total Slots" onChange={handleChange} required style={inputStyle}/>
        <input name="pricePerHour" placeholder="Price Per Hour" onChange={handleChange} required style={inputStyle}/>

        {/* VEHICLE TYPE SELECTION */}
        <div style={{ margin: "16px 0 10px" }}>
          <p style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#475569",
            marginBottom: "10px"
          }}>
            Supported Vehicle Types
          </p>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {vehicleTypeOptions.map((opt) => {
              const isActive = supportedVehicleTypes.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleVehicleTypeToggle(opt.value)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "12px",
                    border: isActive ? "2px solid #2563eb" : "2px solid #e2e8f0",
                    background: isActive ? "#eff6ff" : "#fff",
                    color: isActive ? "#2563eb" : "#64748b",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <button type="submit" style={btnPrimary}>
          Add Parking Lot
        </button>

      </form>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  border: "1px solid #ccc",
  borderRadius: "6px"
};

const btnPrimary = {
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  width: "100%",
  marginTop: "10px"
};

export default AddParkingPage;