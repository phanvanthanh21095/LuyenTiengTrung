# Tài liệu Logic Dự Án "Luyện Tiếng Trung" (Numbers Flash)

## 1. Tổng quan dự án (Overview)
Dự án **Numbers Flash** là một ứng dụng web React (được xây dựng bằng Vite, TypeScript, TailwindCSS) nhằm mục đích giúp người học luyện tập và ghi nhớ cách đọc số đếm trong tiếng Trung (Mandarin).
Điểm cốt lõi của ứng dụng là giải quyết khó khăn của người học khi tiếp cận hệ thống đếm số nhóm theo hàng Vạn (10.000 - 4 chữ số) và Ức (100.000.000) của Trung Quốc, khác biệt hoàn toàn với hệ thống đếm nhóm hàng Ngàn (1.000 - 3 chữ số) của phương Tây/Việt Nam.

## 2. Kiến trúc các thành phần UI (Components)

*   **`App.tsx` (Root Layout)**: Là khung sườn của ứng dụng, chứa Header giới thiệu và hệ thống Tabs điều hướng chính để người dùng chuyển đổi giữa hai chế độ học:
    *   **Luyện Số Ngẫu Nhiên** (`Practice` mode).
    *   **Đấu Trường Phản Xạ** (`Quiz` mode).
    *   Bên cạnh đó là Sidebar hiển thị bảng quy tắc ghi nhớ nhanh (`CheatSheet`).

*   **`NumberGenerator.tsx` (Chế độ Luyện Tập)**:
    *   Cho phép người dùng lựa chọn độ khó dựa vào cấu hình số lượng chữ số (từ 1 đến 9+ chữ số).
    *   Sinh số ngẫu nhiên theo dải đã chọn và hiển thị dưới dạng **Thẻ lật (Flashcard)** ẩn.
    *   Khi tương tác (click), thẻ lật tiết lộ chữ viết Hán tự (Hanzi) và Phiên âm (Pinyin).
    *   Cung cấp tính năng **Tự động đọc (Rảnh tay)** giúp rèn luyện khả năng nghe thụ động.

*   **`QuizPanel.tsx` (Chế độ Trắc nghiệm/Phản xạ)**:
    *   Cung cấp các câu hỏi trắc nghiệm đa lựa chọn giúp củng cố phản xạ não bộ.
    *   Xây dựng hệ thống tính điểm, theo dõi chuỗi trả lời đúng/sai liên tiếp (streak) để kích thích động lực học (Gamification).

*   **`AudioPronounceButton.tsx` & Nút phát âm**:
    *   Các Component đóng gói tính năng phát âm chữ Hán chuẩn bản ngữ qua biểu tượng cái loa.

## 3. Logic Xử Lý Nghiệp Vụ Cốt Lõi (`utils/chineseNumbers.ts`)

Đây là "trái tim" của dự án, nơi chứa các thuật toán phức tạp để chuyển đổi từ một số nguyên sang chữ Hán và Pinyin đúng ngữ pháp.

### A. Thuật toán dịch số sang chữ (`convertNumberToChinese`)
*   **Chia nhóm 4 chữ số**: Thay vì chia số lớn thành các nhóm hàng ngàn (10^3, 10^6), thuật toán cắt số nguyên ra thành các khối Vạn: **Đơn vị (< 10^4)**, **Vạn (< 10^8)**, và **Ức (>= 10^8)**. Hàm `convert4Digits` sẽ chịu trách nhiệm dịch từng khối nhỏ này.
*   **Quy tắc sử dụng "两" (liǎng) thay cho "二" (èr)**:
    *   Thuật toán sẽ tự động xác định khi nào số 2 nằm ở hàng Trăm, hàng Nghìn, hàng Vạn hoặc Ức thì dùng "两", còn số 2 đứng ở hàng chục hoặc đơn vị thì dùng "二".
*   **Quy tắc chèn "零" (líng)**:
    *   Xử lý trường hợp số 0 nằm xen giữa các chữ số lớn hơn 0 (Ví dụ: `101` phải đọc là *一百零一 / yī bǎi líng yī*, `1001` đọc là *一千零一 / yī qiān líng yī*).
    *   Đặc biệt, thuật toán xử lý trường hợp số 0 kết nối giữa các khối lớn (Ví dụ: 1 Vạn lẻ 1 đếm là *一万零一*).
*   **Quy tắc tối giản cho các số Teen (10-19)**:
    *   Người Trung Quốc nói `12` là 十二 (shí èr) chứ không phải 一十二 (yī shí èr). Thuật toán kiểm tra điều kiện (tổng số < 20 và không phải là thành phần phía sau khối số lớn) để rút gọn chữ "一" đầu tiên.

### B. Logic tối ưu hóa việc học (Learning Bias)
*   Hàm sinh số ngẫu nhiên `getRandomNumberWithZeroBias` không sinh số đồng đều thông thường.
*   Nó có tỷ lệ bias (thiên vị khoảng 35%) **ưu tiên ra các số có chứa số `0` ở giữa**. Nguyên nhân vì đây là các số khó (phải đọc chữ "líng"), người học thường hay sai, nên hệ thống ép người dùng tiếp xúc nhiều hơn.

### C. Formatting giao diện (`formatChineseStyleNumber`)
*   Giúp người học quen với hệ thống số học Trung Quốc, hàm này định dạng chuỗi số với dấu chấm ngăn cách mỗi **4 chữ số** thay vì 3 chữ số thông thường (Ví dụ: `300000` được định dạng là `30.0000` biểu thị "30 Vạn" rất trực quan).

## 4. Logic Xử Lý Âm Thanh (`utils/speech.ts`)
*   Hệ thống sử dụng **Web Speech API** (`window.speechSynthesis`) với giọng đọc (voice) mặc định của trình duyệt là ngôn ngữ `zh-CN` (Trung Quốc đại lục - Simplified Chinese).
*   Đảm bảo tốc độ đọc (rate) vừa phải để người mới học nghe rõ dấu thanh điệu (4 thanh điệu của Pinyin).
*   Cho phép dừng phát âm cũ ngay lập tức (cancel) khi người dùng yêu cầu đọc số mới, tránh bị chồng chéo âm thanh.

## 5. Tổng kết
**Numbers Flash** sở hữu một hệ thống logic Front-end sạch sẽ, thuật toán xử lý chuỗi và số nguyên vững chắc cùng với tư duy thiết kế tập trung mạnh vào các "điểm nghẽn" (pain points) thường gặp của người học tiếng Trung (như số có số 0 xen giữa, nhầm lẫn Vạn/Nghìn).
