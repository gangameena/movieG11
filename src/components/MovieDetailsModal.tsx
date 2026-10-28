import React, { useState } from 'react';
import {
  X,
  Star,
  Clock,
  Play,
  Calendar,
  MapPin,
  ChevronRight,
  MessageSquare,
  Send,
  Sparkles,
  Info,
} from 'lucide-react';
import { Movie, Theatre, Show, User } from '../types';

interface MovieDetailsModalProps {
  movie: Movie | null;
  theatres: Theatre[];
  shows: Show[];
  selectedCity: string;
  currentUser: User | null;
  onClose: () => void;
  onSelectShow: (show: Show, theatre: Theatre, movie: Movie) => void;
  onWatchTrailer: (trailerUrl: string, title: string) => void;
  onAddReview: (movieId: string, rating: number, comment: string) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  theatres,
  shows,
  selectedCity,
  currentUser,
  onClose,
  onSelectShow,
  onWatchTrailer,
  onAddReview,
}) => {
  const [activeTab, setActiveTab] = useState<'shows' | 'about' | 'reviews'>('shows');
  const [selectedDateOffset, setSelectedDateOffset] = useState<number>(0);

  // Review Form state
  const [userRating, setUserRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  if (!movie) return null;

  // Calculate dates for showtimes: Today, Tomorrow, +2, +3, +4
  const dateOptions = [0, 1, 2, 3, 4].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { offset, dateStr, dayName, formatted };
  });

  const activeDateStr = dateOptions[selectedDateOffset]?.dateStr;

  // Filter shows for this movie on the chosen date
  const filteredShows = shows.filter(
    (s) => s.movieId === movie.id && s.date === activeDateStr
  );

  // Group shows by Theatre
  const theatreMap = new Map<string, { theatre: Theatre; shows: Show[] }>();
  theatres.forEach((th) => {
    const matchingShows = filteredShows.filter((s) => s.theatreId === th.id);
    if (matchingShows.length > 0) {
      theatreMap.set(th.id, { theatre: th, shows: matchingShows });
    }
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    onAddReview(movie.id, userRating, reviewComment.trim());
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-950/80 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/80 transition-colors"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header */}
        <div className="relative h-64 sm:h-72 w-full flex-shrink-0 bg-slate-950 overflow-hidden">
          <img
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover object-center filter brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-6 flex items-end gap-5">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-24 sm:w-32 aspect-[2/3] object-cover rounded-xl shadow-2xl border-2 border-slate-800 hidden sm:block flex-shrink-0"
            />
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="font-mono px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700 text-slate-200">
                  {movie.certification}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {movie.rating.toFixed(1)} / 10
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {Math.floor(movie.durationMinutes / 60)}h {movie.durationMinutes % 60}m
                </span>
                <span aria-hidden="true">·</span>
                <span>{movie.languages.join(', ')}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {movie.title}
              </h2>

              <p className="text-xs text-slate-300 line-clamp-2 max-w-2xl">
                {movie.genres.join(' · ')}
              </p>

              <div className="pt-1 flex items-center gap-3">
                <button
                  onClick={() => onWatchTrailer(movie.trailerUrl, movie.title)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-6">
          <button
            onClick={() => setActiveTab('shows')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'shows'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Showtimes & Theatres
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            About & Cast
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Reviews & Ratings
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
              {movie.reviews?.length || 0}
            </span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: SHOWTIMES */}
          {activeTab === 'shows' && (
            <div className="space-y-6">
              
              {/* Date Selector Pills */}
              <div>
                <p className="text-xs uppercase font-semibold text-slate-400 tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-red-500" />
                  Select Date
                </p>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {dateOptions.map((opt) => (
                    <button
                      key={opt.offset}
                      onClick={() => setSelectedDateOffset(opt.offset)}
                      className={`flex flex-col items-center justify-center min-w-[85px] py-2 px-3 rounded-xl border text-center transition-all ${
                        selectedDateOffset === opt.offset
                          ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-[11px] font-semibold">{opt.dayName}</span>
                      <span className="text-xs font-mono font-bold mt-0.5">{opt.formatted}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theatres Listing for Selected Date */}
              {theatreMap.size === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80">
                  <Info className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">No scheduled shows for this date</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Try selecting Today or Tomorrow, or switch city to explore other available auditoriums.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from(theatreMap.values()).map(({ theatre, shows: tShows }) => (
                    <div
                      key={theatre.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                        <div>
                          <h4 className="text-base font-bold text-white flex items-center gap-2">
                            {theatre.name}
                          </h4>
                          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
                            <span>{theatre.location} · {theatre.address}</span>
                          </p>
                        </div>
                        {/* Amenities */}
                        <div className="flex flex-wrap gap-1 text-[10px] text-slate-400 font-medium">
                          {theatre.amenities.slice(0, 3).map((am) => (
                            <span key={am} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                              {am}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Shows & Timings */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                          Available Showtimes:
                        </span>
                        <div className="flex flex-wrap gap-2.5">
                          {tShows.map((s) => {
                            const isAlmostFull = s.availableSeats < s.totalSeats * 0.25;
                            return (
                              <button
                                key={s.id}
                                onClick={() => onSelectShow(s, theatre, movie)}
                                className="group relative flex flex-col items-center py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-red-500 transition-all text-left cursor-pointer"
                              >
                                <span className="text-sm font-black font-mono text-white group-hover:text-red-400">
                                  {s.time}
                                </span>
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                                  <span className="font-semibold text-slate-300">{s.format}</span>
                                  <span>·</span>
                                  <span>${s.pricing.standard}</span>
                                </div>
                                {isAlmostFull && (
                                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-tight mt-0.5">
                                    Almost Full
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: ABOUT & CAST */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                  Synopsis
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {movie.synopsis}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  Cast & Crew
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {movie.cast.map((c) => (
                    <div
                      key={c.name}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3"
                    >
                      <img
                        src={c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt={c.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{c.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{c.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <p><strong className="text-white">Director:</strong> {movie.director}</p>
                <p><strong className="text-white">Release Date:</strong> {movie.releaseDate}</p>
                <p><strong className="text-white">Formats:</strong> {movie.formats.join(', ')}</p>
                <p><strong className="text-white">Languages:</strong> {movie.languages.join(', ')}</p>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS & RATINGS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Add a Review Box */}
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Rate & Review this Movie
                  </h4>
                  {/* Star Selector */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-4 h-4 ${star <= userRating ? 'fill-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-amber-400 ml-1">
                      {userRating}/5
                    </span>
                  </div>
                </div>

                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts about the cinematic direction, IMAX effects, sound design..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-red-500 resize-none"
                  required
                />

                <div className="flex items-center justify-between">
                  {reviewSubmitted ? (
                    <span className="text-xs text-emerald-400 font-medium">
                      ✓ Thank you! Your review has been added.
                    </span>
                  ) : <span />}
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Review
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Audience Reviews ({movie.reviews?.length || 0})
                </h4>

                {(!movie.reviews || movie.reviews.length === 0) ? (
                  <p className="text-xs text-slate-500 italic">No reviews yet. Be the first to review!</p>
                ) : (
                  movie.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                            alt={rev.userName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-white">{rev.userName}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                      <span className="text-[10px] text-slate-500">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
