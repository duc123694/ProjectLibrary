import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Calendar, MapPin, Clock,
  Eye, XCircle, BookOpen
} from 'lucide-react';
import rentalApi from '../../api/rentalApi';
import type { RentalOrderResponse, RentalStatus } from '../../types';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const PAGE_SIZE = 10;

const statusConfig: Record<RentalStatus, { label: string; variant: 'warning' | 'success' | 'info' | 'danger' | 'default' }> = {
  PENDING: { label: 'Chờ xử lý', variant: 'warning' },
  ACTIVE: { label: 'Đang thuê', variant: 'success' },
  RETURNED: { label: 'Đã trả', variant: 'default' },
  OVERDUE: { label: 'Quá hạn', variant: 'danger' },
  CANCELLED: { label: 'Đã hủy', variant: 'danger' },
};

const RentalOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<RentalOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState<RentalStatus | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<RentalOrderResponse | null>(null);
  const [cancelOrder, setCancelOrder] = useState<RentalOrderResponse | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await rentalApi.getMyOrders({ status: statusFilter, page, size: PAGE_SIZE });
      const data = res.data.data;
      setOrders(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleCancel = async () => {
    if (!cancelOrder) return;
    setCancelLoading(true);
    try {
      await rentalApi.updateStatus(cancelOrder.id, 'CANCELLED');
      setCancelOrder(null);
      fetchOrders();
    } catch {
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('vi-VN');

  const getIsOverdue = (order: RentalOrderResponse) => {
    if (order.status !== 'ACTIVE') return false;
    return new Date(order.endDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-black text-surface-900">Đơn thuê của tôi</h1>
          <p className="text-surface-500 mt-1 text-sm">Quản lý tất cả các đơn thuê sách</p>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-1">
            {[
              { value: undefined, label: 'Tất cả' },
              { value: 'PENDING' as RentalStatus, label: 'Chờ xử lý' },
              { value: 'ACTIVE' as RentalStatus, label: 'Đang thuê' },
              { value: 'RETURNED' as RentalStatus, label: 'Đã trả' },
              { value: 'OVERDUE' as RentalStatus, label: 'Quá hạn' },
              { value: 'CANCELLED' as RentalStatus, label: 'Đã hủy' },
            ].map(opt => (
              <button
                key={String(opt.value)}
                onClick={() => { setStatusFilter(opt.value); setPage(0); }}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                  statusFilter === opt.value
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-3xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-surface-300" />
            </div>
            <h3 className="text-lg font-bold text-surface-700 mb-2">Chưa có đơn thuê nào</h3>
            <p className="text-surface-400 text-sm mb-6">Hãy khám phá kho sách và đặt thuê ngay!</p>
            <Link to="/books" className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl text-sm font-bold shadow-md shadow-primary-500/20 transition-all">
              Khám phá sách
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map(order => {
                const st = statusConfig[order.status];
                const isOverdue = getIsOverdue(order);
                return (
                  <div key={order.id} className="bg-white rounded-3xl border border-surface-100 hover:border-surface-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Cover */}
                        <div className="w-full sm:w-16 h-20 sm:h-20 rounded-2xl bg-surface-100 overflow-hidden shrink-0 self-start">
                          {order.bookCoverImage ? (
                            <img src={order.bookCoverImage} alt={order.bookTitle} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-indigo-600">
                              <BookOpen className="w-7 h-7 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-bold text-surface-900 text-base truncate">{order.bookTitle}</h3>
                              <p className="text-xs text-surface-500">{order.bookAuthor}</p>
                            </div>
                            <Badge variant={isOverdue ? 'danger' : st.variant} dot>
                              {isOverdue ? 'Quá hạn' : st.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 text-xs text-surface-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{formatDate(order.startDate)} – {formatDate(order.endDate)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{order.rentalDays} ngày</span>
                            </div>
                            <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{order.deliveryAddress}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div>
                              <span className="text-xs text-surface-400">Tổng thanh toán: </span>
                              <span className="text-sm font-black text-primary-600">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-surface-600 bg-surface-100 hover:bg-surface-200 rounded-xl transition-all"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Chi tiết
                              </button>
                              {order.status === 'PENDING' && (
                                <button
                                  onClick={() => setCancelOrder(order)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  Hủy
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
                loading={loading}
              />
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
              <Row label="Tác giả" value={selectedOrder.bookAuthor} />
              <Row label="Trạng thái" value={
                <Badge variant={statusConfig[selectedOrder.status].variant} dot>{statusConfig[selectedOrder.status].label}</Badge>
              } />
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
          </div>
        )}
      </Modal>

      {/* Cancel Confirm */}
      <ConfirmDialog
        isOpen={!!cancelOrder}
        onClose={() => setCancelOrder(null)}
        onConfirm={handleCancel}
        title="Hủy đơn thuê"
        message={`Bạn có chắc muốn hủy đơn thuê sách "${cancelOrder?.bookTitle}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Hủy đơn"
        loading={cancelLoading}
        variant="danger"
      />
    </div>
  );
};

const Row: React.FC<{ label: string; value: React.ReactNode; bold?: boolean }> = ({ label, value, bold }) => (
  <div className="flex justify-between items-start gap-4">
    <span className="text-surface-500 shrink-0">{label}</span>
    <span className={`text-right ${bold ? 'font-bold text-surface-900' : 'text-surface-700'}`}>{value}</span>
  </div>
);

export default RentalOrdersPage;
