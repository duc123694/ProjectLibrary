import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Search, CreditCard, Truck,
  ArrowRight, Star, TrendingUp, Shield, Clock, Sparkles, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME } from '../../utils/constants';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-warm-50 min-h-screen overflow-x-hidden w-full selection:bg-primary-500 selection:text-white">

      {/* ═══════ HERO — Full Bleed ═══════ */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: '92vh' }}>
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt="Thư viện"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay with warm tint */}
          <div className="absolute inset-0 bg-gradient-to-r from-warm-950/90 via-warm-950/70 to-warm-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-950/80 via-transparent to-transparent" />
        </div>

        {/* Floating decorative orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          <div className="absolute top-20 right-[15%] w-80 h-80 rounded-full bg-primary-500/10 blur-[100px] animate-float-slow" />
          <div className="absolute bottom-32 left-[10%] w-64 h-64 rounded-full bg-amber-500/8 blur-[80px] animate-float" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full h-full flex items-center" style={{ minHeight: '92vh' }}>
          <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 py-24">
            <div className="max-w-2xl xl:max-w-3xl animate-fade-in-up">

              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-md mb-8
                              border border-white/[0.12] hover:border-primary-400/40 transition-all duration-300 cursor-default group">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white/90 tracking-wide">
                  Nền tảng thuê sách <span className="text-primary-400 font-bold">#1 Việt Nam</span>
                </span>
              </div>

              {/* Main heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-[1.1] tracking-tight"
                style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                Thuê sách online<br />
                <span className="text-gradient-warm">Dễ dàng</span>
                <span className="text-white"> & </span>
                <span className="text-gradient-warm">Tiện lợi</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-white/70 mb-10 leading-relaxed max-w-xl font-light">
                Khám phá hàng nghìn đầu sách phong phú, đặt thuê chỉ vài giây.
                Giao hàng tận nhà, hoàn tiền cọc tự động 100%.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
                <Link to="/books">
                  <button className="group flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary-vibrant text-white font-bold text-base
                                     shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 hover:scale-[1.03]
                                     transition-all duration-300">
                    <Search className="w-5 h-5" />
                    Khám phá kho sách
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/register">
                    <button className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-base
                                       hover:bg-white/20 hover:border-white/35 backdrop-blur-sm transition-all duration-300">
                      Đăng ký miễn phí
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </Link>
                )}
              </div>

              {/* Mini stats inline */}
              <div className="flex flex-wrap items-center gap-6">
                {[
                  { value: '10,000+', label: 'Đầu sách' },
                  { value: '5,000+', label: 'Thành viên' },
                  { value: '99.5%', label: 'Hài lòng' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-2xl font-black text-white">{s.value}</span>
                    <span className="text-sm text-white/60 font-medium">{s.label}</span>
                    {i < 2 && <div className="w-px h-5 bg-white/20 ml-2" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 20C480 40 240 80 0 40L0 80Z" fill="#fafaf9" />
          </svg>
        </div>
      </section>

      {/* ═══════ TICKER BAND ═══════ */}
      <div className="w-full bg-primary-600 py-3 overflow-hidden">
        <div className="animate-marquee ticker-track">
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex items-center gap-12 px-8">
              {['📚 10,000+ Đầu sách', '🚀 Giao hàng 1-3 ngày', '💳 Thanh toán an toàn', '🔄 Hoàn cọc tự động', '⭐ 99.5% Hài lòng', '📖 Thuê linh hoạt'].map((item, i) => (
                <span key={i} className="text-white/90 text-sm font-semibold whitespace-nowrap flex items-center gap-2">
                  {item}
                  <span className="text-primary-300 mx-2">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 py-28">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left: image */}
          <div className="lg:w-2/5 xl:w-[45%] shrink-0">
            <div className="relative overflow-hidden shadow-2xl shadow-warm-400/20">
              <img src="/reading-lifestyle.png" alt="Đọc sách thư giãn" className="w-full h-[480px] object-cover" />
              {/* Floating card */}
              <div className="absolute bottom-6 left-6 right-6 glass-warm rounded-2xl p-5 border border-white/60 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary-vibrant flex items-center justify-center shadow-md shrink-0">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-warm-900">Đã có 50,000+ lượt thuê</p>
                    <p className="text-xs text-warm-500 mt-0.5">Cộng đồng độc giả tin yêu</p>
                  </div>
                  <div className="ml-auto flex -space-x-2">
                    {['#e55a45', '#f59e0b', '#10b981', '#6366f1'].map((c, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: steps */}
          <div className="lg:w-3/5 xl:w-[55%]">
            <div className="mb-10">
              <span className="inline-block text-xs font-bold text-primary-600 tracking-widest uppercase px-3 py-1.5 bg-primary-50 rounded-lg mb-4 border border-primary-100">
                Quy trình
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-warm-900 mb-4 tracking-tight leading-tight">
                Thuê sách chỉ với<br />
                <span className="text-gradient">4 bước đơn giản</span>
              </h2>
              <p className="text-warm-500 text-lg font-light max-w-lg leading-relaxed">
                Sở hữu cuốn sách yêu thích chưa bao giờ nhanh chóng và tiết kiệm đến thế.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { step: '01', icon: Search, title: 'Tìm kiếm sách', desc: 'Duyệt theo tựa đề, tác giả hoặc thể loại yêu thích trong kho 10,000+ đầu sách.', gradient: 'from-primary-500 to-red-600', bg: 'bg-primary-50', border: 'border-primary-100' },
                { step: '02', icon: CreditCard, title: 'Đặt thuê & Thanh toán', desc: 'Chọn thời gian linh hoạt, thanh toán an toàn qua ví điện tử tích hợp.', gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                { step: '03', icon: Truck, title: 'Nhận sách tận nhà', desc: 'Đội giao hàng vận chuyển sách đến tận tay trong 1-3 ngày làm việc.', gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-100' },
                { step: '04', icon: BookOpen, title: 'Trả sách & Hoàn cọc', desc: 'Hoàn trả đơn giản, hệ thống tự động hoàn tiền cọc 100% vào tài khoản.', gradient: 'from-indigo-500 to-purple-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
              ].map((item, i) => (
                <div key={i} className={`relative group p-6 rounded-2xl ${item.bg} border ${item.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden`}>
                  <span className="absolute top-4 right-4 text-4xl font-black text-warm-200/70 select-none group-hover:text-warm-300/50 transition-colors">
                    {item.step}
                  </span>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-warm-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-warm-500 leading-relaxed font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STATS BAR ═══════ */}
      <section className="w-full bg-warm-900 py-20 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[20%] w-96 h-96 bg-primary-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-[10%] w-80 h-80 bg-amber-500/8 rounded-full blur-[90px]" />
        </div>
        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">
            {[
              { value: '10,000+', label: 'Đầu sách cập nhật', icon: BookOpen, color: 'text-primary-400' },
              { value: '5,000+', label: 'Thành viên tin dùng', icon: TrendingUp, color: 'text-emerald-400' },
              { value: '50,000+', label: 'Lượt thuê thành công', icon: CreditCard, color: 'text-amber-400' },
              { value: '99.5%', label: 'Đánh giá hài lòng', icon: Star, color: 'text-purple-400' },
            ].map((stat, i) => (
              <div key={i} className="text-center py-4 lg:px-8 group">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`} />
                <p className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">{stat.value}</p>
                <p className="text-sm text-white/50 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 py-28">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold text-primary-600 tracking-widest uppercase px-3 py-1.5 bg-primary-50 rounded-lg mb-4 border border-primary-100">
            Giá trị cốt lõi
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-warm-900 mb-4 tracking-tight">
            Tại sao chọn <span className="text-gradient">{APP_NAME}</span>?
          </h2>
          <p className="text-warm-500 text-lg max-w-2xl mx-auto font-light">
            Chúng tôi kiến tạo trải nghiệm đọc sách thời đại mới — tối ưu, an toàn và toàn diện.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: 'An toàn & Bảo mật tuyệt đối',
              desc: 'Mọi giao dịch được mã hóa đầu cuối. Thông tin cá nhân được bảo vệ theo tiêu chuẩn cao nhất.',
              accent: 'bg-primary-500',
              glow: 'shadow-primary-500/20',
              bg: 'hover:bg-primary-50/50',
              border: 'hover:border-primary-100',
            },
            {
              icon: Clock,
              title: 'Vận hành siêu tốc',
              desc: 'Đặt thuê trong 60 giây. Quy trình đóng gói tiêu chuẩn và giao nhận cực nhanh 1-3 ngày.',
              accent: 'bg-emerald-500',
              glow: 'shadow-emerald-500/20',
              bg: 'hover:bg-emerald-50/50',
              border: 'hover:border-emerald-100',
            },
            {
              icon: CreditCard,
              title: 'Ví điện tử tiện ích',
              desc: 'Nạp quỹ một lần — dùng mãi. Hoàn cọc tự động khi trả sách, không cần liên hệ hỗ trợ.',
              accent: 'bg-amber-500',
              glow: 'shadow-amber-500/20',
              bg: 'hover:bg-amber-50/50',
              border: 'hover:border-amber-100',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={`group p-8 rounded-3xl bg-white border border-warm-100 ${feature.border} ${feature.bg}
                         hover:shadow-xl ${feature.glow} transition-all duration-400 hover:-translate-y-1`}
            >
              <div className={`w-14 h-14 ${feature.accent} rounded-2xl flex items-center justify-center mb-6
                              shadow-lg ${feature.glow} group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-warm-900 mb-3">{feature.title}</h3>
              <p className="text-warm-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>



      {/* ═══════ CTA FULL-WIDTH ═══════ */}
      <section className="w-full relative overflow-hidden py-32">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-red-700 to-warm-900" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
          {/* Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '24px 24px'
          }} />
        </div>

        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 xl:px-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-3/5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300 animate-spin-slow" />
                <span className="text-sm font-semibold text-white">Ưu đãi thành viên mới</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                Sẵn sàng mở khóa<br />
                thế giới tri thức vô tận?
              </h2>
              <p className="text-xl text-primary-100/80 font-light leading-relaxed max-w-xl">
                Trở thành hội viên ngay hôm nay và nhận voucher giảm <span className="font-bold text-amber-300">50%</span> cho lượt thuê đầu tiên.
              </p>
            </div>
            <div className="lg:w-2/5 flex flex-col sm:flex-row lg:flex-col gap-4">
              <Link to={isAuthenticated ? '/books' : '/register'} className="block">
                <button className="group w-full flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-white text-primary-700 font-bold text-lg
                                   shadow-xl shadow-black/20 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300">
                  <span>{isAuthenticated ? 'Khám phá sách ngay' : 'Bắt đầu miễn phí'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/books" className="block">
                <button className="w-full flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-white/10 border border-white/25 text-white font-semibold text-lg
                                   hover:bg-white/20 backdrop-blur-sm transition-all duration-300">
                  Xem kho sách
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
