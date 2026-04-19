import React, { useEffect, useState } from "react";
import { getOwners, deleteUser, updateUserStatus } from "../services/adminServices";

function AdminOwnersPage() {

  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {

      const res = await getOwners();
      setOwners(res.data.owners);

    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this owner?")) return;

    try {

      await deleteUser(id);

      fetchOwners();

    } catch (error) {
      console.log(error);
    }

  };

  const handleToggleBlock = async (id, currentStatus) => {
    const newStatus = currentStatus === "blocked" ? "active" : "blocked";
    if (!window.confirm(`Are you sure you want to ${newStatus === "blocked" ? "block" : "unblock"} this owner?`)) return;

    try {
      await updateUserStatus(id, newStatus);
      fetchOwners();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-slate-50">

      <h1 className="text-3xl font-bold mb-8">
        Manage Owners
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>

          <tbody>

            {owners.map((owner) => (

              <tr key={owner._id} className="border-b">

                <td className="p-3">{owner.name}</td>

                <td className="p-3">{owner.email}</td>

                <td className="p-3">{owner.role}</td>

                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${owner.status === "blocked" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                    {owner.status || "active"}
                  </span>
                </td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => handleToggleBlock(owner._id, owner.status)}
                    className={`${owner.status === "blocked" ? "bg-emerald-500" : "bg-orange-500"} text-white px-4 py-1 rounded hover:opacity-80 transition text-xs font-bold`}
                  >
                    {owner.status === "blocked" ? "Unblock" : "Block"}
                  </button>

                  <button
                    onClick={() => handleDelete(owner._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition text-xs font-bold"
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

export default AdminOwnersPage;