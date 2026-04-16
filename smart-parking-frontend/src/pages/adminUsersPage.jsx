import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, updateUserStatus } from "../services/adminServices";

function AdminUsersPage() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {

      const res = await getUsers();
      setUsers(res.data.users);

    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this user?")) return;

    try {

      await deleteUser(id);

      fetchUsers();

    } catch (error) {
      console.log(error);
    }

  };

  const handleToggleBlock = async (id, currentStatus) => {
    const newStatus = currentStatus === "blocked" ? "active" : "blocked";
    if (!window.confirm(`Are you sure you want to ${newStatus === "blocked" ? "block" : "unblock"} this user?`)) return;

    try {
      await updateUserStatus(id, newStatus);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-slate-50">

      <h1 className="text-3xl font-bold mb-8">
        Manage Users
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

            {users.map((user) => (

              <tr key={user._id} className="border-b">

                <td className="p-3">{user.name}</td>

                <td className="p-3">{user.email}</td>

                <td className="p-3">{user.role}</td>

                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${user.status === "blocked" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                    {user.status || "active"}
                  </span>
                </td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => handleToggleBlock(user._id, user.status)}
                    className={`${user.status === "blocked" ? "bg-emerald-500" : "bg-orange-500"} text-white px-4 py-1 rounded hover:opacity-80 transition text-xs font-bold`}
                  >
                    {user.status === "blocked" ? "Unblock" : "Block"}
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
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

export default AdminUsersPage;