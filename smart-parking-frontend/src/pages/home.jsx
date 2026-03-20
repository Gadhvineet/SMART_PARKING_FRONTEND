import Navbar from "../components/navbar";

function Home() {
  return (
    <div className="min-h-screen bg-[#020617] font-sans text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        
        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 1. MAIN HERO: THE VEHICLE (Takes up 8 columns) */}
          <div className="lg:col-span-8 bg-white rounded-[3rem] p-8 md:p-12 overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
            
            {/* Header info inside the card - using Black text for high contrast */}
            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="bg-[#e0f2fe] text-[#0369a1] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">In-Session</span>
                <h2 className="text-4xl font-[1000] text-slate-900 tracking-tighter mt-4">Tesla Model 3</h2>
                <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Downtown Plaza • Slot B-12</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Time Remaining</p>
                <p className="text-3xl font-black text-slate-900 font-mono italic tracking-tighter">02:45:12</p>
              </div>
            </div>

            {/* CAR IMAGE CENTER (Add your car image here) */}
            <div className="relative py-12 flex items-center justify-center">
              {/* Decorative Glow */}
              <div className="absolute w-[80%] h-[80%] bg-sky-100 rounded-full blur-[80px] opacity-50"></div>
              
              {/* Replace the text below with your <img src="car.png" /> */}
              <div className="relative z-10 h-64 w-full flex items-center justify-center">
                 <p className="text-slate-100 font-[1000] text-[120px] italic select-none opacity-40">CAR_IMAGE</p>
                 {/* <img src="/path-to-your-car.png" className="absolute w-full max-w-lg object-contain drop-shadow-2xl" alt="car" /> */}
              </div>
            </div>

            {/* ACTION BUTTON: Using your signature tall Arctic Blue button */}
            <div className="relative z-10">
              <button className="w-full bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] font-[1000] py-6 rounded-2xl transition-all transform active:scale-[0.98] uppercase tracking-[0.4em] text-xs shadow-xl shadow-sky-900/10">
                Manage Parking Session
              </button>
            </div>
          </div>

          {/* 2. SIDE STATS (Takes up 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Wallet Card */}
            <div className="bg-[#e0f2fe] rounded-[3rem] p-10 flex flex-col justify-between h-1/2 shadow-xl shadow-sky-900/20">
              <div>
                <p className="text-[#0369a1] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Available Balance</p>
                <h3 className="text-5xl font-[1000] text-[#0369a1] tracking-tighter">$142.50</h3>
              </div>
              <button className="w-full bg-[#0369a1] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest mt-6">
                Quick Top-Up
              </button>
            </div>

            {/* Nearby Availability (Dark Card) */}
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 h-1/2 flex flex-col justify-between">
              <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Nearby Network</p>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">Oak Terminal</span>
                    <span className="text-sky-400 font-black">4 Free</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">Central Mall</span>
                    <span className="text-rose-400 font-black">Full</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.4em]">Last Updated: Just Now</p>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION: Activity Log */}
        <div className="mt-10 bg-white/5 border border-white/10 rounded-[2rem] p-8">
           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4">Recent Network Activity</h4>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <p className="text-xs text-slate-400 font-medium tracking-tight border-l border-sky-500/30 pl-4">10:04 — Autopay Successful for Slot B-12</p>
              <p className="text-xs text-slate-400 font-medium tracking-tight border-l border-white/10 pl-4">09:55 — Operator Login from New Device</p>
              <p className="text-xs text-slate-400 font-medium tracking-tight border-l border-white/10 pl-4">08:20 — Session Started at Downtown Plaza</p>
           </div>
        </div>

      </main>
    </div>
  );
}

export default Home;