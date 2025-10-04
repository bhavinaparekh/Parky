import { ApiResponse, ParkingSpace, SearchFilters, PaginatedResponse, SpaceForm } from '../types';
import { authService } from './authService';

const API_BASE_URL = 'http://localhost:3000/api'; // Update with your backend URL

class SpaceService {
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

  async searchSpaces(filters: SearchFilters): Promise<ApiResponse<PaginatedResponse<ParkingSpace>>> {
    const queryParams = new URLSearchParams();
    
    if (filters.location) {
      queryParams.append('lat', filters.location.latitude.toString());
      queryParams.append('lng', filters.location.longitude.toString());
      queryParams.append('radius', filters.location.radius.toString());
    }
    
    if (filters.startTime) {
      queryParams.append('startTime', filters.startTime);
    }
    
    if (filters.endTime) {
      queryParams.append('endTime', filters.endTime);
    }
    
    if (filters.vehicleType) {
      queryParams.append('vehicleType', filters.vehicleType);
    }
    
    if (filters.spaceType && filters.spaceType.length > 0) {
      queryParams.append('spaceType', filters.spaceType.join(','));
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      queryParams.append('amenities', filters.amenities.join(','));
    }
    
    if (filters.priceRange) {
      queryParams.append('minPrice', filters.priceRange.min.toString());
      queryParams.append('maxPrice', filters.priceRange.max.toString());
    }
    
    if (filters.instantBook !== undefined) {
      queryParams.append('instantBook', filters.instantBook.toString());
    }

    return this.makeRequest<PaginatedResponse<ParkingSpace>>(`/spaces/search?${queryParams.toString()}`);
  }

  async getNearbySpaces(): Promise<ApiResponse<ParkingSpace[]>> {
    return this.makeRequest<ParkingSpace[]>('/spaces/nearby');
  }

  async getSpaceById(spaceId: string): Promise<ApiResponse<ParkingSpace>> {
    return this.makeRequest<ParkingSpace>(`/spaces/${spaceId}`);
  }

  async createSpace(spaceData: SpaceForm): Promise<ApiResponse<ParkingSpace>> {
    return this.makeRequest<ParkingSpace>('/spaces', {
      method: 'POST',
      body: JSON.stringify(spaceData),
    });
  }

  async updateSpace(spaceId: string, spaceData: Partial<SpaceForm>): Promise<ApiResponse<ParkingSpace>> {
    return this.makeRequest<ParkingSpace>(`/spaces/${spaceId}`, {
      method: 'PUT',
      body: JSON.stringify(spaceData),
    });
  }

  async deleteSpace(spaceId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/spaces/${spaceId}`, {
      method: 'DELETE',
    });
  }

  async getUserSpaces(): Promise<ApiResponse<ParkingSpace[]>> {
    return this.makeRequest<ParkingSpace[]>('/spaces/my-spaces');
  }

  async uploadSpacePhoto(spaceId: string, imageUri: string): Promise<ApiResponse<{ photoUrl: string }>> {
    const formData = new FormData();
    formData.append('photo', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);

    return this.makeRequest<{ photoUrl: string }>(`/spaces/${spaceId}/photos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }

  async deleteSpacePhoto(photoId: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/spaces/photos/${photoId}`, {
      method: 'DELETE',
    });
  }

  async getSpaceAvailability(spaceId: string, startDate: string, endDate: string): Promise<ApiResponse<boolean[]>> {
    const queryParams = new URLSearchParams({
      startDate,
      endDate,
    });

    return this.makeRequest<boolean[]>(`/spaces/${spaceId}/availability?${queryParams.toString()}`);
  }

  async updateSpaceAvailability(spaceId: string, availability: any[]): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/spaces/${spaceId}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ availability }),
    });
  }

  async getSpaceReviews(spaceId: string): Promise<ApiResponse<any[]>> {
    return this.makeRequest<any[]>(`/reviews/space/${spaceId}`);
  }

  async getSpaceStats(spaceId: string): Promise<ApiResponse<{
    totalBookings: number;
    totalEarnings: number;
    averageRating: number;
    occupancyRate: number;
  }>> {
    return this.makeRequest<{
      totalBookings: number;
      totalEarnings: number;
      averageRating: number;
      occupancyRate: number;
    }>(`/spaces/${spaceId}/stats`);
  }
}

export const spaceService = new SpaceService();
