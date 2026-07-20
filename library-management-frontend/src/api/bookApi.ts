import axiosClient from './axiosClient';
import type { ApiResponse, PageResponse } from '../types';
import type { BookResponse, BookRequest, BookFilterParams, CategoryResponse } from '../types';

const bookApi = {
  getAllBooks: (params?: BookFilterParams) =>
    axiosClient.get<ApiResponse<PageResponse<BookResponse>>>('/api/books', { params }),

  getBookById: (id: number) =>
    axiosClient.get<ApiResponse<BookResponse>>(`/api/books/${id}`),

  createBook: (data: BookRequest) =>
    axiosClient.post<ApiResponse<BookResponse>>('/api/books', data),

  updateBook: (id: number, data: BookRequest) =>
    axiosClient.put<ApiResponse<BookResponse>>(`/api/books/${id}`, data),

  deleteBook: (id: number) =>
    axiosClient.delete<ApiResponse<void>>(`/api/books/${id}`),
};

export const categoryApi = {
  getAllCategories: (params?: { keyword?: string; page?: number; size?: number }) =>
    axiosClient.get<ApiResponse<PageResponse<CategoryResponse>>>('/api/categories', { params }),

  getCategoryById: (id: number) =>
    axiosClient.get<ApiResponse<CategoryResponse>>(`/api/categories/${id}`),

  createCategory: (data: { name: string; description?: string }) =>
    axiosClient.post<ApiResponse<CategoryResponse>>('/api/categories', data),

  updateCategory: (id: number, data: { name: string; description?: string }) =>
    axiosClient.put<ApiResponse<CategoryResponse>>(`/api/categories/${id}`, data),

  deleteCategory: (id: number) =>
    axiosClient.delete<ApiResponse<void>>(`/api/categories/${id}`),
};

export default bookApi;
