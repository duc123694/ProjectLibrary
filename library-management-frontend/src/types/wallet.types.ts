// ===== Wallet Types =====
export type TransactionType =
  | 'DEPOSIT'
  | 'RENTAL_PAYMENT'
  | 'DEPOSIT_PAYMENT'
  | 'DEPOSIT_REFUND'
  | 'OVERDUE_FEE';

export interface WalletResponse {
  id: number;
  userId: number;
  balance: number;
  updatedAt: string;
}

export interface WalletTransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  description: string;
  rentalOrderId: number | null;
  createdAt: string;
}

export interface WalletDepositRequest {
  amount: number;
}
