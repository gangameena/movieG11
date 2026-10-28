import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Wallet,
  Building,
  ShieldCheck,
  Tag,
  Check,
  AlertCircle,
  Lock,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import {
  Show,
  Theatre,
  Movie,
  BookingSeatItem,
  BookedSnack,
  User,
  Booking,
} from '../types';

interface CheckoutModalProps {
  movie: Movie;
  theatre: Theatre;
  show: Show;
  selectedSeats: BookingSeatItem[];
  bookedSnacks: BookedSnack[];
  currentUser: User | null;
  onClose: () => void;
  onBackToConcessions: () => void;
  onCompleteBooking: (bookingPayload: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  movie,
  theatre,
  show,
  selectedSeats,
  bookedSnacks,
  currentUser,
  onClose,
  onBackToConcessions,
  onCompleteBooking,
}) => {
  // Contact details
  const [userName, setUserName] = useState<string>(currentUser?.name || 'Alex Johnson');
  const [userEmail, setUserEmail] = useState<string>(currentUser?.email || 'alex@example.com');
  const [userPhone, setUserPhone] = useState<string>(currentUser?.phone || '+1 (555) 234-5678');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet' | 'netbanking'>('card');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('842');
  const [cardName, setCardName] = useState<string>(userName);

  // Promo code
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; description: string } | null>({
    code: 'IMOVIE20',
    discount: 0,
    description: '',
  });
  const [promoError, setPromoError] = useState<string | null>(null);

  // Simulation flags
  const [simulateFailure, setSimulateFailure] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculations
  const ticketSubtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const snacksSubtotal = bookedSnacks.reduce((acc, item) => acc + item.snack.price * item.quantity, 0);
  const rawSubtotal = ticketSubtotal + snacksSubtotal;

  const convenienceFee = Number((selectedSeats.length * 1.75).toFixed(2));
  const tax = Number((rawSubtotal * 0.08).toFixed(2)); // 8% entertainment tax

  // Calculate discount based on applied promo
  let discountAmount = 0;
  if (appliedPromo?.code === 'IMOVIE20') {
    discountAmount = Number((ticketSubtotal * 0.2).toFixed(2)); // 20% off tickets
  } else if (appliedPromo?.code === 'POPCORNFREE') {
    discountAmount = Math.min(snacksSubtotal, 9.5);
  } else if (appliedPromo?.code === 'FIRSTSHOW') {
    discountAmount = Math.min(rawSubtotal, 10.0);
  }

  const finalTotal = Math.max(0, Number((rawSubtotal + convenienceFee + tax - discountAmount).toFixed(2)));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'IMOVIE20') {
      setAppliedPromo({
        code: 'IMOVIE20',
        discount: 20,
        description: '20% off movie tickets applied',
      });
      setPromoCodeInput('');
    } else if (code === 'POPCORNFREE') {
      setAppliedPromo({
        code: 'POPCORNFREE',
        discount: 9.5,
        description: 'Free gourmet popcorn deduction applied',
      });
      setPromoCodeInput('');
    } else if (code === 'FIRSTSHOW') {
      setAppliedPromo({
        code: 'FIRSTSHOW',
        discount: 10,
        description: '$10 first-booking premiere voucher applied',
      });
      setPromoCodeInput('');
    } else {
      setPromoError('Invalid promotional code. Try IMOVIE20 or FIRSTSHOW');
    }
  };

  const handlePay = () => {
    setErrorMessage(null);
    if (!userName.trim() || !userEmail.trim()) {
      setErrorMessage('Please fill in your name and email address for ticket receipt.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (simulateFailure) {
        setErrorMessage('Payment failed: Your bank declined the transaction. (Simulation test mode)');
        return;
      }

      // Booking payload
      const bookingPayload = {
        userId: currentUser?.id || 'guest-1',
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        userPhone: userPhone.trim(),
        movieId: movie.id,
        movieTitle: movie.title,
        moviePoster: movie.poster,
        movieDuration: movie.durationMinutes,
        movieCertification: movie.certification,
        theatreId: theatre.id,
        theatreName: theatre.name,
        theatreLocation: theatre.location,
        theatreAddress: theatre.address,
        screenName: show.screenName,
        format: show.format,
        language: show.language,
        showId: show.id,
        showDate: show.date,
        showTime: show.time,
        seats: selectedSeats,
        snacks: bookedSnacks,
        ticketSubtotal,
        snacksSubtotal,
        tax,
        convenienceFee,
        discount: discountAmount,
        promoCode: appliedPromo?.code,
        totalAmount: finalTotal,
        paymentMethod,
        paymentTransactionId: `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      };

      onCompleteBooking(bookingPayload);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToConcessions}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Back to Concessions"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Secure Checkout & Payment
              </h3>
              <p className="text-xs text-slate-400">
                256-bit encrypted checkout with instant mobile pass delivery.
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

        {/* Content Body Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Contact & Payment Methods (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Contact Details Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Contact Details (For E-Ticket & SMS Alerts)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                    placeholder="name@email.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">Mobile Phone Number</label>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500 font-mono"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Payment Method
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  PCI-DSS Verified
                </div>
              </div>

              {/* Method Tabs */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'card', label: 'Cards', icon: CreditCard },
                  { id: 'upi', label: 'UPI / QR', icon: QrCode },
                  { id: 'wallet', label: 'Wallets', icon: Wallet },
                  { id: 'netbanking', label: 'Banking', icon: Building },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as any)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        paymentMethod === item.id
                          ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Credit Card Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-850 border border-slate-700/80 text-white space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>CineDebit Express</span>
                      <CreditCard className="w-5 h-5 text-amber-400" />
                    </div>
                    <p className="font-mono text-sm tracking-widest text-slate-200">
                      •••• •••• •••• 4242
                    </p>
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>{userName || 'VALUED PATRON'}</span>
                      <span>EXP 12/28</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-400 mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI QR Method */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-3">
                  <p className="text-xs text-slate-300">Scan QR using any UPI app (GPay, PhonePe, Paytm)</p>
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=imovies@bank&pn=IMovies&am=${finalTotal}`}
                      alt="UPI QR Code"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-[11px] font-mono text-slate-400">imovies@okaxis</p>
                </div>
              )}

              {/* Digital Wallets */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-2 text-xs">
                  {['Apple Pay / Google Wallet', 'PayPal Express', 'Amazon Pay'].map((w, idx) => (
                    <label key={w} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                      <span className="text-slate-200 font-medium">{w}</span>
                      <input type="radio" name="wallet" defaultChecked={idx === 0} className="text-red-500" />
                    </label>
                  ))}
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-2 text-xs">
                  <label className="block text-slate-400">Select Bank</label>
                  <select className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none">
                    <option>Chase Manhattan Bank</option>
                    <option>Bank of America</option>
                    <option>Wells Fargo</option>
                    <option>Citibank</option>
                    <option>Barclays Premier</option>
                    <option>HDFC Bank</option>
                  </select>
                </div>
              )}

              {/* Test failure toggle */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Testing Mode: Simulate Payment Failure</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

            </div>

          </div>

          {/* Right Column: Order Summary & Promo Code (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Booking Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Order Summary
              </h4>

              {/* Movie info */}
              <div className="flex gap-3 pb-3 border-b border-slate-800">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-14 aspect-[2/3] object-cover rounded-lg border border-slate-800"
                />
                <div className="overflow-hidden">
                  <h5 className="text-sm font-bold text-white truncate">{movie.title}</h5>
                  <p className="text-xs text-slate-400 mt-0.5">{theatre.name}</p>
                  <p className="text-[11px] font-mono text-red-400 mt-0.5">
                    {show.format} · {show.date} at {show.time}
                  </p>
                </div>
              </div>

              {/* Selected Seats detail */}
              <div className="text-xs space-y-1.5 py-1">
                <div className="flex justify-between text-slate-300">
                  <span>Seats ({selectedSeats.map((s) => s.seatId).join(', ')}):</span>
                  <span className="font-mono font-semibold">${ticketSubtotal.toFixed(2)}</span>
                </div>

                {bookedSnacks.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-slate-900">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">
                      Concessions:
                    </span>
                    {bookedSnacks.map((item) => (
                      <div key={item.snack.id} className="flex justify-between text-[11px] text-slate-400">
                        <span>{item.quantity}x {item.snack.name}</span>
                        <span className="font-mono">${(item.snack.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-900">
                  <span>Convenience Fee</span>
                  <span className="font-mono">${convenienceFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Entertainment Tax (8%)</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold pt-1">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Final Total */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400">Total Payable</span>
                  <p className="text-[10px] text-slate-500">Includes all taxes and fees</p>
                </div>
                <span className="text-2xl font-black font-mono text-white">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Apply Promo Code / Voucher
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder="e.g. IMOVIE20, FIRSTSHOW"
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white uppercase font-mono focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                >
                  Apply
                </button>
              </div>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Code <strong>{appliedPromo.code}</strong> applied!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAppliedPromo(null)}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-[11px] text-red-400">{promoError}</p>
              )}
            </form>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing & Reserving Tickets...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ${finalTotal.toFixed(2)} & Generate Pass</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
