import React, { useState } from 'react';
import { CalendarDays, Package, MapPin, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import rentalApi from '../../../api/rentalApi';
import type { BookResponse, RentalOrderRequest } from '../../../types';

interface RentalOrderFormProps {
  book: BookResponse;
  onSuccess: () => void;
  onCancel: () => void;
}

const RentalOrderForm: React.FC<RentalOrderFormProps> = ({ book, onSuccess, onCancel }) => {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    startDate: today,
    rentalDays: 7,
    deliveryAddress: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const endDate = new Date(form.startDate);
  endDate.setDate(endDate.getDate() + form.rentalDays);

  const rentalFee = book.dailyRentalPrice * form.rentalDays;
  const totalAmount = rentalFee + book.depositAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.deliveryAddress.trim()) {
      setError('Vui lòng nhập địa chỉ nhận sách');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const req: RentalOrderRequest = {
        bookId: book.id,
        startDate: form.startDate,
        rentalDays: form.rentalDays,
        deliveryAddress: form.deliveryAddress,
        notes: form.notes || undefined,
      };
      await rentalApi.createOrder(req);
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đặt thuê thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-surface-900 mb-1">Đặt thuê thành công!</h3>
        <p className="text-sm text-surface-500">Chúng tôi sẽ xử lý và giao sách sớm nhất.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Book Info */}
      <div className="flex gap-4 p-4 bg-surface-50 rounded-2xl">
        <div className="w-16 h-20 rounded-xl bg-surface-200 overflow-hidden shrink-0">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-surface-900 text-sm line-clamp-2">{book.title}</h4>
          <p className="text-xs text-surface-500 mt-0.5">{book.author}</p>
          <div className="mt-2 flex gap-2 text-xs">
            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full font-medium">
              {book.dailyRentalPrice.toLocaleString('vi-VN')}đ/ngày
            </span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
              Cọc: {book.depositAmount.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>
      </div>

      {/* Start Date */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-surface-600 mb-1.5">
          <CalendarDays className="w-3.5 h-3.5" />
          Ngày bắt đầu
        </label>
        <input
          type="date"
          min={today}
          value={form.startDate}
          onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
          className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          required
        />
      </div>

      {/* Rental Days */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-surface-600 mb-1.5">
          <Package className="w-3.5 h-3.5" />
          Số ngày thuê: <span className="text-primary-600">{form.rentalDays} ngày</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={60}
            value={form.rentalDays}
            onChange={e => setForm(prev => ({ ...prev, rentalDays: Number(e.target.value) }))}
            className="flex-1 accent-primary-600"
          />
          <input
            type="number"
            min={1}
            max={60}
            value={form.rentalDays}
            onChange={e => setForm(prev => ({ ...prev, rentalDays: Math.min(60, Math.max(1, Number(e.target.value))) }))}
            className="w-16 px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <p className="text-xs text-surface-400 mt-1">
          Trả sách dự kiến: <span className="font-semibold text-surface-600">{endDate.toLocaleDateString('vi-VN')}</span>
        </p>
      </div>

      {/* Delivery Address */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-surface-600 mb-1.5">
          <MapPin className="w-3.5 h-3.5" />
          Địa chỉ nhận sách
        </label>
        <textarea
          value={form.deliveryAddress}
          onChange={e => setForm(prev => ({ ...prev, deliveryAddress: e.target.value }))}
          placeholder="Nhập địa chỉ giao hàng cụ thể..."
          rows={2}
          className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
          required
        />
      </div>

      {/* Notes */}
      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-surface-600 mb-1.5">
          <FileText className="w-3.5 h-3.5" />
          Ghi chú (tùy chọn)
        </label>
        <textarea
          value={form.notes}
          onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Ghi chú thêm cho người giao hàng..."
          rows={2}
          className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
        />
      </div>

      {/* Price Summary */}
      <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-surface-600">Phí thuê ({form.rentalDays} ngày)</span>
          <span className="font-semibold">{rentalFee.toLocaleString('vi-VN')}đ</span>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-surface-600">Tiền đặt cọc</span>
          <span className="font-semibold">{book.depositAmount.toLocaleString('vi-VN')}đ</span>
        </div>
        <div className="flex justify-between border-t border-primary-200 pt-2.5">
          <span className="font-bold text-surface-900">Tổng thanh toán</span>
          <span className="font-black text-primary-700 text-lg">{totalAmount.toLocaleString('vi-VN')}đ</span>
        </div>
        <p className="text-xs text-surface-500 mt-1.5">* Tiền cọc sẽ được hoàn lại khi trả sách đúng hạn</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 text-sm font-semibold text-surface-700 bg-surface-100 hover:bg-surface-200 rounded-2xl transition-all"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 rounded-2xl shadow-md shadow-primary-500/20 transition-all disabled:opacity-60"
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận thuê'}
        </button>
      </div>
    </form>
  );
};

export default RentalOrderForm;
