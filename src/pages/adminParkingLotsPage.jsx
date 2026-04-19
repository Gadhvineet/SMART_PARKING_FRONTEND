import React, { useEffect, useState } from "react";
import { getParkingLots, deleteParkingLot } from "../services/adminServices";

function AdminParkingLotsPage() {

  const [lots, setLots] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
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
              <th className="text-left p-3 text-emerald-600">Total Revenue</th>
              <th className="text-left p-3 text-amber-500">Rating</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {lots.map((lot) => (
              <React.Fragment key={lot._id}>
                <tr className={`border-b ${expandedId === lot._id ? 'bg-slate-50' : ''}`}>
                  <td className="p-3">{lot.name}</td>
                  <td className="p-3">{lot.location?.city || "Unknown"}</td>
                  <td className="p-3">
                    {lot.owner?.name} <span className="text-xs text-slate-400">({lot.owner?.email})</span>
                  </td>
                  <td className="p-3 font-bold text-emerald-600 scale-105">
                    ₹{lot.totalRevenue?.toLocaleString() || 0}
                  </td>
                  <td className="p-3 text-amber-500 font-bold">
                    ★ {lot.averageRating} <span className="text-xs text-slate-400">({lot.totalReviews})</span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => toggleExpand(lot._id)}
                      className="bg-blue-500 text-white px-3 py-1 text-xs font-bold rounded hover:opacity-80 transition"
                    >
                      {expandedId === lot._id ? "Collapse" : "Expand"}
                    </button>
                    <button
                      onClick={() => handleDelete(lot._id)}
                      className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {expandedId === lot._id && (
                  <tr className="bg-slate-50 border-b">
                    <td colSpan="6" className="p-6">
                      <div className="grid grid-cols-3 gap-6">

                        {/* SLOTS COLUMN */}
                        <div className="border border-slate-200 bg-white p-4 rounded-lg">
                          <h4 className="font-black text-[10px] uppercase text-slate-400 tracking-widest mb-3 border-b pb-2">Inventory ({lot.slots?.length || 0})</h4>
                          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                            {lot.slots?.map(slot => (
                              <div key={slot._id} className="text-[10px] px-2 py-1 bg-slate-100 rounded border border-slate-200">
                                <strong>{slot.slotNumber}</strong> - <span className={slot.status === 'available' ? 'text-emerald-500' : 'text-rose-500'}>{slot.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* RESERVATIONS COLUMN */}
                        <div className="border border-slate-200 bg-white p-4 rounded-lg">
                          <h4 className="font-black text-[10px] uppercase text-slate-400 tracking-widest mb-3 border-b pb-2">Recent Bookings ({lot.reservations?.length || 0})</h4>
                          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                            {lot.reservations?.map(res => (
                              <div key={res._id} className="text-xs border border-slate-100 rounded p-2 bg-slate-50">
                                <p><strong>{res.user?.name}</strong> • {res.vehicle?.plateNumber}</p>
                                <p className="text-[10px] text-slate-500 mt-1">{new Date(res.timePeriod?.startTime).toLocaleString()} - <span className={`font-bold ${res.status === 'completed' ? 'text-emerald-500' : 'text-blue-500'}`}>{res.status}</span></p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* REVIEWS COLUMN */}
                        <div className="border border-slate-200 bg-white p-4 rounded-lg">
                          <h4 className="font-black text-[10px] uppercase text-slate-400 tracking-widest mb-3 border-b pb-2">User Reviews ({lot.reviews?.length || 0})</h4>
                          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                            {lot.reviews?.map(rev => (
                              <div key={rev._id} className="text-xs border border-slate-100 rounded p-2 bg-slate-50">
                                <p className="flex justify-between"><strong>{rev.user?.name}</strong> <span className="text-amber-500 font-bold">★ {rev.rating}</span></p>
                                <p className="text-[10px] text-slate-500 italic mt-1">"{rev.comment}"</p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminParkingLotsPage;