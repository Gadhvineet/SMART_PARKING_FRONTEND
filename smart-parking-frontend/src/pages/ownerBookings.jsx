import React, { useEffect, useState } from "react";
import {
  getOwnerBookings,
  completeBooking,
  cancelBooking
} from "../services/ownerServices";

function OwnerBookingsPage() {

  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {

    try {

      const data = await getOwnerBookings();
      setBookings(data);

    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    fetchBookings();
  }, []);


  const handleComplete = async (id) => {

    try {

      await completeBooking(id);
      fetchBookings();

    } catch (error) {
      alert("Error completing booking");
    }

  };


  const handleCancel = async (id) => {

    try {

      await cancelBooking(id);
      fetchBookings();

    } catch (error) {
      alert("Error cancelling booking");
    }

  };


  return (

    <div className="min-h-screen bg-slate-50 p-10">

      <h1 className="text-3xl font-bold mb-8">
        Parking Bookings
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr className="text-left">

              <th className="p-4">User</th>
              <th className="p-4">Vehicle</th>
              <th className="p-4">Parking Lot</th>
              <th className="p-4">Slot</th>
              <th className="p-4">Start Time</th>
              <th className="p-4">End Time</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {bookings.map((b) => (

              <tr key={b._id} className="border-t">

                <td className="p-4">
                  {b.user?.name}
                </td>

                <td className="p-4">
                  {b.vehicle?.vehicleNumber}
                </td>

                <td className="p-4">
                  {b.parkingLot?.name}
                </td>

                <td className="p-4">
                  {b.slot?.slotNumber}
                </td>

                <td className="p-4">
                  {new Date(b.timePeriod.startTime).toLocaleString()}
                </td>

                <td className="p-4">
                  {new Date(b.timePeriod.endTime).toLocaleString()}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded text-sm
                    ${b.status === "active" ? "bg-green-100 text-green-700" :
                      b.status === "completed" ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"}`}
                  >
                    {b.status}
                  </span>

                </td>

                <td className="p-4 flex gap-2">

                  {b.status === "active" && (

                    <>
                      <button
                        onClick={() => handleComplete(b._id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Complete
                      </button>

                      <button
                        onClick={() => handleCancel(b._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default OwnerBookingsPage;