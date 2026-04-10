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

      <div className="grid grid-cols-4 gap-4">

        {slots.map(slot => (

          <div
            key={slot._id}
            className="p-4 bg-white rounded shadow text-center"
          >

            <h3 className="text-xl font-bold">
              {slot.slotNumber}
            </h3>

            <p className="text-sm text-gray-500">
              {slot.parkingLot?.name}
            </p>

            <p className="text-xs">
              {slot.status}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AdminSlotsPage;