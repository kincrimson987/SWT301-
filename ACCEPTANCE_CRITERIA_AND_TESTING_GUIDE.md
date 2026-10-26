# TÀI LIỆU TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA) & MA TRẬN RỦI RO KIỂM THỬ (RISK-BASED TESTING)
## DỰ ÁN: GAMEHUB PC DIGITAL STORE
**Đề tài thực hành**: Quản lý kiểm thử trong Scrum: Kiểm thử dựa trên rủi ro và quản lý lỗi (ISTQB & Scrum Framework)

---

## I. MA TRẬN RỦI RO KIỂM THỬ (RISK-BASED TESTING MATRIX)

Theo tiêu chuẩn **ISTQB**, mức độ rủi ro (Risk Level) được xác định bởi công thức:
$$\text{Risk Level} = \text{Likelihood (Khả năng xảy ra)} \times \text{Impact (Mức độ ảnh hưởng)}$$

| Mã Rủi Ro | Hạng mục chức năng | Nguy cơ / Sự cố tiềm ẩn | Khả năng (1-5) | Ảnh hưởng (1-5) | Mức độ rủi ro | Mức độ ưu tiên kiểm thử (Priority) |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| **R-01** | **Tính toán tài chính (Cart Total)** | Sai lệch tổng tiền khi mua nhiều game, số lượng lớn hoặc sai số dấu phẩy động (floating point). | 3 | 5 | **Cao (15)** | **P1 (Highest)** |
| **R-02** | **Quy tắc Mã giảm giá (Coupons)** | Áp dụng mã khi không đủ điều kiện tối thiểu, mã hết hạn vẫn được giảm, hoặc không hủy mã khi giảm subtotal. | 4 | 4 | **Cao (16)** | **P1 (Highest)** |
| **R-03** | **Thanh toán & Đơn hàng (Checkout)** | Người dùng gửi đơn hàng khi giỏ rỗng, thông tin nhận key không hợp lệ nhưng vẫn tạo đơn thành công. | 3 | 5 | **Cao (15)** | **P1 (Highest)** |
| **R-04** | **Xác thực phiên (Auth & Session)** | Đăng nhập sai nhưng hệ thống vẫn nhận diện người dùng, hoặc lộ thông tin đăng nhập trong session. | 3 | 4 | **Trung bình - Cao (12)** | **P2 (High)** |
| **R-05** | **Kiểm soát kho hàng (Stock Control)** | Thêm sản phẩm đã hết hàng vào giỏ hàng và thanh toán thành công. | 2 | 4 | **Trung bình (8)** | **P2 (High)** |
| **R-06** | **Tìm kiếm & Bộ lọc (Search & Filters)** | Tìm kiếm từ khóa không có kết quả nhưng không hiển thị Empty State, làm người dùng tưởng lỗi ứng dụng. | 3 | 3 | **Trung bình (9)** | **P3 (Medium)** |
| **R-07** | **Lưu trữ dữ liệu (Persistence)** | Tải lại trang (F5) làm mất sản phẩm trong giỏ hàng hoặc danh sách yêu thích. | 2 | 4 | **Trung bình (8)** | **P3 (Medium)** |

---

## II. USER STORIES & ACCEPTANCE CRITERIA (GHERKIN FORMAT)

---

### User Story 1: Xác thực người dùng (Authentication & Session)
> **Là một** game thủ đã đăng ký tài khoản,  
> **Tôi muốn** đăng nhập vào tài khoản GameHub của mình,  
> **Để** lưu trữ lịch sử đơn hàng và nhận License Key bản quyền kỹ thuật số.

#### AC 1.1: Đăng nhập thành công với tài khoản hợp lệ
- **Given**: Người dùng đang ở trang `/login`.
- **When**: Nhập Email `gamer@gamehub.vn` và Mật khẩu `Demo@123456`.
- **And**: Nhấn nút `Đăng nhập vào GameHub` (`data-testid="login-submit-button"`).
- **Then**: 
  - Hiển thị thông báo thành công `data-testid="login-success-alert"` với nội dung: *"Chào mừng trở lại, Nguyễn Hoàng Gamer!"*.
  - Người dùng được chuyển hướng về trang chủ (`/`).
  - Header hiển thị menu tài khoản với tên `Nguyễn Hoàng Gamer` (`data-testid="user-menu-button"`).
  - Nút `Đăng nhập` trên Header không còn hiển thị.

