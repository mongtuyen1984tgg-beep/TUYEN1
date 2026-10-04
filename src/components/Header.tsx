import React from 'react';
import { Phone, Clock, Home, Sparkles, HelpCircle, Smartphone, Gamepad2, PiggyBank, Calculator, MapPin } from 'lucide-react';
import contentData from '../data/contentData.json';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab }) => {
  const { brand } = contentData;

  const tabIcons: Record<string, React.ReactNode> = {
    faq: <HelpCircle className="w-4 h-4" />,
    download_app: <Smartphone className="w-4 h-4" />,
    game: <Gamepad2 className="w-4 h-4" />,
    deposit_calc: <PiggyBank className="w-4 h-4" />,
    loan_calc: <Calculator className="w-4 h-4" />,
    products: <Sparkles className="w-4 h-4" />,
    branches: <MapPin className="w-4 h-4" />
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-red-700 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wide">Quầy Giao Dịch Điện Tử</span>
            <span className="text-white/60">|</span>
            <span className="text-sky-100 hidden sm:inline">{brand.branchTitle}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden md:flex items-center gap-1.5 text-sky-100">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{brand.workingHours.weekdays.morning} &amp; {brand.workingHours.weekdays.afternoon}</span>
            </div>

            <a
              href={`tel:${brand.advisor.phoneClean}`}
              className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-600 px-2.5 py-0.5 rounded-full font-medium transition text-white shadow-xs"
              title="Gọi chuyên viên tư vấn hỗ trợ"
            >
              <Phone className="w-3 h-3 text-white" />
              <span>CVTV {brand.advisor.name}: <strong className="underline underline-offset-2">{brand.advisor.phone}</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-4">
        {/* Logo at top-left as required */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 text-left group transition focus:outline-none"
        >
          <div className="relative h-10 sm:h-12 w-auto flex items-center">
            <img
              src={brand.logo}
              alt="VietinBank Logo"
              className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-102"
              onError={(e) => {
                // Fallback styled text if image link fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            {/* Fallback brand text if image is hidden */}
            <div className="hidden text-xl font-extrabold tracking-tight text-[#005596]">
              VietinBank
            </div>
          </div>
          <div className="hidden lg:block border-l border-slate-200 pl-3">
            <div className="text-xs uppercase tracking-wider font-bold text-slate-800">
              {brand.branchTitle}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Cổng Tương Tác Khách Hàng
            </div>
          </div>
        </button>

        {/* Home & Hot Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('home')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'home'
                ? 'bg-sky-50 text-[#005596] border border-sky-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Trang chủ</span>
          </button>

          <a
            href={`tel:${brand.hotline.replace(/\s+/g, '')}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition border border-red-200"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Hotline:</span>
            <span>{brand.hotline}</span>
          </a>
        </div>
      </div>

      {/* Quick Navigation Pills for All 7 Features */}
      <div className="border-t border-slate-100 bg-slate-50/70 overflow-x-auto scrollbar-none py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
          {contentData.menuTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#005596] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300'
                } ${tab.featured ? 'ring-1 ring-red-400/50' : ''}`}
              >
                <span className={`w-4 h-4 flex items-center justify-center ${isActive ? 'text-white' : 'text-sky-700'}`}>
                  {tabIcons[tab.id]}
                </span>
                <span>{tab.number}. {tab.title}</span>
                {tab.featured && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-red-500 text-white rounded-full font-bold">
                    HOT
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
