import React from "react";

function OwnerPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">

      {/* 🔹 MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-6 md:p-12">
        
        <header className="mb-10">
          <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900">Owner Dashboard</h2>
          <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">
            Management Mode: <span className="text-emerald-500 font-bold underline underline-offset-4">Active</span>
          </p>
        </header>

        {/* 📊 DASHBOARD STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Parking Lots</p>
            <p className="text-4xl font-[1000] text-slate-900">0</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Slots</p>
            <p className="text-4xl font-[1000] text-slate-900">0</p>
          </div>
          <div className="bg-[#e0f2fe] p-8 rounded-[2.5rem] shadow-sm border border-sky-100">
            <p className="text-[#0369a1] text-[10px] font-black uppercase tracking-widest mb-1">Active Bookings</p>
            <p className="text-4xl font-[1000] text-[#0369a1]">0</p>
          </div>
        </div>

        {/* ⚡ OWNER ACTIONS */}
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">System Operations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <button className="bg-slate-900 hover:bg-black text-white px-6 py-10 rounded-3xl font-[1000] uppercase tracking-[0.2em] text-[10px] transition-all transform active:scale-[0.97] flex flex-col justify-between items-start gap-4">
              <span className="text-2xl">➕</span>
              Add Parking Lot
            </button>

            <button className="bg-slate-50 hover:bg-slate-100 text-slate-900 px-6 py-10 rounded-3xl font-[1000] uppercase tracking-[0.2em] text-[10px] transition-all border border-slate-100 transform active:scale-[0.97] flex flex-col justify-between items-start gap-4">
              <span className="text-2xl">📍</span>
              Manage Parking Lots
            </button>

            <button className="bg-slate-50 hover:bg-slate-100 text-slate-900 px-6 py-10 rounded-3xl font-[1000] uppercase tracking-[0.2em] text-[10px] transition-all border border-slate-100 transform active:scale-[0.97] flex flex-col justify-between items-start gap-4">
              <span className="text-2xl">🚗</span>
              Manage Slots
            </button>

            <button className="bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] px-6 py-10 rounded-3xl font-[1000] uppercase tracking-[0.2em] text-[10px] transition-all transform active:scale-[0.97] flex flex-col justify-between items-start gap-4">
              <span className="text-2xl">📅</span>
              View Bookings
            </button>

          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
            <p className="text-[8px] text-slate-300 font-black uppercase tracking-[1em]">Findpark Property Management v2.0</p>
        </footer>
      </div>
    </div>
  );
}

export default OwnerPage;