import React from 'react';
import { Apple, Smartphone, CheckCircle, ShieldCheck, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { QRCodeComponent } from './QRCodeComponent';
import contentData from '../data/contentData.json';

interface AppDownloadSectionProps {
  onBackToMainMenu: () => void;
}

export const AppDownloadSection: React.FC<AppDownloadSectionProps> = ({ onBackToMainMenu }) => {
  const { appDownload } = contentData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Smartphone className="w-4 h-4" />
          <span>Ngân Hàng Số VietinBank iPay</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          {appDownload.title}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600">
          {appDownload.subTitle}
        </p>
      </div>

      {/* QR Codes & Direct Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-12">
        {/* iOS Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg hover:shadow-xl hover:border-sky-300 transition flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-slate-700 to-slate-900" />
          
          <div className="flex items-center gap-2 mb-4 text-slate-800">
            <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-900">
              <Apple className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg text-slate-800">Apple App Store</h3>
              <p className="text-xs text-slate-500">Dành cho iPhone / iPad</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="my-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
            <QRCodeComponent value={appDownload.ios.url} size={190} />
          </div>

          <p className="text-xs font-semibold text-slate-600 mb-5">
            Dùng camera điện thoại iPhone quét mã QR ở trên
          </p>

          <a
            href={appDownload.ios.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-auto flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-black hover:bg-slate-800 text-white font-semibold text-sm transition shadow-md"
          >
            <Apple className="w-4 h-4 fill-white" />
            <span>Tải trên App Store</span>
            <ExternalLink className="w-4 h-4 opacity-70 ml-1" />
          </a>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg hover:shadow-xl hover:border-emerald-300 transition flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-600" />
          
          <div className="flex items-center gap-2 mb-4 text-slate-800">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg text-slate-800">Google Play Store</h3>
              <p className="text-xs text-slate-500">Dành cho điện thoại Android</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="my-3 p-3 bg-emerald-50/40 rounded-2xl border border-emerald-100 shadow-inner">
            <QRCodeComponent
              value={appDownload.android.url}
              size={190}
              color={{ dark: '#065F46', light: '#FFFFFF' }}
            />
          </div>

          <p className="text-xs font-semibold text-slate-600 mb-5">
            Dùng máy ảnh hoặc ứng dụng quét mã QR trên Android
          </p>

          <a
            href={appDownload.android.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-auto flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#005596] hover:bg-[#004276] text-white font-semibold text-sm transition shadow-md shadow-sky-900/10"
          >
            <Smartphone className="w-4 h-4" />
            <span>Tải trên Google Play</span>
            <ExternalLink className="w-4 h-4 opacity-70 ml-1" />
          </a>
        </div>
      </div>

      {/* Feature Highlights of VietinBank iPay */}
      <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">
          Lợi Ích Vượt Trội Khi Sử Dụng Ứng Dụng VietinBank iPay
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {appDownload.benefits.map((benefit, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#005596] flex items-center justify-center font-bold text-sm mb-3">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 mb-1">
                {benefit.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onBackToMainMenu}
            className="px-6 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition"
          >
            Quay lại menu chính
          </button>
        </div>
      </div>
    </div>
  );
};
