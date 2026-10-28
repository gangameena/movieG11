import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Radio,
  Sparkles,
  AlertCircle,
  Armchair,
  Check,
  ChevronRight,
  Accessibility,
} from 'lucide-react';
import { Show, Theatre, Movie, Seat, SeatTier, BookingSeatItem } from '../types';

interface SeatSelectionModalProps {
  show: Show;
  theatre: Theatre;
  movie: Movie;
  userId: string;
  onClose: () => void;
  onProceedToConcessions: (selectedSeats: BookingSeatItem[], show: Show) => void;
  onSimulateLiveActivity: (showId: string) => string | null;
}

export const SeatSelectionModal: React.FC<SeatSelectionModalProps> = ({
  show,
  theatre,
  movie,
  userId,
  onClose,
  onProceedToConcessions,
  onSimulateLiveActivity,
}) => {
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [liveMessage, setLiveMessage] = useState<string | null>(null);

  // 10-minute hold timer countdown
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Generate seats grid
  // Rows: G, F (VIP Recliner), E, D, C (Premium), B, A (Standard)
  const rows = ['G', 'F', 'E', 'D', 'C', 'B', 'A'];
  const columnsLeft = [1, 2, 3];
  const columnsCenter = [4, 5, 6, 7, 8, 9, 10, 11];
  const columnsRight = [12, 13, 14];

  const getSeatTier = (row: string): SeatTier => {
    if (row === 'G' || row === 'F') return 'recliner';
    if (row === 'E' || row === 'D' || row === 'C') return 'premium';
    return 'standard';
  };

  const getSeatPrice = (tier: SeatTier): number => {
    return show.pricing[tier] || 15.0;
  };

  const isSeatBooked = (seatId: string) => show.bookedSeats.includes(seatId);

  const isSeatLockedByOther = (seatId: string) => {
    if (!show.lockedSeats) return false;
    const lock = show.lockedSeats[seatId];
    return lock && lock.lockedBy !== userId && lock.expiresAt > Date.now();
  };

  const toggleSeat = (row: string, num: number) => {
    const seatId = `${row}${num}`;
    if (isSeatBooked(seatId) || isSeatLockedByOther(seatId)) return;

    if (selectedSeatIds.includes(seatId)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seatId));
    } else {
      if (selectedSeatIds.length >= 8) {
        alert('You can select a maximum of 8 seats per booking transaction.');
        return;
      }
      setSelectedSeatIds((prev) => [...prev, seatId]);
    }
  };

  // Build selected items with tier and price
  const selectedSeatItems: BookingSeatItem[] = selectedSeatIds.map((seatId) => {
    const row = seatId.charAt(0);
    const num = parseInt(seatId.slice(1), 10);
    const tier = getSeatTier(row);
    return {
      seatId,
      row,
      number: num,
      tier,
      price: getSeatPrice(tier),
    };
  });

  const totalSeatsPrice = selectedSeatItems.reduce((acc, s) => acc + s.price, 0);

  const handleSimulate = () => {
    const msg = onSimulateLiveActivity(show.id);
    if (msg) {
      setLiveMessage(msg);
      setTimeout(() => setLiveMessage(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">{movie.title}</h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                {show.format}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {theatre.name} · {show.screenName} · <strong className="text-slate-200">{show.date} at {show.time}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Hold Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold ${
              timeLeftSeconds < 120
                ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                : 'bg-slate-950 text-slate-300 border-slate-800'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>Hold: {formatTimer(timeLeftSeconds)}</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-950 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Simulation Alert Banner */}
        {liveMessage && (
          <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-xs font-medium text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 animate-ping text-amber-400" />
              <span>{liveMessage}</span>
            </div>
            <span className="text-[10px] text-amber-400 uppercase font-mono">Live Sync</span>
          </div>
        )}

        {/* Seating Canvas Area */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 flex flex-col items-center">
          
          {/* Curved Cinema Screen Visual */}
          <div className="w-full max-w-2xl mb-8 flex flex-col items-center">
            <div className="relative w-full h-8 flex items-center justify-center">
              {/* Curved line glow */}
              <div className="w-4/5 h-2 bg-gradient-to-r from-transparent via-red-500/80 to-transparent rounded-[100%] shadow-[0_-8px_20px_rgba(239,68,68,0.6)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent blur-md pointer-events-none" />
            </div>
            <p className="text-[11px] font-mono tracking-widest text-slate-500 uppercase mt-1">
              Cinema Screen — All Eyes This Way
            </p>
          </div>

          {/* Interactive Seating Matrix */}
          <div className="space-y-3 min-w-[560px]">
            {rows.map((row) => {
              const tier = getSeatTier(row);
              const price = getSeatPrice(tier);
              const isVIP = tier === 'recliner';

              return (
                <div key={row} className="flex items-center justify-between gap-3">
                  
                  {/* Row Label */}
                  <div className="w-6 text-xs font-mono font-bold text-slate-500 text-center">
                    {row}
                  </div>

                  {/* Left Block */}
                  <div className="flex items-center gap-1.5">
                    {columnsLeft.map((num) => {
                      const seatId = `${row}${num}`;
                      const isBooked = isSeatBooked(seatId);
                      const isLocked = isSeatLockedByOther(seatId);
                      const isSelected = selectedSeatIds.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          onClick={() => toggleSeat(row, num)}
                          disabled={isBooked || isLocked}
                          title={`${seatId} (${tier.toUpperCase()}) - $${price}`}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105 ring-2 ring-red-400'
                              : isBooked
                              ? 'bg-slate-950 text-slate-700 border border-slate-900 cursor-not-allowed line-through'
                              : isLocked
                              ? 'bg-amber-950/40 border border-amber-600/50 text-amber-500 cursor-not-allowed'
                              : isVIP
                              ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 hover:border-amber-400'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : num}
                        </button>
                      );
                    })}
                  </div>

                  {/* Center Aisle Walkway */}
                  <div className="w-4 sm:w-6" />

                  {/* Center Block */}
                  <div className="flex items-center gap-1.5">
                    {columnsCenter.map((num) => {
                      const seatId = `${row}${num}`;
                      const isBooked = isSeatBooked(seatId);
                      const isLocked = isSeatLockedByOther(seatId);
                      const isSelected = selectedSeatIds.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          onClick={() => toggleSeat(row, num)}
                          disabled={isBooked || isLocked}
                          title={`${seatId} (${tier.toUpperCase()}) - $${price}`}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105 ring-2 ring-red-400'
                              : isBooked
                              ? 'bg-slate-950 text-slate-700 border border-slate-900 cursor-not-allowed line-through'
                              : isLocked
                              ? 'bg-amber-950/40 border border-amber-600/50 text-amber-500 cursor-not-allowed'
                              : isVIP
                              ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 hover:border-amber-400'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : num}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Aisle Walkway */}
                  <div className="w-4 sm:w-6" />

                  {/* Right Block */}
                  <div className="flex items-center gap-1.5">
                    {columnsRight.map((num) => {
                      const seatId = `${row}${num}`;
                      const isBooked = isSeatBooked(seatId);
                      const isLocked = isSeatLockedByOther(seatId);
                      const isSelected = selectedSeatIds.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          onClick={() => toggleSeat(row, num)}
                          disabled={isBooked || isLocked}
                          title={`${seatId} (${tier.toUpperCase()}) - $${price}`}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105 ring-2 ring-red-400'
                              : isBooked
                              ? 'bg-slate-950 text-slate-700 border border-slate-900 cursor-not-allowed line-through'
                              : isLocked
                              ? 'bg-amber-950/40 border border-amber-600/50 text-amber-500 cursor-not-allowed'
                              : isVIP
                              ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 hover:border-amber-400'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : num}
                        </button>
                      );
                    })}
                  </div>

                  {/* Row Tier Price tag */}
                  <div className="w-16 text-right text-[11px] font-mono text-slate-500">
                    ${price.toFixed(2)}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Seat Status & Tier Legend */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 w-full flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-900 border border-slate-800" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center text-[10px]">✓</div>
              <span className="text-white font-medium">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-950 border border-slate-900 line-through text-slate-700" />
              <span>Booked / Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-900 border border-amber-500/40" />
              <span className="text-amber-400 font-medium">VIP Recliner (${show.pricing.recliner})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-900 border border-slate-700" />
              <span>Premium (${show.pricing.premium})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-slate-900 border border-slate-800" />
              <span>Standard (${show.pricing.standard})</span>
            </div>
          </div>

          {/* Live Concurrent Activity Test Button */}
          <div className="mt-4">
            <button
              onClick={handleSimulate}
              type="button"
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulate Real-time Concurrency (Another user reserves a seat)</span>
            </button>
          </div>

        </div>

        {/* Bottom Booking Summary & CTA Bar */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Selected Seats:</span>
              {selectedSeatIds.length === 0 ? (
                <span className="text-xs text-slate-500 italic">None selected yet</span>
              ) : (
                <span className="text-sm font-bold font-mono text-white">
                  {selectedSeatIds.join(', ')} ({selectedSeatIds.length} {selectedSeatIds.length === 1 ? 'seat' : 'seats'})
                </span>
              )}
            </div>
            {selectedSeatIds.length > 0 && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                Ticket Subtotal: <strong className="text-red-400 font-mono">${totalSeatsPrice.toFixed(2)}</strong> (excl. tax & fee)
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={selectedSeatIds.length === 0}
              onClick={() => onProceedToConcessions(selectedSeatItems, show)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedSeatIds.length > 0
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 cursor-pointer'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>Continue to Concessions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
