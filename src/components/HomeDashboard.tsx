import React, { useEffect, useRef } from 'react';
import {
  HelpCircle, Smartphone, Gamepad2, PiggyBank, Calculator,
  Sparkles, MapPin, ChevronRight, Phone, ArrowUpRight, Award,
  Clock, ShieldCheck, HeartHandshake, Fuel, Star, Gift
} from 'lucide-react';
import gsap from 'gsap';
import contentData from '../data/contentData.json';

interface HomeDashboardProps {
  onSelectTab: (tabId: string) => void;
  onEndConversation: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectTab,
  onEndConversation
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { brand, menuTabs, faqSection } = contentData;

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.feature-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' }
      );
    }
  }, []);

  const getFeatureIcon = (id: string) => {
    switch (id) {
      case 'faq':
        return <HelpCircle className="w-7 h-7 text-[#005596]" />;
      case 'download_app':
        return <Smartphone className="w-7 h-7 text-emerald-600" />;
      case 'game':
        return <Gamepad2 className="w-7 h-7 text-amber-500" />;
      case 'deposit_calc':
        return <PiggyBank className="w-7 h-7 text-teal-600" />;
      case 'loan_calc':
        return <Calculator className="w-7 h-7 text-indigo-600" />;
      case 'products':
        return <Sparkles className="w-7 h-7 text-red-600" />;
      case 'branches':
        return <MapPin className="w-7 h-7 text-rose-600" />;
      default:
        return <Star className="w-7 h-7 text-[#005596]" />;
    }
  };

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Hero Welcome Kiosk Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#004276] via-[#005596] to-sky-900 text-white p-6 sm:p-10 shadow-2xl mb-8 sm:mb-12">
        {/* Abstract decorative banking rings */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/5 border border-white/10 pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-red-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sky-200 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Kính chào Quý khách đến với VietinBank</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Cổng Tương Tác Quầy Giao Dịch
            <span className="block text-amber-300 font-extrabold text-xl sm:text-2xl md:text-3xl mt-1">
              {brand.branchTitle}
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-sky-100 max-w-2xl leading-relaxed">
            Hỗ trợ giải đáp thao tác ứng dụng iPay, tra cứu biểu tính tiền gửi, tính toán lịch trả nợ vay và thư giãn nhận voucher xăng tại quầy giao dịch.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Giờ mở cửa: {brand.workingHours.weekdays.morning} &amp; {brand.workingHours.weekdays.afternoon}</span>
            </div>

            <a
              href={`tel:${brand.advisor.phoneClean}`}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-1.5 rounded-xl shadow-md transition"
            >
              <Phone className="w-4 h-4" />
              <span>Chuyên viên tư vấn: {brand.advisor.name} ({brand.advisor.phone})</span>
            </a>
          </div>
        </div>
      </div>

      {/* Feature 6 Highlight Banner Card (Card nổi bật có nhãn nhỏ "Nổi bật", icon ngôi sao/quà tặng, nền gradient xanh nhẹ hoặc viền đỏ mảnh) */}
      <div className="feature-card mb-8 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-sky-50 via-white to-red-50/50 border-2 border-red-500/40 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>Nổi Bật</span>
              <Gift className="w-3.5 h-3.5 text-amber-200" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#005596] transition">
              Sản phẩm dịch vụ nổi bật tại Chi nhánh
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Khám phá các sản phẩm, ưu đãi và tiện ích VietinBank đang được giới thiệu tại chi nhánh: Mở tài khoản hộ kinh doanh, chạm POS rút tiền, thu hộ KHDN &amp; thông tin đấu giá tài sản.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('products')}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition"
            >
              <span>Xem ngay</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of All 7 Core Features */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Danh Mục Tính Năng Phục Vụ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Chạm vào mục Quý khách muốn thao tác hoặc tìm hiểu thông tin
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            7 Tính Năng Trọng Tâm
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {menuTabs.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className="feature-card group relative bg-white rounded-3xl p-6 border border-slate-200 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-900/5 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  item.featured ? 'bg-red-500' : 'bg-slate-100 group-hover:bg-[#005596]'
                } transition-colors`}
              />

              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-sky-50 group-hover:border-sky-100 transition-colors">
                    {getFeatureIcon(item.id)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.featured && (
                      <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-extrabold uppercase">
                        Đặc biệt
                      </span>
                    )}
                    <span className="text-xs font-black text-slate-300 group-hover:text-sky-600 transition">
                      0{item.number}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#005596] transition mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {item.shortDesc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-[#005596] transition">
                <span>Trải nghiệm ngay</span>
                <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#005596] group-hover:text-white flex items-center justify-center transition-all">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Counter Service Banner */}
      <div className="bg-slate-100/80 rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#005596] text-white flex items-center justify-center shrink-0 shadow-md">
            <HeartHandshake className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-base sm:text-lg">
              Đồng Hành Cùng Quý Khách Tại VietinBank Tây Tiền Giang
            </h4>
            <p className="text-xs sm:text-sm text-slate-500">
              Quý khách cần hỗ trợ thêm thông tin hoặc giải đáp thắc mắc riêng tư?
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={`tel:${brand.advisor.phoneClean}`}
            className="px-5 py-3 rounded-2xl bg-[#005596] hover:bg-[#004276] text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi CVTV {brand.advisor.name}</span>
          </a>

          <button
            onClick={onEndConversation}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 transition"
          >
            Kết thúc cuộc trò chuyện
          </button>
        </div>
      </div>
    </div>
  );
};
