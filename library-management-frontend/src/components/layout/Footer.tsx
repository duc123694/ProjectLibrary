import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, GitBranch, Mail, Phone, MessageSquare, Globe, ArrowUpRight } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full bg-warm-950 overflow-hidden">
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-amber-500/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-20 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 items-start mb-16">

          {/* Brand — large column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 w-fit group">
              <div className="w-12 h-12 rounded-2xl gradient-primary-vibrant flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">{APP_NAME}</span>
            </Link>

            <p className="text-base text-warm-400 max-w-md leading-relaxed">
              Nền tảng thuê sách trực tuyến hàng đầu Việt Nam. Hơn 10,000 đầu sách, giao hàng tận nhà,
              hoàn cọc tự động — trải nghiệm đọc sách chưa bao giờ dễ dàng đến vậy.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { icon: GitBranch, label: 'GitHub', href: '#' },
                { icon: MessageSquare, label: 'Community', href: '#' },
                { icon: Globe, label: 'Website', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-primary-500/20 text-warm-400 hover:text-primary-400 flex items-center justify-center transition-all duration-200 hover:scale-105 border border-white/5 hover:border-primary-500/30"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Newsletter hint */}
            <div className="flex items-center gap-3 mt-1 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-9 h-9 rounded-xl bg-primary-500/15 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Nhận thông báo sách mới</p>
                <p className="text-xs text-warm-500 mt-0.5">Cập nhật mỗi tuần, không spam</p>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Khám phá */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h4 className="text-xs font-bold text-warm-500 uppercase tracking-widest">Khám phá</h4>
            <div className="flex flex-col gap-3">
              {[
                { to: '/books', label: 'Danh sách sách' },
                { to: '/register', label: 'Đăng ký tài khoản' },
                { to: '/rental/orders', label: 'Đơn thuê của tôi' },
                { to: '#', label: 'Trung tâm hỗ trợ' },
              ].map(({ to, label }) => (
                <Link key={label} to={to}
                  className="text-sm text-warm-400 hover:text-primary-400 transition-colors duration-200 hover:translate-x-0.5 inline-flex items-center gap-1.5 group">
                  {label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Tài nguyên */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h4 className="text-xs font-bold text-warm-500 uppercase tracking-widest">Tài nguyên</h4>
            <div className="flex flex-col gap-3">
              {[
                { to: '#', label: 'Blog đọc sách' },
                { to: '#', label: 'Hướng dẫn sử dụng' },
                { to: '#', label: 'Câu hỏi thường gặp' },
                { to: '#', label: 'Chính sách thuê sách' },
              ].map(({ to, label }) => (
                <a key={label} href={to}
                  className="text-sm text-warm-400 hover:text-primary-400 transition-colors duration-200 hover:translate-x-0.5 inline-flex items-center gap-1.5 group">
                  {label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          {/* Liên hệ */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h4 className="text-xs font-bold text-warm-500 uppercase tracking-widest">Liên hệ</h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:contact@libraryhub.vn"
                className="flex items-center gap-3 text-sm text-warm-400 hover:text-primary-400 transition-colors duration-200 group">
                <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-primary-500/15 flex items-center justify-center shrink-0 transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span>contact@libraryhub.vn</span>
              </a>
              <a href="tel:0900000001"
                className="flex items-center gap-3 text-sm text-warm-400 hover:text-primary-400 transition-colors duration-200 group">
                <div className="w-8 h-8 rounded-xl bg-white/5 group-hover:bg-primary-500/15 flex items-center justify-center shrink-0 transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>0900 000 001</span>
              </a>
            </div>

            {/* Badge */}
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400">Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-warm-600 flex items-center gap-1.5">
            © {new Date().getFullYear()} {APP_NAME}. Được tạo bằng
            <Heart className="w-3.5 h-3.5 text-primary-500 fill-primary-500" />
            tại Việt Nam.
          </p>
          <div className="flex items-center gap-6 text-sm text-warm-600">
            <a href="#" className="hover:text-primary-400 transition-colors duration-200">Điều khoản sử dụng</a>
            <span className="text-warm-800">|</span>
            <a href="#" className="hover:text-primary-400 transition-colors duration-200">Chính sách bảo mật</a>
            <span className="text-warm-800">|</span>
            <a href="#" className="hover:text-primary-400 transition-colors duration-200">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
