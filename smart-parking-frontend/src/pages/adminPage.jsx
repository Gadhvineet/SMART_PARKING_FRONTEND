import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/adminServices";

function AdminPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalParkingLots: 0,
    totalBookings: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">

      {/* 🔹 MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-6 md:p-12">
        
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900">
              Admin Dashboard
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">
              Global Network Authority
            </p>
          </div>

          <div className="bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            System Online: 100%
          </div>
        </header>

        {/* 📊 DASHBOARD */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">
              Total Users
            </p>
            <p className="text-3xl font-[1000] text-slate-900">
              {stats.totalUsers}
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">
              Total Owners
            </p>
            <p className="text-3xl font-[1000] text-slate-900">
              {stats.totalOwners}
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">
              Parking Lots
            </p>
            <p className="text-3xl font-[1000] text-slate-900">
              {stats.totalParkingLots}
            </p>
          </div>

          <div className="bg-[#e0f2fe] p-6 md:p-8 rounded-[2rem] shadow-sm border border-sky-100">
            <p className="text-[#0369a1] text-[9px] font-black uppercase tracking-widest mb-1">
              Total Bookings
            </p>
            <p className="text-3xl font-[1000] text-[#0369a1]">
              {stats.totalBookings}
            </p>
          </div>

        </div>

        {/* ⚡ ADMIN ACTIONS */}
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100">

          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">
            Administrative Privileges
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* MANAGE USERS */}
            <button
              onClick={() => navigate("/admin/users")}
              className="bg-slate-900 hover:bg-black text-white px-8 py-8 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[10px] transition-all transform active:scale-[0.98] flex items-center gap-6 group"
            >
              <span className="text-2xl bg-white/10 w-12 h-12 flex items-center justify-center rounded-xl">👥</span>

              <div className="text-left">
                <p>Manage Users</p>
                <p className="text-[8px] text-slate-500 lowercase font-medium tracking-normal mt-1 italic">
                  View and moderate all network accounts
                </p>
              </div>
            </button>

            {/* MANAGE OWNERS */}
            <button
              onClick={() => navigate("/admin/owners")}
              className="bg-slate-50 hover:bg-slate-100 text-slate-900 px-8 py-8 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[10px] transition-all border border-slate-100 transform active:scale-[0.98] flex items-center gap-6 group"
            >
              <span className="text-2xl bg-white w-12 h-12 flex items-center justify-center rounded-xl shadow-sm">🧑‍💼</span>

              <div className="text-left">
                <p>Manage Owners</p>
                <p className="text-[8px] text-slate-400 lowercase font-medium tracking-normal mt-1 italic">
                  View and manage all parking owners
                </p>
              </div>
            </button>

            {/* PARKING LOTS */}
            <button
              onClick={() => navigate("/admin/parkinglots")}
              className="bg-slate-50 hover:bg-slate-100 text-slate-900 px-8 py-8 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[10px] transition-all border border-slate-100 transform active:scale-[0.98] flex items-center gap-6 group"
            >
              <span className="text-2xl bg-white w-12 h-12 flex items-center justify-center rounded-xl shadow-sm">🅿️</span>

              <div className="text-left">
                <p>Manage Parking Lots</p>
                <p className="text-[8px] text-slate-400 lowercase font-medium tracking-normal mt-1 italic">
                  Approve or remove registered locations
                </p>
              </div>
            </button>

            {/* SLOTS */}
            <button
              onClick={() => navigate("/admin/slots")}
              className="bg-slate-50 hover:bg-slate-100 text-slate-900 px-8 py-8 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[10px] transition-all border border-slate-100 transform active:scale-[0.98] flex items-center gap-6 group"
            >
              <span className="text-2xl bg-white w-12 h-12 flex items-center justify-center rounded-xl shadow-sm">🚗</span>

              <div className="text-left">
                <p>View Slots</p>
                <p className="text-[8px] text-slate-400 lowercase font-medium tracking-normal mt-1 italic">
                  Global inventory of all parking slots
                </p>
              </div>
            </button>

            {/* BOOKINGS */}
            <button
              onClick={() => navigate("/admin/bookings")}
              className="bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] px-8 py-8 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[10px] transition-all transform active:scale-[0.98] flex items-center gap-6 group"
            >
              <span className="text-2xl bg-white w-12 h-12 flex items-center justify-center rounded-xl shadow-sm">📅</span>

              <div className="text-left">
                <p>View Bookings</p>
                <p className="text-[8px] text-[#0369a1]/50 lowercase font-medium tracking-normal mt-1 italic">
                  Monitor live transactions and history
                </p>
              </div>
            </button>

          </div>
        </div>

        <footer className="mt-16 text-center">
          <p className="text-[8px] text-slate-300 font-black uppercase tracking-[1em]">
            Findpark Admin Core v2.0 • Security Level 4
          </p>
        </footer>

      </div>
    </div>
  );
}

export default AdminPage;