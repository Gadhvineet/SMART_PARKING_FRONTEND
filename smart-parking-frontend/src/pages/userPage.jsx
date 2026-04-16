import React, { useEffect, useState } from "react";
import {
  getUserVehicles,
  getUserReservations,
  cancelReservation,
  extendReservation,
  getUserProfile,
  addReview
} from "../services/userServices";

function UserPage() {

  const [vehicles, setVehicles] = useState([]);
  const [activeReservations, setActiveReservations] = useState([]);
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [historyReservations, setHistoryReservations] = useState([]);

  const [user, setUser] = useState(null);

  // REVIEW STATES (ADDED)
  const [reviewReservation, setReviewReservation] = useState(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const SERVER_URL = "http://localhost:5000";


  // ===============================
  // BUILD VEHICLE IMAGE URL
  // ===============================
  const buildImageUrl = (image) => {

    if (!image) return null;

    if (typeof image === "string") {
      return image.startsWith("http")
        ? image
        : `${SERVER_URL}/${image.replace(/^\/+/, "")}`;
    }

    return null;
  };


  // ===============================
  // FETCH USER PROFILE
  // ===============================
  const fetchUserProfile = async () => {
    try {
      const res = await getUserProfile();
      setUser(res.user);
    } catch (error) {
      console.log(error);
    }
  };


  // ===============================
  // FETCH VEHICLES
  // ===============================
  const fetchVehicles = async () => {
    try {
      const res = await getUserVehicles();
      setVehicles(res.vehicles || []);
    } catch (error) {
      console.log(error);
    }
  };


  // ===============================
  // FETCH BOOKINGS + AUTO STATUS
  // ===============================
  const fetchBookings = async () => {

    try {

      const res = await getUserReservations();
      const bookings = res.reservations || [];

      const now = new Date();

      const active = [];
      const upcoming = [];
      const history = [];

      bookings.forEach((b) => {

        const start = new Date(b.timePeriod.startTime);
        const end = new Date(b.timePeriod.endTime);

        if (b.status === "cancelled") {
          history.push(b);
        }
        else if (now >= start && now <= end) {
          active.push(b);
        }
        else if (now < start) {
          upcoming.push(b);
        }
        else {
          history.push(b);
        }

      });

      setActiveReservations(active);
      setUpcomingReservations(upcoming);
      setHistoryReservations(history);

    } catch (error) {
      console.log(error);
    }

  };


  useEffect(() => {

    fetchUserProfile();
    fetchVehicles();
    fetchBookings();

    const interval = setInterval(fetchBookings, 30000);

    return () => clearInterval(interval);

  }, []);



  // ===============================
  // CANCEL RESERVATION
  // ===============================
  const handleCancelReservation = async (id) => {

    const confirmCancel = window.confirm("Cancel this reservation?");

    if (!confirmCancel) return;

    try {

      await cancelReservation(id);

      alert("Reservation cancelled");

      fetchBookings();

    } catch (error) {

      console.log(error);
      alert("Error cancelling reservation");

    }

  };


  // ===============================
  // EXTEND PARKING TIME
  // ===============================
  const handleExtendTime = async (reservation) => {

    const confirmExtend = window.confirm("Extend parking by 1 hour?");

    if (!confirmExtend) return;

    try {

      await extendReservation(reservation._id);

      alert("Parking extended by 1 hour");

      fetchBookings();

    } catch (error) {

      console.log(error);
      alert("Error extending parking");

    }

  };


  // ===============================
  // SUBMIT REVIEW (ADDED)
  // ===============================
  const submitReview = async () => {

    try {

      // Get the reservation object to extract parkingLot
      const reservation = historyReservations.find(r => r._id === reviewReservation);
      
      if (!reservation || !reservation.parkingLot) {
        alert("Error: Could not find parking lot information");
        return;
      }

      await addReview({
        reservation: reviewReservation,
        parkingLot: reservation.parkingLot,
        rating: parseFloat(rating),
        comment
      });

      alert("Review submitted successfully");

      setReviewReservation(null);
      setComment("");
      setRating(5);
      setHoverRating(0);
      
      // Refresh bookings
      fetchBookings();

    } catch (error) {

      console.log(error);
      alert("Error submitting review: " + (error.response?.data?.message || error.message));

    }

  };


  // ===============================
  // INTERACTIVE STAR RATING (half-star support)
  // ===============================
  const StarRatingPicker = () => {
    const displayRating = hoverRating || rating;

    const handleStarClick = (starIndex, isLeftHalf) => {
      const value = isLeftHalf ? starIndex + 0.5 : starIndex + 1;
      setRating(value);
    };

    const handleStarHover = (starIndex, isLeftHalf) => {
      const value = isLeftHalf ? starIndex + 0.5 : starIndex + 1;
      setHoverRating(value);
    };

    return (
      <div style={{ marginBottom: "16px" }}>
        <p style={{
          fontSize: "12px",
          fontWeight: 800,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "10px"
        }}>
          Your Rating
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>

          {/* 5 Stars */}
          {[0, 1, 2, 3, 4].map((starIndex) => {
            const fillLevel =
              displayRating >= starIndex + 1
                ? "full"
                : displayRating >= starIndex + 0.5
                ? "half"
                : "empty";

            return (
              <div
                key={starIndex}
                style={{
                  position: "relative",
                  width: "36px",
                  height: "36px",
                  cursor: "pointer",
                  fontSize: "32px",
                  lineHeight: "36px",
                  userSelect: "none",
                }}
              >
                {/* Background empty star */}
                <span style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  color: "#e2e8f0",
                  filter: "grayscale(100%)",
                  opacity: 0.5,
                }}>
                  ★
                </span>

                {/* Filled portion */}
                <span style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  overflow: "hidden",
                  width: fillLevel === "full" ? "100%" : fillLevel === "half" ? "50%" : "0%",
                  color: hoverRating ? "#fbbf24" : "#f59e0b",
                  transition: "width 0.15s ease, color 0.15s ease",
                }}>
                  ★
                </span>

                {/* Left half (0.5) click zone */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "50%",
                    height: "100%",
                    zIndex: 2,
                  }}
                  onClick={() => handleStarClick(starIndex, true)}
                  onMouseEnter={() => handleStarHover(starIndex, true)}
                  onMouseLeave={() => setHoverRating(0)}
                />

                {/* Right half (1.0) click zone */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "50%",
                    height: "100%",
                    zIndex: 2,
                  }}
                  onClick={() => handleStarClick(starIndex, false)}
                  onMouseEnter={() => handleStarHover(starIndex, false)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              </div>
            );
          })}

          {/* Rating value badge */}
          <span style={{
            marginLeft: "12px",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "white",
            fontWeight: 900,
            fontSize: "14px",
            padding: "4px 12px",
            borderRadius: "20px",
            minWidth: "44px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)",
          }}>
            {displayRating.toFixed(1)}
          </span>

        </div>

        {/* Zero rating option */}
        <button
          type="button"
          onClick={() => { setRating(0); setHoverRating(0); }}
          style={{
            marginTop: "8px",
            fontSize: "11px",
            color: rating === 0 ? "#ef4444" : "#94a3b8",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            textDecoration: "underline",
            padding: 0,
          }}
        >
          Clear rating (set to 0)
        </button>
      </div>
    );
  };


  const defaultVehicle = vehicles[0];
  const vehicleImage = buildImageUrl(defaultVehicle?.image);



  return (

    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">

      <div className="max-w-6xl mx-auto p-6 md:p-12">

        <header className="mb-10">
          <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900">
            User Dashboard
          </h2>

          <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">
            Network Node: Active
          </p>
        </header>



        {/* PROFILE INFO */}

        {user && (

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-8">

            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
              Profile Info
            </p>

            <p className="text-lg font-bold text-slate-900">
              {user.name}
            </p>

            <p className="text-sm text-slate-500">
              {user.email}
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Member Since: {new Date(user.createdAt).toLocaleDateString()}
            </p>

          </div>

        )}



        {/* DEFAULT VEHICLE */}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          <div className="md:col-span-7 bg-white p-8 md:p-10 rounded-[2.5rem] shadow border border-slate-100">

            <h2 className="text-[10px] font-black text-sky-600 uppercase tracking-[0.4em] mb-6">
              Default Vehicle
            </h2>

            {!defaultVehicle ? (

              <div>

                <p className="text-3xl font-[1000] text-slate-900 mb-3">
                  No Vehicle Added
                </p>

                <button
                  onClick={() => window.location.href = "/vehicles"}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Add Vehicle
                </button>

              </div>

            ) : (

              <div className="flex gap-6 items-center">

                {vehicleImage && (

                  <img
                    src={vehicleImage}
                    alt="vehicle"
                    className="w-32 h-24 object-cover rounded-xl"
                  />

                )}

                <div>

                  <p className="text-2xl font-bold">
                    {defaultVehicle.vehicleName}
                  </p>

                  <p className="text-slate-500 text-sm">
                    {defaultVehicle.vehicleNumber}
                  </p>

                  <p className="text-slate-400 text-xs">
                    {defaultVehicle.vehicleType}
                  </p>

                </div>

              </div>

            )}

          </div>



          {/* ACTION BUTTONS */}

          <div className="md:col-span-5 flex flex-col gap-4">

            <button
              onClick={() => window.location.href = "/find-parking"}
              className="w-full bg-[#e0f2fe] text-[#0369a1] px-6 py-6 rounded-2xl font-[1000]"
            >
              Find New Parking
            </button>

            <button
              onClick={() => window.location.href = "/vehicles"}
              className="w-full bg-slate-900 text-white px-6 py-6 rounded-2xl font-[1000]"
            >
              View Vehicle List
            </button>

          </div>

        </div>



        {/* ACTIVE PARKING */}

        <div className="mt-10">

          <h2 className="text-lg font-bold mb-4">
            Active Parking
          </h2>

          {activeReservations.length === 0 && (
            <p className="text-slate-500 text-sm">No active parking</p>
          )}

          {activeReservations.map((r) => (

            <div key={r._id} className="bg-white p-4 mb-3 rounded-xl border flex justify-between items-center">

              <div>

                <p className="font-semibold">
                  {r.parkingLot?.name}
                </p>

                <p className="text-sm text-slate-500">
                  Vehicle: {r.vehicle?.vehicleNumber}
                </p>

                <p className="text-sm text-slate-500">
                  Slot: {r.slot?.slotNumber}
                </p>

                <p className="text-xs text-slate-400">
                  {new Date(r.timePeriod.startTime).toLocaleTimeString()} -
                  {new Date(r.timePeriod.endTime).toLocaleTimeString()}
                </p>

              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => handleExtendTime(r)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Extend 1h
                </button>

                <button
                  onClick={() => handleCancelReservation(r._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>

              </div>

            </div>

          ))}

        </div>



        {/* UPCOMING PARKING */}

        <div className="mt-10">

          <h2 className="text-lg font-bold mb-4">
            Upcoming Parking
          </h2>

          {upcomingReservations.length === 0 && (
            <p className="text-slate-500 text-sm">No upcoming bookings</p>
          )}

          {upcomingReservations.map((r) => (

            <div key={r._id} className="bg-white p-4 mb-3 rounded-xl border">

              <p className="font-semibold">
                {r.parkingLot?.name}
              </p>

              <p className="text-sm text-slate-500">
                Vehicle: {r.vehicle?.vehicleNumber}
              </p>

              <p className="text-sm text-slate-500">
                Slot: {r.slot?.slotNumber}
              </p>

              <p className="text-xs text-slate-400">
                Starts: {new Date(r.timePeriod.startTime).toLocaleString()}
              </p>

            </div>

          ))}

        </div>



        {/* PARKING HISTORY */}

        <div className="mt-10">

          <h2 className="text-lg font-bold mb-4">
            Parking History
          </h2>

          {historyReservations.length === 0 && (
            <p className="text-slate-500 text-sm">No past bookings</p>
          )}

          {historyReservations.map((r) => (

            <div key={r._id} className="bg-white p-4 mb-3 rounded-xl border">

              <p className="font-semibold">
                {r.parkingLot?.name}
              </p>

              <p className="text-sm text-slate-500">
                Vehicle: {r.vehicle?.vehicleNumber}
              </p>

              <p className="text-sm text-slate-500">
                Slot: {r.slot?.slotNumber}
              </p>

              <p className="text-xs text-slate-400">
                {new Date(r.timePeriod.startTime).toLocaleString()} -
                {new Date(r.timePeriod.endTime).toLocaleString()}
              </p>

              {/* ADD REVIEW BUTTON */}
              <button
                onClick={() => { setReviewReservation(r._id); setRating(5); setHoverRating(0); setComment(""); }}
                className="mt-3 bg-slate-900 text-white px-4 py-2 rounded text-sm"
              >
                Add Review
              </button>

            </div>

          ))}

          {/* REVIEW FORM - Interactive Star Rating */}

          {reviewReservation && (

            <div style={{
              background: "white",
              padding: "28px",
              marginTop: "24px",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: 900, fontSize: "18px", color: "#0f172a", margin: 0 }}>
                  ✍️ Write a Review
                </h3>
                <button
                  onClick={() => { setReviewReservation(null); setHoverRating(0); }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "#94a3b8",
                    fontWeight: 700,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Star Rating Picker */}
              <StarRatingPicker />

              {/* Comment Input */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "8px"
                }}>
                  Your Comment
                </p>
                <textarea
                  placeholder="Share your experience with this parking lot..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    resize: "vertical",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={submitReview}
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "white",
                    padding: "12px 28px",
                    borderRadius: "12px",
                    border: "none",
                    fontWeight: 800,
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                  onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.4)"; }}
                  onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 14px rgba(16, 185, 129, 0.3)"; }}
                >
                  Submit Review
                </button>
                <button
                  onClick={() => { setReviewReservation(null); setHoverRating(0); }}
                  style={{
                    background: "#f1f5f9",
                    color: "#64748b",
                    padding: "12px 28px",
                    borderRadius: "12px",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#e2e8f0"}
                  onMouseLeave={(e) => e.target.style.background = "#f1f5f9"}
                >
                  Cancel
                </button>
              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}

export default UserPage;