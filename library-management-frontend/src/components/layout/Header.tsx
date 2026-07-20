import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen, User, LogOut, Menu, X, ChevronDown,
  LayoutDashboard, Bell, Wallet, Package, Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME, ROLE_LABELS } from '../../utils/constants';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdminOrLibrarian = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';

  return (
    <header
      className={`
        sticky top-0 z-50 transition-all duration-500 w-full
        ${scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm shadow-warm-200/60 border-b border-warm-200/50'
          : 'bg-white/85 backdrop-blur-md border-b border-warm-100/60'
        }
      `}
    >
      {/* Full-width bar */}
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
        <div className="flex items-center justify-between h-[72px]">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-primary-vibrant flex items-center justify-center
                          shadow-md shadow-primary-500/25 group-hover:shadow-primary-500/40
                          group-hover:scale-105 transition-all duration-300">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-[1.2rem] font-extrabold text-gradient hidden sm:block tracking-tight">
              {APP_NAME}
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" active={location.pathname === '/'}>Trang chủ</NavLink>
            <NavLink to="/books" active={location.pathname.startsWith('/books')}>Kho sách</NavLink>
            {isAuthenticated && (
              <NavLink to="/rental/orders" active={location.pathname.startsWith('/rental')}>Đơn thuê</NavLink>
            )}
            {isAdminOrLibrarian && (
              <NavLink to="/admin" active={location.pathname.startsWith('/admin')}>
                <LayoutDashboard className="w-4 h-4" />
                Quản trị
              </NavLink>
            )}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <Link
              to="/books"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-warm-100 hover:bg-warm-200 text-warm-600 hover:text-warm-900 transition-all duration-200 text-sm font-medium"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Tìm kiếm sách...</span>
            </Link>

            {isAuthenticated ? (
              <>
                {/* Bell */}
                <button className="relative p-2.5 rounded-xl text-warm-500 hover:bg-warm-100 hover:text-warm-800 transition-all duration-200">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    3
                  </span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 py-1.5 pl-1.5 pr-3.5 rounded-xl hover:bg-warm-100 transition-all duration-200 border border-transparent hover:border-warm-200"
                  >
                    <div className="w-8 h-8 rounded-lg gradient-primary-vibrant flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-semibold text-warm-900 leading-tight">{user?.fullName}</p>
                      <p className="text-[11px] text-warm-500 mt-0.5">{ROLE_LABELS[user?.role || '']}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-warm-400 transition-transform duration-300 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileDropdownOpen && (
                    <>
                      <div className="fixed inset-0" onClick={() => setProfileDropdownOpen(false)} />
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl shadow-warm-300/20 border border-warm-100 py-2 animate-scale-in overflow-hidden">
                        {/* User info */}
                        <div className="px-5 py-4 border-b border-warm-100 bg-warm-50/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-primary-vibrant flex items-center justify-center text-white font-bold">
                              {user?.fullName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-warm-900">{user?.fullName}</p>
                              <p className="text-xs text-warm-500 mt-0.5">{user?.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="py-1">
                          <DropdownItem to="/profile" icon={User} onClick={() => setProfileDropdownOpen(false)}>
                            Thông tin cá nhân
                          </DropdownItem>
                          <DropdownItem to="/wallet" icon={Wallet} onClick={() => setProfileDropdownOpen(false)}>
                            Ví điện tử
                          </DropdownItem>
                          <DropdownItem to="/rental/orders" icon={Package} onClick={() => setProfileDropdownOpen(false)}>
                            Đơn thuê của tôi
                          </DropdownItem>
                        </div>
                        <div className="mx-4 my-1 border-t border-warm-100" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 w-full transition-all duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-warm-700 hover:text-primary-600 rounded-xl hover:bg-warm-100 transition-all duration-200 whitespace-nowrap"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-bold text-white rounded-xl gradient-primary-vibrant
                           shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/35
                           hover:scale-[1.03] transition-all duration-200 whitespace-nowrap"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-warm-500 hover:bg-warm-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Nav ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-warm-100 bg-white/98 backdrop-blur-md animate-fade-in">
          <nav className="w-full px-6 py-4 flex flex-col gap-1">
            <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Trang chủ</MobileNavLink>
            <MobileNavLink to="/books" onClick={() => setMobileMenuOpen(false)}>Kho sách</MobileNavLink>
            {isAuthenticated && (
              <MobileNavLink to="/rental/orders" onClick={() => setMobileMenuOpen(false)}>Đơn thuê</MobileNavLink>
            )}
            {isAdminOrLibrarian && (
              <MobileNavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>Quản trị</MobileNavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

/* ── Sub-components ── */
const NavLink: React.FC<{ to: string; active: boolean; children: React.ReactNode }> = ({ to, active, children }) => (
  <Link
    to={to}
    className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
      ${active
        ? 'bg-primary-50 text-primary-700'
        : 'text-warm-600 hover:text-warm-900 hover:bg-warm-100'
      }`}
  >
    {children}
    {active && (
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary-500 rounded-full" />
    )}
  </Link>
);

const MobileNavLink: React.FC<{ to: string; onClick: () => void; children: React.ReactNode }> = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="px-4 py-3.5 text-sm font-semibold text-warm-700 hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all duration-200"
  >
    {children}
  </Link>
);

const DropdownItem: React.FC<{ to: string; icon: React.ElementType; onClick: () => void; children: React.ReactNode }> = ({ to, icon: Icon, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-5 py-3 text-sm text-warm-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200"
  >
    <Icon className="w-4 h-4" />
    {children}
  </Link>
);

export default Header;
