import React, { useEffect, useState } from "react";
import { getBookings, cancelBooking, reportBookingOwner } from "../services/adminServices";

function AdminBookingsPage() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {

    try {

      const res = await getBookings();
      setBookings(res.data.bookings);

    } catch (error) {
      console.log(error);
    }

  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to forcibly cancel this booking?")) return;
    try {
      await cancelBooking(id);
      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReport = async (id) => {
    const reason = window.prompt("Enter the reason for reporting this booking to the parking lot owner:");
    if (!reason) return;
    try {
      await reportBookingOwner(id, reason);
      alert("Owner has been notified successfully.");
    } catch (error) {
      console.log(error);
      alert("Failed to report owner.");
    }
  };

  return (
    <div className="min-h-screen p-10 bg-slate-50">

      <h1 className="text-3xl font-[1000] mb-8 text-slate-800">
        Global Network Bookings
      </h1>

      <div className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">User / Vehicle</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Location</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Schedule</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">No active or past bookings.</td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-4">
                    <p className="font-bold text-sm text-slate-800">{booking.user?.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{booking.vehicle?.plateNumber} • {booking.vehicle?.type}</p>
                  </td>
                  
                  <td className="p-4">
                    <p className="font-bold text-sm text-slate-800">{booking.parkingLot?.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Slot: {booking.slot?.slotNumber}</p>
                  </td>

                  <td className="p-4">
                    <p className="text-xs text-slate-800"><span className="font-bold">IN:</span> {new Date(booking.timePeriod?.startTime).toLocaleString()}</p>
                    <p className="text-xs text-slate-800 mt-1"><span className="font-bold">OUT:</span> {new Date(booking.timePeriod?.endTime).toLocaleString()}</p>
                  </td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      booking.status === "completed" ? "bg-emerald-100 text-emerald-600" :
                      booking.status === "cancelled" ? "bg-rose-100 text-rose-600" :
                      "bg-blue-100 text-blue-600"
                    }`}>
                      {booking.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      {booking.status !== "cancelled" && booking.status !== "completed" && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded text-[10px] font-black tracking-wider uppercase transition"
                        >
                          Cancel
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleReport(booking._id)}
                        className="bg-slate-800 hover:bg-black text-white px-3 py-2 rounded text-[10px] font-black tracking-wider uppercase transition"
                      >
                        Alert Owner
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default AdminBookingsPage;