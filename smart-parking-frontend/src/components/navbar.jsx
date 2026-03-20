import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="w-full bg-[#020617] border-b border-white/5 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#e0f2fe] rounded-xl flex items-center justify-center shadow-lg shadow-sky-900/20">
            <span className="text-[#0369a1] font-black text-xl">F</span>
          </div>
          <span className="text-white font-[1000] text-2xl tracking-tighter">Findpark</span>
        </div>

        {/* Horizontal Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Dashboard', 'Map', 'Vehicles', 'Billing'].map((item) => (
            <Link key={item} to="#" className="text-slate-400 hover:text-white font-bold text-sm uppercase tracking-widest transition-colors">
              {item}
            </Link>
          ))}
        </div>

        {/* User Profile / Status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-white text-xs font-black">ALEX RIVERA</p>
            <p className="text-[#0d9488] text-[9px] font-bold uppercase tracking-widest">Operator Active</p>
          </div>
          <div className="w-10 h-10 bg-slate-800 rounded-full border-2 border-white/10 overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="avatar" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;