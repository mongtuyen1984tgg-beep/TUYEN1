import React from 'react';
import { Heart, CheckCircle2, Home } from 'lucide-react';
import contentData from '../data/contentData.json';

interface EndConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoHome: () => void;
}

export const EndConversationModal: React.FC<EndConversationModalProps> = ({
  isOpen,
  onClose,
  onGoHome
}) => {
  if (!isOpen) return null;

  const { brand, faqSection } = contentData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-center border border-slate-100 overflow-hidden">
        {/* Top decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#005596] via-sky-500 to-[#ED1C24]" />

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
          <Heart className="w-8 h-8 fill-red-500 text-red-500 animate-bounce" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
          VietinBank Trân Trọng Cảm Ơn!
        </h3>

        <div className="p-4 my-4 bg-sky-50/70 border border-sky-100 rounded-2xl">
          <p className="text-base sm:text-lg font-semibold text-[#005596] leading-relaxed">
            “{faqSection.endConversationMessage}”
          </p>
        </div>

        <p className="text-xs text-slate-500 mb-6">
          Rất hân hạnh được đồng hành và phục vụ Quý khách tại {brand.branchTitle}. Chúc Quý khách giao dịch thành công và nhiều niềm vui!
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              onGoHome();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#005596] hover:bg-[#004276] text-white font-semibold text-sm transition shadow-md shadow-sky-900/10"
          >
            <Home className="w-4 h-4" />
            <span>Về màn hình chính</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
          >
            Đóng thông báo
          </button>
        </div>
      </div>
    </div>
  );
};
