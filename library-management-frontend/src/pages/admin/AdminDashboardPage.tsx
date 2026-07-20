import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Users, Package, Clock, ArrowRight,
  CheckCircle, AlertTriangle, BarChart3, Plus, FileText
} from 'lucide-react';
import bookApi from '../../api/bookApi';
import userApi from '../../api/userApi';
import rentalApi from '../../api/rentalApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  activeOrders: number;
  overdueOrders: number;
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, usersRes, ordersRes, pendingRes, activeRes, overdueRes] = await Promise.all([
          bookApi.getAllBooks({ page: 0, size: 1 }),
          userApi.getAllUsers({ page: 0, size: 1 }),
          rentalApi.getAllOrders({ page: 0, size: 1 }),
          rentalApi.getAllOrders({ status: 'PENDING', page: 0, size: 1 }),
          rentalApi.getAllOrders({ status: 'ACTIVE', page: 0, size: 1 }),
          rentalApi.getAllOrders({ status: 'OVERDUE', page: 0, size: 1 }),
        ]);
        setStats({
          totalBooks: booksRes.data.data.totalElements,
          totalUsers: usersRes.data.data.totalElements,
          totalOrders: ordersRes.data.data.totalElements,
          pendingOrders: pendingRes.data.data.totalElements,
          activeOrders: activeRes.data.data.totalElements,
          overdueOrders: overdueRes.data.data.totalElements,
        });
      } catch { }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const statCards = stats ? [
    { label: 'Tổng số sách', value: stats.totalBooks, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', link: '/admin/books' },
    { label: 'Người dùng', value: stats.totalUsers, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', link: '/admin/users' },
    { label: 'Đơn chờ duyệt', value: stats.pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', link: '/admin/orders?status=PENDING' },
    { label: 'Đang cho thuê', value: stats.activeOrders, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', link: '/admin/orders?status=ACTIVE' },
    { label: 'Đơn quá hạn', value: stats.overdueOrders, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', link: '/admin/orders?status=OVERDUE' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">

      {/* ── Hero Banner — full width, 360px tall ── */}
      <div className="relative w-full overflow-hidden" style={{ height: '360px' }}>
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Library"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/92 via-slate-900/60 to-slate-900/20" />
        {/* Hero text — centered vertically within the banner (header h-20 = 80px) */}
        <div className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3.5 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Dashboard Hệ Thống
              </h1>
            </div>
            <p className="text-slate-200 text-lg sm:text-xl font-medium leading-relaxed">
              Chào mừng trở lại! Theo dõi tổng quan tình hình hoạt động của thư viện.
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-screen-2xl w-full mx-auto px-8 md:px-12 lg:px-16 space-y-12 mt-12">

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-md shadow-slate-200/40 p-8 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                <FileText className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Truy cập nhanh</h2>
                <p className="text-sm text-slate-500 mt-0.5">Các thao tác thường dùng hàng ngày</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/admin/books/new"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Thêm sách mới
              </Link>
              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl shadow-md shadow-amber-400/20 hover:shadow-lg hover:shadow-amber-400/30 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
              >
                <Package className="w-5 h-5" />
                Duyệt đơn thuê
              </Link>
              <Link
                to="/admin/users"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl shadow-md shadow-emerald-400/20 hover:shadow-lg hover:shadow-emerald-400/30 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
              >
                <Users className="w-5 h-5" />
                Quản lý thành viên
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-28 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-slate-700 mb-6">Thống kê tổng quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {statCards.map((card, idx) => (
                <Link
                  key={idx}
                  to={card.link}
                  className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 p-8 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 rounded-2xl ${card.bg} border ${card.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className={`w-8 h-8 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-4xl font-black text-slate-900 mb-2">{card.value.toLocaleString()}</p>
                    <p className="text-sm text-slate-500 font-medium">{card.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Cards */}
        <div>
          <h2 className="text-xl font-bold text-slate-700 mb-6">Khu vực quản lý</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <NavigationCard
              title="Kho Sách"
              desc="Cập nhật thông tin ấn phẩm, số lượng tồn kho và phân loại danh mục một cách dễ dàng."
              icon={BookOpen}
              link="/admin/books"
              imgSrc="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
            <NavigationCard
              title="Giao Dịch Thuê"
              desc="Theo dõi trạng thái mượn trả, quản lý tiền cọc và lịch sử giao dịch của người dùng."
              icon={Package}
              link="/admin/orders"
              imgSrc="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
            <NavigationCard
              title="Thành Viên"
              desc="Thiết lập phân quyền hệ thống, hỗ trợ tài khoản và xem xét toàn bộ lịch sử hoạt động."
              icon={Users}
              link="/admin/users"
              imgSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

const NavigationCard = ({ title, desc, icon: Icon, link, imgSrc }: any) => (
  <Link
    to={link}
    className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
  >
    <div className="h-56 w-full overflow-hidden relative">
      <img
        src={imgSrc}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent" />
      <div className="absolute bottom-6 left-7">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
    <div className="p-8 flex-1 flex flex-col justify-between gap-6">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-base text-slate-500 leading-relaxed">{desc}</p>
      </div>
      <div className="flex items-center gap-2 text-base font-bold text-primary-600 group-hover:gap-3 transition-all duration-200">
        Quản lý ngay
        <ArrowRight className="w-5 h-5" />
      </div>
    </div>
  </Link>
);

export default AdminDashboardPage;