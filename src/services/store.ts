import {
  Movie,
  Theatre,
  Show,
  Booking,
  SnackItem,
  NotificationItem,
  User,
  UserRole,
  MovieReview,
  SeatTier,
} from '../types';
import {
  INITIAL_MOVIES,
  INITIAL_THEATRES,
  INITIAL_SHOWS,
  INITIAL_SNACKS,
  INITIAL_BOOKINGS,
  INITIAL_USERS,
  CITIES,
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'imovies_users_v2',
  CURRENT_USER: 'imovies_current_user_v2',
  MOVIES: 'imovies_movies_v2',
  THEATRES: 'imovies_theatres_v2',
  SHOWS: 'imovies_shows_v2',
  BOOKINGS: 'imovies_bookings_v2',
  NOTIFICATIONS: 'imovies_notifications_v2',
  CITY: 'imovies_selected_city_v2',
};

class CinemaStore {
  private users: User[] = [];
  private currentUser: User | null = null;
  private movies: Movie[] = [];
  private theatres: Theatre[] = [];
  private shows: Show[] = [];
  private bookings: Booking[] = [];
  private snacks: SnackItem[] = INITIAL_SNACKS;
  private notifications: NotificationItem[] = [];
  private selectedCity: string = 'New York';
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initData();
  }

  private initData() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      this.users = storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;

      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      this.currentUser = storedUser ? JSON.parse(storedUser) : INITIAL_USERS[0];

      const storedMovies = localStorage.getItem(STORAGE_KEYS.MOVIES);
      this.movies = storedMovies ? JSON.parse(storedMovies) : INITIAL_MOVIES;

      const storedTheatres = localStorage.getItem(STORAGE_KEYS.THEATRES);
      this.theatres = storedTheatres ? JSON.parse(storedTheatres) : INITIAL_THEATRES;

      const storedShows = localStorage.getItem(STORAGE_KEYS.SHOWS);
      this.shows = storedShows ? JSON.parse(storedShows) : INITIAL_SHOWS;

      const storedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      this.bookings = storedBookings ? JSON.parse(storedBookings) : INITIAL_BOOKINGS;

      const storedCity = localStorage.getItem(STORAGE_KEYS.CITY);
      this.selectedCity = storedCity || 'New York';

      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (storedNotifs) {
        this.notifications = JSON.parse(storedNotifs);
      } else {
        this.notifications = [
          {
            id: 'notif-1',
            userId: 'user-1',
            title: 'Welcome to IMovies Premiere',
            message: 'Browse top movies in IMAX 3D, Dolby Atmos, and book your luxury recliner seats with zero booking hassle.',
            type: 'offer',
            read: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'notif-2',
            userId: 'user-1',
            title: 'Booking Confirmed: Dune: Part Two',
            message: 'Your tickets for Dune: Part Two at IMovies Grand Royale IMAX (C5, C6) are confirmed. Show starts at 13:30.',
            type: 'booking',
            read: false,
            createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          },
        ];
      }
    } catch {
      // Fallback
      this.users = INITIAL_USERS;
      this.currentUser = INITIAL_USERS[0];
      this.movies = INITIAL_MOVIES;
      this.theatres = INITIAL_THEATRES;
      this.shows = INITIAL_SHOWS;
      this.bookings = INITIAL_BOOKINGS;
      this.selectedCity = 'New York';
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(this.movies));
      localStorage.setItem(STORAGE_KEYS.THEATRES, JSON.stringify(this.theatres));
      localStorage.setItem(STORAGE_KEYS.SHOWS, JSON.stringify(this.shows));
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(this.bookings));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
      localStorage.setItem(STORAGE_KEYS.CITY, this.selectedCity);
    } catch (err) {
      console.warn('Storage save error:', err);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- Auth & Users ---
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public login(email: string, _pass: string, requestedRole?: UserRole): { success: boolean; message?: string } {
    let found = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      // Create user on login if demo
      found = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: requestedRole || (email.includes('admin') ? 'admin' : 'user'),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        createdAt: new Date().toISOString(),
      };
      this.users.push(found);
    }
    if (requestedRole) {
      found.role = requestedRole;
    }
    this.currentUser = found;
    this.save();
    return { success: true };
  }

  public switchRole(role: UserRole) {
    if (this.currentUser) {
      this.currentUser.role = role;
    } else {
      const match = this.users.find((u) => u.role === role) || this.users[0];
      this.currentUser = { ...match, role };
    }
    this.save();
  }

  public register(name: string, email: string, phone?: string): { success: boolean; message?: string } {
    const existing = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      this.currentUser = existing;
      this.save();
      return { success: true };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone: phone || '+1 (555) 000-1122',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    this.currentUser = newUser;
    this.save();
    return { success: true };
  }

  public logout() {
    this.currentUser = null;
    this.save();
  }

  // --- City ---
  public getSelectedCity(): string {
    return this.selectedCity;
  }

  public setSelectedCity(city: string) {
    this.selectedCity = city;
    this.save();
  }

  public getCities(): string[] {
    return CITIES;
  }

  // --- Movies ---
  public getMovies(options?: {
    status?: 'now_showing' | 'coming_soon';
    genre?: string;
    language?: string;
    format?: string;
    search?: string;
  }): Movie[] {
    let list = [...this.movies];
    if (options?.status) {
      list = list.filter((m) => m.status === options.status);
    }
    if (options?.genre && options.genre !== 'All') {
      list = list.filter((m) => m.genres.some((g) => g.toLowerCase() === options.genre?.toLowerCase()));
    }
    if (options?.language && options.language !== 'All') {
      list = list.filter((m) => m.languages.some((l) => l.toLowerCase() === options.language?.toLowerCase()));
    }
    if (options?.format && options.format !== 'All') {
      list = list.filter((m) => m.formats.some((f) => f.toLowerCase() === options.format?.toLowerCase()));
    }
    if (options?.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q)) ||
          m.cast.some((c) => c.name.toLowerCase().includes(q))
      );
    }
    return list;
  }

  public getMovieById(id: string): Movie | undefined {
    return this.movies.find((m) => m.id === id);
  }

  public addMovie(movie: Omit<Movie, 'id' | 'votesCount' | 'reviews'>): Movie {
    const newMovie: Movie = {
      ...movie,
      id: `mov-${Date.now()}`,
      votesCount: 1,
      reviews: [],
    };
    this.movies.unshift(newMovie);
    this.save();
    return newMovie;
  }

  public updateMovie(id: string, updates: Partial<Movie>): boolean {
    const idx = this.movies.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    this.movies[idx] = { ...this.movies[idx], ...updates };
    this.save();
    return true;
  }

  public deleteMovie(id: string): boolean {
    this.movies = this.movies.filter((m) => m.id !== id);
    this.shows = this.shows.filter((s) => s.movieId !== id);
    this.save();
    return true;
  }

  public addReview(movieId: string, rating: number, comment: string): boolean {
    const movie = this.movies.find((m) => m.id === movieId);
    if (!movie) return false;
    const user = this.currentUser || {
      id: 'guest',
      name: 'Cinema Guest',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };
    const newRev: MovieReview = {
      id: `rev-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    movie.reviews = movie.reviews || [];
    movie.reviews.unshift(newRev);

    // recalculate average rating
    const total = movie.reviews.reduce((acc, r) => acc + r.rating, 0);
    movie.rating = Number((total / movie.reviews.length).toFixed(1));
    movie.votesCount += 1;
    this.save();
    return true;
  }

  // --- Theatres ---
  public getTheatres(city?: string): Theatre[] {
    if (city) {
      return this.theatres.filter((t) => t.city.toLowerCase() === city.toLowerCase());
    }
    return this.theatres;
  }

  public getTheatreById(id: string): Theatre | undefined {
    return this.theatres.find((t) => t.id === id);
  }

  public addTheatre(theatre: Omit<Theatre, 'id'>): Theatre {
    const newTh: Theatre = {
      ...theatre,
      id: `th-${Date.now()}`,
    };
    this.theatres.push(newTh);
    this.save();
    return newTh;
  }

  // --- Shows ---
  public getShows(filter?: { movieId?: string; theatreId?: string; date?: string }): Show[] {
    let list = [...this.shows];
    if (filter?.movieId) {
      list = list.filter((s) => s.movieId === filter.movieId);
    }
    if (filter?.theatreId) {
      list = list.filter((s) => s.theatreId === filter.theatreId);
    }
    if (filter?.date) {
      list = list.filter((s) => s.date === filter.date);
    }
    return list;
  }

  public getShowById(id: string): Show | undefined {
    return this.shows.find((s) => s.id === id);
  }

  public addShow(show: Omit<Show, 'id' | 'availableSeats' | 'bookedSeats' | 'lockedSeats'>): Show {
    const newShow: Show = {
      ...show,
      id: `sh-${Date.now()}`,
      availableSeats: show.totalSeats,
      bookedSeats: [],
      lockedSeats: {},
    };
    this.shows.push(newShow);
    this.save();
    return newShow;
  }

  // Real-time seat locking with hold expiration
  public lockSeats(showId: string, seatIds: string[], userId: string): boolean {
    const show = this.shows.find((s) => s.id === showId);
    if (!show) return false;
    show.lockedSeats = show.lockedSeats || {};

    const now = Date.now();
    // Clean expired locks
    Object.keys(show.lockedSeats).forEach((seatId) => {
      if (show.lockedSeats![seatId].expiresAt < now) {
        delete show.lockedSeats![seatId];
      }
    });

    // Check if any seat is already booked or locked by another user
    for (const seatId of seatIds) {
      if (show.bookedSeats.includes(seatId)) return false;
      const existingLock = show.lockedSeats[seatId];
      if (existingLock && existingLock.lockedBy !== userId && existingLock.expiresAt > now) {
        return false;
      }
    }

    // Apply 10 minute lock (600,000 ms)
    const expiresAt = now + 10 * 60 * 1000;
    seatIds.forEach((seatId) => {
      show.lockedSeats![seatId] = { lockedBy: userId, expiresAt };
    });

    this.save();
    return true;
  }

  public unlockSeats(showId: string, seatIds: string[], userId: string) {
    const show = this.shows.find((s) => s.id === showId);
    if (!show || !show.lockedSeats) return;
    seatIds.forEach((seatId) => {
      if (show.lockedSeats![seatId]?.lockedBy === userId) {
        delete show.lockedSeats![seatId];
      }
    });
    this.save();
  }

  // Real-time simulation of other moviegoers reserving or booking seats
  public simulateLiveActivity(showId: string): string | null {
    const show = this.shows.find((s) => s.id === showId);
    if (!show) return null;
    const rows = ['B', 'C', 'D', 'E', 'F'];
    const row = rows[Math.floor(Math.random() * rows.length)];
    const num = Math.floor(Math.random() * 10) + 1;
    const seatId = `${row}${num}`;

    if (!show.bookedSeats.includes(seatId)) {
      show.bookedSeats.push(seatId);
      show.availableSeats = Math.max(0, show.availableSeats - 1);
      this.save();
      return `Seat ${seatId} was just reserved by another patron in real-time.`;
    }
    return null;
  }

  // --- Bookings & Checkout ---
  public createBooking(bookingData: Omit<Booking, 'id' | 'bookingReference' | 'bookedAt' | 'paymentStatus' | 'bookingStatus'>): Booking {
    const show = this.shows.find((s) => s.id === bookingData.showId);
    if (show) {
      const seatIds = bookingData.seats.map((s) => s.seatId);
      // Mark as booked
      show.bookedSeats = Array.from(new Set([...show.bookedSeats, ...seatIds]));
      show.availableSeats = Math.max(0, show.totalSeats - show.bookedSeats.length);

      // Clean locks
      if (show.lockedSeats) {
        seatIds.forEach((sid) => delete show.lockedSeats![sid]);
      }
    }

    const refNum = `IMV-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingReference: refNum,
      bookedAt: new Date().toISOString(),
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      qrCodeUrl: `${refNum}-${bookingData.seats.map((s) => s.seatId).join('')}-${bookingData.movieId}`,
    };

    this.bookings.unshift(newBooking);

    // Create confirmation notification
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: bookingData.userId,
      title: 'Booking Confirmed!',
      message: `Tickets for ${bookingData.movieTitle} at ${bookingData.theatreName} (${bookingData.seats.map((s) => s.seatId).join(', ')}) confirmed. Total: $${bookingData.totalAmount.toFixed(2)}`,
      type: 'booking',
      read: false,
      createdAt: new Date().toISOString(),
      linkAction: newBooking.id,
    });

    this.save();
    return newBooking;
  }

  public getBookings(userId?: string): Booking[] {
    if (userId) {
      return this.bookings.filter((b) => b.userId === userId);
    }
    return this.bookings;
  }

  public getBookingById(id: string): Booking | undefined {
    return this.bookings.find((b) => b.id === id);
  }

  // Cancellation & Refund calculation
  public cancelBooking(bookingId: string): { success: boolean; refundAmount: number; message: string } {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, refundAmount: 0, message: 'Booking not found' };
    if (booking.bookingStatus === 'cancelled') {
      return { success: false, refundAmount: 0, message: 'Booking already cancelled' };
    }

    // Cancellation Policy:
    // If show is in future:
    // > 2 hours prior to showtime: 100% refund of tickets (excluding convenience fee)
    // <= 2 hours: 75% refund of tickets
    const showDateTime = new Date(`${booking.showDate}T${booking.showTime}:00`);
    const now = new Date();
    const diffHours = (showDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundRatio = 1.0;
    if (diffHours < 2) {
      refundRatio = 0.75;
    }

    const refundableSubtotal = booking.ticketSubtotal + booking.snacksSubtotal;
    const refundAmount = Number((refundableSubtotal * refundRatio).toFixed(2));

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancelledAt = new Date().toISOString();
    booking.refundAmount = refundAmount;

    // Release seats back to the show!
    const show = this.shows.find((s) => s.id === booking.showId);
    if (show) {
      const cancelledSeatIds = booking.seats.map((s) => s.seatId);
      show.bookedSeats = show.bookedSeats.filter((sid) => !cancelledSeatIds.includes(sid));
      show.availableSeats = Math.min(show.totalSeats, show.totalSeats - show.bookedSeats.length);
    }

    // Notification
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: booking.userId,
      title: 'Booking Cancelled & Refund Initiated',
      message: `Your booking ${booking.bookingReference} has been cancelled. A refund of $${refundAmount.toFixed(2)} has been credited to your original payment method.`,
      type: 'cancellation',
      read: false,
      createdAt: new Date().toISOString(),
    });

    this.save();
    return {
      success: true,
      refundAmount,
      message: `Booking successfully cancelled. Refund of $${refundAmount.toFixed(2)} (${refundRatio * 100}%) has been issued.`,
    };
  }

  // --- Snacks ---
  public getSnacks(): SnackItem[] {
    return this.snacks;
  }

  // --- Notifications ---
  public getNotifications(userId?: string): NotificationItem[] {
    if (userId) {
      return this.notifications.filter((n) => n.userId === userId || n.userId === 'user-1');
    }
    return this.notifications;
  }

  public markNotificationRead(id: string) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
    }
  }

  public clearAllNotifications() {
    this.notifications = [];
    this.save();
  }

  // --- Admin Stats ---
  public getAdminStats() {
    const totalBookings = this.bookings.length;
    const activeBookings = this.bookings.filter((b) => b.bookingStatus === 'confirmed');
    const totalRevenue = activeBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalTicketsSold = activeBookings.reduce((sum, b) => sum + b.seats.length, 0);

    const totalSeatsInShows = this.shows.reduce((sum, s) => sum + s.totalSeats, 0);
    const bookedSeatsInShows = this.shows.reduce((sum, s) => sum + s.bookedSeats.length, 0);
    const occupancyRate = totalSeatsInShows > 0 ? Math.round((bookedSeatsInShows / totalSeatsInShows) * 100) : 0;

    return {
      totalRevenue,
      totalTicketsSold,
      totalBookings,
      activeShowsCount: this.shows.length,
      occupancyRate,
      activeMoviesCount: this.movies.filter((m) => m.status === 'now_showing').length,
    };
  }
}

export const cinemaStore = new CinemaStore();
