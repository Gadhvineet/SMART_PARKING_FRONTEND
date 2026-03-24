import React from "react";

function UserPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">

      {/* 🔹 MAIN CONTENT: Bento Layout */}
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        
        <header className="mb-10">
          <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900">User Dashboard</h2>
          <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Network Node: Active</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* 📊 DASHBOARD STATUS */}
          <div className="md:col-span-7 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-[10px] font-black text-sky-600 uppercase tracking-[0.4em] mb-6">Current Session</h2>
                
                <div className="space-y-6">
                    <div>
                       
                        <div>
  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Active Vehicle</p>
  <p className="text-3xl font-[1000] text-slate-900 tracking-tight">
    {user?.vehicle ? user.vehicle : "No vehicle added"}
  </p>
</div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Status</p>
                            <p className="text-lg font-bold text-slate-900">In-Session</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-slate-50 rounded-full blur-3xl"></div>
          </div>

          {/* ⚡ AVAILABLE ACTIONS */}
          <div className="md:col-span-5 flex flex-col gap-4">
            
            <button className="w-full bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] px-6 py-6 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[10px] shadow-sm transition-all transform active:scale-[0.98] text-left flex justify-between items-center group">
              Find New Parking
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white px-6 py-6 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[10px] shadow-sm transition-all transform active:scale-[0.98] text-left flex justify-between items-center group">
              View Vehicle List
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button className="w-full bg-white border border-slate-200 hover:border-sky-200 text-slate-900 px-6 py-6 rounded-2xl font-[1000] uppercase tracking-[0.2em] text-[10px] shadow-sm transition-all transform active:scale-[0.98] text-left flex justify-between items-center group">
              Transaction History
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>

          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[1em]">Findpark Secure Interface</p>
        </footer>
      </div>
    </div>
  );
}

export default UserPage;