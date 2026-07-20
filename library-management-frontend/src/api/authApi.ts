import axiosClient from './axiosClient';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../types';

const authApi = {
  login: (data: LoginRequest) =>
    axiosClient.post<ApiResponse<AuthResponse>>('/api/auth/login', data),

  register: (data: RegisterRequest) =>
    axiosClient.post<ApiResponse<AuthResponse>>('/api/auth/register', data),

  refreshToken: (refreshToken: string) =>
    axiosClient.post<ApiResponse<AuthResponse>>('/api/auth/refresh-token', { refreshToken }),

  logout: () =>
    axiosClient.post<ApiResponse<void>>('/api/auth/logout'),
};

export default authApi;
