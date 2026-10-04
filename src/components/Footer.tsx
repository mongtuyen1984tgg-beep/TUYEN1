import React from 'react';
import { Phone, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import contentData from '../data/contentData.json';

interface FooterProps {
  onSelectTab: (tabId: string) => void;
  onEndConversation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onEndConversation }) => {
  const { brand } = contentData;

  return (
    <footer className="mt-16 bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-black text-white tracking-tight">VietinBank</span>
              <span className="text-xs px-2 py-0.5 rounded bg-red-600 font-bold uppercase">Kiosk</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {brand.fullName} - {brand.branchTitle}. Nâng giá trị cuộc sống, tận tâm phục vụ Quý khách hàng.
            </p>
            <div className="text-xs text-sky-400 font-medium">
              Khẩu hiệu: “{brand.slogan}”
            </div>
          </div>

          {/* Col 2: Support Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Kênh Hỗ Trợ Khách Hàng
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <p>
                <span className="text-slate-400 block">Tổng đài CSKH 24/7:</span>
                <a href={`tel:${brand.hotline.replace(/\s+/g, '')}`} className="text-white font-bold hover:text-sky-300">
                  {brand.hotline}
                </a>
              </p>
              <p>
                <span className="text-slate-400 block">Chuyên viên tư vấn phụ trách:</span>
                <strong className="text-white">{brand.advisor.name}</strong> -{' '}
                <a href={`tel:${brand.advisor.phoneClean}`} className="text-red-400 font-bold hover:underline">
                  {brand.advisor.phone}
                </a>
              </p>
            </div>
          </div>

          {/* Col 3: Hours & Operations */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Giờ Giao Dịch
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p>
                <strong className="text-white block">{brand.workingHours.weekdays.title}:</strong>
                Sáng: {brand.workingHours.weekdays.morning}<br />
                Chiều: {brand.workingHours.weekdays.afternoon}
              </p>
              <p>
                <strong className="text-white block">{brand.workingHours.weekend.title}:</strong>
                <span className="text-amber-400">{brand.workingHours.weekend.status}</span>
              </p>
            </div>
          </div>

          {/* Col 4: Quick Navigation & Conversation End */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Thao Tác Nhanh
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onSelectTab('home')}
                className="block text-slate-400 hover:text-white transition"
              >
                Trang chủ Kiosk
              </button>
              <button
                onClick={() => onSelectTab('faq')}
                className="block text-slate-400 hover:text-white transition"
              >
                Giải đáp thắc mắc khách hàng
              </button>
              <button
                onClick={() => onSelectTab('game')}
                className="block text-slate-400 hover:text-white transition"
              >
                Trò chơi nhận voucher xăng
              </button>
              <button
                onClick={() => onSelectTab('products')}
                className="block text-slate-400 hover:text-white transition"
              >
                Sản phẩm dịch vụ nổi bật
              </button>
              <button
                onClick={onEndConversation}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-semibold transition"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Kết thúc cuộc trò chuyện</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Ngân hàng TMCP Công Thương Việt Nam - {brand.branchTitle}.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Ứng dụng hỗ trợ giao dịch số tại quầy</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
