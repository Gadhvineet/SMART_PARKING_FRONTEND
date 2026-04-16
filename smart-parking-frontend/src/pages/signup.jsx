import { useState } from "react";
import { registerUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    role: "user"   
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend Validation
    if (!formData.name || formData.name.trim() === "") {
      alert("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!formData.password || formData.password.length < 5) {
      alert("Password must be at least 5 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      await registerUser(dataToSend);
      alert("Account Created");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup Error");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] p-6 font-sans relative overflow-hidden">
      
      {/* AMBIENT VISUAL LAYER */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#075985_0%,_transparent_70%)] opacity-40 pointer-events-none" />
      <div 
        className="absolute bottom-0 w-full h-[50vh] opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          transform: 'perspective(1000px) rotateX(60deg)',
          maskImage: 'linear-gradient(to top, black, transparent)'
        }}
      />
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-sky-600/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />

      {/* SIGNUP CARD */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] shadow-2xl p-8 md:p-10">
        
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-black text-white tracking-tighter">
            Create Account
          </h1>
          <p className="text-slate-400 text-xs mt-2 font-medium tracking-widest uppercase">Join the Findpark network</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            onChange={handleChange} 
            required 
            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:border-sky-500 outline-none font-bold transition-all"
          />

          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            required 
            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:border-sky-500 outline-none font-bold transition-all"
          />

          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:border-sky-500 outline-none font-bold transition-all"
          />

          <input 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirm Password" 
            onChange={handleChange} 
            required 
            className="w-full bg-slate-950/50 border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:border-sky-500 outline-none font-bold transition-all"
          />

          <div className="flex flex-col gap-1 px-1 mt-1">
            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Account Type</label>
            <select 
              name="role" 
              onChange={handleChange}
              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-2xl px-6 py-4 text-white focus:border-sky-500 outline-none font-bold appearance-none cursor-pointer"
            >
              <option value="user" className="bg-slate-900">User</option>
              <option value="owner" className="bg-slate-900">Parking Owner</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#e0f2fe] hover:bg-white text-[#0369a1] font-black py-5 rounded-2xl transition-all transform active:scale-[0.98] mt-4 uppercase tracking-[0.2em] text-xs shadow-lg shadow-sky-500/10"
          >
            Join
          </button>

          <div className="text-center mt-4">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-sky-400 font-bold cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Signup;