import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Grid3X3, List, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import bookApi, { categoryApi } from '../../api/bookApi';
import type { BookResponse, BookFilterParams, CategoryResponse, BookStatus } from '../../types';
import BookCard from '../../components/common/BookCard';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import RentalOrderForm from './components/RentalOrderForm';
import { useAuth } from '../../context/AuthContext';

const PAGE_SIZE = 12;

const BooksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [books, setBooks] = useState<BookResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [rentBook, setRentBook] = useState<BookResponse | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter state
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [categoryId, setCategoryId] = useState<number | undefined>(
    searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined
  );
  const [status, setStatus] = useState<BookStatus | undefined>(
    (searchParams.get('status') as BookStatus) || undefined
  );
  const [page, setPage] = useState(Number(searchParams.get('page') || 0));

  useEffect(() => {
    categoryApi.getAllCategories({ size: 100 }).then(res => {
      setCategories(res.data.data.content);
    }).catch(() => { });
  }, []);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params: BookFilterParams = {
        keyword: keyword || undefined,
        categoryId,
        status,
        page,
        size: PAGE_SIZE,
        sortBy: 'createdAt',
        sortDir: 'desc',
      };
      const res = await bookApi.getAllBooks(params);
      const data = res.data.data;
      setBooks(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, categoryId, status, page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  const handleClearFilters = () => {
    setKeyword('');
    setCategoryId(undefined);
    setStatus(undefined);
    setPage(0);
  };

  const handleRent = (book: BookResponse) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setRentBook(book);
  };

  const hasActiveFilters = keyword || categoryId || status;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Page Header */}
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-surface-900 tracking-tight">Kho sách</h1>
              <p className="text-surface-500 mt-1 text-sm">
                {totalElements > 0 ? `${totalElements.toLocaleString()} đầu sách` : 'Đang tải...'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-surface-400 hover:bg-surface-100'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-surface-400 hover:bg-surface-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-5 flex items-center gap-3 w-full group">
            {/* Vùng Input - Dùng flex-1 để chiếm hết không gian trống */}
            <div className="relative flex-1">

              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Tìm kiếm theo tựa đề, tác giả..."
                // Đảm bảo pl-12 để chữ không đè kính lúp, pr-12 để không đè nút X
                className="w-full pl-[52px] pr-[52px] py-3 bg-surface-50 border border-surface-200 rounded-2xl shadow-sm text-sm text-surface-800 placeholder-surface-400 focus:outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-400/20 transition-all duration-300"
              />

              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-surface-400 hover:text-surface-700 hover:bg-surface-200 rounded-full transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Vùng Nút bấm - Bọc trong 1 div và dùng shrink-0 để không bị ô input chèn ép */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold border transition-all ${filtersOpen || hasActiveFilters
                    ? 'bg-primary-50 border-primary-200 text-primary-700'
                    : 'bg-surface-50 border-surface-200 text-surface-600 hover:bg-surface-100'
                  }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Lọc
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-primary-500" />
                )}
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-2xl transition-all shadow-md shadow-primary-500/20 shrink-0"
              >
                Tìm
              </button>
            </div>
          </form>

          {/* Filters Panel */}
          <div style={{ marginTop: '1rem' }}>
            {filtersOpen && (
                    <div className="mt-4 flex flex-wrap gap-3 items-center animate-fade-in">
                      <div className="relative">
                        <select
                            value={categoryId ?? ''}
                            onChange={e => {
                              setCategoryId(e.target.value ? Number(e.target.value) : undefined);
                              setPage(0);
                            }}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
                        >
                          <option value="">Tất cả danh mục</option>
                          {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                        <ChevronDown
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none"/>
                      </div>

                      {/* Status */}
                      <div className="relative">
                        <select
                            value={status ?? ''}
                            onChange={e => {
                              setStatus((e.target.value as BookStatus) || undefined);
                              setPage(0);
                            }}
                            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-surface-200 rounded-xl text-sm text-surface-700 focus:outline-none focus:ring-2 focus:ring-primary-400 cursor-pointer"
                        >
                          <option value="">Tất cả trạng thái</option>
                          <option value="AVAILABLE">Còn sách</option>
                          <option value="UNAVAILABLE">Hết sách</option>
                        </select>
                        <ChevronDown
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none"/>
                      </div>

                      {hasActiveFilters && (
                          <button
                              onClick={handleClearFilters}
                              className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <X className="w-3.5 h-3.5"/>
                            Xóa bộ lọc
                          </button>
                      )}
                    </div>
                )}
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-24">
            <LoadingSpinner size="lg" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-surface-300" />
            </div>
            <h3 className="text-lg font-bold text-surface-700 mb-2">Không tìm thấy sách</h3>
            <p className="text-surface-400 text-sm mb-6">Thử thay đổi từ khóa hoặc bộ lọc</p>
            <button onClick={handleClearFilters} className="px-6 py-2.5 bg-primary-600 text-white rounded-2xl text-sm font-semibold hover:bg-primary-500 transition-all">
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
                : 'flex flex-col gap-3'
            }>
              {books.map(book => (
                viewMode === 'grid' ? (
                  <BookCard key={book.id} book={book} onRent={handleRent} />
                ) : (
                  <BookListItem key={book.id} book={book} onRent={handleRent} />
                )
              ))}
            </div>

            <div className="mt-8">
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

      {/* Rent Modal */}
      {rentBook && (
        <Modal
          isOpen={!!rentBook}
          onClose={() => setRentBook(null)}
          title="Đặt thuê sách"
          size="lg"
        >
          <RentalOrderForm
            book={rentBook}
            onSuccess={() => { setRentBook(null); }}
            onCancel={() => setRentBook(null)}
          />
        </Modal>
      )}
    </div>
  );
};

// List view item
const BookListItem: React.FC<{ book: BookResponse; onRent: (b: BookResponse) => void }> = ({ book, onRent }) => {
  const isAvailable = book.status === 'AVAILABLE' && book.stockQuantity > 0;
  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl border border-surface-100 hover:border-primary-100 hover:shadow-md transition-all duration-200">
      <div className="w-16 h-20 rounded-xl overflow-hidden bg-surface-100 shrink-0">
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{book.title.charAt(0)}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-surface-900 text-sm truncate">{book.title}</h3>
        <p className="text-xs text-surface-500 mt-0.5">{book.author}</p>
        {book.categoryName && <p className="text-xs text-primary-500 mt-1">{book.categoryName}</p>}
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="text-right">
          <p className="text-sm font-bold text-primary-600">{book.dailyRentalPrice.toLocaleString('vi-VN')}đ/ngày</p>
          <p className="text-xs text-surface-400">Cọc: {book.depositAmount.toLocaleString('vi-VN')}đ</p>
        </div>
        <button
          onClick={() => onRent(book)}
          disabled={!isAvailable}
          className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${isAvailable ? 'bg-primary-600 hover:bg-primary-500 text-white' : 'bg-surface-100 text-surface-400 cursor-not-allowed'}`}
        >
          {isAvailable ? 'Thuê ngay' : 'Hết sách'}
        </button>
      </div>
    </div>
  );
};

export default BooksPage;
