import React, { useEffect, useState } from "react";
import axios from "axios";
import { createReservation, getUserVehicles } from "../services/userServices";
import { getRazorpayKey, createOrder, verifyPayment } from "../services/paymentServices";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function FindParkingPage() {

const [parkingLots,setParkingLots] = useState([]);
const [slots,setSlots] = useState([]);
const [vehicles,setVehicles] = useState([]);

const [selectedLot,setSelectedLot] = useState(null);
const [selectedSlot,setSelectedSlot] = useState(null);
const [selectedVehicle,setSelectedVehicle] = useState(null);

// NEW STATES
const [date,setDate] = useState("");
const [startTime,setStartTime] = useState("");
const [endTime,setEndTime] = useState("");

// ============================
// SEARCH & FILTER STATES
// ============================
const [searchQuery, setSearchQuery] = useState("");
const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all");
const [sortBy, setSortBy] = useState("default");

const token = localStorage.getItem("token");


// FETCH PARKING LOTS
const fetchParkingLots = async()=>{

const res = await axios.get(
"http://localhost:5000/parkinglots/all",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setParkingLots(res.data.parkingLots);

};


// FETCH VEHICLES
const fetchVehicles = async()=>{

const res = await getUserVehicles();
setVehicles(res.vehicles);

};


// FETCH SLOTS
const fetchSlots = async(lotId)=>{

const res = await axios.get(
`http://localhost:5000/slots/lot/${lotId}`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setSlots(res.data.slots);
};


// CLICK BOOK
const handleSelectLot = async(lotId)=>{

setSelectedLot(lotId);

fetchSlots(lotId);

fetchVehicles();

};


// FINAL BOOKING
const handleBooking = async()=>{

if(!selectedSlot || !selectedVehicle || !date || !startTime || !endTime){
  alert("Please fill all booking details");
  return;
}

// COMBINE DATE + TIME
const startDateTime = new Date(`${date}T${startTime}`);
const endDateTime = new Date(`${date}T${endTime}`);
const now = new Date();

// Check if booking is in the past
if (startDateTime < now) {
  alert("Cannot book parking for a time in the past.");
  return;
}

// Check if end is before/same as start
if(endDateTime <= startDateTime){
  alert("End time must be firmly after the start time.");
  return;
}

// Minimum 1 hour parking check
const diffInMs = endDateTime - startDateTime;
if (diffInMs < 60 * 60 * 1000) {
  alert("Minimum parking duration is 1 hour.");
  return;
}

const data = {
  vehicle:selectedVehicle,
  parkingLot:selectedLot,
  slot:selectedSlot,
  timePeriod:{
    startTime:startDateTime,
    endTime:endDateTime
  }
};

    try {
      // 1. Create Reservation
      const resData = await createReservation(data);
      const reservation = resData.reservation;
      
      // 2. Load Razorpay Script
      const isLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!isLoaded) {
        alert("Payment gateway failed to load. Please check your connection.");
        return;
      }
      
      // 3. Get total amount
      let amount = 0;
      if (pricePreview && pricePreview.total) {
        amount = parseFloat(pricePreview.total);
      } else {
        alert("Could not calculate payment amount.");
        return;
      }
      
      // 4. Create Order
      const orderRes = await createOrder({
        amount: amount,
        reservation: reservation._id,
        user: reservation.user,
        paymentMethod: 'card'
      });
      
      // 5. Get Razorpay Key
      const keyRes = await getRazorpayKey();
      
      // 6. Open Razorpay Checkout
      const options = {
        key: keyRes.key,
        amount: orderRes.order.amount,
        currency: orderRes.order.currency,
        name: "Smart Parking System",
        description: "Parking Reservation Payment",
        order_id: orderRes.order.id,
        handler: async function (response) {
            try {
                // 7. Verify Payment
                await verifyPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    paymentId: orderRes.paymentId
                });
                
                alert("Reservation confirmed! Payment successful.");
                window.location.href = "/user";
            } catch (err) {
                alert("Payment verification failed! " + (err.response?.data?.message || err.message));
            }
        },
        theme: {
            color: "#0f172a"
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
          alert("Payment failed! Please check your bookings in dashboard and try again later.");
      });
      rzp1.open();

    } catch (error) {
      alert(error.response?.data?.message || "Booking Failed");
    }

  };


