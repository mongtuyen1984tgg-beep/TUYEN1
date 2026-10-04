import React, { useState, useMemo } from 'react';
import { PiggyBank, Calculator, AlertCircle, Video, CheckCircle2, TrendingUp, HelpCircle, ExternalLink } from 'lucide-react';
import { formatVND, formatNumberOnly, parseNumberFromInput } from '../utils/formatters';
import contentData from '../data/contentData.json';

interface DepositCalculatorProps {
  onBackToMainMenu: () => void;
}

export const DepositCalculator: React.FC<DepositCalculatorProps> = ({ onBackToMainMenu }) => {
  const { depositTool } = contentData;

  const [depositAmountRaw, setDepositAmountRaw] = useState<string>('100000000'); // 100 Million default
  const [selectedTermMonths, setSelectedTermMonths] = useState<number>(12); // 12 months default
  const [customInterestRate, setCustomInterestRate] = useState<string>('4.7'); // %/year default

  // Validation errors
  const [amountTouched, setAmountTouched] = useState<boolean>(true);
  const [rateTouched, setRateTouched] = useState<boolean>(true);

  const depositAmount = useMemo(() => {
    return parseNumberFromInput(depositAmountRaw);
  }, [depositAmountRaw]);

  const interestRate = useMemo(() => {
    const parsed = parseFloat(customInterestRate);
    return isNaN(parsed) ? 0 : parsed;
  }, [customInterestRate]);

  // Validation rules according to PDF specs
  const amountError = useMemo(() => {
    if (!amountTouched) return null;
    if (depositAmount <= 0 || depositAmount < depositTool.rules.minAmount) {
      return depositTool.rules.errorAmount;
    }
    return null;
  }, [depositAmount, amountTouched, depositTool.rules]);

  const termError = useMemo(() => {
    if (!selectedTermMonths || selectedTermMonths <= 0) {
      return depositTool.rules.errorTerm;
    }
    return null;
  }, [selectedTermMonths, depositTool.rules]);

  const rateError = useMemo(() => {
    if (!rateTouched) return null;
    if (interestRate <= 0 || interestRate > 15) {
      return depositTool.rules.errorRate;
    }
    return null;
  }, [interestRate, rateTouched, depositTool.rules]);

  // Calculate Interest:
  // Tiền lãi = (Số tiền gửi x Lãi suất %/năm x Số tháng gửi) / 12
  const estimatedInterest = useMemo(() => {
    if (amountError || termError || rateError) return 0;
    return Math.round((depositAmount * (interestRate / 100) * selectedTermMonths) / 12);
  }, [depositAmount, interestRate, selectedTermMonths, amountError, termError, rateError]);

  const totalMaturityAmount = useMemo(() => {
    return depositAmount + estimatedInterest;
  }, [depositAmount, estimatedInterest]);

  const handleTermChange = (months: number) => {
    setSelectedTermMonths(months);
    const termObj = depositTool.terms.find(t => t.months === months);
    if (termObj) {
      setCustomInterestRate(termObj.rate.toString());
    }
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountTouched(true);
    // Allow only numeric digits
    const cleaned = e.target.value.replace(/[^0-9]/g, '');
    setDepositAmountRaw(cleaned);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <PiggyBank className="w-4 h-4 text-emerald-600" />
          <span>Tiết Kiệm Tích Lũy VietinBank</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          {depositTool.title}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Công cụ tính toán minh bạch lãi suất thực nhận theo kỳ hạn tiết kiệm tại quầy &amp; online
        </p>
      </div>

      {/* Main Form & Calculation Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Input Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              Thông tin tiền gửi
            </h3>
            <span className="text-xs text-slate-400">
              Điền các thông số để xem trước tiền lãi nhận được khi đáo hạn
            </span>
          </div>

          {/* 1. Số tiền gửi */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-700">
                Số tiền gửi (VND) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-sky-700 font-semibold">
                {depositAmount > 0 ? formatVND(depositAmount) : ''}
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={depositAmount ? formatNumberOnly(depositAmount) : depositAmountRaw}
                onChange={handleAmountInputChange}
                onBlur={() => setAmountTouched(true)}
                placeholder="Nhập số tiền gửi (ví dụ: 100.000.000)"
                className={`w-full py-3.5 px-4 pr-16 rounded-2xl border text-base sm:text-lg font-bold transition focus:outline-none focus:ring-2 ${
                  amountError
                    ? 'border-red-400 focus:ring-red-200 bg-red-50/20 text-red-900'
                    : 'border-slate-300 focus:border-[#005596] focus:ring-sky-100 text-slate-900 bg-slate-50/30'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>

            {/* Quick Amount Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {depositTool.quickAmounts.map((q) => (
                <button
                  key={q.value}
                  type="button"
                  onClick={() => {
                    setDepositAmountRaw(q.value.toString());
                    setAmountTouched(true);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium ${
                    depositAmount === q.value
                      ? 'bg-[#005596] text-white border-[#005596]'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>

            {amountError && (
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-red-600">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{amountError}</span>
              </div>
            )}
          </div>

          {/* 2. Kỳ hạn gửi */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
              Kỳ hạn gửi (Tháng) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {depositTool.terms.map((t) => (
                <button
                  key={t.months}
                  type="button"
                  onClick={() => handleTermChange(t.months)}
                  className={`py-2 px-1 text-center rounded-xl border transition ${
                    selectedTermMonths === t.months
                      ? 'bg-[#005596] border-[#005596] text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">{t.label}</div>
                  <div className={`text-[10px] mt-0.5 ${selectedTermMonths === t.months ? 'text-sky-200' : 'text-slate-400'}`}>
                    {t.rate}%/năm
                  </div>
                </button>
              ))}
            </div>

            {termError && (
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-red-600">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{termError}</span>
              </div>
            )}
          </div>

          {/* 3. Lãi suất */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-700">
                Lãi suất (%/năm) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Tự động điền theo biểu lãi suất VietinBank
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="15"
                value={customInterestRate}
                onChange={(e) => {
                  setRateTouched(true);
                  setCustomInterestRate(e.target.value);
                }}
                className={`w-full py-3 px-4 pr-16 rounded-2xl border text-sm sm:text-base font-bold transition focus:outline-none focus:ring-2 ${
                  rateError
                    ? 'border-red-400 focus:ring-red-200 bg-red-50/20 text-red-900'
                    : 'border-slate-300 focus:border-[#005596] focus:ring-sky-100 text-slate-900 bg-slate-50/30'
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                %/năm
              </span>
            </div>

            {rateError && (
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-red-600">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{rateError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Output Summary Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-[#005596] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-sky-200">
                  Dự Tính Lãi Tiền Gửi
                </span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                Trả lãi cuối kỳ
              </span>
            </div>

            {/* Tiền lãi dự tính */}
            <div className="mb-6">
              <div className="text-xs text-sky-200 font-medium mb-1">
                Tiền lãi dự tính
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
                {formatVND(estimatedInterest)}
              </div>
            </div>

            {/* Tổng tiền gốc + lãi */}
            <div className="pt-4 border-t border-white/10">
              <div className="text-xs text-sky-200 font-medium mb-1">
                Tổng tiền nhận được khi đáo hạn (Gốc + Lãi)
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {formatVND(totalMaturityAmount)}
              </div>
            </div>

            {/* Summary Details */}
            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-white/60 block">Gốc ban đầu:</span>
                <strong className="text-white">{formatVND(depositAmount)}</strong>
              </div>
              <div>
                <span className="text-white/60 block">Kỳ hạn gửi:</span>
                <strong className="text-white">{selectedTermMonths} tháng ({interestRate}%/năm)</strong>
              </div>
            </div>
          </div>

          {/* TikTok Guide Video Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-black text-white flex items-center justify-center shrink-0 shadow-md">
                <Video className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  Video Hướng Dẫn Gửi Tiết Kiệm
                </h4>
                <p className="text-[11px] text-slate-500">
                  Mẹo gửi tiết kiệm online sinh lời tối đa trên TikTok
                </p>
              </div>
            </div>

            <a
              href={depositTool.tiktokVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0"
            >
              <span>Xem video</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          {/* Advice Button */}
          <button
            onClick={onBackToMainMenu}
            className="w-full py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm transition"
          >
            Quay lại menu chính
          </button>
        </div>
      </div>
    </div>
  );
};
