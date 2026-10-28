export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export type MovieFormat = '2D' | '3D' | 'IMAX' | 'IMAX 3D' | 'Dolby Atmos' | '4DX';
export type MovieCertification = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | 'U/A' | 'A';

export interface MovieReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  poster: string;
  backdrop: string;
  genres: string[];
  languages: string[];
  releaseDate: string;
  durationMinutes: number;
  certification: MovieCertification;
  rating: number; // e.g. 8.8
  votesCount: number;
  director: string;
  cast: { name: string; role: string; avatar?: string }[];
  formats: MovieFormat[];
  trailerUrl: string;
  status: 'now_showing' | 'coming_soon';
  reviews?: MovieReview[];
}

export interface Screen {
  id: string;
  name: string;
  format: MovieFormat;
  totalRows: number;
  seatsPerRow: number;
  capacity: number;
}

export interface Theatre {
  id: string;
  name: string;
  city: string;
  location: string;
  address: string;
  amenities: string[];
  screens: Screen[];
}

export type SeatTier = 'standard' | 'premium' | 'recliner';

export interface ShowPriceTiers {
  standard: number;
  premium: number;
  recliner: number;
}

export interface Show {
  id: string;
  movieId: string;
  theatreId: string;
  screenId: string;
  screenName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (e.g. "14:30")
  language: string;
  format: MovieFormat;
  pricing: ShowPriceTiers;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: string[]; // seat ids e.g. ["C5", "C6"]
  lockedSeats?: { [seatId: string]: { lockedBy: string; expiresAt: number } };
}

export type SeatStatus = 'available' | 'selected' | 'booked' | 'locked' | 'space';

export interface Seat {
  id: string; // e.g. "A1"
  row: string; // e.g. "A"
  number: number; // e.g. 1
  tier: SeatTier;
  price: number;
  status: SeatStatus;
  isWheelchair?: boolean;
}

export interface SnackItem {
  id: string;
  name: string;
  category: 'popcorn' | 'snacks' | 'beverages' | 'combos';
  description: string;
  price: number;
  image: string;
  calories?: string;
}

export interface BookedSnack {
  snack: SnackItem;
  quantity: number;
}

export interface BookingSeatItem {
  seatId: string;
  row: string;
  number: number;
  tier: SeatTier;
  price: number;
}

export interface Booking {
  id: string;
  bookingReference: string; // e.g. IMV-7842
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  movieDuration: number;
  movieCertification: MovieCertification;
  theatreId: string;
  theatreName: string;
  theatreLocation: string;
  theatreAddress: string;
  screenName: string;
  format: MovieFormat;
  language: string;
  showId: string;
  showDate: string;
  showTime: string;
  seats: BookingSeatItem[];
  snacks: BookedSnack[];
  ticketSubtotal: number;
  snacksSubtotal: number;
  tax: number;
  convenienceFee: number;
  discount: number;
  promoCode?: string;
  totalAmount: number;
  paymentMethod: 'card' | 'upi' | 'wallet' | 'netbanking';
  paymentTransactionId: string;
  paymentStatus: 'paid' | 'refunded';
  bookingStatus: 'confirmed' | 'cancelled';
  bookedAt: string;
  cancelledAt?: string;
  refundAmount?: number;
  qrCodeUrl?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'cancellation' | 'reminder' | 'offer';
  read: boolean;
  createdAt: string;
  linkAction?: string;
}
