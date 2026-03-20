import { useState } from "react";
import { registerUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      await registerUser(formData);
      alert("Findpark Account Created.");
      navigate("/login");
    } catch (error) {
      alert("Registration failed.");
    }
  };

  return (
    /* WEB BACKGROUND: Darker Midnight Blue Vibe */
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] p-6 font-sans">
      
      {/* CENTERED CARD: Focused & Minimal */}
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] border border-white/5 overflow-hidden">
        
        <div className="p-10 md:p-14 flex flex-col">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <div className="flex justify-center items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
              <span className="font-black text-slate-900 uppercase tracking-[0.4em] text-[10px]">Findpark OS</span>
            </div>
            <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter mb-2">
              Create Account
            </h1>
            <p className="text-slate-500 text-sm font-medium italic">Initialize your credentials for the grid.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input fields now with Dark Black Text for clarity */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" name="name" placeholder="e.g. Alex Rivera" onChange={handleChange} required
                className="w-full bg-slate-100 border border-transparent rounded-2xl px-6 py-4.5 text-black placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-200 outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Email</label>
              <input 
                type="email" name="email" placeholder="name@gmail.com" onChange={handleChange} required
                className="w-full bg-slate-100 border border-transparent rounded-2xl px-6 py-4.5 text-black placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-200 outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" name="password" placeholder="••••••••" onChange={handleChange} required
                className="w-full bg-slate-100 border border-transparent rounded-2xl px-6 py-4.5 text-black placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-200 outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Confirm Password</label>
              <input 
                type="password" name="confirmPassword" placeholder="••••••••" onChange={handleChange} required
                className="w-full bg-slate-100 border border-transparent rounded-2xl px-6 py-4.5 text-black placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-200 outline-none transition-all font-bold"
              />
            </div>
            
            {/* Vertically Taller "Join" Button in Lightest Blue */}
            <button 
              type="submit" 
              className="w-full bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] font-[1000] py-6 rounded-2xl transition-all transform active:scale-[0.97] mt-10 uppercase tracking-[0.3em] text-xs shadow-xl shadow-sky-900/10"
            >
              Join
            </button>
          </form>

          {/* Bottom Branding / No Redirect Link per request */}
          <div className="mt-12 text-center">
            <div className="text-[8px] text-slate-300 font-black uppercase tracking-[1em] opacity-50">
              Secure Interface Terminal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;