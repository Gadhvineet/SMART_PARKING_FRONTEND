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

      // role based redirect
      const user = res.user;

      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);

      if (user.role === "user") navigate("/user");
      else if (user.role === "owner") navigate("/owner");
      else if (user.role === "admin") navigate("/admin");

    } catch (error) {
      console.log(error);
      
      console.log("FULL ERROR:", error.response?.data);
      alert(error.response?.data?.message || "Login Failed");
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
          backgroundSize: "60px 60px",
          transform: "perspective(1000px) rotateX(60deg)",
          maskImage: "linear-gradient(to top, black, transparent)"
        }}
      />

      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] shadow-2xl p-10 md:p-14">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-[1000] text-white tracking-tighter mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">
            Please enter your credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1">
              Email
            </label>
            <input 
              type="email"
              name="email"
              placeholder="name@email.com"
              onChange={handleChange}
              required
              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-2xl px-6 py-4.5 text-white placeholder:text-slate-600 focus:border-sky-500 outline-none transition-all font-bold"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest ml-1">
              Password
            </label>
            <input 
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-2xl px-6 py-4.5 text-white placeholder:text-slate-600 focus:border-sky-500 outline-none transition-all font-bold"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#e0f2fe] hover:bg-white text-[#0369a1] font-[1000] py-6 rounded-2xl transition-all transform active:scale-[0.97] mt-6 uppercase tracking-[0.3em] text-xs shadow-xl shadow-sky-500/10"
          >
            Login
          </button>

          <div className="text-center mt-4">
            <p className="text-xs text-slate-500">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-sky-400 font-bold cursor-pointer hover:underline"
              >
                Create one
              </span>
            </p>
          </div>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[8px] text-slate-500 font-black uppercase tracking-[1em] opacity-50">
            Findpark Secure
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;