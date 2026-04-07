import React, { useEffect, useState } from "react";
import { getSlots } from "../services/adminServices";

function AdminSlotsPage() {

  const [slots, setSlots] = useState([]);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {

    try {

      const res = await getSlots();
      setSlots(res.data.slots);

    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div className="min-h-screen p-10 bg-slate-50">

      <h1 className="text-3xl font-bold mb-8">
        Parking Slots
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <p>Total Slots: {slots.length}</p>

      </div>

    </div>
  );
}

export default AdminSlotsPage;