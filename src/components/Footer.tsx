import React from 'react';
import { Film, ShieldCheck, MapPin, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenMyBookings: () => void;
  onSelectCity: (city: string) => void;
  cities: string[];
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenMyBookings,
  onSelectCity,
  cities,
}) => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-lg font-black font-mono tracking-wider text-white">
                I<span className="text-red-500">MOVIES</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The premier cinema ticketing platform with real-time seat tracking, IMAX 70mm & Dolby Atmos schedules, and gourmet in-seat confectionery dining.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Cinema Experience
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><button onClick={onOpenMyBookings} className="hover:text-white transition-colors">My Digital Tickets</button></li>
              <li><a href="#movies" className="hover:text-white transition-colors">Now Showing</a></li>
              <li><a href="#movies" className="hover:text-white transition-colors">Advance Booking</a></li>
              <li><button onClick={onOpenAdmin} className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">Admin Operations</button></li>
            </ul>
          </div>

          {/* Popular Cities */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Multiplex Cities
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => onSelectCity(city)}
                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] transition-colors border border-slate-850"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Formats & Tech */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Certified Formats
            </h5>
            <div className="space-y-1 text-xs text-slate-400">
              <p>• IMAX with Laser 4K Dual</p>
              <p>• Dolby Atmos 64-Channel Spatial</p>
              <p>• 4DX Environmental Motion Simulation</p>
              <p>• VIP Recliner Luxury Suites</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 IMovies Cinema Systems. MERN Stack Architecture.</p>
          <div className="flex items-center gap-4">
            <span>PCI-DSS Secured</span>
            <span>·</span>
            <span>Real-Time Seat Locks</span>
            <span>·</span>
            <span>256-bit Encryption</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
