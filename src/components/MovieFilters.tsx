import React from 'react';
import { Film, Filter, Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface MovieFiltersProps {
  status: 'now_showing' | 'coming_soon';
  onStatusChange: (status: 'now_showing' | 'coming_soon') => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  selectedFormat: string;
  onFormatChange: (format: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  totalCount: number;
  onReset: () => void;
}

const GENRES = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Animation', 'Biography'];
const FORMATS = ['All', 'IMAX 3D', 'IMAX', 'Dolby Atmos', '4DX', '2D'];
const LANGUAGES = ['All', 'English', 'Spanish', 'Japanese'];

export const MovieFilters: React.FC<MovieFiltersProps> = ({
  status,
  onStatusChange,
  selectedGenre,
  onGenreChange,
  selectedFormat,
  onFormatChange,
  selectedLanguage,
  onLanguageChange,
  totalCount,
  onReset,
}) => {
  const isFiltered =
    selectedGenre !== 'All' || selectedFormat !== 'All' || selectedLanguage !== 'All';

  return (
    <div className="w-full bg-slate-900/60 border-y border-slate-800/80 backdrop-blur-sm py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Main Status Segmented Control & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Segmented Tab Switcher */}
          <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => onStatusChange('now_showing')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                status === 'now_showing'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Now Showing in Theatres
            </button>
            <button
              onClick={() => onStatusChange('coming_soon')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                status === 'coming_soon'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Coming Soon (Advance)
            </button>
          </div>

          {/* Result Count and Clear Filters */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>
              Showing <strong className="text-white font-medium">{totalCount}</strong> movies
            </span>
            {isFiltered && (
              <button
                onClick={onReset}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Filters
              </button>
            )}
          </div>

        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-y-3 gap-x-4 pt-1 border-t border-slate-800/60">
          
          {/* Genre Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mr-1">
              Genre:
            </span>
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => onGenreChange(genre)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedGenre === genre
                    ? 'bg-slate-100 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-800 hidden md:block" />

          {/* Format Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Experience:
            </span>
            <select
              value={selectedFormat}
              onChange={(e) => onFormatChange(e.target.value)}
              className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1 focus:outline-none focus:border-red-500 font-mono"
            >
              {FORMATS.map((fmt) => (
                <option key={fmt} value={fmt}>
                  {fmt === 'All' ? 'All Formats' : fmt}
                </option>
              ))}
            </select>
          </div>

          {/* Language Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Language:
            </span>
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1 focus:outline-none focus:border-red-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang === 'All' ? 'All Languages' : lang}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>
    </div>
  );
};
