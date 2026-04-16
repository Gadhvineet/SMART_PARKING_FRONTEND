import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile, changePassword } from "../services/userServices";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  
  // Profile update states
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch latest profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        if (res.user) {
          setUser(res.user);
          setName(res.user.name);
          setEmail(res.user.email);
          localStorage.setItem("user", JSON.stringify(res.user));
        }
      } catch (err) {
        console.log("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const res = await updateUserProfile({ name, email });
      alert("Profile updated successfully");
      
      const updatedUser = { ...user, name: res.user.name, email: res.user.email };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update local state to match DB
      setName(res.user.name);
      setEmail(res.user.email);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    if (newPassword.length < 5) {
      alert("New password must be at least 5 characters long");
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword({ currentPassword, newPassword });
      
      alert("Password changed successfully! Please login again with your new password.");
      
      // Logout and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
      
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Navigate back to appropriate dashboard based on role
  const handleGoBack = () => {
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "owner") navigate("/owner");
    else navigate("/user");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={handleGoBack}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-[1000] tracking-tighter text-slate-900">
              Account Settings
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">
              Manage your profile and security
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* PROFILE CARD */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-fit">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-sky-500/20">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-slate-500">{email}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">
                Personal Information
              </h3>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-sky-500 focus:bg-white outline-none transition-all font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-sky-500 focus:bg-white outline-none transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all transform active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUpdatingProfile ? "Updating..." : "Save Profile Changes"}
              </button>
            </form>
          </div>

          {/* PASSWORD CARD */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-fit">
            <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Ensure your account is using a long, random password to stay secure.
                </p>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-sky-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-sky-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 align-baseline">
                <label className="text-xs font-bold text-slate-700 ml-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full bg-[#f8fafc] border rounded-xl px-4 py-3 text-slate-900 focus:bg-white outline-none transition-all ${
                    confirmPassword && newPassword !== confirmPassword 
                      ? "border-red-300 focus:border-red-500" 
                      : "border-slate-200 focus:border-sky-500"
                  }`}
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <span className="text-xs text-red-500 font-medium ml-1">Passwords do not match</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isChangingPassword || (confirmPassword && newPassword !== confirmPassword)}
                className="w-full bg-[#e0f2fe] text-[#0369a1] hover:bg-[#bae6fd] font-bold py-3.5 rounded-xl transition-all transform active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;