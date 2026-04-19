import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getOwnerAnalytics } from "../services/ownerServices";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

function OwnerPage() {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [totalLots, setTotalLots] = useState(0);
  const [totalSlots, setTotalSlots] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);

  // ANALYTICS STATES
  const [analytics, setAnalytics] = useState({
    totalRevenue: "0.00",
    totalBookings: 0,
    trendData: [],
    lotData: []
  });

  const SERVER_URL = "http://localhost:5000";

  // FETCH OWNER PARKING LOTS (Kept for basic lot counts)
  const fetchParkingLots = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/parkinglots/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const lots = res.data.parkingLots || [];
      setTotalLots(lots.length);
      
      let slotSum = 0;
      lots.forEach((lot) => { slotSum += lot.totalSlots; });
      setTotalSlots(slotSum);

    } catch (error) {
      console.error("Error fetching parking lots:", error);
    }
  };

  // FETCH ANALYTICS (Revenue, Trends, etc.)
  const fetchAnalytics = async () => {
    try {
      const data = await getOwnerAnalytics();
      setAnalytics(data);
      // We can also set active bookings from this data if we had it, but mostly we use the dedicated active endpoint or just rely on total bookings
      // For now, let's keep totalBookings as a separate stat
      setActiveBookings(data.totalBookings); 
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchParkingLots();
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto p-6 md:p-12">

        <header className="mb-10">
          <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900">
            Analytics Overview
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Manage your parking enterprise</p>
        </header>

        {/* DASHBOARD STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-[#e0f2fe] p-8 rounded-[2.5rem] shadow-sm border border-sky-100">
            <p className="text-[#0369a1] text-[10px] font-black uppercase tracking-widest mb-1">
              Total Revenue
            </p>
            <p className="text-4xl font-[1000] text-[#0369a1]">
              ₹{analytics.totalRevenue}
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
              Total Bookings
            </p>
            <p className="text-4xl font-[1000] text-slate-900">
              {analytics.totalBookings}
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
              Total Parking Lots
            </p>
            <p className="text-4xl font-[1000] text-slate-900">
              {totalLots}
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
              Total Slots
            </p>
            <p className="text-4xl font-[1000] text-slate-900">
              {totalSlots}
            </p>
          </div>

        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* MONTHLY TRENDS CHART */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <h3 className="font-[1000] text-lg text-slate-900 mb-6">Revenue Trends</h3>
              <div className="w-full h-[300px]">
                {analytics.trendData && analytics.trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dx={-10} tickFormatter={(val) => `₹${val}`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                        itemStyle={{ color: '#0ea5e9' }}
                        formatter={(value) => [`₹${value}`, "Revenue"]}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={4} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 8}} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <p className="text-xs uppercase font-bold tracking-widest">No Trend Data Yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* TOP PERFORMING LOTS CHART */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <h3 className="font-[1000] text-lg text-slate-900 mb-6">Top Performing Lots</h3>
              <div className="w-full h-[300px]">
                {analytics.lotData && analytics.lotData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.lotData} layout="vertical" margin={{top: 0, right: 30, left: 20, bottom: 0}}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 800}} width={80} />
                      <Tooltip 
                         contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                         itemStyle={{ color: '#0ea5e9' }}
                         cursor={{fill: '#f8fafc'}}
                         formatter={(value) => [`₹${value}`, "Revenue"]}
                      />
                      <Bar dataKey="revenue" fill="#0ea5e9" radius={[0, 8, 8, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                     <p className="text-xs uppercase font-bold tracking-widest">No Data Yet</p>
                  </div>
                )}
              </div>
            </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100">
          <h3 className="font-[1000] text-lg text-slate-400 uppercase tracking-widest text-[10px] mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <button
              onClick={() => navigate("/owner/add-parking")}
              className="bg-slate-900 hover:bg-black text-white px-6 py-6 rounded-3xl font-[1000] uppercase tracking-[0.2em] text-[10px] transition-all"
            >
              <span className="text-xl block mb-2">➕</span> Add Parking Lot
            </button>

            <button
              onClick={() => navigate("/owner/parkinglots")}
              className="bg-slate-50 hover:bg-slate-100 text-slate-900 px-6 py-6 rounded-3xl border transition-all uppercase tracking-widest text-[10px] font-bold"
            >
              <span className="text-xl block mb-2">📍</span> Manage Lots
            </button>

            <button
              onClick={() => navigate("/owner/bookings")}
              className="bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] px-6 py-6 rounded-3xl transition-all uppercase tracking-widest text-[10px] font-bold"
            >
              <span className="text-xl block mb-2">📅</span> View Bookings
            </button>

            <button
              onClick={() => navigate("/owner/reviews")}
              className="bg-[#fef3c7] hover:bg-[#fde68a] text-[#92400e] px-6 py-6 rounded-3xl transition-all uppercase tracking-widest text-[10px] font-bold"
            >
              <span className="text-xl block mb-2">⭐</span> View Reviews
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default OwnerPage;