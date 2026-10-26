/**
 * Định dạng tiền tệ VND với dấu chấm phân cách hàng nghìn và ký hiệu ₫
 */
export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 ₫';
  }
  const cleanAmount = Math.max(0, Math.round(amount));
  return new Intl.NumberFormat('vi-VN').format(cleanAmount) + ' ₫';
}

/**
 * Định dạng ngày theo chuẩn DD/MM/YYYY
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

/**
 * Sinh mã đơn hàng ngẫu nhiên GH-XXXXXX
 */
export function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GH-${code}`;
}

/**
 * Sinh key kích hoạt game demo dạng GHUB-XXXX-YYYY-ZZZZ
 */
export function generateGameKey(prefix = 'GHUB'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const block = () => {
    let res = '';
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };
  return `${prefix}-${block()}-${block()}-${block()}`;
}
