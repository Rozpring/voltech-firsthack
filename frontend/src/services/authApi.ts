// 認証関連のAPIコール関数群

import { apiClient } from '../utils/apiClient';
import type { LoginResponse, UserResponse, RegisterRequest } from '../types/api';

/**
 * ログイン - OAuth2形式でFormData送信
 */
export const login = async (username: string, password: string): Promise<LoginResponse> => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    return apiClient.postFormData<LoginResponse>('/api/v1/users/login/', formData);
};

/**
 * 新規ユーザー登録
 */
export const register = async (username: string, password: string): Promise<UserResponse> => {
    const userData: RegisterRequest = { username, password };
    return apiClient.post<UserResponse>('/api/v1/users/', userData);
};

/**
 * 現在のユーザー情報を取得
 */
export const getCurrentUser = async (): Promise<UserResponse> => {
    return apiClient.get<UserResponse>('/api/v1/users/me');
};