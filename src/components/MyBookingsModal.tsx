import React, { useState } from 'react';
import {
  X,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Eye,
  Info,
} from 'lucide-react';
import { Booking } from '../types';

interface MyBookingsModalProps {
  bookings: Booking[];
  onClose: () => void;
  onViewTicketPass: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => { success: boolean; refundAmount: number; message: string };
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  bookings,
  onClose,
  onViewTicketPass,
  onCancelBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);

  const now = new Date();

  const isUpcoming = (b: Booking) => {
    if (b.bookingStatus === 'cancelled') return false;
    const showDate = new Date(`${b.showDate}T${b.showTime}:00`);
    return showDate >= now;
  };

  const upcomingBookings = bookings.filter(isUpcoming);
  const pastOrCancelledBookings = bookings.filter((b) => !isUpcoming(b));

  const displayedList = activeTab === 'upcoming' ? upcomingBookings : pastOrCancelledBookings;

  const handleConfirmCancel = () => {
    if (!cancellingBooking) return;
    const res = onCancelBooking(cancellingBooking.id);
    setCancelFeedback(res.message);
    setCancellingBooking(null);
    setTimeout(() => setCancelFeedback(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-red-500" />
              My Cinema Bookings & Tickets
            </h3>
            <p className="text-xs text-slate-400">
              Manage your upcoming reservations, digital passes, and refund cancellations.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-950 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'upcoming'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Upcoming Reservations
            <span className="px-1.5 py-0.2 rounded-full bg-red-600/20 text-red-400 text-[10px] font-bold">
              {upcomingBookings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'past'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Past & Cancelled
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
              {pastOrCancelledBookings.length}
            </span>
          </button>
        </div>

        {/* Feedback Alert */}
        {cancelFeedback && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-6 py-2.5 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{cancelFeedback}</span>
          </div>
        )}

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {displayedList.length === 0 ? (
            <div className="py-12 text-center bg-slate-950/50 rounded-2xl border border-slate-800/80 p-6">
              <Ticket className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No {activeTab} bookings found</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {activeTab === 'upcoming'
                  ? 'Browse now-showing movies in IMAX or Dolby Atmos to reserve luxury seats.'
                  : 'Your past cinema visits will appear here.'}
              </p>
            </div>
          ) : (
            displayedList.map((bk) => (
              <div
                key={bk.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
              >
                {/* Left Movie Info */}
                <div className="flex gap-4">
                  <img
                    src={bk.moviePoster}
                    alt={bk.movieTitle}
                    className="w-16 aspect-[2/3] object-cover rounded-xl border border-slate-800 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{bk.movieTitle}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {bk.format}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      {bk.theatreName} · {bk.screenName}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-300 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-red-500" />
                        {bk.showDate}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono font-bold text-white">
                        <Clock className="w-3.5 h-3.5 text-red-500" />
                        {bk.showTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                      <span>Seats: <strong className="text-white font-mono">{bk.seats.map((s) => s.seatId).join(', ')}</strong></span>
                      <span>·</span>
                      <span>Ref: <strong className="font-mono text-slate-300">{bk.bookingReference}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right Status & Action Buttons */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      bk.bookingStatus === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {bk.bookingStatus === 'confirmed' ? 'CONFIRMED' : 'CANCELLED & REFUNDED'}
                    </span>
                    <p className="text-sm font-black font-mono text-white mt-1">
                      ${bk.totalAmount.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewTicketPass(bk)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>

                    {bk.bookingStatus === 'confirmed' && (
                      <button
                        onClick={() => setCancellingBooking(bk)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Cancellation Confirmation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Cancel Booking & Release Seats?</h4>
                <p className="text-xs text-slate-400">Ref: {cancellingBooking.bookingReference}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p>
                <strong>Movie:</strong> {cancellingBooking.movieTitle}
              </p>
              <p>
                <strong>Seats:</strong> {cancellingBooking.seats.map((s) => s.seatId).join(', ')}
              </p>
              <p>
                <strong>Refund Policy:</strong> If cancelled &gt; 2 hours before showtime, 100% of tickets and snacks are refunded to the original payment method.
              </p>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                <span>Estimated Refund Amount:</span>
                <span className="text-emerald-400 font-mono">
                  ${(cancellingBooking.ticketSubtotal + cancellingBooking.snacksSubtotal).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCancellingBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30"
              >
                Yes, Cancel & Refund
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
