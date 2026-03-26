import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center items-center text-white font-sans selection:bg-sky-500/30 overflow-hidden relative">
      
      {/* --- AMBIENT VISUAL LAYER --- */}
      {/* 1. Main Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#075985_0%,_transparent_70%)] opacity-40 pointer-events-none" />
      
      {/* 2. Perspective Grid Floor (The "Urban" feel) */}
      <div 
        className="absolute bottom-0 w-full h-[50vh] opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          transform: 'perspective(1000px) rotateX(60deg)',
          maskImage: 'linear-gradient(to top, black, transparent)'
        }}
      />

      {/* 3. Floating Ambient Orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-sky-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 flex flex-col items-center px-6">
        {/* LOGO / TITLE */}
        <div className="mb-4 group">
           <span className="text-[10px] font-bold tracking-[0.5em] text-sky-400/80 uppercase px-3 py-1 border border-sky-400/20 rounded-full bg-sky-400/5 backdrop-blur-sm">
            Find Your Safe Spot
           </span>
        </div>
        
        <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500 drop-shadow-2xl">
          FindPark
        </h1>

        {/* DESCRIPTION */}
        <p className="text-slate-400 mb-12 text-center max-w-sm text-lg leading-relaxed font-light">
          Experience <span className="text-sky-400 font-normal italic">seamless</span> navigation. 
          A minimalist gateway to smart, secure, and instant parking solutions.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <button
            onClick={() => navigate("/login")}
            className="group relative bg-[#e0f2fe] text-[#0369a1] px-12 py-4 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] transition-all duration-500 hover:bg-white hover:shadow-[0_0_40px_rgba(186,230,253,0.4)] hover:-translate-y-1 active:scale-95"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="group relative border border-slate-700/50 bg-slate-900/30 backdrop-blur-xl text-white px-12 py-4 rounded-2xl font-bold uppercase text-xs tracking-[0.2em] transition-all duration-500 hover:bg-slate-800 hover:border-slate-500 hover:-translate-y-1 active:scale-95"
          >
            Signup
          </button>
        </div>

        {/* FOOTER HINT */}
        <div className="mt-24 flex flex-col items-center gap-2 opacity-30">
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-slate-500" />
            <p className="text-[10px] tracking-[0.6em] uppercase font-medium">Est. 2026</p>
        </div>
      </div>
    </div>
  );
}

export default Home;