import React from "react";

function SlotCard({ slot }) {

  const color =
    slot.status === "available"
      ? "bg-green-100 text-green-800"
      : slot.status === "reserved"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  return (

    <div className={`p-4 rounded-xl shadow text-center ${color}`}>

      <h3 className="text-xl font-bold">
        {slot.slotNumber}
      </h3>

      <p className="text-sm">
        {slot.status}
      </p>

    </div>

  );
}

export default SlotCard;