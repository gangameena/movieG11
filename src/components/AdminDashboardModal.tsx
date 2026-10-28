import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Film,
  Calendar,
  Layers,
  BarChart3,
  Plus,
  Trash2,
  Edit3,
  TrendingUp,
  DollarSign,
  Ticket,
  Users,
  Search,
  CheckCircle,
  Eye,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  Movie,
  Theatre,
  Show,
  Booking,
  User,
  MovieCertification,
  MovieFormat,
} from '../types';

interface AdminDashboardModalProps {
  currentUser: User | null;
  movies: Movie[];
  theatres: Theatre[];
  shows: Show[];
  bookings: Booking[];
  stats: {
    totalRevenue: number;
    totalTicketsSold: number;
    totalBookings: number;
    activeShowsCount: number;
    occupancyRate: number;
    activeMoviesCount: number;
  };
  onClose: () => void;
  onAddMovie: (movieData: any) => void;
  onDeleteMovie: (movieId: string) => void;
  onAddShow: (showData: any) => void;
  onAddTheatre: (theatreData: any) => void;
  onCancelBooking: (bookingId: string) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  currentUser,
  movies,
  theatres,
  shows,
  bookings,
  stats,
  onClose,
  onAddMovie,
  onDeleteMovie,
  onAddShow,
  onAddTheatre,
  onCancelBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'movies' | 'shows' | 'theatres' | 'bookings' | 'heatmap'>('analytics');
  
  // Add Movie Form State
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [movieTitle, setMovieTitle] = useState('');
  const [movieSynopsis, setMovieSynopsis] = useState('');
  const [moviePoster, setMoviePoster] = useState('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80');
  const [movieBackdrop, setMovieBackdrop] = useState('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80');
  const [movieGenres, setMovieGenres] = useState('Action, Sci-Fi');
  const [movieDirector, setMovieDirector] = useState('Christopher Nolan');
  const [movieDuration, setMovieDuration] = useState('145');
  const [movieCert, setMovieCert] = useState<MovieCertification>('PG-13');
  const [movieStatus, setMovieStatus] = useState<'now_showing' | 'coming_soon'>('now_showing');

  // Add Show Form State
  const [showAddShow, setShowAddShow] = useState(false);
  const [showMovieId, setShowMovieId] = useState(movies[0]?.id || '');
  const [showTheatreId, setShowTheatreId] = useState(theatres[0]?.id || '');
  const [showDate, setShowDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTime, setShowTime] = useState('19:45');
  const [showFormat, setShowFormat] = useState<MovieFormat>('IMAX 3D');
  const [priceStandard, setPriceStandard] = useState('16.00');
  const [pricePremium, setPricePremium] = useState('22.00');
  const [priceRecliner, setPriceRecliner] = useState('28.00');

  // Heatmap show selection
  const [heatmapShowId, setHeatmapShowId] = useState<string>(shows[0]?.id || '');

