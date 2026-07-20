import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star } from 'lucide-react';
import type { BookResponse } from '../../types';
import Badge from './Badge';

interface BookCardProps {
  book: BookResponse;
  onRent?: (book: BookResponse) => void;
  showRentButton?: boolean;
}

const statusConfig = {
  AVAILABLE: { label: 'Còn sách', variant: 'success' as const },
  UNAVAILABLE: { label: 'Hết sách', variant: 'danger' as const },
  MAINTENANCE: { label: 'Bảo trì', variant: 'warning' as const },
};

const BookCard: React.FC<BookCardProps> = ({ book, onRent, showRentButton = true }) => {
  const status = statusConfig[book.status] ?? statusConfig.UNAVAILABLE;
  const isAvailable = book.status === 'AVAILABLE' && book.stockQuantity > 0;
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-warm-100 hover:border-primary-200 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
      {/* Cover */}
      <Link to={`/books/${book.id}`} className="relative block aspect-[3/4] bg-gradient-to-br from-warm-100 to-warm-200 overflow-hidden">
        {book.coverImage && !imgError ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-2xl gradient-primary-vibrant flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs text-warm-400 font-medium px-4 text-center line-clamp-2">{book.title}</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={status.variant} dot size="sm">{status.label}</Badge>
        </div>

        {/* Category */}
        {book.categoryName && (
          <div className="absolute bottom-3 right-3">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-black/50 text-white backdrop-blur-sm">
              {book.categoryName}
            </span>
          </div>
        )}

        {/* Rating placeholder */}
        <div className="absolute top-3 right-3 flex items-center gap-0.5 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-[11px] font-bold text-white">4.8</span>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <Link to={`/books/${book.id}`}>
            <h3 className="font-bold text-warm-900 text-sm leading-snug line-clamp-2 hover:text-primary-600 transition-colors">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-warm-400 mt-1 font-medium">{book.author}</p>
        </div>

        {/* Pricing */}
        <div className="flex items-end justify-between">
          <div>
            <span className="font-black text-primary-600 text-lg leading-none">
              {book.dailyRentalPrice.toLocaleString('vi-VN')}đ
            </span>
            <span className="text-xs text-warm-400 ml-1">/ngày</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-warm-400">Đặt cọc</p>
            <p className="text-xs font-semibold text-warm-600">{book.depositAmount.toLocaleString('vi-VN')}đ</p>
          </div>
        </div>

        {/* Rent button */}
        {showRentButton && (
          <button
            onClick={() => onRent?.(book)}
            disabled={!isAvailable}
            className={`w-full py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
              isAvailable
                ? 'gradient-primary-vibrant text-white shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02]'
                : 'bg-warm-100 text-warm-400 cursor-not-allowed'
            }`}
          >
            {isAvailable ? 'Thuê ngay' : 'Không khả dụng'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
