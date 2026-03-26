import React, { useEffect, useState } from "react";
import axios from "axios";

function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);

  const [form, setForm] = useState({
    vehicleName: "",
    vehicleType: "car",
    vehicleNumber: "",
    colour: "",
    image: null,
  });

  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // 🔹 FETCH VEHICLES
  const fetchVehicles = async () => {
    const res = await axios.get("http://localhost:5000/vehicles/get", {
      headers: { Authorization: token },
    });
    setVehicles(res.data.vehicles);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // 🔹 HANDLE INPUT
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // 🔹 ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/vehicles/update/${editId}`,
          formData,
          { headers: { Authorization: token } }
        );
        setEditId(null);
      } else {
        await axios.post(
          "http://localhost:5000/vehicles/create",
          formData,
          { headers: { Authorization: token } }
        );
      }

      setForm({
        vehicleName: "",
        vehicleType: "car",
        vehicleNumber: "",
        colour: "",
        image: null,
      });

      fetchVehicles();

    } catch (err) {
      console.error(err);
      alert("Error saving vehicle");
    }
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/vehicles/delete/${id}`, {
      headers: { Authorization: token },
    });
    fetchVehicles();
  };

  // 🔹 EDIT
  const handleEdit = (v) => {
    setForm({
      vehicleName: v.vehicleName,
      vehicleType: v.vehicleType,
      vehicleNumber: v.vehicleNumber,
      colour: v.colour,
      image: null,
    });
    setEditId(v._id);
  };

  // 🔹 CANCEL EDIT
  const cancelEdit = () => {
    setEditId(null);
    setForm({
      vehicleName: "",
      vehicleType: "car",
      vehicleNumber: "",
      colour: "",
      image: null,
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>🚗 My Vehicles</h1>

      {/* 🔥 FORM CARD */}
      <div style={{
        maxWidth: "500px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
      }}>
        <h3>{editId ? "✏️ Edit Vehicle" : "➕ Add Vehicle"}</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="vehicleName"
            placeholder="Vehicle Name"
            value={form.vehicleName}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <select name="vehicleType" onChange={handleChange} style={inputStyle}>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="bus">Bus</option>
            <option value="truck">Truck</option>
          </select>

          <input
            name="vehicleNumber"
            placeholder="Vehicle Number"
            value={form.vehicleNumber}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="colour"
            placeholder="Colour"
            value={form.colour}
            onChange={handleChange}
            style={inputStyle}
          />

          <input type="file" name="image" onChange={handleChange} />

          <div style={{ marginTop: "10px" }}>
            <button type="submit" style={btnPrimary}>
              {editId ? "Update Vehicle" : "Add Vehicle"}
            </button>

            {editId && (
              <button type="button" onClick={cancelEdit} style={btnSecondary}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 🔥 VEHICLE LIST */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px"
      }}>
        {vehicles.map((v) => (
          <div key={v._id} style={cardStyle}>
            {v.image && (
              <img src={v.image} alt="" style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "10px" }} />
            )}

            <h3>{v.vehicleName}</h3>
            <p><b>Number:</b> {v.vehicleNumber}</p>
            <p><b>Type:</b> {v.vehicleType}</p>
            <p><b>Colour:</b> {v.colour}</p>

            <button onClick={() => handleEdit(v)} style={btnPrimary}>Edit</button>
            <button onClick={() => handleDelete(v._id)} style={btnDanger}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 🔹 STYLES */
const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const cardStyle = {
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  boxShadow: "0 5px 10px rgba(0,0,0,0.1)"
};

const btnPrimary = {
  padding: "8px 12px",
  marginRight: "10px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const btnSecondary = {
  padding: "8px 12px",
  backgroundColor: "#aaa",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const btnDanger = {
  padding: "8px 12px",
  marginLeft: "10px",
  backgroundColor: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default VehiclesPage;