import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {
  INITIAL_MOVIES,
  INITIAL_THEATRES,
  INITIAL_SHOWS,
  INITIAL_SNACKS,
  INITIAL_BOOKINGS,
  INITIAL_USERS,
  CITIES,
} from './src/data/mockData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory backend data stores representing MongoDB collections
let moviesCollection = [...INITIAL_MOVIES];
let theatresCollection = [...INITIAL_THEATRES];
let showsCollection = [...INITIAL_SHOWS];
let bookingsCollection = [...INITIAL_BOOKINGS];
let usersCollection = [...INITIAL_USERS];
let snacksCollection = [...INITIAL_SNACKS];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // 1. System & Health API
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  app.get('/api/info', (req: Request, res: Response) => {
    res.json({
      name: 'IMovies MERN Architecture API',
      version: '1.0.0',
      database: 'MongoDB (Mongoose Schema Engine)',
      endpoints: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/movies',
        'GET /api/movies/:id',
        'POST /api/movies',
        'PUT /api/movies/:id',
        'DELETE /api/movies/:id',
        'GET /api/theatres',
        'GET /api/shows',
        'GET /api/shows/:id',
        'POST /api/shows/:id/lock',
        'POST /api/bookings',
        'GET /api/bookings',
        'POST /api/bookings/:id/cancel',
        'GET /api/snacks',
        'GET /api/admin/metrics',
      ],
    });
  });

  // 2. Auth Endpoints (JWT / Session Simulation)
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const existing = usersCollection.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.json({ token: `mock-jwt-token-${existing.id}`, user: existing });
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone: phone || '+1 (555) 000-0000',
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    };
    usersCollection.push(newUser);
    res.status(201).json({ token: `mock-jwt-token-${newUser.id}`, user: newUser });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email } = req.body;
    const user = usersCollection.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) || usersCollection[0];
    res.json({
      token: `mock-jwt-token-${user.id}`,
      user,
    });
  });

  // 3. Movies API
  app.get('/api/movies', (req: Request, res: Response) => {
    const { status, genre, search, city } = req.query;
    let list = [...moviesCollection];
    if (status) {
      list = list.filter((m) => m.status === status);
    }
    if (genre && genre !== 'All') {
      list = list.filter((m) => m.genres.some((g) => g.toLowerCase() === (genre as string).toLowerCase()));
    }
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter((m) => m.title.toLowerCase().includes(q) || m.director.toLowerCase().includes(q));
    }
    res.json({ movies: list, total: list.length });
  });

  app.get('/api/movies/:id', (req: Request, res: Response) => {
    const movie = moviesCollection.find((m) => m.id === req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  });

  app.post('/api/movies', (req: Request, res: Response) => {
    const newMovie = {
      ...req.body,
      id: `mov-${Date.now()}`,
      votesCount: 1,
      rating: req.body.rating || 8.0,
      reviews: [],
    };
    moviesCollection.unshift(newMovie);
    res.status(201).json(newMovie);
  });

  app.put('/api/movies/:id', (req: Request, res: Response) => {
    const idx = moviesCollection.findIndex((m) => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Movie not found' });
    moviesCollection[idx] = { ...moviesCollection[idx], ...req.body };
    res.json(moviesCollection[idx]);
  });

  app.delete('/api/movies/:id', (req: Request, res: Response) => {
    moviesCollection = moviesCollection.filter((m) => m.id !== req.params.id);
    res.json({ message: 'Movie deleted successfully' });
  });

  // 4. Theatres & Cities
  app.get('/api/cities', (_req: Request, res: Response) => {
    res.json({ cities: CITIES });
  });

  app.get('/api/theatres', (req: Request, res: Response) => {
    const { city } = req.query;
    let list = theatresCollection;
    if (city) {
      list = list.filter((t) => t.city.toLowerCase() === (city as string).toLowerCase());
    }
    res.json({ theatres: list });
  });

  // 5. Shows API & Seat Locking
  app.get('/api/shows', (req: Request, res: Response) => {
    const { movieId, theatreId, date } = req.query;
    let list = [...showsCollection];
    if (movieId) list = list.filter((s) => s.movieId === movieId);
    if (theatreId) list = list.filter((s) => s.theatreId === theatreId);
    if (date) list = list.filter((s) => s.date === date);
    res.json({ shows: list });
  });

  app.get('/api/shows/:id', (req: Request, res: Response) => {
    const show = showsCollection.find((s) => s.id === req.params.id);
    if (!show) return res.status(404).json({ error: 'Show not found' });
    res.json(show);
  });

  app.post('/api/shows/:id/lock', (req: Request, res: Response) => {
    const { seats, userId } = req.body;
    const show = showsCollection.find((s) => s.id === req.params.id);
    if (!show) return res.status(404).json({ error: 'Show not found' });
    show.lockedSeats = show.lockedSeats || {};
    const expiresAt = Date.now() + 10 * 60 * 1000;
    (seats || []).forEach((sid: string) => {
      show.lockedSeats![sid] = { lockedBy: userId || 'anonymous', expiresAt };
    });
    res.json({ success: true, lockedSeats: show.lockedSeats });
  });

  // 6. Bookings & Cancellations
  app.get('/api/bookings', (req: Request, res: Response) => {
    const { userId } = req.query;
    let list = bookingsCollection;
    if (userId) list = list.filter((b) => b.userId === userId);
    res.json({ bookings: list });
  });

  app.post('/api/bookings', (req: Request, res: Response) => {
    const bookingData = req.body;
    const refNum = `IMV-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingReference: refNum,
      bookedAt: new Date().toISOString(),
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      qrCodeUrl: `${refNum}-${(bookingData.seats || []).map((s: any) => s.seatId).join('')}`,
    };
    bookingsCollection.unshift(newBooking);

    // Update show booked seats
    const show = showsCollection.find((s) => s.id === bookingData.showId);
    if (show && bookingData.seats) {
      const seatIds = bookingData.seats.map((s: any) => s.seatId);
      show.bookedSeats = Array.from(new Set([...show.bookedSeats, ...seatIds]));
      show.availableSeats = Math.max(0, show.totalSeats - show.bookedSeats.length);
    }
    res.status(201).json(newBooking);
  });

  app.post('/api/bookings/:id/cancel', (req: Request, res: Response) => {
    const booking = bookingsCollection.find((b) => b.id === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.cancelledAt = new Date().toISOString();

    const show = showsCollection.find((s) => s.id === booking.showId);
    if (show) {
      const seatIds = booking.seats.map((s) => s.seatId);
      show.bookedSeats = show.bookedSeats.filter((sid) => !seatIds.includes(sid));
      show.availableSeats = Math.min(show.totalSeats, show.totalSeats - show.bookedSeats.length);
    }
    res.json({ success: true, booking });
  });

  // 7. Snacks
  app.get('/api/snacks', (_req: Request, res: Response) => {
    res.json({ snacks: snacksCollection });
  });

  // 8. Admin Metrics
  app.get('/api/admin/metrics', (_req: Request, res: Response) => {
    const totalRev = bookingsCollection.reduce((s, b) => (b.bookingStatus === 'confirmed' ? s + b.totalAmount : s), 0);
    const tickets = bookingsCollection.reduce((s, b) => (b.bookingStatus === 'confirmed' ? s + b.seats.length : s), 0);
    res.json({
      totalRevenue: totalRev,
      ticketsSold: tickets,
      activeShows: showsCollection.length,
      moviesCount: moviesCollection.length,
    });
  });

  // Production vs Dev mode
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[IMovies] Full-stack Cinema Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[IMovies] Failed to start server:', err);
});
