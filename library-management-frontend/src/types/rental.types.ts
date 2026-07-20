// ===== Rental Order Types =====
export type RentalStatus = 'PENDING' | 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'CANCELLED';

export interface RentalOrderResponse {
  id: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookCoverImage: string | null;
  startDate: string;
  endDate: string;
  actualReturnDate: string | null;
  rentalDays: number;
  rentalPrice: number;
  depositAmount: number;
  totalAmount: number;
  status: RentalStatus;
  deliveryAddress: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RentalOrderRequest {
  bookId: number;
  startDate: string;
  rentalDays: number;
  deliveryAddress: string;
  notes?: string;
}

export interface RentalFilterParams {
  status?: RentalStatus;
  userId?: number;
  keyword?: string;
  page?: number;
  size?: number;
}
