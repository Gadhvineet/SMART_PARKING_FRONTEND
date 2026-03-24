import { useState } from "react";
import { loginUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData);

      const user = res.user;

      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);

      if (user.role === "user") navigate("/user");
      else if (user.role === "owner") navigate("/owner");
      else if (user.role === "admin") navigate("/admin");

    } catch (error) {
      console.log(error);
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] p-6 font-sans">
      
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-14">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm font-medium">Please enter your credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="name@email.com" 
              onChange={handleChange} 
              required
              className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4.5 text-black placeholder:text-slate-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all font-bold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••" 
              onChange={handleChange} 
              required
              className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4.5 text-black placeholder:text-slate-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all font-bold"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] font-[1000] py-6 rounded-2xl transition-all transform active:scale-[0.97] mt-6 uppercase tracking-[0.3em] text-xs shadow-xl shadow-sky-900/10"
          >
            Login
          </button>

          {/* ✅ ADDED THIS BLOCK */}
          <div className="text-center mt-2">
            <p className="text-xs text-slate-500">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-[#0369a1] font-bold cursor-pointer hover:underline"
              >
                Create one
              </span>
            </p>
          </div>

        </form>

        <div className="mt-12 text-center">
          <p className="text-[8px] text-slate-300 font-black uppercase tracking-[1em] opacity-50">
            Findpark Secure
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;