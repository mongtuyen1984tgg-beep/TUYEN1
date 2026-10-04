import React, { useState } from 'react';
import {
  KeyRound, CreditCard, Fingerprint, FileSpreadsheet, CalendarClock,
  ArrowLeft, ArrowRight, Play, ExternalLink, CheckCircle2, AlertCircle,
  Phone, RotateCcw, X, ZoomIn, HelpCircle, ChevronRight, MessageSquare
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface FaqSectionProps {
  onBackToMainMenu: () => void;
  onEndConversation: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onBackToMainMenu,
  onEndConversation
}) => {
  const { faqSection, brand } = contentData;
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'ok' | 'not_ok'>('idle');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const selectedCard = faqSection.cards.find(c => c.id === selectedCardId);

  const getCardIcon = (id: string) => {
    switch (id) {
      case 'forgot_password':
        return <KeyRound className="w-7 h-7 text-[#005596]" />;
      case 'close_card':
        return <CreditCard className="w-7 h-7 text-rose-600" />;
      case 'biometrics':
        return <Fingerprint className="w-7 h-7 text-emerald-600" />;
      case 'e_tax':
        return <FileSpreadsheet className="w-7 h-7 text-amber-600" />;
      case 'booking_appointment':
        return <CalendarClock className="w-7 h-7 text-purple-600" />;
      default:
        return <HelpCircle className="w-7 h-7 text-sky-600" />;
    }
  };

  const handleSelectCard = (id: string) => {
    setSelectedCardId(id);
    setCurrentStepIndex(0);
    setFeedbackStatus('idle');
  };

  const handleBackToList = () => {
    setSelectedCardId(null);
    setCurrentStepIndex(0);
    setFeedbackStatus('idle');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* If No Card Selected: Display List of FAQ Cards */}
      {!selectedCard ? (
        <div className="animate-in fade-in duration-300">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-[#005596] text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle className="w-4 h-4" />
              <span>Hỗ Trợ Tương Tác Tại Quầy</span>
            </div>
            {/* The exact question specified in requirements */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              {faqSection.question}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Chọn chủ đề bên dưới để xem hướng dẫn từng bước chi tiết kèm hình ảnh minh họa thực tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {faqSection.cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleSelectCard(card.id)}
                className="group relative flex flex-col p-6 rounded-2xl bg-white border border-slate-200 hover:border-sky-500 hover:shadow-xl hover:shadow-sky-900/5 transition-all duration-200 text-left cursor-pointer overflow-hidden"
              >
                {/* Decorative border bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 group-hover:bg-[#005596] transition-colors" />

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-sky-50 transition-colors">
                    {getCardIcon(card.id)}
                  </div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-sky-600 transition">
                    #{idx + 1}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-[#005596] transition line-clamp-2 mb-2">
                  {card.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-4 grow">
                  {card.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-[#005596]">
                  <span>{card.steps.length} bước thực hiện</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Xem ngay</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Action Bar */}
          <div className="mt-12 p-4 sm:p-6 bg-slate-100/80 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-white text-red-600 shadow-xs">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Cần hỗ trợ trực tiếp từ giao dịch viên?</p>
                <p className="text-sm font-bold text-slate-800">
                  CVTV {brand.advisor.name} - <a href={`tel:${brand.advisor.phoneClean}`} className="text-[#005596] underline">{brand.advisor.phone}</a>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onBackToMainMenu}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition"
              >
                Quay lại menu chính
              </button>
              <button
                onClick={onEndConversation}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition"
              >
                Kết thúc cuộc trò chuyện
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* If Card is Selected: Step-by-step Interactive Viewer */
        <div className="animate-in fade-in duration-300">
          {/* Top Bar with navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#005596] hover:bg-sky-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách hướng dẫn</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onBackToMainMenu}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
              >
                Quay lại menu chính
              </button>
              <button
                onClick={onEndConversation}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
              >
                Kết thúc cuộc trò chuyện
              </button>
            </div>
          </div>

          {/* Guide Title & Video Link */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wide">
                  Chủ đề hướng dẫn
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {selectedCard.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {selectedCard.description}
                </p>
              </div>

              {selectedCard.videoUrl && (
                <a
                  href={selectedCard.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-red-600/20 transition shrink-0"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Xem Video trên YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              )}
            </div>

            {/* Stepper Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                <span>Bước {currentStepIndex + 1} / {selectedCard.steps.length}</span>
                <span>{Math.round(((currentStepIndex + 1) / selectedCard.steps.length) * 100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#005596] to-sky-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStepIndex + 1) / selectedCard.steps.length) * 100}%` }}
                />
              </div>

              {/* Step indicator pills */}
              <div className="flex gap-1.5 mt-3 overflow-x-auto py-1 scrollbar-none">
                {selectedCard.steps.map((s, idx) => (
                  <button
                    key={s.step}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition shrink-0 ${
                      idx === currentStepIndex
                        ? 'bg-[#005596] text-white'
                        : idx < currentStepIndex
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    B.{s.step}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Step Content Box */}
          {selectedCard.steps[currentStepIndex] && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Step text instructions */}
                <div className="lg:col-span-6 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-50 text-[#005596] text-xs font-bold w-fit mb-4">
                    <span>HƯỚNG DẪN THỰC HIỆN BƯỚC {selectedCard.steps[currentStepIndex].step}</span>
                  </div>

                  <div className="text-base sm:text-xl font-semibold text-slate-800 leading-relaxed mb-6">
                    {selectedCard.steps[currentStepIndex].text}
                  </div>

                  {/* Navigation controls for steps */}
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentStepIndex === 0}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs sm:text-sm text-slate-700 transition"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Bước trước</span>
                    </button>

                    <button
                      onClick={() => setCurrentStepIndex(prev => Math.min(selectedCard.steps.length - 1, prev + 1))}
                      disabled={currentStepIndex === selectedCard.steps.length - 1}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#005596] hover:bg-[#004276] disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs sm:text-sm text-white transition shadow-sm"
                    >
                      <span>Bước tiếp theo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Step image illustration */}
                <div className="lg:col-span-6 flex flex-col items-center">
                  <div className="relative group max-w-sm w-full bg-slate-50 p-2 sm:p-3 rounded-2xl border border-slate-200 shadow-inner">
                    <img
                      src={selectedCard.steps[currentStepIndex].image}
                      alt={`Minh họa bước ${selectedCard.steps[currentStepIndex].step}`}
                      className="w-full max-h-[420px] object-contain rounded-xl mx-auto cursor-zoom-in"
                      onClick={() => setZoomedImage(selectedCard.steps[currentStepIndex].image)}
                      onError={(e) => {
                        // Fallback placeholder with helpful label
                        (e.currentTarget as HTMLElement).style.display = 'none';
                        const parent = (e.currentTarget as HTMLElement).parentElement;
                        if (parent) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'w-full h-64 flex flex-col items-center justify-center bg-slate-100 rounded-xl text-slate-400 p-4 text-center';
                          placeholder.innerHTML = `<svg class="w-12 h-12 mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="text-xs">Hình ảnh minh họa Bước ${selectedCard.steps[currentStepIndex].step}</span>`;
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                    <button
                      onClick={() => setZoomedImage(selectedCard.steps[currentStepIndex].image)}
                      className="absolute bottom-4 right-4 bg-black/70 hover:bg-black text-white p-2 rounded-lg text-xs flex items-center gap-1 shadow-md transition"
                    >
                      <ZoomIn className="w-4 h-4" />
                      <span>Xem to ảnh</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2">
                    Hình ảnh chụp màn hình thao tác trên ứng dụng VietinBank iPay
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Prompt at the end of guidance: "Hỏi khách hàng thực hiện ổn hay chưa?" */}
          <div className="mt-8 bg-gradient-to-r from-sky-50 via-slate-50 to-indigo-50 rounded-2xl p-6 border border-sky-100">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                {faqSection.promptFeedback}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-5">
                Vui lòng phản hồi trải nghiệm của Quý khách để chúng tôi hỗ trợ tốt nhất:
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setFeedbackStatus('ok')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition ${
                    feedbackStatus === 'ok'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Đã ổn, tôi đã làm được</span>
                </button>

                <button
                  onClick={() => setFeedbackStatus('not_ok')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition ${
                    feedbackStatus === 'not_ok'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white hover:bg-amber-50 text-amber-700 border border-amber-300'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Chưa ổn, cần hỗ trợ thêm</span>
                </button>
              </div>

              {/* Feedback responses based on specification */}
              {feedbackStatus === 'ok' && (
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm animate-in fade-in duration-200">
                  <p className="font-bold mb-2">
                    {faqSection.feedbackOkMessage}
                  </p>
                  <p className="text-xs text-emerald-700 mb-4">
                    Quý khách có thể quay lại menu chính để khám phá thêm các tính năng khác hoặc kết thúc trò chuyện.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={onBackToMainMenu}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      Quay lại menu chính
                    </button>
                    <button
                      onClick={onEndConversation}
                      className="px-4 py-2 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition"
                    >
                      Kết thúc cuộc trò chuyện
                    </button>
                  </div>
                </div>
              )}

              {feedbackStatus === 'not_ok' && (
                <div className="mt-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-left animate-in fade-in duration-200">
                  <div className="flex items-start gap-3">
                    <Phone className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed mb-3">
                        “{faqSection.feedbackNotOkMessage}”
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href={`tel:${brand.advisor.phoneClean}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Gọi ngay: {brand.advisor.phone}</span>
                        </a>
                        <button
                          onClick={onBackToMainMenu}
                          className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                        >
                          Quay lại menu chính
                        </button>
                        <button
                          onClick={onEndConversation}
                          className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition"
                        >
                          Kết thúc cuộc trò chuyện
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Modal for Illustration Images */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-white rounded-2xl p-2 overflow-hidden shadow-2xl">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomedImage}
              alt="Ảnh phóng to chi tiết"
              className="max-h-[85vh] w-auto mx-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
