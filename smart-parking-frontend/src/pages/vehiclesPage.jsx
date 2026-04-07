import React, { useEffect, useState } from "react";
import axios from "axios";

function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [form, setForm] = useState({
    vehicleName: "",
    vehicleType: "2-wheeler",
    vehicleNumber: "",
    colour: "",
    image: null,
  });

  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");
  const SERVER_URL = "http://localhost:5000";

  // 🔹 FETCH VEHICLES
  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/vehicles/get", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setVehicles(res.data.vehicles);

    } catch (error) {
      console.error("Fetch vehicle error:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (!form.image) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(form.image);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [form.image]);

  const buildImageUrl = (image) => {
    if (!image) return null;

    if (Array.isArray(image)) {
      return buildImageUrl(image[0]);
    }

    if (typeof image === "string") {
      return image.startsWith("http")
        ? image
        : `${SERVER_URL}/${image.replace(/^\/+/, "")}`;
    }

    if (typeof image === "object") {
      const fields = [
        "url",
        "secure_url",
        "location",
        "imageUrl",
        "imageURL",
        "image_url",
        "imagePath",
        "image_path",
        "path",
        "filename",
      ];

      for (const field of fields) {
        const value = image[field];
        if (value) {
          return buildImageUrl(value);
        }
      }

      if (image.image) {
        return buildImageUrl(image.image);
      }

      if (image.data && image.contentType) {
        const rawData = image.data.data || image.data;
        const bytes = rawData instanceof Uint8Array ? rawData : new Uint8Array(rawData);
        const binary = Array.from(bytes)
          .map((byte) => String.fromCharCode(byte))
          .join("");
        return `data:${image.contentType};base64,${btoa(binary)}`;
      }
    }

    return null;
  };

  // 🔹 HANDLE INPUT
  const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "image") {
    setForm({ ...form, image: files[0] });
  } else if (name === "vehicleNumber") {
    setForm({ ...form, vehicleNumber: value.toUpperCase() });
  } else {
    setForm({ ...form, [name]: value });
  }
};

  // 🔹 ADD / UPDATE VEHICLE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("vehicleName", form.vehicleName);
    formData.append("vehicleType", form.vehicleType);
    formData.append("vehicleNumber", form.vehicleNumber);
    formData.append("colour", form.colour);

    if (form.image) {
      formData.append("image", form.image);
    }

    try {

      if (editId) {
        await axios.put(
          `http://localhost:5000/vehicles/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
        setEditId(null);
      } 
      else {
        await axios.post(
          "http://localhost:5000/vehicles/create",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );
      }

      setForm({
        vehicleName: "",
        vehicleType: "2-wheeler",
        vehicleNumber: "",
        colour: "",
        image: null,
      });

      fetchVehicles();

    } catch (err) {
      console.error("Save vehicle error:", err);
      alert("Error saving vehicle");
    }
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/vehicles/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchVehicles();
    } catch (error) {
      console.error("Delete error:", error);
    }
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
      vehicleType: "2-wheeler",
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

          <select
            name="vehicleType"
            value={form.vehicleType}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="2-wheeler">2 Wheeler</option>
            <option value="3-wheeler">3 Wheeler</option>
            <option value="4-wheeler">4 Wheeler</option>
            <option value="heavy-vehicle">Heavy Vehicle</option>
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

          {previewUrl && (
            <div style={{ marginTop: "10px" }}>
              <p style={{ marginBottom: "6px" }}>Selected image preview:</p>
              <img
                src={previewUrl}
                alt="vehicle preview"
                style={{ width: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "10px" }}
              />
            </div>
          )}

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

        {vehicles.map((v) => {

          const imageUrl = buildImageUrl(
            v.image || v.imageUrl || v.image_url || v.imagePath || v.image_path
          );

          return (
            <div key={v._id} style={cardStyle}>

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="vehicle"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "10px"
                  }}
                />
              )}

              <h3>{v.vehicleName}</h3>
              <p><b>Number:</b> {v.vehicleNumber}</p>
              <p><b>Type:</b> {v.vehicleType}</p>
              <p><b>Colour:</b> {v.colour}</p>

              <button onClick={() => handleEdit(v)} style={btnPrimary}>Edit</button>
              <button onClick={() => handleDelete(v._id)} style={btnDanger}>Delete</button>

            </div>
          );
        })}

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