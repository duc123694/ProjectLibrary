import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, ArrowLeft, Tag, Building, Calendar, BookMarked,
  ChevronRight, Star, AlertCircle
} from 'lucide-react';
import bookApi from '../../api/bookApi';
import type { BookResponse } from '../../types';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import RentalOrderForm from './components/RentalOrderForm';
import { useAuth } from '../../context/AuthContext';

const statusConfig = {
  AVAILABLE: { label: 'Còn sách', variant: 'success' as const },
  UNAVAILABLE: { label: 'Hết sách', variant: 'danger' as const },
  MAINTENANCE: { label: 'Bảo trì', variant: 'warning' as const },
};

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState<BookResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rentOpen, setRentOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    bookApi.getBookById(Number(id))
      .then(res => setBook(res.data.data))
      .catch(() => setError('Không tìm thấy sách'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  );

  if (error || !book) return (
    <div className="max-w-screen-2xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 rounded-3xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-10 h-10 text-surface-300" />
      </div>
      <h2 className="text-xl font-bold text-surface-700 mb-2">{error || 'Không tìm thấy sách'}</h2>
      <Link to="/books" className="text-primary-600 text-sm font-semibold hover:underline">← Quay lại kho sách</Link>
    </div>
  );

  const status = statusConfig[book.status];
  const isAvailable = book.status === 'AVAILABLE' && book.stockQuantity > 0;

  const handleRent = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setRentOpen(true);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-surface-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/books" className="hover:text-primary-600 transition-colors">Sách</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-surface-900 font-medium truncate max-w-48">{book.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Book Cover */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-surface-100 to-surface-200 shadow-2xl shadow-surface-300/50">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-xl">
                      <BookOpen className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-surface-500 text-sm font-medium px-6 text-center">{book.title}</p>
                  </div>
                )}
              </div>

              {/* Pricing Card */}
              <div className="mt-6 p-6 bg-white rounded-3xl border border-surface-100 shadow-sm">
                <Badge variant={status.variant} dot size="md" className="mb-4">{status.label}</Badge>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-black text-primary-600">{book.dailyRentalPrice.toLocaleString('vi-VN')}đ</span>
                  <span className="text-surface-500 text-sm">/ngày</span>
                </div>
                <p className="text-sm text-surface-500 mb-4">
                  Đặt cọc: <span className="font-semibold text-surface-700">{book.depositAmount.toLocaleString('vi-VN')}đ</span>
                  <span className="text-xs ml-1">(hoàn lại khi trả sách)</span>
                </p>
                <p className="text-xs text-surface-400 mb-5">
                  Còn lại: <span className="font-bold text-surface-600">{book.stockQuantity} cuốn</span>
                </p>

                <button
                  onClick={handleRent}
                  disabled={!isAvailable}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                    isAvailable
                      ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/35 hover:-translate-y-0.5'
                      : 'bg-surface-100 text-surface-400 cursor-not-allowed'
                  }`}
                >
                  {isAvailable ? '📖 Thuê sách này' : 'Hiện không có sẵn'}
                </button>
              </div>
            </div>
          </div>

          {/* Right — Book Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Author */}
            <div>
              {book.categoryName && (
                <div className="flex items-center gap-1.5 text-sm text-primary-600 font-semibold mb-2">
                  <Tag className="w-4 h-4" />
                  {book.categoryName}
                </div>
              )}
              <h1 className="text-2xl sm:text-4xl font-black text-surface-900 leading-tight mb-3">
                {book.title}
              </h1>
              <p className="text-lg text-surface-600 font-medium">bởi <span className="text-surface-800 font-bold">{book.author}</span></p>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Building, label: 'Nhà xuất bản', value: book.publisher || '—' },
                { icon: Calendar, label: 'Năm xuất bản', value: book.publishedYear?.toString() || '—' },
                { icon: BookMarked, label: 'Số trang', value: book.pageCount ? `${book.pageCount} trang` : '—' },
                { icon: Star, label: 'ISBN', value: book.isbn || '—' },
              ].map(info => (
                <div key={info.label} className="p-4 bg-white rounded-2xl border border-surface-100">
                  <div className="flex items-center gap-1.5 text-xs text-surface-500 mb-1.5">
                    <info.icon className="w-3.5 h-3.5" />
                    {info.label}
                  </div>
                  <p className="text-sm font-bold text-surface-800 truncate">{info.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {book.description && (
              <div className="p-6 bg-white rounded-3xl border border-surface-100">
                <h2 className="text-base font-bold text-surface-900 mb-3">Giới thiệu sách</h2>
                <p className="text-sm text-surface-600 leading-relaxed whitespace-pre-line">{book.description}</p>
              </div>
            )}

            {/* How it works */}
            <div className="p-6 bg-gradient-to-br from-primary-50 to-indigo-50/50 rounded-3xl border border-primary-100">
              <h2 className="text-base font-bold text-surface-900 mb-4">Cách thức thuê sách</h2>
              <div className="space-y-3">
                {[
                  'Đặt thuê và thanh toán từ ví điện tử',
                  'Nhận sách trong 1–3 ngày làm việc',
                  'Đọc trong thời gian bạn chọn (tối đa 60 ngày)',
                  'Trả sách và nhận lại tiền cọc tự động',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <p className="text-sm text-surface-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rent Modal */}
      <Modal isOpen={rentOpen} onClose={() => setRentOpen(false)} title="Đặt thuê sách" size="lg">
        <RentalOrderForm book={book} onSuccess={() => setRentOpen(false)} onCancel={() => setRentOpen(false)} />
      </Modal>
    </div>
  );
};

export default BookDetailPage;
