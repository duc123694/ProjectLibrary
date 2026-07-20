import React, { useState, useEffect, useCallback } from 'react';
import {
  Wallet, Plus, ArrowUpRight,
  ArrowDownLeft, CreditCard, AlertCircle, CheckCircle, History
} from 'lucide-react';
import walletApi from '../../api/walletApi';
import type { WalletResponse, WalletTransactionResponse, TransactionType } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';

const PAGE_SIZE = 10;

const txConfig: Record<TransactionType, { label: string; icon: React.ElementType; color: string; isCredit: boolean }> = {
  DEPOSIT: { label: 'Nạp tiền', icon: ArrowDownLeft, color: 'text-emerald-600 bg-emerald-50', isCredit: true },
  RENTAL_PAYMENT: { label: 'Phí thuê sách', icon: ArrowUpRight, color: 'text-red-500 bg-red-50', isCredit: false },
  DEPOSIT_PAYMENT: { label: 'Thanh toán cọc', icon: ArrowUpRight, color: 'text-amber-600 bg-amber-50', isCredit: false },
  DEPOSIT_REFUND: { label: 'Hoàn cọc', icon: ArrowDownLeft, color: 'text-emerald-600 bg-emerald-50', isCredit: true },
  OVERDUE_FEE: { label: 'Phí quá hạn', icon: ArrowUpRight, color: 'text-red-600 bg-red-50', isCredit: false },
};

const WalletPage: React.FC = () => {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [transactions, setTransactions] = useState<WalletTransactionResponse[]>([]);
  const [walletLoading, setWalletLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositMsg, setDepositMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchWallet = useCallback(async () => {
    setWalletLoading(true);
    try {
      const res = await walletApi.getMyWallet();
      setWallet(res.data.data);
    } catch {}
    finally { setWalletLoading(false); }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setTxLoading(true);
    try {
      const res = await walletApi.getTransactions({ page, size: PAGE_SIZE });
      const data = res.data.data;
      setTransactions(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchWallet(); }, [fetchWallet]);
  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (!amount || amount < 10000) {
      setDepositMsg({ type: 'error', text: 'Số tiền nạp tối thiểu là 10.000đ' });
      return;
    }
    setDepositLoading(true);
    setDepositMsg(null);
    try {
      await walletApi.deposit({ amount });
      setDepositMsg({ type: 'success', text: `Nạp ${amount.toLocaleString('vi-VN')}đ thành công!` });
      setDepositAmount('');
      fetchWallet();
      fetchTransactions();
      setTimeout(() => { setDepositOpen(false); setDepositMsg(null); }, 1500);
    } catch (err: any) {
      setDepositMsg({ type: 'error', text: err?.response?.data?.message || 'Nạp tiền thất bại' });
    } finally {
      setDepositLoading(false);
    }
  };

  const quickAmounts = [50000, 100000, 200000, 500000];
  const formatDate = (d: string) => new Date(d).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Wallet Balance Card */}
        {walletLoading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
        ) : (
          <div className="relative bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-700 rounded-4xl p-8 mb-8 overflow-hidden shadow-2xl shadow-primary-900/30">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-primary-200 text-xs font-semibold tracking-wide uppercase">Ví điện tử</p>
                    <p className="text-white font-bold">LibraryHub Wallet</p>
                  </div>
                </div>
                <button
                  onClick={() => setDepositOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Nạp tiền
                </button>
              </div>

              <div>
                <p className="text-primary-200 text-sm mb-1">Số dư hiện tại</p>
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {wallet?.balance.toLocaleString('vi-VN') ?? '0'}
                  <span className="text-2xl text-primary-200 ml-1">đ</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white rounded-3xl border border-surface-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-100">
            <History className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-surface-900">Lịch sử giao dịch</h2>
            <span className="text-xs text-surface-500 ml-auto">{totalElements} giao dịch</span>
          </div>

          {txLoading ? (
            <div className="flex justify-center py-16"><LoadingSpinner size="md" /></div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16">
              <CreditCard className="w-12 h-12 text-surface-200 mx-auto mb-3" />
              <p className="text-surface-400 text-sm">Chưa có giao dịch nào</p>
            </div>
          ) : (
            <div>
              {transactions.map((tx, idx) => {
                const cfg = txConfig[tx.type] ?? { label: tx.type, icon: CreditCard, color: 'text-surface-500 bg-surface-100', isCredit: false };
                const Icon = cfg.icon;
                return (
                  <div
                    key={tx.id}
                    className={`flex items-center gap-4 px-6 py-4 hover:bg-surface-50/50 transition-colors ${idx < transactions.length - 1 ? 'border-b border-surface-50' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-2xl ${cfg.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-800">{cfg.label}</p>
                      <p className="text-xs text-surface-400 mt-0.5 truncate">{tx.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${cfg.isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
                        {cfg.isCredit ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-xs text-surface-400 mt-0.5">{formatDate(tx.createdAt)}</p>
                    </div>
                  </div>
                );
              })}

              <div className="p-6">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  pageSize={PAGE_SIZE}
                  onPageChange={setPage}
                  loading={txLoading}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      <Modal isOpen={depositOpen} onClose={() => { setDepositOpen(false); setDepositMsg(null); }} title="Nạp tiền vào ví" size="sm">
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-600 mb-2">Số tiền nạp</label>
            <div className="relative">
              <input
                type="number"
                min={10000}
                step={1000}
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                placeholder="Nhập số tiền..."
                className="w-full pl-4 pr-14 py-3 bg-surface-50 border border-surface-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-surface-400">đ</span>
            </div>
          </div>

          {/* Quick amounts */}
          <div className="grid grid-cols-2 gap-2">
            {quickAmounts.map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setDepositAmount(String(amt))}
                className={`py-2 text-sm font-semibold rounded-xl border transition-all ${
                  depositAmount === String(amt)
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-surface-50 text-surface-600 border-surface-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {amt.toLocaleString('vi-VN')}đ
              </button>
            ))}
          </div>

          {depositMsg && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
              depositMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {depositMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {depositMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={depositLoading}
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl shadow-md shadow-primary-500/20 transition-all disabled:opacity-60"
          >
            {depositLoading ? 'Đang xử lý...' : 'Xác nhận nạp tiền'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default WalletPage;
