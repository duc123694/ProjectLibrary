import axiosClient from './axiosClient';
import type { ApiResponse, PageResponse, UserResponse, UpdateUserRequest, ChangePasswordRequest } from '../types';
import type { Role, UserStatus } from '../types';

const userApi = {
  getProfile: () =>
    axiosClient.get<ApiResponse<UserResponse>>('/api/users/profile'),

  getUserById: (id: number) =>
    axiosClient.get<ApiResponse<UserResponse>>(`/api/users/${id}`),

  getAllUsers: (params?: {
    keyword?: string;
    role?: Role;
    status?: UserStatus;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }) => axiosClient.get<ApiResponse<PageResponse<UserResponse>>>('/api/users', { params }),

  updateUser: (id: number, data: UpdateUserRequest) =>
    axiosClient.put<ApiResponse<UserResponse>>(`/api/users/${id}`, data),

  updateUserRole: (id: number, role: Role) =>
    axiosClient.put<ApiResponse<UserResponse>>(`/api/users/${id}/role`, { role }),

  updateUserStatus: (id: number, status: UserStatus) =>
    axiosClient.put<ApiResponse<UserResponse>>(`/api/users/${id}/status`, { status }),

  changePassword: (id: number, data: ChangePasswordRequest) =>
    axiosClient.put<ApiResponse<void>>(`/api/users/${id}/password`, data),
};

export default userApi;
