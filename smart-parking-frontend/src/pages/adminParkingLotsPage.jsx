import React, { useEffect, useState } from "react";
import { getParkingLots, deleteParkingLot } from "../services/adminServices";

function AdminParkingLotsPage() {

  const [lots, setLots] = useState([]);

  useEffect(() => {
    fetchLots();
  }, []);

  const fetchLots = async () => {
    try {

      const res = await getParkingLots();
      setLots(res.data.lots);

    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this parking lot?")) return;

    try {

      await deleteParkingLot(id);

      fetchLots();

    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div className="min-h-screen p-10 bg-slate-50">

      <h1 className="text-3xl font-bold mb-8">
        Manage Parking Lots
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Parking Name</th>
              <th className="text-left p-3">City</th>
              <th className="text-left p-3">Owner</th>
              <th className="text-left p-3">Slots</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>

          <tbody>

            {lots.map((lot) => (

              <tr key={lot._id} className="border-b">

                <td className="p-3">{lot.name}</td>

                <td className="p-3">{lot.location?.city}</td>

                <td className="p-3">
                  {lot.owner?.name} ({lot.owner?.email})
                </td>

                <td className="p-3">
                  {lot.availableSlots} / {lot.totalSlots}
                </td>

                <td className="p-3">
                  ₹{lot.pricePerHour}/hr
                </td>

                <td className="p-3">

                  <button
                    onClick={() => handleDelete(lot._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminParkingLotsPage;