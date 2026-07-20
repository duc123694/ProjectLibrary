import axiosClient from './axiosClient';
import type { ApiResponse, PageResponse } from '../types';
import type { RentalOrderResponse, RentalOrderRequest, RentalFilterParams, RentalStatus } from '../types';

const rentalApi = {
  getMyOrders: (params?: RentalFilterParams) =>
    axiosClient.get<ApiResponse<PageResponse<RentalOrderResponse>>>('/api/rental-orders/my', { params }),

  getAllOrders: (params?: RentalFilterParams) =>
    axiosClient.get<ApiResponse<PageResponse<RentalOrderResponse>>>('/api/rental-orders', { params }),

  getOrderById: (id: number) =>
    axiosClient.get<ApiResponse<RentalOrderResponse>>(`/api/rental-orders/${id}`),

  createOrder: (data: RentalOrderRequest) =>
    axiosClient.post<ApiResponse<RentalOrderResponse>>('/api/rental-orders', data),

  updateStatus: (id: number, status: RentalStatus) =>
    axiosClient.patch<ApiResponse<RentalOrderResponse>>(`/api/rental-orders/${id}/status`, { status }),
};

export default rentalApi;
