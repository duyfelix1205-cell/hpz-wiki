# HPZWiki

Site tĩnh thuần HTML/CSS/JS, không cần build. Giao diện đại dương tối theo `hpzfull` (header, màu, thẻ, nền cá bơi). Nội dung là dữ liệu mẫu trong `app.js` (mảng `ARTICLES`).

## Cấu trúc

- `index.html`: khung trang
- `styles.css`: giao diện dùng chung với HPZ Community
- `wiki.css`: phần riêng của Wiki (lưới bài, bộ lọc, trang chi tiết)
- `app.js`: dữ liệu mẫu, tìm kiếm, lọc chủ đề, trang chi tiết (route dạng `#/wiki/<slug>`)

## Deploy

Settings → Pages → Deploy from a branch → `main` → `/ (root)`.

## Thêm bài

Thêm một object vào `ARTICLES` trong `app.js` với `slug`, `title`, `category`, `summary`, `content` (mỗi dòng một đoạn), `updated`.
