import React, { useState, useEffect, useCallback } from 'react';
import { Search, BookOpen, Eye, ChevronDown } from 'lucide-react';
import rentalApi from '../../../api/rentalApi';
import type { RentalOrderResponse, RentalStatus } from '../../../types';
import Badge from '../../../components/common/Badge';
import Pagination from '../../../components/common/Pagination';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Modal from '../../../components/common/Modal';

const PAGE_SIZE = 10;

const statusConfig: Record<RentalStatus, { label: string; variant: 'warning' | 'success' | 'info' | 'danger' | 'default'; nextStatuses: RentalStatus[] }> = {
  PENDING: { label: 'Chờ xử lý', variant: 'warning', nextStatuses: ['ACTIVE', 'CANCELLED'] },
  ACTIVE: { label: 'Đang thuê', variant: 'success', nextStatuses: ['RETURNED', 'OVERDUE'] },
  RETURNED: { label: 'Đã trả', variant: 'default', nextStatuses: [] },
  OVERDUE: { label: 'Quá hạn', variant: 'danger', nextStatuses: ['RETURNED'] },
  CANCELLED: { label: 'Đã hủy', variant: 'danger', nextStatuses: [] },
};

const statusLabels: Record<RentalStatus, string> = {
  PENDING: 'Chờ xử lý',
  ACTIVE: 'Đang thuê',
  RETURNED: 'Đã trả',
  OVERDUE: 'Quá hạn',
  CANCELLED: 'Đã hủy',
};

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<RentalOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<RentalStatus | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<RentalOrderResponse | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await rentalApi.getAllOrders({ keyword: keyword || undefined, status: statusFilter, page, size: PAGE_SIZE });
      const data = res.data.data;
      setOrders(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch { setOrders([]); }
    finally { setLoading(false); }
  }, [keyword, statusFilter, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: number, newStatus: RentalStatus) => {
    setUpdatingStatus(orderId);
    try {
      await rentalApi.updateStatus(orderId, newStatus);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch { }
    finally { setUpdatingStatus(null); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-black text-surface-900">Quản lý Đơn Thuê</h1>
              <p className="text-surface-500 text-sm mt-0.5">{totalElements} đơn thuê</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                value={keyword}
                onChange={e => { setKeyword(e.target.value); setPage(0); }}
                placeholder="Tìm tên sách, người dùng..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter ?? ''}
                onChange={e => { setStatusFilter((e.target.value as RentalStatus) || undefined); setPage(0); }}
                className="appearance-none pl-4 pr-9 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(statusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-surface-200 mx-auto mb-3" />
            <p className="text-surface-400 text-sm">Không có đơn thuê nào</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl border border-surface-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-100 bg-surface-50/50">
                      <th className="text-left px-6 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Sách</th>
                      <th className="text-left px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider hidden md:table-cell">Người thuê</th>
                      <th className="text-left px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider hidden sm:table-cell">Thời hạn</th>
                      <th className="text-left px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider hidden lg:table-cell">Tổng tiền</th>
                      <th className="text-left px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="text-right px-6 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-50">
                    {orders.map(order => {
                      const st = statusConfig[order.status];
                      const nextStatuses = st.nextStatuses;
                      return (
                        <tr key={order.id} className="hover:bg-surface-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-surface-900 line-clamp-1">{order.bookTitle}</p>
                            <p className="text-xs text-surface-500">{order.bookAuthor}</p>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <p className="text-sm text-surface-700 font-medium">{order.userFullName}</p>
                            <p className="text-xs text-surface-400">{order.userEmail}</p>
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <p className="text-xs text-surface-600">{formatDate(order.startDate)} → {formatDate(order.endDate)}</p>
                            <p className="text-xs text-surface-400">{order.rentalDays} ngày</p>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <span className="text-sm font-bold text-primary-600">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant={st.variant} dot size="sm">{st.label}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {nextStatuses.length > 0 && (
                                <div className="relative">
                                  <select
                                    value=""
                                    onChange={e => { if (e.target.value) handleUpdateStatus(order.id, e.target.value as RentalStatus); }}
                                    disabled={updatingStatus === order.id}
                                    className="appearance-none pl-2 pr-7 py-1.5 text-xs font-semibold bg-surface-100 border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer disabled:opacity-50"
                                  >
                                    <option value="">Đổi TT</option>
                                    {nextStatuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-surface-400 pointer-events-none" />
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-surface-100">
                <Pagination currentPage={page} totalPages={totalPages} totalElements={totalElements} pageSize={PAGE_SIZE} onPageChange={setPage} loading={loading} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="Chi tiết đơn thuê" size="md">
        {selectedOrder && (
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-surface-50 rounded-2xl space-y-2">
              <Row label="Sách" value={selectedOrder.bookTitle} bold />
              <Row label="Người thuê" value={selectedOrder.userFullName} />
              <Row label="Email" value={selectedOrder.userEmail} />
              <Row label="Trạng thái" value={<Badge variant={statusConfig[selectedOrder.status].variant} dot>{statusConfig[selectedOrder.status].label}</Badge>} />
            </div>
            <div className="p-4 bg-surface-50 rounded-2xl space-y-2">
              <Row label="Ngày bắt đầu" value={formatDate(selectedOrder.startDate)} />
              <Row label="Ngày kết thúc" value={formatDate(selectedOrder.endDate)} />
              {selectedOrder.actualReturnDate && <Row label="Ngày trả thực tế" value={formatDate(selectedOrder.actualReturnDate)} />}
              <Row label="Số ngày thuê" value={`${selectedOrder.rentalDays} ngày`} />
            </div>
            <div className="p-4 bg-surface-50 rounded-2xl space-y-2">
              <Row label="Phí thuê" value={`${selectedOrder.rentalPrice.toLocaleString('vi-VN')}đ`} />
              <Row label="Tiền cọc" value={`${selectedOrder.depositAmount.toLocaleString('vi-VN')}đ`} />
              <Row label="Tổng cộng" value={`${selectedOrder.totalAmount.toLocaleString('vi-VN')}đ`} bold />
            </div>
            <div className="p-4 bg-surface-50 rounded-2xl space-y-2">
              <Row label="Địa chỉ giao" value={selectedOrder.deliveryAddress} />
              {selectedOrder.notes && <Row label="Ghi chú" value={selectedOrder.notes} />}
            </div>
            {statusConfig[selectedOrder.status].nextStatuses.length > 0 && (
              <div className="pt-1">
                <p className="text-xs font-semibold text-surface-600 mb-2">Cập nhật trạng thái</p>
                <div className="flex gap-2 flex-wrap">
                  {statusConfig[selectedOrder.status].nextStatuses.map(s => (
                    <button
                      key={s}
                      onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                      disabled={updatingStatus === selectedOrder.id}
                      className="px-4 py-2 text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all disabled:opacity-60"
                    >
                      → {statusLabels[s]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

const Row: React.FC<{ label: string; value: React.ReactNode; bold?: boolean }> = ({ label, value, bold }) => (
  <div className="flex justify-between items-start gap-4">
    <span className="text-surface-500 shrink-0">{label}</span>
    <span className={`text-right ${bold ? 'font-bold text-surface-900' : 'text-surface-700'}`}>{value}</span>
  </div>
);

export default AdminOrdersPage;