  const handleCreateMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieTitle.trim()) return;

    onAddMovie({
      title: movieTitle.trim(),
      slug: movieTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      synopsis: movieSynopsis.trim() || 'Exciting premiere cinema experience.',
      poster: moviePoster,
      backdrop: movieBackdrop,
      genres: movieGenres.split(',').map((g) => g.trim()),
      languages: ['English'],
      releaseDate: new Date().toISOString().split('T')[0],
      durationMinutes: parseInt(movieDuration, 10) || 120,
      certification: movieCert,
      rating: 8.5,
      director: movieDirector,
      cast: [
        { name: 'Lead Actor', role: 'Protagonist' },
        { name: 'Supporting Star', role: 'Companion' },
      ],
      formats: ['IMAX 3D', 'Dolby Atmos', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
      status: movieStatus,
    });

    setMovieTitle('');
    setShowAddMovie(false);
  };

  const handleCreateShow = (e: React.FormEvent) => {
    e.preventDefault();
    const theatre = theatres.find((t) => t.id === showTheatreId) || theatres[0];
    const screen = theatre.screens[0];

    onAddShow({
      movieId: showMovieId,
      theatreId: showTheatreId,
      screenId: screen.id,
      screenName: screen.name,
      date: showDate,
      time: showTime,
      language: 'English',
      format: showFormat,
      pricing: {
        standard: parseFloat(priceStandard) || 15,
        premium: parseFloat(pricePremium) || 20,
        recliner: parseFloat(priceRecliner) || 26,
      },
      totalSeats: screen.capacity,
    });

    setShowAddShow(false);
  };

  const selectedHeatmapShow = shows.find((s) => s.id === heatmapShowId) || shows[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">IMovies Cinema Admin Engine</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-bold">
                  Staff Role: {currentUser?.role || 'Admin'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Full-stack Cinema Management, Real-time Shows & Occupancy Tracking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-950 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-6 overflow-x-auto">
          {[
            { id: 'analytics', label: 'Overview Analytics', icon: BarChart3 },
            { id: 'movies', label: `Movies (${movies.length})`, icon: Film },
            { id: 'shows', label: `Showtimes (${shows.length})`, icon: Calendar },
            { id: 'theatres', label: `Theatres (${theatres.length})`, icon: Layers },
            { id: 'bookings', label: `Bookings Log (${bookings.length})`, icon: Ticket },
            { id: 'heatmap', label: 'Live Occupancy Heatmap', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Total Ticket Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black font-mono text-white">
                    ${stats.totalRevenue.toFixed(2)}
                  </p>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    +18.4% from last week
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Tickets Issued</span>
                    <Ticket className="w-4 h-4 text-red-500" />
                  </div>
                  <p className="text-2xl font-black font-mono text-white">
                    {stats.totalTicketsSold}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Across {stats.totalBookings} orders
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Average Occupancy</span>
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-black font-mono text-white">
                    {stats.occupancyRate}%
                  </p>
                  <span className="text-[10px] text-amber-400 font-medium">
                    Peak weekend demand
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Active Scheduled Shows</span>
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-black font-mono text-white">
                    {stats.activeShowsCount}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {stats.activeMoviesCount} movies in screens
                  </span>
                </div>

              </div>

              {/* Recent Transactions List */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Recent Ticket Transactions
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-slate-500 border-b border-slate-800 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="pb-2">Booking Ref</th>
                        <th className="pb-2">Patron</th>
                        <th className="pb-2">Movie & Show</th>
                        <th className="pb-2">Seats</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} className="hover:bg-slate-900/50">
                          <td className="py-2.5 font-mono text-white font-bold">{b.bookingReference}</td>
                          <td className="py-2.5">{b.userName}</td>
                          <td className="py-2.5">{b.movieTitle} ({b.showTime})</td>
                          <td className="py-2.5 font-mono">{b.seats.map((s) => s.seatId).join(', ')}</td>
                          <td className="py-2.5 font-mono font-bold text-emerald-400">${b.totalAmount.toFixed(2)}</td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                              b.bookingStatus === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {b.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MOVIES MANAGEMENT */}
          {activeTab === 'movies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Movie Catalog CRUD</h4>
                  <p className="text-xs text-slate-400">Add, edit, or remove movies from theatre schedules.</p>
                </div>
                <button
                  onClick={() => setShowAddMovie(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New Movie
                </button>
              </div>

              {/* Add Movie Modal Form */}
              {showAddMovie && (
                <form onSubmit={handleCreateMovie} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h5 className="text-xs font-bold text-white uppercase">New Movie Document</h5>
                    <button type="button" onClick={() => setShowAddMovie(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Movie Title</label>
                      <input
                        type="text"
                        value={movieTitle}
                        onChange={(e) => setMovieTitle(e.target.value)}
                        placeholder="e.g. Interstellar 2"
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Director</label>
                      <input
                        type="text"
                        value={movieDirector}
                        onChange={(e) => setMovieDirector(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Duration (minutes)</label>
                      <input
                        type="number"
                        value={movieDuration}
                        onChange={(e) => setMovieDuration(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Genres (comma-separated)</label>
                      <input
                        type="text"
                        value={movieGenres}
                        onChange={(e) => setMovieGenres(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Certification</label>
                      <select
                        value={movieCert}
                        onChange={(e) => setMovieCert(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                      >
                        <option value="PG-13">PG-13</option>
                        <option value="R">R</option>
                        <option value="PG">PG</option>
                        <option value="U/A">U/A</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Status</label>
                      <select
                        value={movieStatus}
                        onChange={(e) => setMovieStatus(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                      >
                        <option value="now_showing">Now Showing</option>
                        <option value="coming_soon">Coming Soon</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMovie(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
                    >
                      Save Movie
                    </button>
                  </div>
                </form>
              )}

              {/* Movies Table */}
              <div className="overflow-x-auto rounded-2xl bg-slate-950 border border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="text-slate-500 border-b border-slate-800 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">Poster</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Certification</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Formats</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {movies.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-900/50">
                        <td className="p-3">
                          <img src={m.poster} alt={m.title} className="w-10 aspect-[2/3] object-cover rounded" />
                        </td>
                        <td className="p-3 font-bold text-white">{m.title}</td>
                        <td className="p-3 font-mono">{m.certification}</td>
                        <td className="p-3 font-mono font-bold text-amber-400">{m.rating} ★</td>
                        <td className="p-3 font-mono">{m.formats.slice(0, 2).join(', ')}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            m.status === 'now_showing' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onDeleteMovie(m.id)}
                            className="p-1 rounded text-red-400 hover:bg-red-500/10"
                            title="Delete Movie"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SHOWTIMES SCHEDULER */}
          {activeTab === 'shows' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Showtimes Scheduler</h4>
                  <p className="text-xs text-slate-400">Schedule movie runs in theatre auditoriums with dynamic pricing.</p>
                </div>
                <button
                  onClick={() => setShowAddShow(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Schedule Show
                </button>
              </div>

              {showAddShow && (
                <form onSubmit={handleCreateShow} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h5 className="text-xs font-bold text-white uppercase">New Show Schedule</h5>
                    <button type="button" onClick={() => setShowAddShow(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Movie</label>
                      <select
                        value={showMovieId}
                        onChange={(e) => setShowMovieId(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                      >
                        {movies.map((m) => (
                          <option key={m.id} value={m.id}>{m.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Theatre</label>
                      <select
                        value={showTheatreId}
                        onChange={(e) => setShowTheatreId(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                      >
                        {theatres.map((t) => (
                          <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Format</label>
                      <select
                        value={showFormat}
                        onChange={(e) => setShowFormat(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                      >
                        <option value="IMAX 3D">IMAX 3D</option>
                        <option value="IMAX">IMAX</option>
                        <option value="Dolby Atmos">Dolby Atmos</option>
                        <option value="4DX">4DX</option>
                        <option value="2D">2D</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Date (YYYY-MM-DD)</label>
                      <input
                        type="date"
                        value={showDate}
                        onChange={(e) => setShowDate(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Showtime (HH:MM)</label>
                      <input
                        type="time"
                        value={showTime}
                        onChange={(e) => setShowTime(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Standard / Recliner Price</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={priceStandard}
                          onChange={(e) => setPriceStandard(e.target.value)}
                          placeholder="Standard $"
                          className="w-1/2 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                        />
                        <input
                          type="text"
                          value={priceRecliner}
                          onChange={(e) => setPriceRecliner(e.target.value)}
                          placeholder="VIP $"
                          className="w-1/2 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddShow(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
                    >
                      Schedule Show
                    </button>
                  </div>
                </form>
              )}

              {/* Shows List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {shows.map((s) => {
                  const m = movies.find((mov) => mov.id === s.movieId);
                  const t = theatres.find((th) => th.id === s.theatreId);
                  return (
                    <div key={s.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                      <div className="flex justify-between items-start">
                        <h5 className="font-bold text-white truncate max-w-[180px]">{m?.title || 'Movie'}</h5>
                        <span className="font-mono text-red-400 font-bold">{s.time}</span>
                      </div>
                      <p className="text-slate-400">{t?.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {s.screenName} · {s.format} · {s.date}
                      </p>
                      <div className="pt-2 flex justify-between text-[11px] border-t border-slate-900">
                        <span className="text-slate-400">Seats: {s.availableSeats} / {s.totalSeats} open</span>
                        <span className="text-emerald-400 font-mono">${s.pricing.standard} - ${s.pricing.recliner}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: THEATRES */}
          {activeTab === 'theatres' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white">Theatres & Screens</h4>
                <p className="text-xs text-slate-400">Configure multiplex locations, sound systems, and screen capacities.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {theatres.map((th) => (
                  <div key={th.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div>
                      <h5 className="text-base font-bold text-white">{th.name}</h5>
                      <p className="text-xs text-red-400">{th.city} · {th.location}</p>
                      <p className="text-[11px] text-slate-500">{th.address}</p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-900">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Auditorium Screens:</span>
                      <div className="space-y-1">
                        {th.screens.map((sc) => (
                          <div key={sc.id} className="flex justify-between text-xs p-2 rounded-lg bg-slate-900 border border-slate-850">
                            <span className="text-slate-200 font-medium">{sc.name} ({sc.format})</span>
                            <span className="text-slate-400 font-mono">{sc.capacity} seats</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BOOKINGS LOG */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Full Bookings & Reservation Ledger</h4>
                  <p className="text-xs text-slate-400">Monitor all transactions, seats booked, and execute admin refunds.</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl bg-slate-950 border border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="text-slate-500 border-b border-slate-800 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Movie & Theatre</th>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">Seats</th>
                      <th className="p-3">Paid</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-900/50">
                        <td className="p-3 font-mono font-bold text-white">{b.bookingReference}</td>
                        <td className="p-3">
                          <p className="font-semibold text-slate-200">{b.userName}</p>
                          <p className="text-[10px] text-slate-500">{b.userEmail}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-white">{b.movieTitle}</p>
                          <p className="text-[10px] text-slate-500">{b.theatreName}</p>
                        </td>
                        <td className="p-3 font-mono">{b.showDate} @ {b.showTime}</td>
                        <td className="p-3 font-mono text-red-400">{b.seats.map((s) => s.seatId).join(', ')}</td>
                        <td className="p-3 font-mono font-bold text-emerald-400">${b.totalAmount.toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                            b.bookingStatus === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {b.bookingStatus}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {b.bookingStatus === 'confirmed' && (
                            <button
                              onClick={() => onCancelBooking(b.id)}
                              className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold"
                            >
                              Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: REAL-TIME OCCUPANCY HEATMAP */}
          {activeTab === 'heatmap' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Live Hall Occupancy Heatmap</h4>
                  <p className="text-xs text-slate-400">Select any scheduled show to view real-time booked seats in the auditorium.</p>
                </div>
                
                <select
                  value={heatmapShowId}
                  onChange={(e) => setHeatmapShowId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  {shows.map((s) => {
                    const m = movies.find((mov) => mov.id === s.movieId);
                    return (
                      <option key={s.id} value={s.id}>
                        {m?.title || 'Movie'} — {s.date} at {s.time} ({s.screenName})
                      </option>
                    );
                  })}
                </select>
              </div>

              {selectedHeatmapShow && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center space-y-4">
                  <div className="w-full flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                    <span>Auditorium: <strong className="text-white">{selectedHeatmapShow.screenName}</strong></span>
                    <span>
                      Occupancy: <strong className="text-amber-400 font-mono">
                        {selectedHeatmapShow.bookedSeats.length} / {selectedHeatmapShow.totalSeats} seats booked ({Math.round((selectedHeatmapShow.bookedSeats.length / selectedHeatmapShow.totalSeats) * 100)}%)
                      </strong>
                    </span>
                  </div>

                  {/* Visual Screen */}
                  <div className="w-3/4 h-2 bg-red-500/80 rounded-[100%] shadow-[0_-6px_15px_rgba(239,68,68,0.5)] my-2" />
                  <p className="text-[10px] font-mono uppercase text-slate-500">Projection Screen</p>

                  {/* Heatmap Grid */}
                  <div className="space-y-2 pt-2">
                    {['G', 'F', 'E', 'D', 'C', 'B', 'A'].map((row) => (
                      <div key={row} className="flex items-center gap-1.5">
                        <span className="w-5 text-[10px] font-mono text-slate-500">{row}</span>
                        {Array.from({ length: 14 }).map((_, i) => {
                          const seatId = `${row}${i + 1}`;
                          const isBooked = selectedHeatmapShow.bookedSeats.includes(seatId);
                          return (
                            <div
                              key={seatId}
                              title={`${seatId}: ${isBooked ? 'Booked' : 'Available'}`}
                              className={`w-5 h-5 rounded text-[9px] font-mono flex items-center justify-center ${
                                isBooked ? 'bg-red-600 text-white font-bold shadow-sm' : 'bg-slate-900 border border-slate-850 text-slate-600'
                              }`}
                            >
                              {i + 1}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 text-xs text-slate-400 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-600" />
                      <span>Occupied / Reserved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-slate-900 border border-slate-800" />
                      <span>Vacant & Available</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
