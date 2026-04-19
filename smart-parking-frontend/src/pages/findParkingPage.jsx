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

// Today's date in YYYY-MM-DD for min attribute
const getTodayStr = () => {
  const now = new Date();
  return now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0');
};
const todayStr = getTodayStr();

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

// Check if selected date itself is in the past
const selectedDate = new Date(date);
const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
if (selectedDate < todayDate) {
  alert("Cannot book parking for a past date. Please select today or a future date.");
  return;
}

// Check if booking start time is in the past (same day scenario)
if (startDateTime < now) {
  alert("Cannot book parking for a time that has already passed. Please select a future start time.");
  return;
}

// Check if end time is in the past
if (endDateTime <= now) {
  alert("End time must be in the future.");
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
      // 1. Load Razorpay Script FIRST (before any reservation)
      const isLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!isLoaded) {
        alert("Payment gateway failed to load. Please check your connection.");
        return;
      }
      
      // 2. Get total amount
      let amount = 0;
      if (pricePreview && pricePreview.total) {
        amount = parseFloat(pricePreview.total);
      } else {
        alert("Could not calculate payment amount.");
        return;
      }

      // 3. Get logged-in user ID from token
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.id;
      
      // 4. Create Razorpay Order (NO reservation yet — payment first!)
      const orderRes = await createOrder({
        amount: amount,
        user: userId,
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
                // 7. Verify Payment FIRST
                await verifyPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    paymentId: orderRes.paymentId
                });
                
                // 8. Payment verified → NOW create reservation (slot gets locked only here)
                const resData = await createReservation(data);
                
                alert("Payment successful! Your parking slot has been reserved.");
                window.location.href = "/user";
            } catch (err) {
                alert("Error: " + (err.response?.data?.message || err.message));
            }
        },
        modal: {
            ondismiss: function () {
                // User closed the payment modal — do nothing, slot stays free
                alert("Payment cancelled. No slot has been reserved.");
            }
        },
        theme: {
            color: "#0f172a"
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
          // Payment failed — do nothing, slot stays free
          alert("Payment failed! No slot has been reserved. Please try again.");
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


      {/* DATE & TIME SELECTOR — REDESIGNED */}
      <div style={{ marginBottom: "28px" }}>
        <p style={{
          fontSize: "12px",
          fontWeight: 800,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "14px",
        }}>📅 Schedule Your Parking</p>

        {/* DATE CARD */}
        <div style={{
          background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
          borderRadius: "16px",
          padding: "18px 20px",
          border: date && date < todayStr ? "2px solid #ef4444" : "1px solid #e2e8f0",
          marginBottom: "16px",
          transition: "all 0.2s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <span style={{
              fontSize: "22px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>📅</span>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 800, color: "#0f172a" }}>Parking Date</p>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>Select today or a future date</p>
            </div>
          </div>
          <input
            type="date"
            value={date}
            min={todayStr}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: date && date < todayStr ? "2px solid #ef4444" : "2px solid #e2e8f0",
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "inherit",
              outline: "none",
              background: date && date < todayStr ? "#fef2f2" : "#fff",
              boxSizing: "border-box",
              cursor: "pointer",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onFocus={(e) => {
              if (!(date && date < todayStr)) {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.boxShadow = "0 0 0 4px rgba(59,130,246,0.1)";
              }
            }}
            onBlur={(e) => {
              if (!(date && date < todayStr)) {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "none";
              }
            }}
          />
          {date && date < todayStr && (
            <p style={{ fontSize: "11px", color: "#ef4444", fontWeight: 700, marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
              ⚠️ Past date selected — please pick today or later
            </p>
          )}
          {date === todayStr && (
            <p style={{ fontSize: "11px", color: "#0ea5e9", fontWeight: 700, marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
              ℹ️ Today selected — only future time slots are available
            </p>
          )}
        </div>

        {/* TIME SLOT GRIDS */}
        {(() => {
          // Generate time slots in 30-min intervals from 06:00 to 23:30
          const allSlots = [];
          for (let h = 6; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
              const hh = String(h).padStart(2, '0');
              const mm = String(m).padStart(2, '0');
              const val24 = `${hh}:${mm}`;
              // 12-hour display label
              const period = h >= 12 ? 'PM' : 'AM';
              const h12 = h % 12 === 0 ? 12 : h % 12;
              const label = `${h12}:${mm} ${period}`;
              allSlots.push({ val24, label });
            }
          }

          // Determine which start slots are in the past (if today)
          const nowDate = new Date();
          const nowMins = nowDate.getHours() * 60 + nowDate.getMinutes();
          const isToday = date === todayStr;

          // For end time, only show slots after selected start
          const startMins = startTime ? (() => {
            const [sh, sm] = startTime.split(':').map(Number);
            return sh * 60 + sm;
          })() : null;

          return (
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>

              {/* START TIME SECTION */}
              <div style={{
                flex: 1,
                minWidth: "240px",
                background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)",
                borderRadius: "16px",
                padding: "18px 20px",
                border: "1px solid #bbf7d0",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <span style={{
                    fontSize: "20px",
                    width: "38px",
                    height: "38px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}>🕐</span>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 800, color: "#15803d" }}>Start Time</p>
                    <p style={{ fontSize: "10px", fontWeight: 600, color: "#86efac" }}>When you arrive</p>
                  </div>
                  {startTime && (
                    <span style={{
                      marginLeft: "auto",
                      background: "#15803d",
                      color: "#fff",
                      padding: "4px 12px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 800,
                    }}>
                      {allSlots.find(s => s.val24 === startTime)?.label || startTime}
                    </span>
                  )}
                </div>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(85px, 1fr))",
                  gap: "6px",
                  maxHeight: "180px",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}>
                  {allSlots.map((slot) => {
                    const [sh, sm] = slot.val24.split(':').map(Number);
                    const slotMins = sh * 60 + sm;
                    const isPast = isToday && slotMins <= nowMins;
                    const isActive = startTime === slot.val24;
                    return (
                      <button
                        key={`start-${slot.val24}`}
                        onClick={() => {
                          if (!isPast) {
                            setStartTime(slot.val24);
                            // Auto-clear end time if it's now invalid
                            if (endTime) {
                              const [eh, em] = endTime.split(':').map(Number);
                              if (eh * 60 + em <= slotMins + 60) {
                                setEndTime("");
                              }
                            }
                          }
                        }}
                        disabled={isPast}
                        style={{
                          padding: "8px 4px",
                          borderRadius: "10px",
                          border: isActive ? "2px solid #15803d" : "1px solid #d1fae5",
                          background: isPast ? "#f1f5f9" : isActive ? "#15803d" : "#fff",
                          color: isPast ? "#cbd5e1" : isActive ? "#fff" : "#1e293b",
                          fontSize: "12px",
                          fontWeight: isActive ? 900 : 700,
                          cursor: isPast ? "not-allowed" : "pointer",
                          transition: "all 0.15s ease",
                          opacity: isPast ? 0.5 : 1,
                          textDecoration: isPast ? "line-through" : "none",
                        }}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ARROW CONNECTOR */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
                minWidth: "40px",
              }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}>
                  <span style={{
                    fontSize: "28px",
                    color: "#64748b",
                    fontWeight: 900,
                    lineHeight: 1,
                  }}>→</span>
                  <span style={{
                    fontSize: "9px",
                    fontWeight: 800,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}>to</span>
                </div>
              </div>

              {/* END TIME SECTION */}
              <div style={{
                flex: 1,
                minWidth: "240px",
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                borderRadius: "16px",
                padding: "18px 20px",
                border: "1px solid #93c5fd",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <span style={{
                    fontSize: "20px",
                    width: "38px",
                    height: "38px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}>🕑</span>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 800, color: "#1d4ed8" }}>End Time</p>
                    <p style={{ fontSize: "10px", fontWeight: 600, color: "#93c5fd" }}>When you leave</p>
                  </div>
                  {endTime && (
                    <span style={{
                      marginLeft: "auto",
                      background: "#1d4ed8",
                      color: "#fff",
                      padding: "4px 12px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 800,
                    }}>
                      {allSlots.find(s => s.val24 === endTime)?.label || endTime}
                    </span>
                  )}
                </div>

                {!startTime ? (
                  <div style={{
                    padding: "24px",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "13px",
                    fontWeight: 700,
                    background: "rgba(255,255,255,0.6)",
                    borderRadius: "12px",
                    border: "1px dashed #bfdbfe",
                  }}>
                    ← Select a start time first
                  </div>
                ) : (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(85px, 1fr))",
                    gap: "6px",
                    maxHeight: "180px",
                    overflowY: "auto",
                    paddingRight: "4px",
                  }}>
                    {allSlots
                      .filter((slot) => {
                        const [eh, em] = slot.val24.split(':').map(Number);
                        const endMins = eh * 60 + em;
                        // Must be at least 1 hour after start
                        return startMins !== null && endMins >= startMins + 60;
                      })
                      .map((slot) => {
                        const isActive = endTime === slot.val24;
                        // Calculate duration for this option
                        const [eh, em] = slot.val24.split(':').map(Number);
                        const durHrs = ((eh * 60 + em) - startMins) / 60;
                        return (
                          <button
                            key={`end-${slot.val24}`}
                            onClick={() => setEndTime(slot.val24)}
                            style={{
                              padding: "8px 4px",
                              borderRadius: "10px",
                              border: isActive ? "2px solid #1d4ed8" : "1px solid #bfdbfe",
                              background: isActive ? "#1d4ed8" : "#fff",
                              color: isActive ? "#fff" : "#1e293b",
                              fontSize: "12px",
                              fontWeight: isActive ? 900 : 700,
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                              position: "relative",
                            }}
                          >
                            {slot.label}
                            <span style={{
                              display: "block",
                              fontSize: "9px",
                              fontWeight: 600,
                              color: isActive ? "#bfdbfe" : "#94a3b8",
                              marginTop: "1px",
                            }}>
                              {durHrs}h
                            </span>
                          </button>
                        );
                      })
                    }
                  </div>
                )}
              </div>

            </div>
          );
        })()}

        {/* DURATION SUMMARY */}
        {startTime && endTime && (() => {
          const [sh, sm] = startTime.split(':').map(Number);
          const [eh, em] = endTime.split(':').map(Number);
          const diffH = ((eh * 60 + em) - (sh * 60 + sm)) / 60;
          if (diffH <= 0) return (
            <div style={{
              marginTop: "12px",
              padding: "12px 18px",
              borderRadius: "12px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <span style={{ fontSize: "18px" }}>⚠️</span>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#dc2626" }}>
                End time must be after start time
              </p>
            </div>
          );
          if (diffH < 1) return (
            <div style={{
              marginTop: "12px",
              padding: "12px 18px",
              borderRadius: "12px",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <span style={{ fontSize: "18px" }}>⏱️</span>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#d97706" }}>
                Minimum parking duration is 1 hour
              </p>
            </div>
          );
          // Convert 24h to 12h label inline (allSlots is not in scope here)
          const fmt12 = (t) => {
            const [hh, mm] = t.split(':').map(Number);
            const period = hh >= 12 ? 'PM' : 'AM';
            const h12 = hh % 12 === 0 ? 12 : hh % 12;
            return `${h12}:${String(mm).padStart(2,'0')} ${period}`;
          };
          const startLabel = fmt12(startTime);
          const endLabel = fmt12(endTime);
          return (
            <div style={{
              marginTop: "12px",
              padding: "14px 20px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #f0fdf4, #eff6ff)",
              border: "1px solid #bbf7d0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "8px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px" }}>✅</span>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 800, color: "#15803d" }}>
                    {startLabel} → {endLabel}
                  </p>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "#86efac" }}>
                    Your scheduled parking window
                  </p>
                </div>
              </div>
              <span style={{
                background: "#0f172a",
                color: "#fff",
                padding: "6px 16px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 900,
              }}>
                {diffH} hour{diffH !== 1 ? "s" : ""}
              </span>
            </div>
          );
        })()}

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