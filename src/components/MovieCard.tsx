import React from 'react';
import { Star, Clock, Play, Ticket, Calendar } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onWatchTrailer: (trailerUrl: string, title: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelectMovie,
  onWatchTrailer,
}) => {
  const hours = Math.floor(movie.durationMinutes / 60);
  const minutes = movie.durationMinutes % 60;

  return (
    <div className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-slate-700 transition-all duration-300 flex flex-col hover:shadow-2xl hover:shadow-red-950/20">
      
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover overlay with quick trailer play */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWatchTrailer(movie.trailerUrl, movie.title);
            }}
            className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg hover:bg-red-500 hover:scale-110 transition-transform"
            title="Watch Trailer"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>
        </div>

        {/* Rating Floating Tag */}
        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700/60 flex items-center gap-1 shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-white font-mono">{movie.rating.toFixed(1)}</span>
        </div>

        {/* Certification Tag */}
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono font-semibold text-slate-300 border border-slate-700/60">
          {movie.certification}
        </div>

        {/* Experience badges */}
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
          {movie.formats.slice(0, 3).map((fmt) => (
            <span
              key={fmt}
              className="text-[10px] font-mono font-semibold bg-slate-950/90 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800"
            >
              {fmt}
            </span>
          ))}
          {movie.formats.length > 3 && (
            <span className="text-[10px] font-mono bg-slate-950/90 text-slate-400 px-1 py-0.5 rounded">
              +{movie.formats.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Title */}
          <h3
            onClick={() => onSelectMovie(movie)}
            className="text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer"
            title={movie.title}
          >
            {movie.title}
          </h3>

          {/* Clean Unboxed Metadata */}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span>{hours}h {minutes}m</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="truncate">{movie.genres.slice(0, 2).join(', ')}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{movie.languages[0]}</span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {movie.status === 'now_showing' ? (
            <button
              onClick={() => onSelectMovie(movie)}
              className="w-full py-2.5 px-3 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 hover:shadow-red-600/40 transition-all cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Book Tickets</span>
            </button>
          ) : (
            <button
              onClick={() => onSelectMovie(movie)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Explore & Advance Info</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
