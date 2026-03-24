import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">

      {/* ✅ ADDED NAVBAR */}
      <div className="w-full bg-[#020617] text-white px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">FindPark</h1>

        <div className="flex gap-4 items-center">
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-[#e0f2fe] text-[#0369a1] px-4 py-2 rounded font-bold text-xs uppercase"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="bg-[#e0f2fe] text-[#0369a1] px-4 py-2 rounded font-bold text-xs uppercase"
              >
                Signup
              </button>
            </>
          ) : (
            <span className="text-sm">Welcome, {user.name}</span>
          )}
        </div>
      </div>

      {/* 🔹 MAIN CONTENT */}
      <div className="max-w-6xl mx-auto p-6 md:p-12">

        {/* HEADER */}
        <header className="mb-10">
          <h2 className="text-4xl font-[1000] tracking-tighter">
            Welcome, {user?.name || "Operator"}
          </h2>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest">
            Smart Parking Dashboard
          </p>
        </header>

        {/* 📊 DASHBOARD STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
              Active Vehicle
            </p>
            <p className="text-3xl font-[1000] text-slate-900">
              Fortuner
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
              Current Status
            </p>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-lg font-bold text-slate-900">
                In-Session
              </p>
            </div>
          </div>

        </div>

        {/* ⚡ ACTIONS */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">
            Available Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <button className="bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] px-6 py-6 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[10px] transition-all">
              Find Parking
            </button>

            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-6 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[10px] transition-all">
              Vehicles
            </button>

            <button className="bg-white border border-slate-200 hover:border-sky-200 text-slate-900 px-6 py-6 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[10px] transition-all">
              History
            </button>

          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-16 text-center">
          <p className="text-[9px] text-slate-300 font-black uppercase tracking-[1em]">
            Findpark Unified Interface
          </p>
        </footer>

      </div>
    </div>
  );
}

export default Home;