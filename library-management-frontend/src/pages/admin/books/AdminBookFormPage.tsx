import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import bookApi, { categoryApi } from '../../../api/bookApi';
import type { BookRequest, BookStatus, CategoryResponse } from '../../../types';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

const AdminBookFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id && id !== 'new';

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState<BookRequest>({
    title: '',
    author: '',
    categoryId: null,
    isbn: '',
    description: '',
    coverImage: '',
    dailyRentalPrice: 5000,
    depositAmount: 50000,
    stockQuantity: 1,
    status: 'AVAILABLE',
    publisher: '',
    publishedYear: new Date().getFullYear(),
    pageCount: undefined,
  });

  useEffect(() => {
    categoryApi.getAllCategories({ size: 100 }).then(res => setCategories(res.data.data.content)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    bookApi.getBookById(Number(id))
      .then(res => {
        const book = res.data.data;
        setForm({
          title: book.title,
          author: book.author,
          categoryId: book.categoryId,
          isbn: book.isbn || '',
          description: book.description || '',
          coverImage: book.coverImage || '',
          dailyRentalPrice: book.dailyRentalPrice,
          depositAmount: book.depositAmount,
          stockQuantity: book.stockQuantity,
          status: book.status,
          publisher: book.publisher || '',
          publishedYear: book.publishedYear || undefined,
          pageCount: book.pageCount || undefined,
        });
      })
      .catch(() => navigate('/admin/books'))
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const handleChange = (key: keyof BookRequest, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      setMessage({ type: 'error', text: 'Tên sách và tác giả không được để trống' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const payload: BookRequest = {
        ...form,
        categoryId: form.categoryId || null,
        isbn: form.isbn || undefined,
        description: form.description || undefined,
        coverImage: form.coverImage || undefined,
        publisher: form.publisher || undefined,
      };
      if (isEdit) {
        await bookApi.updateBook(Number(id), payload);
        setMessage({ type: 'success', text: 'Cập nhật sách thành công!' });
      } else {
        await bookApi.createBook(payload);
        setMessage({ type: 'success', text: 'Thêm sách thành công!' });
        setTimeout(() => navigate('/admin/books'), 1000);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.response?.data?.message || 'Lưu thất bại. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all";
  const labelClass = "block text-xs font-semibold text-surface-600 mb-1.5";

  if (loading) return <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link to="/admin/books" className="p-2 rounded-xl text-surface-500 hover:text-surface-700 hover:bg-surface-100 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-surface-900">{isEdit ? 'Chỉnh sửa sách' : 'Thêm sách mới'}</h1>
              <p className="text-surface-500 text-sm mt-0.5">{isEdit ? `Đang sửa: ${form.title}` : 'Điền thông tin sách mới vào form bên dưới'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-white rounded-3xl border border-surface-100 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-bold text-surface-900 border-b border-surface-100 pb-3">Thông tin cơ bản</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className={labelClass}>Tên sách *</label>
                <input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)} className={inputClass} placeholder="Nhập tên sách..." required />
              </div>
              <div>
                <label className={labelClass}>Tác giả *</label>
                <input type="text" value={form.author} onChange={e => handleChange('author', e.target.value)} className={inputClass} placeholder="Tên tác giả..." required />
              </div>
              <div>
                <label className={labelClass}>Danh mục</label>
                <div className="relative">
                  <select
                    value={form.categoryId ?? ''}
                    onChange={e => handleChange('categoryId', e.target.value ? Number(e.target.value) : null)}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className={labelClass}>ISBN</label>
                <input type="text" value={form.isbn} onChange={e => handleChange('isbn', e.target.value)} className={inputClass} placeholder="978-..." />
              </div>
              <div>
                <label className={labelClass}>Nhà xuất bản</label>
                <input type="text" value={form.publisher} onChange={e => handleChange('publisher', e.target.value)} className={inputClass} placeholder="NXB..." />
              </div>
              <div>
                <label className={labelClass}>Năm xuất bản</label>
                <input type="number" value={form.publishedYear || ''} onChange={e => handleChange('publishedYear', e.target.value ? Number(e.target.value) : undefined)} className={inputClass} placeholder="2024" min={1900} max={new Date().getFullYear()} />
              </div>
              <div>
                <label className={labelClass}>Số trang</label>
                <input type="number" value={form.pageCount || ''} onChange={e => handleChange('pageCount', e.target.value ? Number(e.target.value) : undefined)} className={inputClass} placeholder="300" min={1} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>URL ảnh bìa</label>
                <input type="url" value={form.coverImage} onChange={e => handleChange('coverImage', e.target.value)} className={inputClass} placeholder="https://..." />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Mô tả</label>
                <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={4} className={`${inputClass} resize-none`} placeholder="Giới thiệu nội dung sách..." />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white rounded-3xl border border-surface-100 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-bold text-surface-900 border-b border-surface-100 pb-3">Giá & Số lượng</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className={labelClass}>Giá thuê / ngày (đ) *</label>
                <input type="number" value={form.dailyRentalPrice} onChange={e => handleChange('dailyRentalPrice', Number(e.target.value))} className={inputClass} min={0} required />
              </div>
              <div>
                <label className={labelClass}>Tiền đặt cọc (đ) *</label>
                <input type="number" value={form.depositAmount} onChange={e => handleChange('depositAmount', Number(e.target.value))} className={inputClass} min={0} required />
              </div>
              <div>
                <label className={labelClass}>Số lượng tồn kho *</label>
                <input type="number" value={form.stockQuantity} onChange={e => handleChange('stockQuantity', Number(e.target.value))} className={inputClass} min={0} required />
              </div>
              <div>
                <label className={labelClass}>Trạng thái</label>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={e => handleChange('status', e.target.value as BookStatus)}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    <option value="AVAILABLE">Còn sách</option>
                    <option value="UNAVAILABLE">Hết sách</option>
                    <option value="MAINTENANCE">Bảo trì</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Link to="/admin/books" className="flex-1 py-3.5 text-center text-sm font-semibold text-surface-700 bg-surface-100 hover:bg-surface-200 rounded-2xl transition-all">
              Hủy
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-2xl shadow-md shadow-primary-500/20 transition-all disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : (isEdit ? 'Cập nhật sách' : 'Thêm sách')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBookFormPage;
