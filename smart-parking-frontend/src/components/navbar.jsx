import React, { useEffect, useState, useRef } from "react";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../services/notificationServices";

function Navbar() {

  const [user,setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(()=>{
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    
    if (storedUser) {
      fetchNotifications();
    }
  },[]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifRef]);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.notifications || []);
    } catch (err) {
      console.log("Failed to fetch notifications");
    }
  };

  const handleRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      // Locally update
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {

    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if(confirmLogout){

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href="/login";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (

    <div className="w-full bg-[#020617] text-white px-6 py-4 flex justify-between items-center relative">

      <h1
        className="font-bold text-lg cursor-pointer flex items-center gap-2"
        onClick={()=>window.location.href="/user"}
      >
        <span className="text-xl">🅿️</span>
        <span className="tracking-widest uppercase font-black text-[15px]">FindPark</span>
      </h1>

      <div className="flex gap-6 items-center">
        
        {/* NOTIFICATION BELL */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <span className="text-xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#020617]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* DROPDOWN POPOVER */}
          {showNotifications && (
            <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200 text-slate-800">
              
              <div className="bg-slate-50 px-4 py-3 flex justify-between items-center border-b border-slate-200">
                <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleReadAll} className="text-xs text-sky-600 font-bold hover:underline">
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-500 font-medium tracking-wide">
                    You have no notifications yet.
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif._id} 
                      onClick={() => !notif.read && handleRead(notif._id)}
                      className={`px-4 py-4 border-b border-slate-100 last:border-0 cursor-pointer transition-colors
                        ${!notif.read ? "bg-sky-50/50 hover:bg-sky-50" : "bg-white hover:bg-slate-50 opacity-70"}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg mt-0.5">
                          {notif.type === "success" ? "✅" : notif.type === "warning" ? "⚠️" : "💬"}
                        </span>
                        <div>
                          <p className={`text-[13px] tracking-wide ${!notif.read ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                            {notif.title}
                          </p>
                          <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-wider">
                            {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
            </div>
          )}
        </div>

        <span
          className="cursor-pointer font-bold text-sm tracking-wide text-slate-300 hover:text-white transition-colors"
          onClick={()=>window.location.href="/profile"}
        >
          {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg transition-all"
        >
          Logout
        </button>

      </div>

    </div>

  );

}

export default Navbar;