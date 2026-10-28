import React, { useState, useEffect } from 'react';
import { Play, Ticket, Star, Clock, Volume2, Shield, Calendar } from 'lucide-react';
import { Movie } from '../types';

interface HeroBannerProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onWatchTrailer: (trailerUrl: string, title: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movies,
  onSelectMovie,
  onWatchTrailer,
}) => {
  const featuredMovies = movies.filter((m) => m.status === 'now_showing').slice(0, 4);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (featuredMovies.length === 0) return null;
  const movie = featuredMovies[currentIndex] || featuredMovies[0];

  return (
    <div className="relative w-full h-[480px] sm:h-[540px] md:h-[600px] overflow-hidden bg-slate-950">
      {/* Background Image with Cinematic Gradient Mask */}
      <div className="absolute inset-0">
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.4] transition-all duration-1000 ease-out transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16">
        <div className="max-w-2xl space-y-4">
          
          {/* Formats & Certification (Clean unboxed metadata) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-medium">
            <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              FEATURED PREMIERE
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-white font-semibold">{movie.certification}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {movie.rating.toFixed(1)}
              <span className="text-slate-400 font-normal">({movie.votesCount.toLocaleString()} ratings)</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5" />
              {Math.floor(movie.durationMinutes / 60)}h {movie.durationMinutes % 60}m
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
            {movie.title}
          </h1>

          {/* Formats Available */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {movie.formats.map((fmt) => (
              <span
                key={fmt}
                className="px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700/60 font-mono text-[11px] font-semibold"
              >
                {fmt}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
            {movie.synopsis}
          </p>

          {/* Director and Cast (Clean unboxed inline metadata) */}
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Directed by <strong className="text-slate-200">{movie.director}</strong></span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="truncate max-w-[300px]">Starring {movie.cast.map((c) => c.name).join(', ')}</span>
          </div>

          {/* CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectMovie(movie)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-102 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Book Tickets</span>
            </button>

            <button
              onClick={() => onWatchTrailer(movie.trailerUrl, movie.title)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-sm border border-slate-700/60 backdrop-blur-md transition-all hover:scale-102 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Trailer</span>
            </button>
          </div>

        </div>

        {/* Carousel indicators */}
        {featuredMovies.length > 1 && (
          <div className="absolute right-4 sm:right-8 bottom-6 flex items-center gap-2">
            {featuredMovies.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-red-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={m.title}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
