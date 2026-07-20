import axiosClient from './axiosClient';
import type { ApiResponse, PageResponse } from '../types';
import type { WalletResponse, WalletTransactionResponse, WalletDepositRequest } from '../types';

const walletApi = {
  getMyWallet: () =>
    axiosClient.get<ApiResponse<WalletResponse>>('/api/wallet'),

  deposit: (data: WalletDepositRequest) =>
    axiosClient.post<ApiResponse<WalletResponse>>('/api/wallet/deposit', data),

  getTransactions: (params?: { page?: number; size?: number }) =>
    axiosClient.get<ApiResponse<PageResponse<WalletTransactionResponse>>>('/api/wallet/transactions', { params }),
};

export default walletApi;
