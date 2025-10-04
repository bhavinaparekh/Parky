import { ApiResponse, Booking, VehicleInfo } from '../types';
import { authService } from './authService';

const API_BASE_URL = 'http://localhost:3000/api'; // Update with your backend URL

class BookingService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await authService.getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'An error occurred',
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    }
  }

  async createBooking(
    spaceId: string,
    startTime: string,
    endTime: string,
    vehicleInfo: VehicleInfo,
    specialRequests?: string
  ): Promise<ApiResponse<Booking>> {
    return this.makeRequest<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        spaceId,
        startTime,
        endTime,
        vehicleInfo,
        specialRequests,
      }),
    });
  }

  async getUserBookings(type: 'upcoming' | 'past' = 'upcoming'): Promise<ApiResponse<Booking[]>> {
    const queryParams = new URLSearchParams({ type });
    return this.makeRequest<Booking[]>(`/bookings?${queryParams.toString()}`);
  }

  async getBookingById(bookingId: string): Promise<ApiResponse<Booking>> {
    return this.makeRequest<Booking>(`/bookings/${bookingId}`);
  }

  async updateBooking(
    bookingId: string,
    updates: {
      startTime?: string;
      endTime?: string;
      vehicleInfo?: VehicleInfo;
      specialRequests?: string;
    }
  ): Promise<ApiResponse<Booking>> {
    return this.makeRequest<Booking>(`/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/bookings/${bookingId}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason }),
    });
  }

  async extendBooking(bookingId: string, newEndTime: string): Promise<ApiResponse<Booking>> {
    return this.makeRequest<Booking>(`/bookings/${bookingId}/extend`, {
      method: 'POST',
      body: JSON.stringify({ newEndTime }),
    });
  }

  async checkIn(bookingId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/bookings/${bookingId}/check-in`, {
      method: 'POST',
    });
  }

  async checkOut(bookingId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/bookings/${bookingId}/check-out`, {
      method: 'POST',
    });
  }

  async getHostBookings(): Promise<ApiResponse<Booking[]>> {
    return this.makeRequest<Booking[]>('/bookings/host');
  }

  async confirmBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    return this.makeRequest<Booking>(`/bookings/${bookingId}/confirm`, {
      method: 'POST',
    });
  }

  async declineBooking(bookingId: string, reason?: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/bookings/${bookingId}/decline`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getBookingAvailability(
    spaceId: string,
    startTime: string,
    endTime: string
  ): Promise<ApiResponse<{ available: boolean; conflicts?: any[] }>> {
    const queryParams = new URLSearchParams({
      startTime,
      endTime,
    });

    return this.makeRequest<{ available: boolean; conflicts?: any[] }>(
      `/bookings/availability/${spaceId}?${queryParams.toString()}`
    );
  }

  async calculateBookingPrice(
    spaceId: string,
    startTime: string,
    endTime: string
  ): Promise<ApiResponse<{
    subtotal: number;
    platformFee: number;
    total: number;
    breakdown: any;
  }>> {
    const queryParams = new URLSearchParams({
      startTime,
      endTime,
    });

    return this.makeRequest<{
      subtotal: number;
      platformFee: number;
      total: number;
      breakdown: any;
    }>(`/bookings/calculate-price/${spaceId}?${queryParams.toString()}`);
  }
}

export const bookingService = new BookingService();
