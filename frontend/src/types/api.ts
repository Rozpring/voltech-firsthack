// API request/response types

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface UserResponse {
    id: number;
    username: string;
}

export interface TaskCreateRequest {
    title: string;
    description?: string;
    deadline?: string; // ISO datetime string
    priority?: string; // "low" | "medium" | "high"
    category_id?: number;
}

export interface TaskUpdateRequest {
    title?: string;
    description?: string;
    deadline?: string;
    priority?: string;
    is_completed?: boolean;
    category_id?: number | null;
}

export interface TaskResponse {
    id: number;
    title: string;
    description?: string;
    is_completed: boolean;
    priority: string;
    deadline?: string;
    created_at: string;
    owner_id: number;
    category_id?: number | null;
}

// Category types
export interface CategoryCreateRequest {
    name: string;
    color?: string;
}

export interface CategoryUpdateRequest {
    name?: string;
    color?: string;
}

export interface CategoryResponse {
    id: number;
    name: string;
    color: string;
    user_id: number;
}

export interface APIError {
    detail: string;
}

// Location types
export interface LocationCreateRequest {
    name: string;
    latitude: number;
    longitude: number;
    radius?: number;
    category_id?: number | null;
}

export interface LocationUpdateRequest {
    name?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    category_id?: number | null;
}

export interface LocationResponse {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
    category_id?: number | null;
    owner_id: number;
}

export interface NearbyLocationResponse extends LocationResponse {
    distance: number;  // 現在地からの距離（メートル）
}

