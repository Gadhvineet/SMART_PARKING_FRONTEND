import React, { useEffect, useState } from "react";
import { getBookings } from "../services/adminServices";

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

  return (
    <div className="min-h-screen p-10 bg-slate-50">

      <h1 className="text-3xl font-bold mb-8">
        All Bookings
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <p>Total Bookings: {bookings.length}</p>

      </div>

    </div>
  );
}

export default AdminBookingsPage;