import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, BookOpen, X, ChevronDown } from 'lucide-react';
import bookApi, { categoryApi } from '../../../api/bookApi';
import type { BookResponse, BookFilterParams, CategoryResponse, BookStatus } from '../../../types';
import Badge from '../../../components/common/Badge';
import Pagination from '../../../components/common/Pagination';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

const PAGE_SIZE = 10;

const statusMap = {
  AVAILABLE: { label: 'Còn sách', variant: 'success' as const },
  UNAVAILABLE: { label: 'Hết sách', variant: 'danger' as const },
  MAINTENANCE: { label: 'Bảo trì', variant: 'warning' as const },
};

const AdminBooksPage: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [status, setStatus] = useState<BookStatus | undefined>();
  const [deleteBook, setDeleteBook] = useState<BookResponse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    categoryApi.getAllCategories({ size: 100 }).then(res => setCategories(res.data.data.content)).catch(() => {});
  }, []);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params: BookFilterParams = { keyword: keyword || undefined, categoryId, status, page, size: PAGE_SIZE, sortBy: 'createdAt', sortDir: 'desc' };
      const res = await bookApi.getAllBooks(params);
      const data = res.data.data;
      setBooks(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch { setBooks([]); }
    finally { setLoading(false); }
  }, [keyword, categoryId, status, page]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const handleDelete = async () => {
    if (!deleteBook) return;
    setDeleteLoading(true);
    try {
      await bookApi.deleteBook(deleteBook.id);
      setDeleteBook(null);
      fetchBooks();
    } catch {}
    finally { setDeleteLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-surface-900">Quản lý Sách</h1>
              <p className="text-surface-500 text-sm mt-0.5">{totalElements} đầu sách trong hệ thống</p>
            </div>
            <Link
              to="/admin/books/new"
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-2xl shadow-md shadow-primary-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Thêm sách mới
            </Link>
          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                value={keyword}
                onChange={e => { setKeyword(e.target.value); setPage(0); }}
                placeholder="Tìm tên sách, tác giả..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              {keyword && (
                <button onClick={() => setKeyword('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="relative">
              <select
                value={categoryId ?? ''}
                onChange={e => { setCategoryId(e.target.value ? Number(e.target.value) : undefined); setPage(0); }}
                className="appearance-none pl-4 pr-9 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={status ?? ''}
                onChange={e => { setStatus((e.target.value as BookStatus) || undefined); setPage(0); }}
                className="appearance-none pl-4 pr-9 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="AVAILABLE">Còn sách</option>
                <option value="UNAVAILABLE">Hết sách</option>
                <option value="MAINTENANCE">Bảo trì</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
        ) : books.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-surface-200 mx-auto mb-3" />
            <p className="text-surface-400 text-sm">Không có sách nào</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white rounded-3xl border border-surface-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-100 bg-surface-50/50">
                      <th className="text-left px-6 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Sách</th>
                      <th className="text-left px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider hidden md:table-cell">Danh mục</th>
                      <th className="text-left px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider hidden sm:table-cell">Giá thuê</th>
                      <th className="text-left px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider hidden lg:table-cell">Tồn kho</th>
                      <th className="text-left px-4 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="text-right px-6 py-3.5 text-xs font-bold text-surface-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-50">
                    {books.map(book => {
                      const st = statusMap[book.status];
                      return (
                        <tr key={book.id} className="hover:bg-surface-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-13 rounded-xl overflow-hidden bg-surface-100 shrink-0">
                                {book.coverImage ? (
                                  <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-indigo-600">
                                    <BookOpen className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-surface-900 line-clamp-1">{book.title}</p>
                                <p className="text-xs text-surface-500">{book.author}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <span className="text-sm text-surface-600">{book.categoryName || '—'}</span>
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <span className="text-sm font-semibold text-primary-600">{book.dailyRentalPrice.toLocaleString('vi-VN')}đ/ngày</span>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <span className="text-sm text-surface-700 font-medium">{book.stockQuantity}</span>
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant={st.variant} dot size="sm">{st.label}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => navigate(`/admin/books/${book.id}/edit`)}
                                className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteBook(book)}
                                className="p-2 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-surface-100">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  pageSize={PAGE_SIZE}
                  onPageChange={setPage}
                  loading={loading}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteBook}
        onClose={() => setDeleteBook(null)}
        onConfirm={handleDelete}
        title="Xóa sách"
        message={`Bạn có chắc muốn xóa sách "${deleteBook?.title}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa sách"
        loading={deleteLoading}
        variant="danger"
      />
    </div>
  );
};

export default AdminBooksPage;
