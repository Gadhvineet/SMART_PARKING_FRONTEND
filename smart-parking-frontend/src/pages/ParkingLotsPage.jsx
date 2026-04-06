import React, { useEffect, useState } from "react";
import axios from "axios";

function ParkingLotsPage() {

  const token = localStorage.getItem("token");

  const [parkingLots, setParkingLots] = useState([]);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    totalSlots: "",
    pricePerHour: ""
  });

  const [editId, setEditId] = useState(null);

  // FETCH PARKING LOTS
  const fetchParkingLots = async () => {
    const res = await axios.get("http://localhost:5000/parkinglots/get", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setParkingLots(res.data.parkingLots);
  };

  useEffect(() => {
    fetchParkingLots();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // CREATE / UPDATE
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

      if (editId) {

        await axios.put(
          `http://localhost:5000/parkinglots/update/${editId}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setEditId(null);

      } else {

        await axios.post(
          "http://localhost:5000/parkinglots/create",
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );

      }

      setForm({
        name: "",
        address: "",
        city: "",
        pincode: "",
        totalSlots: "",
        pricePerHour: ""
      });

      fetchParkingLots();

    } catch (err) {
      console.log(err);
      alert("Error saving parking lot");
    }
  };

  // DELETE
  const deleteParkingLot = async (id) => {

    await axios.delete(
      `http://localhost:5000/parkinglots/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchParkingLots();
  };

  // EDIT
  const editParkingLot = (p) => {

    setForm({
      name: p.name,
      address: p.location.address,
      city: p.location.city,
      pincode: p.location.pincode,
      totalSlots: p.totalSlots,
      pricePerHour: p.pricePerHour
    });

    setEditId(p._id);
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1 style={{ textAlign: "center" }}>🅿 Parking Lots</h1>

      {/* FORM */}

      <div style={{
        maxWidth: "500px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px"
      }}>

        <h3>{editId ? "Edit Parking Lot" : "Add Parking Lot"}</h3>

        <form onSubmit={handleSubmit}>

          <input name="name" placeholder="Parking Name"
          value={form.name} onChange={handleChange} required style={inputStyle}/>

          <input name="address" placeholder="Address"
          value={form.address} onChange={handleChange} style={inputStyle}/>

          <input name="city" placeholder="City"
          value={form.city} onChange={handleChange} style={inputStyle}/>

          <input name="pincode" placeholder="Pincode"
          value={form.pincode} onChange={handleChange} style={inputStyle}/>

          <input name="totalSlots" placeholder="Total Slots"
          value={form.totalSlots} onChange={handleChange} required style={inputStyle}/>

          <input name="pricePerHour" placeholder="Price Per Hour"
          value={form.pricePerHour} onChange={handleChange} required style={inputStyle}/>

          <button type="submit" style={btnPrimary}>
            {editId ? "Update Parking Lot" : "Add Parking Lot"}
          </button>

        </form>

      </div>

      {/* PARKING LOT LIST */}

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

            <button onClick={() => editParkingLot(p)} style={btnPrimary}>Edit</button>
            <button onClick={() => deleteParkingLot(p._id)} style={btnDanger}>Delete</button>

          </div>

        ))}

      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  border: "1px solid #ccc",
  borderRadius: "6px"
};

const cardStyle = {
  border: "1px solid #ddd",
  padding: "15px",
  borderRadius: "10px"
};

const btnPrimary = {
  padding: "8px 12px",
  marginRight: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px"
};

const btnDanger = {
  padding: "8px 12px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "6px"
};

export default ParkingLotsPage;