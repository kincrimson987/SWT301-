# GameHub — Cửa Hàng Phân Phối Game PC Kỹ Thuật Số Bản Quyền

Website thương mại điện tử chuyên bán game PC bản quyền **GameHub**, được xây dựng bằng **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, và **Zustand**. Giao diện tối hiện đại (Dark Theme Gaming), đầy đủ hiệu ứng tương tác thực tế, logic tính toán tài chính chuẩn xác bằng VND và sẵn sàng làm đối tượng kiểm thử phần mềm tự động (E2E / Selenium / Playwright / Cypress) nhờ hệ thống `data-testid` ổn định.

---

## 1. Công Nghệ Sử Dụng

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Ngôn ngữ**: TypeScript Strict Mode
- **Giao diện & Styling**: Tailwind CSS v4, Modern Dark Mode Gaming Aesthetic
- **Quản lý trạng thái (State Management)**: Zustand với middleware `persist` (lưu trữ localStorage)
- **Icons**: Lucide React (100% vector icons, không sử dụng emoji cho icon giao diện)
- **Notifications**: Toast System tương tác thời gian thực

---

## 2. Hướng Dẫn Cài Đặt & Chạy Website

### Cài đặt dependencies (nếu chưa cài):
```bash
npm install
```

### Chạy môi trường phát triển (Development):
```bash
npm run dev
```
Mở trình duyệt tại [http://localhost:3000](http://localhost:3000).

### Kiểm tra TypeScript & Build Production:
```bash
npm run build
npm run start
```

---

## 3. Tài Khoản Đăng Nhập Demo

Hệ thống cung cấp sẵn các tài khoản demo được cấu hình trước (có hỗ trợ nút 1-click tự động điền tại trang `/login`):

| Loại tài khoản | Email | Mật khẩu | Quyền |
| :--- | :--- | :--- | :--- |
| **Gamer Mặc Định** | `gamer@gamehub.vn` | `Demo@123456` | Khách hàng thông thường |
| **Tài Khoản VIP** | `pro@gamehub.vn` | `Vip@123456` | Thành viên VIP |
| **Kiểm thử lỗi** | `wrong@gamehub.vn` | `wrongpass` | *(Dùng để kiểm thử lỗi đăng nhập thất bại)* |

*Người dùng cũng có thể tạo tài khoản mới tại trang `/register`.*

---

## 4. Danh Sách Mã Giảm Giá Demo (Coupons)

| Mã Giảm Giá | Mô tả điều kiện | Giá trị giảm | Trạng thái |
| :--- | :--- | :--- | :--- |
| `GAMEHUB10` | Áp dụng cho mọi đơn hàng | Giảm **10%** tổng đơn | **Hợp lệ** |
| `GAMEHUB50K` | Áp dụng cho đơn hàng từ **300.000 ₫** | Giảm **50.000 ₫** | **Hợp lệ** |
| `VIP100K` | Áp dụng cho đơn hàng từ **800.000 ₫** | Giảm **100.000 ₫** | **Hợp lệ** |
| `EXPIRED20` | Mã đã hết hạn | Giảm 20% | **Không hợp lệ (Hết hạn)** |
| `MÃ BẤT KỲ` | Nhập mã không có trong hệ thống | N/A | **Báo lỗi mã không tồn tại** |

---

## 5. Danh Sách Đường Dẫn (Routes)

- `/` — Trang chủ: Hero banner, game nổi bật, game bán chạy, game giảm giá lớn, game mới phát hành, lọc thể loại nhanh.
- `/store` — Cửa hàng: Tìm kiếm từ khóa, lọc theo 8 thể loại, lọc khoảng giá, lọc đang giảm giá, lọc còn hàng, sắp xếp 6 tiêu chí, phân trang tải thêm.
- `/store/[slug]` — Chi tiết game: Gallery ảnh lớn, thông số chi tiết, cấu hình PC (tối thiểu & đề nghị), số lượng mua, nút thêm giỏ, yêu thích, game liên quan.
- `/cart` — Giỏ hàng: Bảng game đã chọn, tăng giảm số lượng, xóa item, ô nhập mã giảm giá, tính tổng tiền chuẩn VND, xóa toàn bộ giỏ.
- `/checkout` — Thanh toán demo: Thông tin người nhận, lựa chọn 3 phương thức thanh toán demo (VietQR, MoMo, Thẻ ATM), xác nhận đơn.
- `/checkout/success` — Xác nhận đơn hàng: Hiển thị mã đơn `GH-XXXXXX`, sinh License Key kỹ thuật số ngẫu nhiên cho từng game đã mua kèm nút copy key.
- `/wishlist` — Danh sách yêu thích: Thêm, xóa, chuyển từng game hoặc chuyển tất cả vào giỏ hàng.
- `/login` — Đăng nhập: Kiểm tra hợp lệ, hiển thị/ẩn mật khẩu, nút điền tài khoản nhanh, thông báo lỗi/thành công.
- `/register` — Đăng ký: Tạo tài khoản demo mới và tự động đăng nhập.
- `/orders` — Lịch sử đơn hàng: Danh sách các đơn hàng đã đặt cùng kho license keys.

---

## 6. Hướng Dẫn Kiểm Thử (QA & Test Automation Reference)

Tất cả các thành phần tương tác chính đều được gắn `data-testid` cố định:
- Header: `data-testid="header-logo"`, `data-testid="header-search-input"`, `data-testid="header-cart-button"`, `data-testid="header-wishlist-button"`, `data-testid="header-login-button"`, `data-testid="cart-badge"`, `data-testid="wishlist-badge"`.
- Game Card: `data-testid="game-card"`, `data-testid="add-to-cart-button"`, `data-testid="wishlist-toggle-button"`, `data-testid="game-current-price"`, `data-testid="game-original-price"`.
- Cửa hàng & Bộ lọc: `data-testid="store-search-input"`, `data-testid="reset-filters-button"`, `data-testid="filter-discount-checkbox"`, `data-testid="filter-instock-checkbox"`, `data-testid="store-sort-select"`, `data-testid="results-count"`, `data-testid="load-more-button"`.
- Chi tiết game: `data-testid="detail-add-to-cart-button"`, `data-testid="increase-quantity-button"`, `data-testid="decrease-quantity-button"`, `data-testid="quantity-display"`, `data-testid="detail-wishlist-button"`.
- Giỏ hàng: `data-testid="cart-item-row"`, `data-testid="cart-increase-qty"`, `data-testid="cart-decrease-qty"`, `data-testid="cart-remove-item"`, `data-testid="coupon-input"`, `data-testid="apply-coupon-button"`, `data-testid="summary-final-total"`, `data-testid="proceed-to-checkout-button"`.
- Thanh toán & Đặt hàng: `data-testid="checkout-fullname-input"`, `data-testid="checkout-email-input"`, `data-testid="checkout-phone-input"`, `data-testid="place-order-button"`, `data-testid="order-success-id"`, `data-testid="license-key-code"`.
- Đăng nhập: `data-testid="login-email-input"`, `data-testid="login-password-input"`, `data-testid="toggle-password-visibility"`, `data-testid="login-submit-button"`, `data-testid="login-error-alert"`, `data-testid="login-success-alert"`, `data-testid="demo-account-gamer"`, `data-testid="demo-account-vip"`, `data-testid="demo-account-invalid"`.