useEffect(()=>{
fetchParkingLots();
},[]);


// ============================
// FILTER & SEARCH LOGIC
// ============================
const getFilteredLots = () => {

  let filtered = [...parkingLots];

  // KEYWORD SEARCH — matches name, city, address, pincode
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter((lot) => {
      const name = (lot.name || "").toLowerCase();
      const city = (lot.location?.city || "").toLowerCase();
      const address = (lot.location?.address || "").toLowerCase();
      const pincode = String(lot.location?.pincode || "");
      const price = String(lot.pricePerHour || "");

      return (
        name.includes(q) ||
        city.includes(q) ||
        address.includes(q) ||
        pincode.includes(q) ||
        price.includes(q)
      );
    });
  }

  // VEHICLE TYPE FILTER
  if (vehicleTypeFilter !== "all") {
    filtered = filtered.filter((lot) => {
      const types = lot.supportedVehicleTypes || ["2-wheeler", "3-wheeler", "4-wheeler"];
      return types.includes(vehicleTypeFilter);
    });
  }

  // SORT
  if (sortBy === "price-low") {
    filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
  } else if (sortBy === "price-high") {
    filtered.sort((a, b) => b.pricePerHour - a.pricePerHour);
  } else if (sortBy === "availability") {
    filtered.sort((a, b) => b.availableSlots - a.availableSlots);
  }

  return filtered;
};

const filteredLots = getFilteredLots();

// Get unique cities for suggestion
const allCities = [...new Set(parkingLots.map(l => l.location?.city).filter(Boolean))];

// Vehicle type filter options
const vehicleTypeOptions = [
  { value: "all", label: "All Types", icon: "🅿️" },
  { value: "2-wheeler", label: "2-Wheeler", icon: "🏍️" },
  { value: "3-wheeler", label: "3-Wheeler", icon: "🛺" },
  { value: "4-wheeler", label: "4-Wheeler", icon: "🚗" },
];


// ============================
// CALCULATE TOTAL PRICE
// ============================
const calculatePricePreview = () => {
  if (!startTime || !endTime || !selectedLot) return null;
  
  const startObj = new Date(`1970-01-01T${startTime}`);
  const endObj = new Date(`1970-01-01T${endTime}`);
  
  let diffInHours = (endObj - startObj) / (1000 * 60 * 60);

  if (diffInHours <= 0) return null; // Invalid time range

  const lot = parkingLots.find(l => l._id === selectedLot);
  if (!lot) return null;

  const total = (diffInHours * lot.pricePerHour).toFixed(2);
  
  return {
    hours: diffInHours.toFixed(1),
    rate: lot.pricePerHour,
    total
  };
};

const pricePreview = calculatePricePreview();