#### AC 1.2: Đăng nhập thất bại khi sai mật khẩu hoặc tài khoản không tồn tại
- **Given**: Người dùng đang ở trang `/login`.
- **When**: Nhập Email `wrong@gamehub.vn` và Mật khẩu `wrongpass`.
- **And**: Nhấn nút `Đăng nhập vào GameHub` (`data-testid="login-submit-button"`).
- **Then**: 
  - Hiển thị thông báo lỗi `data-testid="login-error-alert"` với nội dung: *"Tài khoản hoặc mật khẩu không chính xác."*.
  - Người dùng vẫn ở lại trang `/login` (không chuyển trang).
  - Header vẫn hiển thị nút `Đăng nhập` (`data-testid="header-login-button"`), không có session nào được kích hoạt.

#### AC 1.3: Kiểm tra tính hợp lệ dữ liệu đầu vào (Validation)
- **Given**: Người dùng đang ở trang `/login`.
- **When**: Bỏ trống trường Email hoặc Mật khẩu, hoặc nhập email sai định dạng (ví dụ `invalid-email`).
- **Then**: 
  - Hiển thị thông báo lỗi yêu cầu kiểm tra dữ liệu đầu vào.
  - Form không thực hiện gửi dữ liệu.

---

### User Story 2: Tìm kiếm và Lọc Game (Catalog Search & Filter)
> **Là một** khách hàng ghé thăm GameHub,  
> **Tôi muốn** tìm kiếm và lọc game theo tên, thể loại, khoảng giá và khuyến mãi,  
> **Để** nhanh chóng tìm thấy tựa game mình muốn mua.

#### AC 2.1: Tìm kiếm trả về kết quả chính xác
- **Given**: Người dùng đang ở trang `/store`.
- **When**: Nhập từ khóa `Wukong` vào ô tìm kiếm (`data-testid="store-search-input"`).
- **Then**: 
  - Danh sách game hiển thị duy nhất game `Wukong: Legend of the Golden Cloud`.
  - Bộ đếm kết quả (`data-testid="results-count"`) hiển thị giá trị `1`.

#### AC 2.2: Xử lý tìm kiếm không có kết quả (Empty State)
- **Given**: Người dùng đang ở trang `/store`.
- **When**: Nhập từ khóa không tồn tại, ví dụ `game_khong_ton_tai_xyz123`.
- **Then**: 
  - Bộ đếm kết quả (`data-testid="results-count"`) hiển thị giá trị `0`.
  - Hiển thị khối thông báo rỗng `data-testid="empty-store-state"` với tiêu đề: *"Không tìm thấy tựa game nào phù hợp"*.
  - Hiển thị nút `Xóa tất cả bộ lọc` (`data-testid="empty-state-reset-button"`).
- **When**: Nhấn nút `Xóa tất cả bộ lọc`.
- **Then**: 
  - Ô tìm kiếm và các bộ lọc được xóa sạch.
  - Danh sách game được phục hồi đầy đủ (16 game demo).

#### AC 2.3: Lọc game đang giảm giá (Discount Filter)
- **Given**: Người dùng đang ở trang `/store`.
- **When**: Tích chọn checkbox `Đang giảm giá` (`data-testid="filter-discount-checkbox"`).
- **Then**: 
  - Tất cả các game hiển thị trên grid đều có `data-testid="discount-badge"`.
  - Không có bất kỳ game nào có `discountPercent = 0` được hiển thị.

---

### User Story 3: Giỏ hàng & Cập nhật số lượng (Shopping Cart Management)
> **Là một** người mua hàng,  
> **Tôi muốn** thêm, xóa và điều chỉnh số lượng game trong giỏ hàng,  
> **Để** quản lý danh mục và chi phí đơn hàng của mình.

