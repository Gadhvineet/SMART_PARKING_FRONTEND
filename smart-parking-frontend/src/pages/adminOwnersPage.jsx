import React, { useEffect, useState } from "react";
import { getOwners, deleteUser } from "../services/adminServices";

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

                  <button
                    onClick={() => handleDelete(owner._id)}
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

export default AdminOwnersPage;