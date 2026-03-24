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
      alert("Signup Error");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] p-6 font-sans">
      
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-12">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Join the Findpark network</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            onChange={handleChange} 
            required 
            className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 text-black placeholder:text-slate-400 focus:ring-2 focus:ring-sky-200 outline-none font-bold"
          />

          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            required 
            className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 text-black placeholder:text-slate-400 focus:ring-2 focus:ring-sky-200 outline-none font-bold"
          />

          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
            className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 text-black placeholder:text-slate-400 focus:ring-2 focus:ring-sky-200 outline-none font-bold"
          />

          <input 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirm Password" 
            onChange={handleChange} 
            required 
            className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 text-black placeholder:text-slate-400 focus:ring-2 focus:ring-sky-200 outline-none font-bold"
          />

          <div className="flex flex-col gap-1 px-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Type</label>
            <select 
              name="role" 
              onChange={handleChange}
              className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 text-black focus:ring-2 focus:ring-sky-200 outline-none font-bold appearance-none cursor-pointer"
            >
              <option value="user">User</option>
              <option value="owner">Parking Owner</option>
            </select>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] font-black py-5 rounded-2xl transition-all transform active:scale-[0.98] mt-4 uppercase tracking-[0.2em] text-xs"
          >
            Join
          </button>

          {/* ✅ ADDED THIS BLOCK */}
          <div className="text-center mt-2">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#0369a1] font-bold cursor-pointer hover:underline"
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