#### AC 3.1: Thêm ba game khác nhau vào giỏ hàng
- **Given**: Người dùng đang ở trang Cửa hàng hoặc Chi tiết game.
- **When**: Nhấn thêm 3 game khác nhau: `Cyberpunk 2077`, `ELDEN RING`, `Baldur's Gate 3`.
- **Then**: 
  - Badge số lượng trên icon giỏ hàng ở Header (`data-testid="cart-badge"`) hiển thị số `3`.
  - Khi mở trang `/cart`, cả 3 game đều xuất hiện trong danh sách `data-testid="cart-items-container"`.
  - Mỗi game hiển thị đúng tên, đơn giá và số lượng ban đầu là `1`.

#### AC 3.2: Tăng / Giảm số lượng game
- **Given**: Game `Cyberpunk 2077` (đơn giá 645.000 ₫) đang có số lượng `1` trong giỏ hàng.
- **When**: Nhấn nút tăng số lượng (`data-testid="cart-increase-qty"`).
- **Then**: 
  - Số lượng cập nhật thành `2`.
  - Thành tiền dòng sản phẩm (`data-testid="cart-item-total"`) cập nhật thành `1.290.000 ₫`.
  - Tạm tính tổng đơn hàng (`data-testid="summary-subtotal"`) được cộng thêm 645.000 ₫ ngay lập tức.
- **When**: Nhấn nút giảm số lượng (`data-testid="cart-decrease-qty"`) khi số lượng đang là `1`.
- **Then**: 
  - Số lượng giữ nguyên là `1`, không bị âm hoặc bằng `0`.
  - Xuất hiện thông báo hướng dẫn sử dụng nút xóa (thùng rác) nếu muốn bỏ sản phẩm khỏi giỏ.

#### AC 3.3: Xử lý chặn sản phẩm hết hàng
- **Given**: Game `Spec Ops: The Line` có trạng thái `inStock = false` (tạm ngừng phân phối bản số).
- **Then**: 
  - Thẻ game hiển thị badge `Hết hàng` (`data-testid="out-of-stock-badge"`).
  - Nút thêm vào giỏ hàng bị vô hiệu hóa (disabled) và hiển thị nhãn `Hết hàng`.
  - Người dùng không thể thêm sản phẩm này vào giỏ hàng.

#### AC 3.4: Xóa sản phẩm khỏi giỏ hàng
- **Given**: Giỏ hàng đang có 3 sản phẩm.
- **When**: Nhấn biểu tượng thùng rác (`data-testid="cart-remove-item"`) tại dòng sản phẩm thứ nhất.
- **Then**: 
  - Sản phẩm đó bị xóa hoàn toàn khỏi giỏ hàng.
  - Số lượng sản phẩm giảm còn `2`.
  - Tổng tiền đơn hàng được tính toán lại ngay lập tức.

---

### User Story 4: Tính toán tài chính & Áp dụng Mã giảm giá (Financial Calculation & Coupons)
> **Là một** người mua hàng,  
> **Tôi muốn** áp dụng mã giảm giá và xem bảng chi phí chi tiết,  
> **Để** biết chính xác số tiền mình cần thanh toán sau khi được giảm giá.

#### AC 4.1: Áp dụng mã giảm giá phần trăm hợp lệ (`GAMEHUB10`)
- **Given**: Giỏ hàng có tạm tính subtotal là `1.000.000 ₫`.
- **When**: Nhập mã `GAMEHUB10` vào ô `data-testid="coupon-input"` và nhấn `Áp dụng` (`data-testid="apply-coupon-button"`).
- **Then**: 
  - Hiển thị thông báo thành công `data-testid="coupon-success-message"`.
  - Hiển thị khối mã giảm giá đã áp dụng `data-testid="applied-coupon-box"`.
  - Dòng giảm giá (`data-testid="summary-discount-amount"`) hiển thị `-100.000 ₫` (10% của 1.000.000 ₫).
  - Tổng thanh toán (`data-testid="summary-final-total"`) hiển thị chính xác `900.000 ₫`.

