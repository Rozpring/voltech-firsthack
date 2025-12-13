// Category API functions

import { apiClient } from '../utils/apiClient';
import type {
    CategoryCreateRequest,
    CategoryUpdateRequest,
    CategoryResponse,
} from '../types/api';

/**
 * Get all categories for the current user
 */
export const getCategories = async (): Promise<CategoryResponse[]> => {
    return apiClient.get<CategoryResponse[]>('/api/v1/categories/');
};

/**
 * Create a new category
 */
export const createCategory = async (
    categoryData: CategoryCreateRequest
): Promise<CategoryResponse> => {
    return apiClient.post<CategoryResponse>('/api/v1/categories/', categoryData);
};

/**
 * Update an existing category
 */
export const updateCategory = async (
    categoryId: number,
    categoryData: CategoryUpdateRequest
): Promise<CategoryResponse> => {
    return apiClient.put<CategoryResponse>(`/api/v1/categories/${categoryId}`, categoryData);
};

/**
 * Delete a category
 */
export const deleteCategory = async (categoryId: number): Promise<void> => {
    return apiClient.delete<void>(`/api/v1/categories/${categoryId}`);
};
