/**
 * Tiện ích hỗ trợ tìm kiếm không phân biệt dấu tiếng Việt
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  let strClean = str.toLowerCase();
  strClean = strClean.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  strClean = strClean.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  strClean = strClean.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  strClean = strClean.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  strClean = strClean.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  strClean = strClean.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  strClean = strClean.replace(/đ/g, 'd');
  // Xóa các ký tự dấu thanh kết hợp nếu có
  strClean = strClean.replace(/[\u0300\u0301\u0303\u0309\u0323]/g, '');
  strClean = strClean.replace(/[\u02C6\u0306\u031B]/g, '');
  return strClean.trim();
}

/**
 * Kiểm tra chuỗi nguồn có chứa từ khóa tìm kiếm (hỗ trợ cả có dấu và không dấu)
 */
export function matchSearch(source: string, keyword: string): boolean {
  if (!keyword || !keyword.trim()) return true;
  if (!source) return false;

  const rawSource = source.toLowerCase();
  const rawKeyword = keyword.toLowerCase().trim();

  // Khớp trực tiếp
  if (rawSource.includes(rawKeyword)) return true;

  // Khớp không dấu
  const cleanSource = removeVietnameseTones(source);
  const cleanKeyword = removeVietnameseTones(keyword);

  return cleanSource.includes(cleanKeyword);
}
