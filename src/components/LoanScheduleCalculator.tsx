import React, { useState, useMemo } from 'react';
import { Calculator, Calendar, FileText, X, ChevronRight, ArrowLeft, Printer, AlertCircle, Info, Landmark } from 'lucide-react';
import { formatVND, formatNumberOnly, parseNumberFromInput, calculatePaymentDate } from '../utils/formatters';
import contentData from '../data/contentData.json';

interface LoanScheduleCalculatorProps {
  onBackToMainMenu: () => void;
}

interface ScheduleRow {
  period: number;
  paymentDate: string;
  remainingPrincipal: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
}

export const LoanScheduleCalculator: React.FC<LoanScheduleCalculatorProps> = ({ onBackToMainMenu }) => {
  const { loanTool } = contentData;

  // Input states as required: no simple slider for loan amount, but clear input field
  const [propertyValueRaw, setPropertyValueRaw] = useState<string>('2000000000'); // 2 Billion
  const [loanAmountRaw, setLoanAmountRaw] = useState<string>('1000000000'); // 1 Billion
  const [loanTermMonths, setLoanTermMonths] = useState<number>(120); // 120 months (10 years)
  const [annualInterestRate, setAnnualInterestRate] = useState<string>('8.0'); // 8%/year
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-06-16');
  const [paymentDayOfMonth, setPaymentDayOfMonth] = useState<number>(25);
  const [paymentCycleId, setPaymentCycleId] = useState<string>('month');
  const [roundingUnit, setRoundingUnit] = useState<number>(1000); // 1000 VND default

  // Detail Modal view
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const propertyValue = useMemo(() => parseNumberFromInput(propertyValueRaw), [propertyValueRaw]);
  const loanAmount = useMemo(() => parseNumberFromInput(loanAmountRaw), [loanAmountRaw]);

  // LTV (Loan to Value) percentage
  const ltvPercent = useMemo(() => {
    if (propertyValue <= 0) return 0;
    return Math.min(100, Math.round((loanAmount / propertyValue) * 100));
  }, [propertyValue, loanAmount]);

  // Calculate schedule rows based on reduction rules
  const { schedule, totalPrincipal, totalInterest, totalPayment, firstMonthPayment, lastMonthPayment, totalPeriods } = useMemo(() => {
    const rateYear = parseFloat(annualInterestRate) || 0;

    // Cycle months and period divisor
    let cycleMonths = 1;
    let periodDivisor = 12;
    if (paymentCycleId === 'quarter') {
      cycleMonths = 3;
      periodDivisor = 4;
    } else if (paymentCycleId === 'halfyear') {
      cycleMonths = 6;
      periodDivisor = 2;
    } else if (paymentCycleId === 'year') {
      cycleMonths = 12;
      periodDivisor = 1;
    }

    const periods = Math.max(1, Math.ceil(loanTermMonths / cycleMonths));
    const periodicRate = (rateYear / 100) / periodDivisor;

    // Rounding helper
    const roundFn = (val: number) => {
      if (roundingUnit === 1000) {
        return Math.round(val / 1000) * 1000;
      }
      return Math.round(val);
    };

    // Equal principal per period
    const rawPrincipalPerPeriod = loanAmount / periods;
    const basePrincipalPerPeriod = roundFn(rawPrincipalPerPeriod);

    let currentBalance = loanAmount;
    const rows: ScheduleRow[] = [];
    let sumPrincipal = 0;
    let sumInterest = 0;

    // Period 0 (Disbursement day)
    const disburseParts = disbursementDate.split('-');
    const disburseFormatted = disburseParts.length === 3 ? `${disburseParts[2]}/${disburseParts[1]}/${disburseParts[0]}` : disbursementDate;

    rows.push({
      period: 0,
      paymentDate: disburseFormatted,
      remainingPrincipal: loanAmount,
      principalPayment: 0,
      interestPayment: 0,
      totalPayment: 0
    });

    for (let k = 1; k <= periods; k++) {
      const payDate = calculatePaymentDate(disbursementDate, k, cycleMonths, paymentDayOfMonth);
      
      // Interest for this period = starting balance * periodic rate
      const interest = roundFn(currentBalance * periodicRate);
      
      // If last period, adjust principal to reconcile any rounding discrepancies
      let principal = basePrincipalPerPeriod;
      if (k === periods) {
        principal = currentBalance;
      } else {
        principal = Math.min(basePrincipalPerPeriod, currentBalance);
      }

      const total = principal + interest;
      const endBalance = Math.max(0, currentBalance - principal);

      sumPrincipal += principal;
      sumInterest += interest;

      rows.push({
        period: k,
        paymentDate: payDate,
        remainingPrincipal: endBalance,
        principalPayment: principal,
        interestPayment: interest,
        totalPayment: total
      });

      currentBalance = endBalance;
    }

    const firstPeriodTotal = rows.length > 1 ? rows[1].totalPayment : 0;
    const lastPeriodTotal = rows.length > 1 ? rows[rows.length - 1].totalPayment : 0;

    return {
      schedule: rows,
      totalPrincipal: sumPrincipal,
      totalInterest: sumInterest,
      totalPayment: sumPrincipal + sumInterest,
      firstMonthPayment: firstPeriodTotal,
      lastMonthPayment: lastPeriodTotal,
      totalPeriods: periods
    };
  }, [loanAmount, loanTermMonths, annualInterestRate, disbursementDate, paymentDayOfMonth, paymentCycleId, roundingUnit]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Calculator className="w-4 h-4" />
          <span>Dư Nợ Giảm Dần Chuẩn VietinBank</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          {loanTool.title}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          {loanTool.description}
        </p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Step 1: Input Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-[#005596] uppercase tracking-wider">
              Bước 1: Nhập thông tin khoản vay
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-1">
              Thông số giải ngân &amp; phương thức trả nợ
            </h3>
          </div>

          {/* 1. Giá trị Bất động sản / TSBĐ (Tùy chọn) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs sm:text-sm font-bold text-slate-700">
                Giá trị tài sản bảo đảm (VND)
              </label>
              <span className="text-xs text-slate-500 font-medium">
                {propertyValue > 0 ? formatVND(propertyValue) : '0 ₫'}
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={propertyValue ? formatNumberOnly(propertyValue) : propertyValueRaw}
                onChange={(e) => setPropertyValueRaw(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Nhập giá trị TSBĐ (ví dụ: 2.000.000.000)"
                className="w-full py-3 px-4 pr-14 rounded-2xl border border-slate-300 text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-[#005596] bg-slate-50/30"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>
          </div>

          {/* 2. Số tiền vay (dạng ô nhập, không để dạng kéo thả theo yêu cầu PDF) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs sm:text-sm font-bold text-slate-700">
                Số tiền vay <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-[#005596] font-bold">
                {loanAmount > 0 ? formatVND(loanAmount) : '0 ₫'}
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={loanAmount ? formatNumberOnly(loanAmount) : loanAmountRaw}
                onChange={(e) => setLoanAmountRaw(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Nhập số tiền muốn vay (ví dụ: 1.000.000.000)"
                className="w-full py-3.5 px-4 pr-14 rounded-2xl border-2 border-sky-600/40 text-base sm:text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-100 focus:border-[#005596] bg-white shadow-xs"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>

            {/* Quick Loan Amount Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                { label: '300 Triệu', val: 300000000 },
                { label: '500 Triệu', val: 500000000 },
                { label: '1 Tỷ', val: 1000000000 },
                { label: '2 Tỷ', val: 2000000000 },
                { label: '5 Tỷ', val: 5000000000 }
              ].map(item => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setLoanAmountRaw(item.val.toString())}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                    loanAmount === item.val
                      ? 'bg-[#005596] text-white border-[#005596]'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {propertyValue > 0 && (
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Tỷ lệ vay trên tài sản (LTV):</span>
                <span className={`font-bold ${ltvPercent > 80 ? 'text-amber-600' : 'text-emerald-700'}`}>
                  {ltvPercent}% ({ltvPercent <= 80 ? 'Hạn mức an toàn' : 'Cần thẩm định thêm'})
                </span>
              </div>
            )}
          </div>

          {/* 3. Thời gian vay & Lãi suất năm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                Thời gian vay (Tháng) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={loanTermMonths}
                  onChange={(e) => setLoanTermMonths(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full py-3 px-4 pr-16 rounded-2xl border border-slate-300 text-sm sm:text-base font-bold text-slate-900 focus:outline-none focus:border-[#005596]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  Tháng ({Math.round((loanTermMonths / 12) * 10) / 10} năm)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                Lãi suất (%/Năm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="25"
                  value={annualInterestRate}
                  onChange={(e) => setAnnualInterestRate(e.target.value)}
                  className="w-full py-3 px-4 pr-14 rounded-2xl border border-slate-300 text-sm sm:text-base font-bold text-slate-900 focus:outline-none focus:border-[#005596]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  %/Năm
                </span>
              </div>
            </div>
          </div>

          {/* 4. Ngày giải ngân & Ngày trả nợ định kỳ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                Ngày giải ngân <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full py-2.5 px-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#005596]"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">
                Ngày trả nợ định kỳ
              </label>
              <select
                value={paymentDayOfMonth}
                onChange={(e) => setPaymentDayOfMonth(parseInt(e.target.value, 10))}
                className="w-full py-2.5 px-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#005596] bg-white"
              >
                {[5, 10, 15, 20, 25, 28].map(day => (
                  <option key={day} value={day}>Ngày {day} hàng tháng</option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Chu kỳ trả nợ & Làm tròn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chu kỳ trả nợ
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {loanTool.cycles.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setPaymentCycleId(c.id)}
                    className={`text-xs py-1.5 px-2 rounded-xl border text-center font-medium transition ${
                      paymentCycleId === c.id
                        ? 'bg-[#005596] text-white border-[#005596]'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quy tắc làm tròn
              </label>
              <div className="flex gap-2">
                {loanTool.roundingOptions.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRoundingUnit(parseInt(r.value, 10))}
                    className={`flex-1 text-[11px] py-2 px-1 rounded-xl border text-center font-medium transition ${
                      roundingUnit === parseInt(r.value, 10)
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Summary Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-[#005596] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-400" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-sky-200">
                  Dự Tính Trả Nợ Vay
                </span>
              </div>
              <span className="text-xs bg-sky-500/30 text-sky-200 px-2.5 py-0.5 rounded-full font-bold">
                {totalPeriods} kỳ thanh toán
              </span>
            </div>

            {/* Số tiền trả tháng đầu & tháng cuối */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="text-xs text-sky-200 font-medium mb-1">
                  Số tiền trả kỳ đầu tiên (cao nhất)
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300">
                  {formatVND(firstMonthPayment)}
                </div>
              </div>

              <div>
                <div className="text-xs text-sky-200 font-medium mb-1">
                  Số tiền trả kỳ cuối cùng (thấp nhất)
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-300">
                  {formatVND(lastMonthPayment)}
                </div>
              </div>
            </div>

            {/* Tổng lãi & Tổng số tiền phải trả */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-sky-200">
                <span>Tổng lãi phải trả:</span>
                <span className="font-bold text-white">{formatVND(totalInterest)}</span>
              </div>
              <div className="flex justify-between items-center text-sky-200">
                <span>Tổng tiền gốc + lãi:</span>
                <span className="font-extrabold text-white text-base">{formatVND(totalPayment)}</span>
              </div>
            </div>

            {/* Bước 2: Nút Xem chi tiết */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => setIsDetailModalOpen(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition"
              >
                <span>Xem chi tiết lịch trả nợ</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-sky-50 border border-sky-100 rounded-3xl p-5 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 text-[#005596] font-bold">
              <Info className="w-4 h-4" />
              <span>Đặc điểm phương thức dư nợ giảm dần:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-600">
              <li>Tiền gốc trả đều mỗi kỳ: {formatVND(loanAmount / totalPeriods)}</li>
              <li>Tiền lãi giảm dần tương ứng với số dư nợ thực tế</li>
              <li>Tổng tiền lãi thấp hơn so với phương thức niên kim (trả góp đều)</li>
            </ul>
          </div>

          <button
            onClick={onBackToMainMenu}
            className="w-full py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm transition"
          >
            Quay lại menu chính
          </button>
        </div>
      </div>

      {/* Step 2: Detail Schedule Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-[#005596] to-sky-800 text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold text-amber-300 tracking-wider">
                  BƯỚC 2: CHI TIẾT LỊCH TRẢ NỢ VỚI DƯ NỢ GIẢM DẦN
                </span>
                <h3 className="text-base sm:text-xl font-bold mt-0.5">
                  Bảng Kê Chi Tiết Gốc &amp; Lãi Từng Kỳ ({totalPeriods} kỳ)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-xs flex items-center gap-1.5"
                  title="In bảng tính"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">In / Xuất</span>
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Meta Summary Bar */}
            <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-4 text-xs font-semibold text-slate-700 justify-around">
              <div>Số tiền vay: <strong className="text-[#005596]">{formatVND(loanAmount)}</strong></div>
              <div>Thời gian: <strong>{loanTermMonths} tháng</strong></div>
              <div>Lãi suất: <strong>{annualInterestRate}%/năm</strong></div>
              <div>Giải ngân: <strong>{disbursementDate}</strong></div>
            </div>

            {/* Scrollable Table Area */}
            <div className="overflow-y-auto grow p-4 sm:p-6">
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-3 text-center w-12">STT</th>
                      <th className="py-3 px-3">Kỳ trả nợ</th>
                      <th className="py-3 px-3 text-right">Số gốc còn lại</th>
                      <th className="py-3 px-3 text-right">Gốc</th>
                      <th className="py-3 px-3 text-right">Lãi</th>
                      <th className="py-3 px-3 text-right text-[#005596]">Tổng gốc + Lãi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {schedule.map((row) => (
                      <tr
                        key={row.period}
                        className={row.period === 0 ? 'bg-sky-50/50 font-semibold' : 'hover:bg-slate-50'}
                      >
                        <td className="py-2.5 px-3 text-center text-slate-500">{row.period}</td>
                        <td className="py-2.5 px-3">{row.paymentDate}</td>
                        <td className="py-2.5 px-3 text-right text-slate-700">{formatVND(row.remainingPrincipal)}</td>
                        <td className="py-2.5 px-3 text-right">{row.period === 0 ? '-' : formatVND(row.principalPayment)}</td>
                        <td className="py-2.5 px-3 text-right text-red-600">{row.period === 0 ? '-' : formatVND(row.interestPayment)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          {row.period === 0 ? '-' : formatVND(row.totalPayment)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Totals Footer */}
                  <tfoot className="bg-slate-900 text-white font-extrabold border-t-2 border-slate-700">
                    <tr>
                      <td colSpan={3} className="py-3.5 px-4 text-left uppercase tracking-wider text-amber-300">
                        TỔNG CỘNG
                      </td>
                      <td className="py-3.5 px-3 text-right text-sky-200">
                        {formatVND(totalPrincipal)}
                      </td>
                      <td className="py-3.5 px-3 text-right text-red-300">
                        {formatVND(totalInterest)}
                      </td>
                      <td className="py-3.5 px-3 text-right text-amber-300 text-sm">
                        {formatVND(totalPayment)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <p className="text-[11px] text-slate-400 mt-3 text-center">
                * Bảng tính mang tính chất tham khảo tại thời điểm hiện tại. Số tiền thực tế có thể thay đổi tùy theo quy định của VietinBank tại thời điểm giải ngân.
              </p>
            </div>

            {/* Modal Bottom Close */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs sm:text-sm transition"
              >
                Đóng bảng tính
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
