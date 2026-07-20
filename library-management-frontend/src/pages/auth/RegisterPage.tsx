import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, User as UserIcon, BookOpen, ArrowRight, CheckCircle2, Sparkles, Star, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import Input from '../../components/common/Input';
import { APP_NAME } from '../../utils/constants';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../types';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Họ tên không được để trống';
    if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không đúng định dạng';
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại không được để trống';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Số điện thoại phải có đúng 10 chữ số';
    if (!formData.password) newErrors.password = 'Mật khẩu không được để trống';
    else if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) newErrors.password = 'Mật khẩu phải có cả chữ và số';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(formData);
      showToast('success', 'Đăng ký thành công!');
      navigate('/', { replace: true });
    } catch (err) {
      const error = err as AxiosError<ApiResponse<unknown>>;
      const message = error.response?.data?.message || 'Đăng ký thất bại';
      showToast('error', message);
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: CheckCircle2, text: 'Thuê sách trực tuyến, giao hàng tận nhà', color: 'text-emerald-400' },
    { icon: CheckCircle2, text: 'Ví điện tử tiện lợi, thanh toán nhanh chóng', color: 'text-emerald-400' },
    { icon: CheckCircle2, text: 'Hoàn tiền cọc tự động 100% khi trả sách', color: 'text-emerald-400' },
  ];

  return (
    <div className="min-h-screen flex w-full">

      {/* ══════════════════════════════════════
          LEFT PANEL — Hero / Branding
      ══════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        {/* Background image */}
        <img
          src="/reading-lifestyle.png"
          alt="Đọc sách"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-warm-950/92 via-warm-950/78 to-warm-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-warm-950/70 via-transparent to-transparent" />

        {/* Floating orbs */}
        <div className="absolute top-20 right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] animate-float-slow pointer-events-none" />
        <div className="absolute bottom-24 left-8 w-56 h-56 bg-primary-500/8 rounded-full blur-[70px] animate-float pointer-events-none" />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-14 xl:p-20 w-full">
          {/* Middle: Heading */}
          <div className="flex-1 flex flex-col justify-center items-center text-center py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/12 mb-6 w-fit backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
              <span className="text-xs font-bold text-white/80 tracking-widest uppercase">Miễn phí đăng ký</span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-black text-white mb-5 leading-[1.1] tracking-tight">
              Bắt đầu hành trình<br />
              <span className="text-gradient-warm">đọc sách của bạn</span>
            </h1>

            <p className="text-lg text-white/55 leading-relaxed max-w-sm mb-10 font-light">
              Tạo tài khoản miễn phí để truy cập kho sách khổng lồ và trải nghiệm dịch vụ thuê sách tiện lợi nhất.
            </p>

            {/* Feature checklist */}
            <div className="space-y-4">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/25 transition-all duration-300">
                    <f.icon className={`w-4 h-4 ${f.color}`} />
                  </div>
                  <span className="text-white/70 text-sm font-light">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Trust badges */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Shield, label: 'Bảo mật SSL', sub: 'Mã hóa đầu cuối' },
              { icon: Zap, label: 'Siêu tốc', sub: 'Xử lý < 1 phút' },
              { icon: Star, label: 'Đánh giá 4.9★', sub: '5,000+ đánh giá' },
            ].map(({ icon: Icon, label, sub }, i) => (
              <div key={i} className="glass-dark rounded-xl p-3.5 border border-white/6 text-center">
                <Icon className="w-4 h-4 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-white">{label}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — Register Form
      ══════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-warm-50 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-15%] right-[-10%] w-96 h-96 bg-emerald-200/18 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-80 h-80 bg-primary-200/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="w-full max-w-[420px] relative z-10 animate-fade-in py-6">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl gradient-primary-vibrant flex items-center justify-center shadow-md shadow-primary-500/25">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gradient">{APP_NAME}</span>
          </div>

          {/* Header */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase">Miễn phí đăng ký</span>
            </div>
            <h2 className="text-3xl font-black text-warm-900 mb-2 tracking-tight">Tạo tài khoản mới</h2>
            <p className="text-warm-500 font-light">Đăng ký miễn phí để bắt đầu thuê sách</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              icon={<UserIcon className="w-4 h-4" />}
              value={formData.fullName}
              onChange={handleChange('fullName')}
              error={errors.fullName}
              autoComplete="name"
            />
            <Input
              label="Email"
              type="email"
              placeholder="name@example.com"
              icon={<Mail className="w-4 h-4" />}
              value={formData.email}
              onChange={handleChange('email')}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Số điện thoại"
              placeholder="0912345678"
              icon={<Phone className="w-4 h-4" />}
              value={formData.phone}
              onChange={handleChange('phone')}
              error={errors.phone}
              autoComplete="tel"
            />

            {/* Password with show/hide */}
            <div className="relative">
              <Input
                label="Mật khẩu"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                value={formData.password}
                onChange={handleChange('password')}
                error={errors.password}
                autoComplete="new-password"
              />
            </div>

            {/* Confirm password with show/hide */}
            <div className="relative">
              <Input
                label="Xác nhận mật khẩu"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />
            </div>

            {/* Submit */}
            <div style={{ marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl gradient-primary-vibrant text-white font-bold
                           shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/35
                           hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ padding: '0.5rem', fontSize: '1rem' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang đăng ký...
                  </>
                ) : (
                  <>
                    Đăng ký ngay
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-warm-200" />
            </div>
            <div className="relative flex justify-center">
            </div>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-warm-500">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
