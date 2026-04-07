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
    pricePerHour: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: form.name,
      location: {
        address: form.address,
        city: form.city,
        pincode: Number(form.pincode)
      },
      totalSlots: Number(form.totalSlots),
      availableSlots: Number(form.totalSlots),
      pricePerHour: Number(form.pricePerHour)
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
        <input name="totalSlots" placeholder="Total Slots" onChange={handleChange} required style={inputStyle}/>
        <input name="pricePerHour" placeholder="Price Per Hour" onChange={handleChange} required style={inputStyle}/>

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
  width: "100%"
};

export default AddParkingPage;