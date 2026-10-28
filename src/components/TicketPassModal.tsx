import React, { useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Download,
  Printer,
  Share2,
  Sparkles,
  Ticket,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Booking } from '../types';

interface TicketPassModalProps {
  booking: Booking | null;
  onClose: () => void;
  onViewMyBookings: () => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  booking,
  onClose,
  onViewMyBookings,
}) => {
  useEffect(() => {
    if (booking) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e50914', '#f59e0b', '#3b82f6', '#ffffff'],
        });
      } catch (e) {
        // graceful ignore
      }
    }
  }, [booking]);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:IMovies: ${booking.movieTitle} at ${booking.theatreName}
DESCRIPTION:Seats: ${booking.seats.map((s) => s.seatId).join(', ')}. Booking Ref: ${booking.bookingReference}
LOCATION:${booking.theatreAddress}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${booking.bookingReference}-movie-pass.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    `IMOVIES-VERIFIED-${booking.bookingReference}-${booking.seats.map((s) => s.seatId).join('')}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto print:border-none print:shadow-none print:max-w-none print:w-full">
        
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 p-4 text-white text-center relative print:hidden">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>Booking Confirmed & Seats Reserved!</span>
          </div>
          <p className="text-xs text-red-100 mt-0.5">
            Your digital pass is ready for cinema turnstile scan.
          </p>
        </div>

        {/* Boarding Pass Ticket Body */}
        <div className="p-6 space-y-6 print:text-black">
          
          {/* Ticket Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black tracking-wider text-white print:text-black">
                  I<span className="text-red-500">MOVIES</span> PASS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase">
                  {booking.format}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 print:text-gray-600">
                Booking Reference: <strong className="font-mono text-white print:text-black">{booking.bookingReference}</strong>
              </p>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                {booking.paymentStatus.toUpperCase()}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                {new Date(booking.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Movie & Showtime Specs */}
          <div className="flex gap-4">
            <img
              src={booking.moviePoster}
              alt={booking.movieTitle}
              className="w-20 aspect-[2/3] object-cover rounded-xl shadow-md border border-slate-800 flex-shrink-0"
            />
            <div className="space-y-1.5 flex-1">
              <h4 className="text-lg font-bold text-white leading-tight print:text-black">
                {booking.movieTitle}
              </h4>
              <p className="text-xs text-slate-400 print:text-gray-700">
                {booking.theatreName} · {booking.screenName}
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 print:text-gray-800 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-red-500" />
                  {booking.showDate}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-bold text-white font-mono print:text-black">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  {booking.showTime}
                </span>
                <span>·</span>
                <span className="font-mono">{booking.language}</span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 print:text-gray-500">
                <MapPin className="w-3 h-3 text-slate-400" />
                {booking.theatreAddress}
              </p>
            </div>
          </div>

          {/* Reserved Seats Highlight Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between print:border-gray-300">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Reserved Seats ({booking.seats.length})
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {booking.seats.map((s) => (
                  <span
                    key={s.seatId}
                    className="px-2.5 py-1 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 font-mono font-bold text-sm"
                  >
                    {s.seatId} ({s.tier})
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Total Paid
              </span>
              <p className="text-xl font-black font-mono text-white print:text-black mt-0.5">
                ${booking.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Concessions if any */}
          {booking.snacks && booking.snacks.length > 0 && (
            <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
              <strong className="text-slate-300">Concessions to pick up at counter:</strong>{' '}
              {booking.snacks.map((snk) => `${snk.quantity}x ${snk.snack.name}`).join(', ')}
            </div>
          )}

          {/* QR Code & Barcode Section */}
          <div className="border-t border-dashed border-slate-700/80 pt-5 flex flex-col items-center space-y-3">
            <div className="p-2 bg-white rounded-2xl shadow-md">
              <img
                src={qrImageUrl}
                alt="Ticket QR Code"
                className="w-28 h-28"
              />
            </div>
            <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase text-center">
              Scan at cinema turnstile · Entry granted 15 min prior to showtime
            </p>
            <div className="font-mono text-xs text-slate-500 tracking-widest">
              ||| | ||||| |||| || |||||| | |||| |||
            </div>
          </div>

        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
            <button
              onClick={handleDownloadCalendar}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Add to Calendar</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onViewMyBookings();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30 transition-all cursor-pointer"
            >
              View in My Bookings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