return(

<div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">

<div className="max-w-6xl mx-auto p-6 md:p-12">

  {/* HEADER */}
  <header className="mb-8">
    <h1 className="text-4xl font-[1000] tracking-tighter text-slate-900">
      Find Parking
    </h1>
    <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">
      Search • Filter • Book
    </p>
  </header>


  {/* ============================
      SEARCH & FILTER BAR
      ============================ */}

  <div style={{
    background: "white",
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
    marginBottom: "32px",
  }}>

    {/* SEARCH INPUT */}
    <div style={{ position: "relative", marginBottom: "20px" }}>
      <span style={{
        position: "absolute",
        left: "18px",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "20px",
        opacity: 0.4,
      }}>🔍</span>
      <input
        type="text"
        placeholder="Search by parking name, city, address, pincode..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "16px 20px 16px 52px",
          borderRadius: "16px",
          border: "2px solid #e2e8f0",
          fontSize: "15px",
          fontWeight: 600,
          fontFamily: "inherit",
          outline: "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          boxSizing: "border-box",
          background: "#f8fafc",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#3b82f6";
          e.target.style.boxShadow = "0 0 0 4px rgba(59,130,246,0.1)";
          e.target.style.background = "#fff";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e2e8f0";
          e.target.style.boxShadow = "none";
          e.target.style.background = "#f8fafc";
        }}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          style={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "#f1f5f9",
            border: "none",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 700,
            color: "#94a3b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
      )}
    </div>

    {/* QUICK CITY TAGS */}
    {allCities.length > 0 && (
      <div style={{ marginBottom: "16px" }}>
        <p style={{
          fontSize: "11px",
          fontWeight: 800,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "8px",
        }}>Quick Search by City</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {allCities.map((city) => (
            <button
              key={city}
              onClick={() => setSearchQuery(city)}
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                background: searchQuery.toLowerCase() === city.toLowerCase() ? "#0f172a" : "#fff",
                color: searchQuery.toLowerCase() === city.toLowerCase() ? "#fff" : "#475569",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              📍 {city}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* FILTERS ROW */}
    <div style={{
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
    }}>

      {/* VEHICLE TYPE FILTER */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {vehicleTypeOptions.map((opt) => {
          const isActive = vehicleTypeFilter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setVehicleTypeFilter(opt.value)}
              style={{
                padding: "10px 20px",
                borderRadius: "14px",
                border: isActive ? "2px solid #0f172a" : "2px solid #e2e8f0",
                background: isActive ? "#0f172a" : "#fff",
                color: isActive ? "#fff" : "#475569",
                fontSize: "13px",
                fontWeight: 800,
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ fontSize: "16px" }}>{opt.icon}</span>
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* SORT DROPDOWN */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        style={{
          padding: "10px 18px",
          borderRadius: "14px",
          border: "2px solid #e2e8f0",
          background: "#fff",
          fontSize: "13px",
          fontWeight: 700,
          color: "#475569",
          cursor: "pointer",
          outline: "none",
          fontFamily: "inherit",
        }}
      >
        <option value="default">Sort: Default</option>
        <option value="price-low">Price: Low → High</option>
        <option value="price-high">Price: High → Low</option>
        <option value="availability">Most Available</option>
      </select>

    </div>

  </div>

  {/* RESULTS COUNT */}
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    padding: "0 4px",
  }}>
    <p style={{
      fontSize: "13px",
      fontWeight: 700,
      color: "#64748b",
    }}>
      {filteredLots.length} parking lot{filteredLots.length !== 1 ? "s" : ""} found
      {searchQuery && (
        <span style={{ color: "#94a3b8" }}> for "{searchQuery}"</span>
      )}
      {vehicleTypeFilter !== "all" && (
        <span style={{ color: "#94a3b8" }}> • {vehicleTypeFilter}</span>
      )}
    </p>
    {(searchQuery || vehicleTypeFilter !== "all" || sortBy !== "default") && (
      <button
        onClick={() => {
          setSearchQuery("");
          setVehicleTypeFilter("all");
          setSortBy("default");
        }}
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#ef4444",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          padding: "6px 14px",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Clear Filters
      </button>
    )}
  </div>



  {/* ============================
      PARKING LOTS GRID
      ============================ */}

  {filteredLots.length === 0 ? (

    <div style={{
      background: "white",
      borderRadius: "24px",
      padding: "60px 24px",
      border: "1px solid #e2e8f0",
      textAlign: "center",
    }}>
      <p style={{ fontSize: "48px", marginBottom: "12px" }}>🅿️</p>
      <p style={{
        fontSize: "18px",
        fontWeight: 800,
        color: "#0f172a",
        marginBottom: "6px",
      }}>No parking lots found</p>
      <p style={{
        fontSize: "14px",
        color: "#94a3b8",
      }}>Try changing your search or filters</p>
    </div>

  ) : (

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {filteredLots.map((parking) => {

        const isSelected = selectedLot === parking._id;
        const vehicleTypes = parking.supportedVehicleTypes || ["2-wheeler", "3-wheeler", "4-wheeler"];

        return (
          <div
            key={parking._id}
            style={{
              background: isSelected ? "#f0f9ff" : "white",
              borderRadius: "20px",
              padding: "24px",
              border: isSelected ? "2px solid #0ea5e9" : "1px solid #e2e8f0",
              boxShadow: isSelected
                ? "0 8px 30px rgba(14,165,233,0.12)"
                : "0 2px 12px rgba(0,0,0,0.03)",
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              if (!isSelected) e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.03)";
            }}
          >

            {/* LOT NAME + CITY */}
            <div style={{ marginBottom: "14px" }}>
              <h2 style={{
                fontSize: "18px",
                fontWeight: 900,
                color: "#0f172a",
                marginBottom: "4px",
              }}>
                {parking.name}
              </h2>
              {parking.location?.city && (
                <p style={{
                  fontSize: "13px",
                  color: "#64748b",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}>
                  📍 {parking.location.city}
                  {parking.location?.address && ` • ${parking.location.address}`}
                </p>
              )}
            </div>

            {/* STATS ROW */}
            <div style={{
              display: "flex",
              gap: "12px",
              marginBottom: "14px",
            }}>
              <div style={{
                background: parking.availableSlots > 0 ? "#f0fdf4" : "#fef2f2",
                padding: "8px 14px",
                borderRadius: "10px",
                flex: 1,
              }}>
                <p style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  color: parking.availableSlots > 0 ? "#16a34a" : "#dc2626",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>Available</p>
                <p style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: parking.availableSlots > 0 ? "#15803d" : "#dc2626",
                }}>
                  {parking.availableSlots}<span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>/{parking.totalSlots}</span>
                </p>
              </div>

              <div style={{
                background: "#f8fafc",
                padding: "8px 14px",
                borderRadius: "10px",
                flex: 1,
              }}>
                <p style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>Price/hr</p>
                <p style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "#0f172a",
                }}>
                  ₹{parking.pricePerHour}
                </p>
              </div>
            </div>

            {/* VEHICLE TYPE BADGES */}
            <div style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}>
              {vehicleTypes.map((type) => (
                <span
                  key={type}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "8px",
                    background: "#f1f5f9",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#475569",
                  }}
                >
                  {type === "2-wheeler" ? "🏍️" : type === "3-wheeler" ? "🛺" : "🚗"} {type}
                </span>
              ))}
            </div>

            {/* VIEW ON MAP BUTTON (IF EXISTS) */}
            {parking.location?.googleMapsLink && (
              <a
                href={parking.location.googleMapsLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#3b82f6",
                  fontWeight: 800,
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  textAlign: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  marginBottom: "10px",
                  transition: "all 0.15s ease",
                }}
              >
                📍 View on Google Maps
              </a>
            )}

            {/* BOOK BUTTON */}
            <button
              onClick={() => handleSelectLot(parking._id)}
              disabled={parking.availableSlots === 0}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border: "none",
                background: parking.availableSlots === 0
                  ? "#e2e8f0"
                  : isSelected
                  ? "#0ea5e9"
                  : "#0f172a",
                color: parking.availableSlots === 0 ? "#94a3b8" : "#fff",
                fontWeight: 900,
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: parking.availableSlots === 0 ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {parking.availableSlots === 0
                ? "Full — No Slots"
                : isSelected
                ? "✓ Selected"
                : "Book Parking"}
            </button>

          </div>
        );
      })}

    </div>

  )}



  {/* ============================
      BOOKING PANEL (Slot + Vehicle + Time)
      ============================ */}

  {selectedLot && (

    <div style={{
      background: "white",
      borderRadius: "24px",
      padding: "32px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
      marginTop: "32px",
    }}>

      <h2 style={{
        fontSize: "20px",
        fontWeight: 900,
        color: "#0f172a",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        📋 Complete Your Booking
      </h2>


      {/* SLOT SELECTOR */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{
          fontSize: "12px",
          fontWeight: 800,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "10px",
        }}>Select Slot</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {slots.map(slot => {
            const isSlotSelected = selectedSlot === slot._id;
            const isAvailable = slot.status === "available";
            return (
              <button
                key={slot._id}
                onClick={() => isAvailable && setSelectedSlot(slot._id)}
                disabled={!isAvailable}
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: isSlotSelected
                    ? "2px solid #0ea5e9"
                    : isAvailable
                    ? "2px solid #e2e8f0"
                    : "2px solid #fecaca",
                  background: isSlotSelected
                    ? "#f0f9ff"
                    : isAvailable
                    ? "#fff"
                    : "#fef2f2",
                  color: isSlotSelected
                    ? "#0369a1"
                    : isAvailable
                    ? "#0f172a"
                    : "#ef4444",
                  fontWeight: 800,
                  fontSize: "14px",
                  cursor: isAvailable ? "pointer" : "not-allowed",
                  transition: "all 0.15s ease",
                  opacity: isAvailable ? 1 : 0.6,
                }}
              >
                {slot.slotNumber}
                {!isAvailable && (
                  <span style={{
                    display: "block",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "#ef4444",
                    textTransform: "uppercase",
                  }}>
                    Taken
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>


      {/* VEHICLE SELECTOR */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{
          fontSize: "12px",
          fontWeight: 800,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "10px",
        }}>Select Vehicle</p>

        <select
          onChange={(e) => setSelectedVehicle(e.target.value)}
          style={{
            padding: "14px 18px",
            borderRadius: "14px",
            border: "2px solid #e2e8f0",
            fontSize: "14px",
            fontWeight: 700,
            color: "#0f172a",
            fontFamily: "inherit",
            outline: "none",
            minWidth: "260px",
            cursor: "pointer",
            background: "#fff",
          }}
        >
          <option value="">— Select Vehicle —</option>
          {vehicles.map(v => (
            <option key={v._id} value={v._id}>
              {v.vehicleNumber} — {v.vehicleName} ({v.vehicleType})
            </option>
          ))}
        </select>
      </div>


      {/* DATE & TIME SELECTOR */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{
          fontSize: "12px",
          fontWeight: 800,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "10px",
        }}>Date & Time</p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "4px" }}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "inherit",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "4px" }}>Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "inherit",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "4px" }}>End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "inherit",
                outline: "none",
              }}
            />
          </div>

        </div>
      </div>


      {/* PRICE PREVIEW COMPONENT */}
      {pricePreview && (
        <div style={{
          background: "#f0f9ff",
          border: "2px solid #bae6fd",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <p style={{ fontSize: "12px", fontWeight: 800, color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
              Total Estimated Cost
            </p>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#0284c7" }}>
              {pricePreview.hours} Hours × ₹{pricePreview.rate}/hr
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "28px", fontWeight: 1000, color: "#0f172a" }}>
              ₹{pricePreview.total}
            </p>
          </div>
        </div>
      )}

      {/* RESERVE BUTTON */}
      <button
        onClick={handleBooking}
        style={{
          background: "linear-gradient(135deg, #0ea5e9, #0369a1)",
          color: "white",
          padding: "18px 40px",
          borderRadius: "16px",
          border: "none",
          fontWeight: 900,
          fontSize: "14px",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(14,165,233,0.3)",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 12px 32px rgba(14,165,233,0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 8px 24px rgba(14,165,233,0.3)";
        }}
      >
        Pay Now
      </button>

    </div>

  )}

</div>

</div>

);

}

export default FindParkingPage;