import { useState } from "react";
import { loginUser } from "../services/authServices";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "" 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      // Keeping your existing naming conventions for storage
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      
      alert("System Access Granted.");
      navigate("/"); 
    } catch (error) {
      alert(error.response?.data?.message || "Auth Failure: Check Credentials");
    }
  };

  return (
    /* WEB BACKGROUND: Deep Midnight Blue */
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] p-6 font-sans relative overflow-hidden">
      
      {/* Decorative Glow (Makes it "Attractively Good") */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* CENTERED CARD */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] border border-white/5 overflow-hidden">
        
        <div className="p-10 md:p-14 flex flex-col">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <div className="flex justify-center items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#e0f2fe] rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-[#0369a1] font-black text-xl">F</span>
              </div>
            </div>
            <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm font-medium italic">Authorize to access the Findpark grid.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input fields with Bold Black Text */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="example@gmail.com" 
                onChange={handleChange} 
                required
                className="w-full bg-slate-100 border border-transparent rounded-2xl px-6 py-4.5 text-black placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-200 outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-bold text-sky-600 hover:underline">Forgot?</button>
              </div>
              <input 
                type="password" 
                name="password" 
                placeholder="••••••••••••" 
                onChange={handleChange} 
                required
                className="w-full bg-slate-100 border border-transparent rounded-2xl px-6 py-4.5 text-black placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:border-sky-200 outline-none transition-all font-bold"
              />
            </div>

            <div className="flex items-center gap-2 px-1 py-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
              <label htmlFor="remember" className="text-xs font-bold text-slate-600">Keep me logged in</label>
            </div>
            
            {/* Signature Tall Arctic Blue Button */}
            <button 
              type="submit" 
              className="w-full bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] font-[1000] py-6 rounded-2xl transition-all transform active:scale-[0.97] mt-6 uppercase tracking-[0.3em] text-xs shadow-xl shadow-sky-900/10"
            >
              Login
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-10 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              New to the grid? {" "}
              <Link to="/signup" className="text-sky-600 hover:text-sky-700 underline underline-offset-4">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Background Utility Metadata */}
      <div className="absolute bottom-10 text-[8px] text-slate-500 font-black uppercase tracking-[1em] opacity-30 text-center w-full select-none">
        Findpark Secure Node v2.0
      </div>
    </div>
  );
}

export default Login;