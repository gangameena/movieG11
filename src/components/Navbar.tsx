import React, { useState } from 'react';
import {
  Film,
  MapPin,
  Search,
  Bell,
  Ticket,
  User as UserIcon,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { User, NotificationItem } from '../types';

interface NavbarProps {
  currentUser: User | null;
  selectedCity: string;
  cities: string[];
  notifications: NotificationItem[];
  bookingCount: number;
  onSelectCity: (city: string) => void;
  onOpenAuth: () => void;
  onOpenMyBookings: () => void;
  onOpenAdmin: () => void;
  onOpenNotifications: () => void;
  onSwitchRole: (role: 'user' | 'admin') => void;
  onLogout: () => void;
  onSearchChange: (search: string) => void;
  searchQuery: string;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  selectedCity,
  cities,
  notifications,
  bookingCount,
  onSelectCity,
  onOpenAuth,
  onOpenMyBookings,
  onOpenAdmin,
  onOpenNotifications,
  onSwitchRole,
  onLogout,
  onSearchChange,
  searchQuery,
  onNavigateHome,
}) => {
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-wider text-white flex items-center gap-1.5 font-mono">
                  I<span className="text-red-500">MOVIES</span>
                  <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">
                    CinePrime
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:block tracking-tight">
                  Seamless Cinema & Real-Time Booking
                </span>
              </div>
            </button>

            {/* City Selector */}
            <div className="relative">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
                title="Select City"
              >
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span className="max-w-[100px] truncate">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {cityDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setCityDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-20 py-1 overflow-hidden">
                    <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-800">
                      Popular Cities
                    </div>
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          onSelectCity(city);
                          setCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                          selectedCity === city
                            ? 'text-red-400 bg-red-500/10 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span>{city}</span>
                        {selectedCity === city && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search movies, theatres, genres, actors..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900/90 text-sm text-slate-100 placeholder:text-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500/70 focus:ring-1 focus:ring-red-500/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Admin Console Quick Button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all shadow-sm"
              title="Admin Cinema Management"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin Panel</span>
            </button>

            {/* My Bookings */}
            <button
              onClick={onOpenMyBookings}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="My Cinema Bookings"
            >
              <Ticket className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">My Bookings</span>
              {bookingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-red-600 text-[10px] font-bold text-white rounded-full">
                  {bookingCount}
                </span>
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-lg object-cover ring-1 ring-slate-700"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-200 leading-none">
                      {currentUser.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                      {currentUser.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-20 py-2 divide-y divide-slate-800">
                      <div className="px-3 py-2">
                        <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            currentUser.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            Role: {currentUser.role}
                          </span>
                        </div>
                      </div>

                      {/* Role switcher toggle for testing role-based security */}
                      <div className="px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">
                          Switch Role (RBAC Demo)
                        </p>
                        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg">
                          <button
                            onClick={() => {
                              onSwitchRole('user');
                              setUserDropdownOpen(false);
                            }}
                            className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                              currentUser.role === 'user'
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            User
                          </button>
                          <button
                            onClick={() => {
                              onSwitchRole('admin');
                              setUserDropdownOpen(false);
                            }}
                            className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                              currentUser.role === 'admin'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Admin
                          </button>
                        </div>
                      </div>

                      <div className="px-1 py-1">
                        <button
                          onClick={() => {
                            onOpenMyBookings();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                        >
                          <Ticket className="w-3.5 h-3.5 text-red-400" />
                          My Bookings & Tickets
                        </button>
                        <button
                          onClick={() => {
                            onLogout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-md shadow-red-600/30 transition-all"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Search */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search movies, theatres, genres..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 text-xs text-slate-100 placeholder:text-slate-500 rounded-lg border border-slate-800 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
