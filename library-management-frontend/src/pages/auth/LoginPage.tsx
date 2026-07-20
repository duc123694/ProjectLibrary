import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, BookOpen, ArrowRight, Sparkles, Star, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import Input from '../../components/common/Input';
import { APP_NAME } from '../../utils/constants';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email không đúng định dạng';
    if (!password.trim()) newErrors.password = 'Mật khẩu không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login({ email, password });
      showToast('success', 'Đăng nhập thành công!');
      navigate(from, { replace: true });
    } catch (err) {
      const error = err as AxiosError<ApiResponse<unknown>>;
      const message = error.response?.data?.message || 'Đăng nhập thất bại';
      showToast('error', message);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full">

      {/* ══════════════════════════════════════
          LEFT PANEL — Hero / Branding
      ══════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        {/* Background image */}
        <img
          src="/hero-bg.png"
          alt="Thư viện"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-warm-950/92 via-warm-950/78 to-warm-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-950/70 via-transparent to-transparent" />

        {/* Floating orbs */}
        <div className="absolute top-20 right-12 w-64 h-64 bg-primary-500/12 rounded-full blur-[80px] animate-float-slow pointer-events-none" />
        <div className="absolute bottom-24 left-8 w-56 h-56 bg-amber-500/8 rounded-full blur-[70px] animate-float pointer-events-none" />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-14 xl:p-20 w-full">
          {/* Middle: Heading */}
          <div className="flex-1 flex flex-col justify-center items-center text-center py-12 ">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/12 mb-6 w-fit backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span className="text-xs font-bold text-white/80 tracking-widest uppercase">Chào mừng trở lại</span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-black text-white mb-5 leading-[1.1] tracking-tight">
              Thế giới sách<br />
              <span className="text-gradient-warm">trong tầm tay</span>
            </h1>

            <p className="text-lg text-white/55 leading-relaxed max-w-sm mb-10 font-light">
              Hàng nghìn đầu sách đang chờ bạn. Thuê ngay, giao tận nhà, hoàn cọc tự động.
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              {[
                { icon: BookOpen, value: '10K+', label: 'Đầu sách', color: 'text-primary-400' },
                { icon: Users, value: '5K+', label: 'Người dùng', color: 'text-emerald-400' },
                { icon: Star, value: '99%', label: 'Hài lòng', color: 'text-amber-400' },
              ].map((s, i) => (
                <div key={i} className="group">
                  <s.icon className={`w-4 h-4 ${s.color} mb-1.5`} />
                  <p className="text-2xl font-black text-white tracking-tight">{s.value}</p>
                  <p className="text-xs text-white/45 font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — Login Form
      ══════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-warm-50 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-15%] right-[-10%] w-96 h-96 bg-primary-200/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-80 h-80 bg-amber-200/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="w-full max-w-[420px] relative z-10 animate-fade-in">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl gradient-primary-vibrant flex items-center justify-center shadow-md shadow-primary-500/25">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gradient">{APP_NAME}</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" />
              <span className="text-xs font-bold text-primary-600 tracking-widest uppercase">Chào mừng trở lại</span>
            </div>
            <h2 className="text-3xl font-black text-warm-900 mb-2 tracking-tight">Đăng nhập</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="name@example.com"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            {/* Password with show/hide */}
            <div className="relative">
              <Input
                label="Mật khẩu"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="current-password"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-warm-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 transition-colors"
                />
                <span className="text-sm text-warm-600 group-hover:text-warm-800 transition-colors">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit */}
            <div style={{ marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl gradient-primary-vibrant text-white font-bold text-lg
                         shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/35
                         hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ padding: '0.5rem', fontSize: '1rem' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    Đăng nhập
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-warm-200" />
            </div>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-warm-500">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
              Đăng ký ngay
            </Link>
          </p>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-6">
            {[
              { icon: TrendingUp, label: 'Bảo mật SSL' },
              { icon: Star, label: 'Đánh giá 4.9★' },
              { icon: Users, label: '5,000+ thành viên' },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-warm-400">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
