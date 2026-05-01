-- demo-data.sql
-- Dữ liệu mẫu đã được cập nhật theo danh sách sản phẩm trang sức thực tế

-- 1) User roles
DELETE FROM user_role;
INSERT INTO user_role (id, role_name) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_MANAGER'),
(3, 'ROLE_USER');

-- 2) User details
DELETE FROM users_details;
INSERT INTO users_details (id, first_name, last_name, email, phone_number, street, street_number, zip_code, locality, country) VALUES
(1, 'Nguyen', 'Anh', 'admin@luxury.com', '0912345678', 'Le Loi', '10', '70000', 'Ho Chi Minh', 'Vietnam'),
(2, 'Tran', 'Binh', 'manager@luxury.com', '0987654321', 'Pham Ngu Lao', '22', '70000', 'Ho Chi Minh', 'Vietnam');

-- 3) Users
DELETE FROM users;
INSERT INTO users (id, user_name, user_password, active, user_details_id, role_id) VALUES
(1, 'admin', 'admin123', 1, 1, 1),
(2, 'manager', 'manager123', 1, 2, 2);

-- 4) Luxury Jewelry Products (Updated from real session data)
DELETE FROM products;
INSERT INTO products (id, product_name, price, discription, category, availability, image) VALUES
(1, 'Nhẫn Kim Cương Eternal Love', 45000000.00, 'Nhẫn kim cương tự nhiên 18K mang biểu tượng tình yêu vĩnh cửu.', 'Nhẫn', 10, '91854_nhnkimcngeternel.webp'),
(2, 'Cặp Nhẫn Cưới Tình Nhân', 28000000.00, 'Cặp nhẫn cưới vàng hồng tinh tế cho các cặp đôi.', 'Nhẫn', 5, '41673_cpnhncitnhnhn.webp'),
(3, 'Nhẫn Ruby Hoàng Gia', 62000000.00, 'Nhẫn đính đá Ruby đỏ rực rỡ phong cách hoàng gia.', 'Nhẫn', 3, '78416_nhnrubyhonggia.webp'),
(4, 'Nhẫn Ngọc Lục Bảo Emerald', 38000000.00, 'Sắc xanh lục bảo quyến rũ trên nền vàng trắng.', 'Nhẫn', 4, '53397_nhnngclcboemerald.webp'),
(5, 'Dây Chuyền Bạch Kim Ánh Sao', 12000000.00, 'Thiết kế thanh mảnh với mặt kim cương nhỏ lấp lánh.', 'Dây chuyền', 15, '39280_dychuynbchkimnhsao.webp'),
(6, 'Vòng Cổ Ngọc Trai Akoya', 22000000.00, 'Ngọc trai Akoya Nhật Bản trắng hồng tự nhiên.', 'Dây chuyền', 8, '73025_vngcngctraiakoya.webp'),
(7, 'Mặt Dây Kim Cương Trái Tim', 35000000.00, 'Biểu tượng trái tim nạm kim cương toàn bộ bề mặt.', 'Dây chuyền', 7, '73952_mtdykimcngtritim.webp'),
(8, 'Choker Vàng Hồng Nữ Hoàng', 18500000.00, 'Phong cách quý phái, ôm sát cổ tôn vinh vẻ đẹp nữ tính.', 'Dây chuyền', 12, '25860_chokervnghngnhong.webp'),
(9, 'Đồng Hồ Nữ Đính Đá Sapphire', 65000000.00, 'Mặt kính Sapphire chống trầy, viền đính đá sang trọng.', 'Đồng hồ', 5, '1614_nghnnhsapphire.webp'),
(10, 'Đồng Hồ Cơ Lộ Máy Limited', 85000000.00, 'Phiên bản giới hạn với bộ máy cơ tinh xảo lộ diện.', 'Đồng hồ', 2, '98772_nghclmylimited.webp'),
(11, 'Đồng Hồ Nữ Rose Gold Petite', 42000000.00, 'Kích thước nhỏ gọn, màu vàng hồng thời thượng.', 'Đồng hồ', 6, '50095_nghnrosegoldpetite.webp'),
(12, 'Đồng Hồ Nam Chronograph Elite', 78000000.00, 'Thiết kế mạnh mẽ tích hợp chức năng bấm giờ thể thao.', 'Đồng hồ', 3, '63524_nghnamchronographelite.webp');
