// User Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  dateOfBirth?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  userType: 'renter' | 'host' | 'both';
  createdAt: string;
  updatedAt: string;
}

// Parking Space Types
export interface ParkingSpace {
  id: string;
  hostId: string;
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  spaceType: 'driveway' | 'garage' | 'lot' | 'street' | 'covered';
  vehicleTypes: string[];
  hourlyRate?: number;
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  amenities: string[];
  maxVehicleLength?: number;
  maxVehicleWidth?: number;
  maxVehicleHeight?: number;
  instructions?: string;
  instantBook: boolean;
  status: 'active' | 'inactive' | 'pending_approval';
  photos: SpacePhoto[];
  availability: AvailabilitySchedule[];
  createdAt: string;
  updatedAt: string;
}

export interface SpacePhoto {
  id: string;
  spaceId: string;
  photoUrl: string;
  caption?: string;
  displayOrder: number;
  createdAt: string;
}

export interface AvailabilitySchedule {
  id: string;
  spaceId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// Booking Types
export interface Booking {
  id: string;
  renterId: string;
  spaceId: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  platformFee: number;
  hostPayout: number;
  vehicleInfo: VehicleInfo;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  cancellationReason?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
  space?: ParkingSpace;
  renter?: User;
}

export interface VehicleInfo {
  make: string;
  model: string;
  color: string;
  licensePlate: string;
}

// Payment Types
export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  paymentIntentId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';
  stripeChargeId?: string;
  refundAmount: number;
  processedAt?: string;
  createdAt: string;
}

// Review Types
export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1-5
  comment?: string;
  reviewType: 'host_to_renter' | 'renter_to_host' | 'renter_to_space';
  createdAt: string;
  reviewer?: User;
}

// Search and Filter Types
export interface SearchFilters {
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in miles
  };
  startTime?: string;
  endTime?: string;
  vehicleType?: string;
  spaceType?: string[];
  amenities?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  instantBook?: boolean;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  SpaceDetails: { spaceId: string };
  BookingConfirmation: { bookingId: string };
  Profile: undefined;
  EditProfile: undefined;
  MySpaces: undefined;
  AddSpace: undefined;
  EditSpace: { spaceId: string };
  MyBookings: undefined;
  BookingDetails: { bookingId: string };
  Reviews: { userId: string };
  Settings: undefined;
  Help: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyEmail: { email: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Bookings: undefined;
  Profile: undefined;
};

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: 'renter' | 'host' | 'both';
}

export interface SpaceForm {
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  spaceType: string;
  vehicleTypes: string[];
  hourlyRate?: number;
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  amenities: string[];
  maxVehicleLength?: number;
  maxVehicleWidth?: number;
  maxVehicleHeight?: number;
  instructions?: string;
  instantBook: boolean;
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'review' | 'system';
  read: boolean;
  createdAt: string;
}