#### AC 4.2: Áp dụng mã giảm giá cố định có điều kiện tối thiểu (`GAMEHUB50K`)
- **Given**: Mã `GAMEHUB50K` yêu cầu đơn hàng tối thiểu `300.000 ₫`.
- **Kịch bản A (Thỏa mãn điều kiện)**:
  - Khi đơn hàng đạt `400.000 ₫`, áp dụng mã thành công. Dòng giảm giá hiển thị `-50.000 ₫`. Tổng thanh toán là `350.000 ₫`.
- **Kịch bản B (Không thỏa mãn điều kiện)**:
  - Khi đơn hàng chỉ có giá trị `192.000 ₫` (nhỏ hơn 300.000 ₫).
  - Khi áp dụng mã `GAMEHUB50K`, hệ thống từ chối áp dụng và hiển thị lỗi `data-testid="coupon-error-message"`:
    *"Đơn hàng tối thiểu cần đạt 300.000 ₫ để áp dụng mã "GAMEHUB50K"..."*.
  - Tổng thanh toán không đổi (vẫn là 192.000 ₫).

#### AC 4.3: Tự động hủy mã khi xóa bớt sản phẩm không còn đủ điều kiện
- **Given**: Đơn hàng đang áp dụng mã `GAMEHUB50K` với tổng tiền `400.000 ₫`.
- **When**: Người dùng xóa 1 game làm tổng tiền hàng giảm xuống còn `200.000 ₫`.
- **Then**: 
  - Hệ thống tự động hủy mã giảm giá.
  - Hiển thị thông báo cảnh báo mã đã tự động bị thu hồi do không còn đạt giá trị tối thiểu 300.000 ₫.
  - Tổng thanh toán bằng đúng tạm tính `200.000 ₫`.

#### AC 4.4: Kiểm thử mã giảm giá không hợp lệ hoặc hết hạn (`EXPIRED20`)
- **Given**: Người dùng nhập mã `EXPIRED20`.
- **When**: Nhấn `Áp dụng`.
- **Then**: 
  - Hiển thị thông báo lỗi `data-testid="coupon-error-message"` với lý do: *"Mã giảm giá này đã hết hạn sử dụng vào 01/01/2026"*.
  - Không có bất kỳ khoản tiền nào được khấu trừ vào tổng thanh toán.

---

### User Story 5: Thanh toán Demo & Xác nhận đơn hàng (Checkout & Confirmation)
> **Là một** người mua hàng,  
> **Tôi muốn** hoàn tất thủ tục thanh toán demo,  
> **Để** nhận ngay License Key kích hoạt game PC và kiểm tra thông tin đơn hàng.

#### AC 5.1: Chặn thanh toán khi giỏ hàng trống
- **Given**: Giỏ hàng của người dùng đang không có sản phẩm nào (`items = []`).
- **When**: Người dùng truy cập đường dẫn `/checkout`.
- **Then**: 
  - Hiển thị màn hình cảnh báo `data-testid="empty-checkout-block"` thông báo giỏ hàng rỗng.
  - Form đặt hàng và nút xác nhận thanh toán (`data-testid="place-order-button"`) không hiển thị.
  - Có nút điều hướng quay lại cửa hàng (`data-testid="return-to-store-button"`).

#### AC 5.2: Kiểm tra hợp lệ dữ liệu biểu mẫu thanh toán (Form Validation)
- **Given**: Người dùng ở trang `/checkout` với giỏ hàng hợp lệ.
- **When**: Bỏ trống Họ tên, hoặc nhập Email sai cú pháp, hoặc nhập Số điện thoại chứa chữ cái (ví dụ `0912abcxyz`).
- **And**: Nhấn nút `Xác nhận đặt hàng demo` (`data-testid="place-order-button"`).
- **Then**: 
  - Hiển thị thông báo lỗi `data-testid="checkout-error-alert"` chỉ rõ trường dữ liệu sai.
  - Không tạo đơn hàng và không chuyển trang.

