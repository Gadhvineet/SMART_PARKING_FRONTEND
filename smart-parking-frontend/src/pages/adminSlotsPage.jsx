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

  // Group slots by parkingLot name
  const groupedSlots = slots.reduce((acc, slot) => {
    const lotName = slot.parkingLot?.name || "Unknown Lot";
    if (!acc[lotName]) acc[lotName] = [];
    acc[lotName].push(slot);
    return acc;
  }, {});

  return (
    <div className="min-h-screen p-10 bg-slate-50">

      <h1 className="text-3xl font-bold mb-8">
        Inventory Slots Categorization
      </h1>

      {Object.keys(groupedSlots).length === 0 && (
        <p className="text-slate-500">No slots found across the network.</p>
      )}

      {Object.entries(groupedSlots).map(([lotName, lotSlots]) => (
        <div key={lotName} className="mb-10 bg-white p-6 rounded-xl shadow border border-slate-100">
          <h2 className="text-xl font-[1000] text-slate-900 mb-6 flex items-center gap-3">
            <span className="text-2xl">🅿️</span> {lotName} 
            <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest font-black">
              {lotSlots.length} Slots
            </span>
          </h2>

          <div className="flex flex-wrap gap-4">
            {lotSlots.map(slot => (
              <div
                key={slot._id}
                className="p-4 bg-slate-50 rounded-lg shadow-sm border border-slate-200 text-center w-32 flex flex-col items-center justify-center relative overflow-hidden group hover:border-slate-300 transition"
              >
                <div className={`absolute top-0 w-full h-1 ${slot.status === 'available' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                <h3 className="text-xl font-[1000] text-slate-800 mt-2">
                  {slot.slotNumber}
                </h3>
                <p className={`text-[9px] font-black uppercase tracking-widest mt-2 ${slot.status === 'available' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {slot.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}

    </div>
  );
}

export default AdminSlotsPage;