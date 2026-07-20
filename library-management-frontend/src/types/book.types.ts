// ===== Book Types =====
export type BookStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';

export interface CategoryResponse {
  id: number;
  name: string;
  description: string | null;
  bookCount: number;
}

export interface BookResponse {
  id: number;
  title: string;
  author: string;
  categoryId: number | null;
  categoryName: string | null;
  isbn: string | null;
  description: string | null;
  coverImage: string | null;
  dailyRentalPrice: number;
  depositAmount: number;
  stockQuantity: number;
  status: BookStatus;
  publisher: string | null;
  publishedYear: number | null;
  pageCount: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookRequest {
  title: string;
  author: string;
  categoryId?: number | null;
  isbn?: string;
  description?: string;
  coverImage?: string;
  dailyRentalPrice: number;
  depositAmount: number;
  stockQuantity: number;
  status?: BookStatus;
  publisher?: string;
  publishedYear?: number;
  pageCount?: number;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}

export interface BookFilterParams {
  keyword?: string;
  categoryId?: number;
  status?: BookStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