#### AC 5.3: Đặt hàng thành công và sinh License Key
- **Given**: Điền đầy đủ thông tin: Họ tên `Nguyen Van Test`, Email `test@gamehub.vn`, SĐT `0987654321` và chọn phương thức thanh toán `VietQR Demo`.
- **When**: Nhấn `Xác nhận đặt hàng demo`.
- **Then**: 
  - Hệ thống sinh mã đơn hàng duy nhất `data-testid="order-success-id"` định dạng `GH-XXXXXX`.
  - Tự động sinh License Key kỹ thuật số cho từng sản phẩm đã mua (`data-testid="license-key-item"`).
  - Có nút `data-testid="copy-key-button"` cho phép sao chép key vào clipboard.
  - **Trạng thái giỏ hàng sau khi đặt**: Giỏ hàng được xóa sạch hoàn toàn (`items = []`, `appliedCoupon = null`). Khi quay lại `/cart`, hiển thị màn hình giỏ hàng trống `data-testid="empty-cart-state"`.

---

## III. BẢNG DANH MỤC SELECTORS VÀ `data-testid` CHO AUTOMATION TESTING

Dưới đây là danh sách đầy đủ các locator cố định để nhóm viết kịch bản kiểm thử tự động (Selenium / Playwright / Cypress / Robot Framework):

