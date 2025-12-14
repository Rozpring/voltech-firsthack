// Location API functions

import { apiClient } from '../utils/apiClient';
import type {
    LocationCreateRequest,
    LocationUpdateRequest,
    LocationResponse,
    NearbyLocationResponse,
} from '../types/api';

/**
 * Get all locations for the current user
 */
export const getLocations = async (): Promise<LocationResponse[]> => {
    return apiClient.get<LocationResponse[]>('/api/v1/locations/');
};

/**
 * Get a specific location by ID
 */
export const getLocation = async (locationId: number): Promise<LocationResponse> => {
    return apiClient.get<LocationResponse>(`/api/v1/locations/${locationId}`);
};

/**
 * Find the nearest location within its radius
 */
export const findNearbyLocation = async (
    latitude: number,
    longitude: number
): Promise<NearbyLocationResponse | null> => {
    return apiClient.get<NearbyLocationResponse | null>(
        `/api/v1/locations/nearby?latitude=${latitude}&longitude=${longitude}`
    );
};

/**
 * Create a new location
 */
export const createLocation = async (
    locationData: LocationCreateRequest
): Promise<LocationResponse> => {
    return apiClient.post<LocationResponse>('/api/v1/locations/', locationData);
};

/**
 * Update an existing location
 */
export const updateLocation = async (
    locationId: number,
    locationData: LocationUpdateRequest
): Promise<LocationResponse> => {
    return apiClient.put<LocationResponse>(`/api/v1/locations/${locationId}`, locationData);
};

/**
 * Delete a location
 */
export const deleteLocation = async (locationId: number): Promise<void> => {
    return apiClient.delete<void>(`/api/v1/locations/${locationId}`);
};
