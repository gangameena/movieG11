import React, { useState, useEffect } from 'react';
import { cinemaStore } from './services/store';
import {
  Movie,
  Theatre,
  Show,
  Booking,
  User,
  BookingSeatItem,
  BookedSnack,
  NotificationItem,
  UserRole,
} from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieFilters } from './components/MovieFilters';
import { MovieCard } from './components/MovieCard';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { SeatSelectionModal } from './components/SeatSelectionModal';
import { ConcessionsModal } from './components/ConcessionsModal';
import { CheckoutModal } from './components/CheckoutModal';
import { TicketPassModal } from './components/TicketPassModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AuthModal } from './components/AuthModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { TrailerModal } from './components/TrailerModal';
import { Footer } from './components/Footer';
import { Film, Sparkles, MapPin, Ticket } from 'lucide-react';

export default function App() {
  // Store reactive state
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = cinemaStore.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  const currentUser = cinemaStore.getCurrentUser();
  const selectedCity = cinemaStore.getSelectedCity();
  const cities = cinemaStore.getCities();
  const snacks = cinemaStore.getSnacks();
  const theatres = cinemaStore.getTheatres(selectedCity);
  const shows = cinemaStore.getShows();
  const bookings = cinemaStore.getBookings(currentUser?.role === 'admin' ? undefined : currentUser?.id);
  const allBookings = cinemaStore.getBookings(); // for admin metrics
  const notifications = cinemaStore.getNotifications(currentUser?.id);
  const adminStats = cinemaStore.getAdminStats();

  // Filters state
  const [status, setStatus] = useState<'now_showing' | 'coming_soon'>('now_showing');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active filtered movies
  const movies = cinemaStore.getMovies({
    status,
    genre: selectedGenre,
    format: selectedFormat,
    language: selectedLanguage,
    search: searchQuery,
  });

  const allMovies = cinemaStore.getMovies();

  // Modals & Navigation state
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [trailerData, setTrailerData] = useState<{ url: string; title: string } | null>(null);

  // Booking Flow Steps
  const [bookingShow, setBookingShow] = useState<Show | null>(null);
  const [bookingTheatre, setBookingTheatre] = useState<Theatre | null>(null);
  const [bookingMovie, setBookingMovie] = useState<Movie | null>(null);

  const [selectedSeats, setSelectedSeats] = useState<BookingSeatItem[]>([]);
  const [showConcessionsModal, setShowConcessionsModal] = useState<boolean>(false);
  const [bookedSnacks, setBookedSnacks] = useState<BookedSnack[]>([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);

  // Pass & Management Modals
  const [activeTicketPass, setActiveTicketPass] = useState<Booking | null>(null);
  const [showMyBookings, setShowMyBookings] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Reset filters
  const handleResetFilters = () => {
    setSelectedGenre('All');
    setSelectedFormat('All');
    setSelectedLanguage('All');
    setSearchQuery('');
  };

  // Launch Show Booking flow
  const handleStartShowBooking = (show: Show, theatre: Theatre, movie: Movie) => {
    setBookingShow(show);
    setBookingTheatre(theatre);
    setBookingMovie(movie);
    setSelectedMovie(null); // close details modal
  };

  // Step 1 -> 2: Seats to Concessions
  const handleProceedToConcessions = (seats: BookingSeatItem[], show: Show) => {
    setSelectedSeats(seats);
    // Lock seats in store
    cinemaStore.lockSeats(show.id, seats.map((s) => s.seatId), currentUser?.id || 'guest');
    setShowConcessionsModal(true);
  };

  // Step 2 -> 3: Concessions to Checkout
  const handleProceedToCheckout = (snacksSelected: BookedSnack[]) => {
    setBookedSnacks(snacksSelected);
    setShowConcessionsModal(false);
    setShowCheckoutModal(true);
  };

  // Step 3 -> Confirmation: Complete Booking
  const handleCompleteBooking = (bookingPayload: any) => {
    const createdBooking = cinemaStore.createBooking(bookingPayload);
    // Close checkout and seat flow
    setShowCheckoutModal(false);
    setBookingShow(null);
    setBookingTheatre(null);
    setBookingMovie(null);
    setSelectedSeats([]);
    setBookedSnacks([]);
    // Open Ticket pass
    setActiveTicketPass(createdBooking);
  };

  // Cancel Booking
  const handleCancelBooking = (bookingId: string) => {
    return cinemaStore.cancelBooking(bookingId);
  };

  // Real-time activity simulation
  const handleSimulateLiveActivity = (showId: string) => {
    return cinemaStore.simulateLiveActivity(showId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      
      {/* 1. Header / Navbar */}
      <Navbar
        currentUser={currentUser}
        selectedCity={selectedCity}
        cities={cities}
        notifications={notifications}
        bookingCount={bookings.filter((b) => b.bookingStatus === 'confirmed').length}
        onSelectCity={(city) => cinemaStore.setSelectedCity(city)}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenMyBookings={() => setShowMyBookings(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenNotifications={() => setShowNotifications(true)}
        onSwitchRole={(role) => cinemaStore.switchRole(role)}
        onLogout={() => cinemaStore.logout()}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        onNavigateHome={() => {
          handleResetFilters();
          setStatus('now_showing');
        }}
      />

      {/* 2. Hero Blockbuster Banner (Hidden if active search filter is applied) */}
      {!searchQuery && (
        <HeroBanner
          movies={allMovies}
          onSelectMovie={(movie) => setSelectedMovie(movie)}
          onWatchTrailer={(url, title) => setTrailerData({ url, title })}
        />
      )}

      {/* 3. Movie Catalog Section */}
      <main id="movies" className="flex-1 w-full pb-16">
        
        {/* Filters and Status Tabs */}
        <MovieFilters
          status={status}
          onStatusChange={setStatus}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          selectedFormat={selectedFormat}
          onFormatChange={setSelectedFormat}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          totalCount={movies.length}
          onReset={handleResetFilters}
        />

        {/* Movies Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {status === 'now_showing' ? `Now Showing in ${selectedCity}` : 'Upcoming Blockbusters'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {status === 'now_showing'
                  ? 'Real-time reserved seating in IMAX Laser, Dolby Cinema & 4DX'
                  : 'Be the first to secure tickets for upcoming releases.'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{selectedCity} Multiplexes</span>
            </div>
          </div>

          {movies.length === 0 ? (
            <div className="py-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 p-8 space-y-3">
              <Film className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No matching movies found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No titles match your current filter criteria. Try resetting filters or switching between Now Showing and Coming Soon.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onSelectMovie={(m) => setSelectedMovie(m)}
                  onWatchTrailer={(url, title) => setTrailerData({ url, title })}
                />
              ))}
            </div>
          )}

        </div>

      </main>

      {/* 4. Footer */}
      <Footer
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenMyBookings={() => setShowMyBookings(true)}
        onSelectCity={(city) => cinemaStore.setSelectedCity(city)}
        cities={cities}
      />

      {/* --- MODALS & WORKFLOWS --- */}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          theatres={theatres}
          shows={shows}
          selectedCity={selectedCity}
          currentUser={currentUser}
          onClose={() => setSelectedMovie(null)}
          onSelectShow={handleStartShowBooking}
          onWatchTrailer={(url, title) => setTrailerData({ url, title })}
          onAddReview={(movieId, rating, comment) => cinemaStore.addReview(movieId, rating, comment)}
        />
      )}

      {/* Step 1: Real-Time Seat Selection Screen */}
      {bookingShow && bookingTheatre && bookingMovie && (
        <SeatSelectionModal
          show={bookingShow}
          theatre={bookingTheatre}
          movie={bookingMovie}
          userId={currentUser?.id || 'guest'}
          onClose={() => {
            setBookingShow(null);
            setBookingTheatre(null);
            setBookingMovie(null);
          }}
          onProceedToConcessions={handleProceedToConcessions}
          onSimulateLiveActivity={handleSimulateLiveActivity}
        />
      )}

      {/* Step 2: Concessions & Food Add-on Modal */}
      {showConcessionsModal && bookingShow && (
        <ConcessionsModal
          snacks={snacks}
          selectedSeats={selectedSeats}
          show={bookingShow}
          onClose={() => {
            setShowConcessionsModal(false);
            setBookingShow(null);
          }}
          onBackToSeats={() => {
            setShowConcessionsModal(false);
          }}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {/* Step 3: Checkout & Payment Modal */}
      {showCheckoutModal && bookingMovie && bookingTheatre && bookingShow && (
        <CheckoutModal
          movie={bookingMovie}
          theatre={bookingTheatre}
          show={bookingShow}
          selectedSeats={selectedSeats}
          bookedSnacks={bookedSnacks}
          currentUser={currentUser}
          onClose={() => {
            setShowCheckoutModal(false);
            setBookingShow(null);
          }}
          onBackToConcessions={() => {
            setShowCheckoutModal(false);
            setShowConcessionsModal(true);
          }}
          onCompleteBooking={handleCompleteBooking}
        />
      )}

      {/* Digital E-Ticket Pass Modal */}
      {activeTicketPass && (
        <TicketPassModal
          booking={activeTicketPass}
          onClose={() => setActiveTicketPass(null)}
          onViewMyBookings={() => {
            setActiveTicketPass(null);
            setShowMyBookings(true);
          }}
        />
      )}

      {/* My Bookings History & Cancellation */}
      {showMyBookings && (
        <MyBookingsModal
          bookings={bookings}
          onClose={() => setShowMyBookings(false)}
          onViewTicketPass={(b) => setActiveTicketPass(b)}
          onCancelBooking={handleCancelBooking}
        />
      )}

      {/* Admin Cinema Operations Dashboard */}
      {showAdminModal && (
        <AdminDashboardModal
          currentUser={currentUser}
          movies={allMovies}
          theatres={theatres}
          shows={shows}
          bookings={allBookings}
          stats={adminStats}
          onClose={() => setShowAdminModal(false)}
          onAddMovie={(m) => cinemaStore.addMovie(m)}
          onDeleteMovie={(id) => cinemaStore.deleteMovie(id)}
          onAddShow={(s) => cinemaStore.addShow(s)}
          onAddTheatre={(t) => cinemaStore.addTheatre(t)}
          onCancelBooking={(id) => cinemaStore.cancelBooking(id)}
        />
      )}

      {/* Auth Modal (Login / Sign Up / Demo RBAC Switcher) */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={(email, pass, role) => cinemaStore.login(email, pass, role)}
          onRegister={(name, email, phone) => cinemaStore.register(name, email, phone)}
        />
      )}

      {/* Notifications Drawer */}
      {showNotifications && (
        <NotificationsDrawer
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkRead={(id) => cinemaStore.markNotificationRead(id)}
          onClearAll={() => cinemaStore.clearAllNotifications()}
          onOpenMyBookings={() => setShowMyBookings(true)}
        />
      )}

      {/* Trailer Video Player Modal */}
      {trailerData && (
        <TrailerModal
          trailerUrl={trailerData.url}
          movieTitle={trailerData.title}
          onClose={() => setTrailerData(null)}
        />
      )}

    </div>
  );
}
