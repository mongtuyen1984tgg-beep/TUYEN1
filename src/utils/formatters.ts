/**
 * VietinBank Kiosk Application Utilities
 */

export function formatVND(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
  if (isNaN(num)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(num);
}

export function formatNumberOnly(value: number): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0
  }).format(value);
}

export function parseNumberFromInput(raw: string): number {
  const clean = raw.replace(/[^0-9]/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

/**
 * Generate Next Scheduled Date given disbursement date, cycle month step, and due day of month
 * E.g., Disbursement: 10/01/2026, dueDay: 25 -> 1st payment: 25/02/2026, 2nd: 25/03/2026 ...
 */
export function calculatePaymentDate(startDateStr: string, periodIndex: number, cycleMonths: number, preferredDay: number = 25): string {
  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) {
    // Fallback date
    return `Kỳ ${periodIndex}`;
  }

  // Calculate target month and year
  const totalMonthsToAdd = periodIndex * cycleMonths;
  const targetDate = new Date(start.getFullYear(), start.getMonth() + totalMonthsToAdd, 1);
  
  // Find valid day in that month
  const lastDayOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
  const day = Math.min(preferredDay, lastDayOfMonth);
  targetDate.setDate(day);

  const dd = String(targetDate.getDate()).padStart(2, '0');
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const yyyy = targetDate.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