| Khu Vực | Tên Thành Phần | Selector `data-testid` | Mục Đích Kiểm Thử |
| :--- | :--- | :--- | :--- |
| **Header** | Logo | `data-testid="header-logo"` | Xác minh liên kết về trang chủ |
| **Header** | Ô tìm kiếm nhanh | `data-testid="header-search-input"` | Nhập từ khóa tìm kiếm toàn trang |
| **Header** | Nút giỏ hàng | `data-testid="header-cart-button"` | Mở giỏ hàng |
| **Header** | Badge đếm giỏ hàng | `data-testid="cart-badge"` | Xác minh số lượng sản phẩm trong giỏ |
| **Header** | Badge đếm yêu thích | `data-testid="wishlist-badge"` | Xác minh số lượng game yêu thích |
| **Header** | Nút đăng nhập | `data-testid="header-login-button"` | Xác minh trạng thái chưa đăng nhập |
| **Header** | Nút menu người dùng | `data-testid="user-menu-button"` | Xác minh trạng thái đã đăng nhập |
| **Header** | Nút đăng xuất | `data-testid="logout-button"` | Kiểm thử chức năng đăng xuất |
| **Store** | Ô tìm kiếm cửa hàng | `data-testid="store-search-input"` | Kiểm thử tìm kiếm lọc danh mục |
| **Store** | Bộ chọn sắp xếp | `data-testid="store-sort-select"` | Kiểm thử sắp xếp giá/tên/độ hot |
| **Store** | Checkbox giảm giá | `data-testid="filter-discount-checkbox"` | Lọc game đang sale |
| **Store** | Checkbox còn hàng | `data-testid="filter-instock-checkbox"` | Lọc game còn hàng trong kho |
| **Store** | Nút reset bộ lọc | `data-testid="reset-filters-button"` | Kiểm thử khôi phục bộ lọc mặc định |
| **Store** | Bộ đếm kết quả tìm | `data-testid="results-count"` | Xác minh số lượng kết quả (ví dụ = 0) |
| **Store** | Empty State cửa hàng | `data-testid="empty-store-state"` | Xác minh hiển thị khi tìm không thấy |
| **Game Card** | Thẻ game | `data-testid="game-card"` | Container của từng game |
| **Game Card** | Nút thêm vào giỏ | `data-testid="add-to-cart-button"` | Thêm nhanh game vào giỏ hàng |
| **Game Card** | Nút yêu thích | `data-testid="wishlist-toggle-button"` | Bật/tắt yêu thích game |
| **Game Detail** | Tiêu đề game | `data-testid="detail-game-title"` | Xác minh tên game chi tiết |
| **Game Detail** | Nút thêm giỏ | `data-testid="detail-add-to-cart-button"` | Thêm game vào giỏ từ trang chi tiết |
| **Game Detail** | Trạng thái kho | `data-testid="detail-stock-status"` | Kiểm tra còn hàng / hết hàng |
| **Cart** | Container item giỏ | `data-testid="cart-items-container"` | Danh sách các game trong giỏ |
| **Cart** | Hàng sản phẩm | `data-testid="cart-item-row"` | Từng dòng game trong giỏ |
| **Cart** | Nút giảm số lượng | `data-testid="cart-decrease-qty"` | Giảm số lượng game |
| **Cart** | Nút tăng số lượng | `data-testid="cart-increase-qty"` | Tăng số lượng game |
| **Cart** | Input số lượng | `data-testid="cart-quantity-input"` | Kiểm thử giá trị biên (Boundary Value) |
| **Cart** | Nút xóa sản phẩm | `data-testid="cart-remove-item"` | Xóa game khỏi giỏ |
| **Cart** | Ô nhập coupon | `data-testid="coupon-input"` | Nhập mã giảm giá |
| **Cart** | Nút áp dụng coupon | `data-testid="apply-coupon-button"` | Áp dụng mã giảm giá |
| **Cart** | Thông báo coupon lỗi | `data-testid="coupon-error-message"` | Bắt lỗi mã giảm giá không hợp lệ |
| **Cart** | Thông báo coupon đúng | `data-testid="coupon-success-message"`| Bắt thông báo áp dụng mã thành công |
| **Cart** | Nút gỡ coupon | `data-testid="remove-coupon-button"` | Hủy áp dụng coupon |
| **Cart** | Tiền niêm yết | `data-testid="summary-original-subtotal"` | Tổng tiền gốc |
| **Cart** | Tạm tính | `data-testid="summary-subtotal"` | Tiền hàng trước giảm giá |
| **Cart** | Tiền giảm giá | `data-testid="summary-discount-amount"` | Số tiền được trừ từ coupon |
| **Cart** | Tổng thanh toán | `data-testid="summary-final-total"` | Số tiền thanh toán cuối cùng |
| **Cart** | Nút đến thanh toán | `data-testid="proceed-to-checkout-button"`| Chuyển sang trang thanh toán |
| **Cart** | Giỏ hàng trống | `data-testid="empty-cart-state"` | Hiển thị khi giỏ hàng rỗng |
| **Checkout** | Họ tên người nhận | `data-testid="checkout-fullname-input"` | Nhập họ tên |
| **Checkout** | Email người nhận | `data-testid="checkout-email-input"` | Nhập email nhận key |
| **Checkout** | Số điện thoại | `data-testid="checkout-phone-input"` | Nhập số điện thoại |
| **Checkout** | Nút đặt hàng | `data-testid="place-order-button"` | Gửi xác nhận đơn hàng |
| **Checkout** | Alert lỗi đặt hàng | `data-testid="checkout-error-alert"` | Bắt thông báo lỗi validate form |
| **Success** | Mã đơn hàng | `data-testid="order-success-id"` | Lấy mã đơn hàng (GH-XXXXXX) |
| **Success** | Mã bản quyền game | `data-testid="license-key-code"` | Lấy License Key (GHUB-XXXX-...) |
| **Success** | Nút copy key | `data-testid="copy-key-button"` | Kiểm thử sao chép key |
| **Login** | Email đăng nhập | `data-testid="login-email-input"` | Nhập email đăng nhập |
| **Login** | Mật khẩu đăng nhập | `data-testid="login-password-input"` | Nhập mật khẩu |
| **Login** | Nút submit đăng nhập | `data-testid="login-submit-button"` | Thực hiện đăng nhập |
| **Login** | Thông báo lỗi login | `data-testid="login-error-alert"` | Xác minh lỗi đăng nhập sai |
| **Login** | Thông báo thành công | `data-testid="login-success-alert"` | Xác minh đăng nhập thành công |
| **Login** | Nút điền nhanh Gamer | `data-testid="demo-account-gamer"` | 1-click điền tài khoản hợp lệ |
| **Login** | Nút điền nhanh Lỗi | `data-testid="demo-account-invalid"` | 1-click điền tài khoản sai để test lỗi |
