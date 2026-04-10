import React, { useEffect, useState } from "react";
import {
  getUserVehicles,
  getUserReservations,
  cancelReservation,
  extendReservation,
  getUserProfile
} from "../services/userServices";

function UserPage() {

  const [vehicles, setVehicles] = useState([]);
  const [activeReservations, setActiveReservations] = useState([]);
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [historyReservations, setHistoryReservations] = useState([]);

  const [user, setUser] = useState(null);

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

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default UserPage;