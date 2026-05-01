-- demo-data.sql
-- SQL này tạo dữ liệu mẫu cho bảng products, user_role, users_details và users

-- 1) User roles
INSERT INTO user_role (id, role_name) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_MANAGER'),
(3, 'ROLE_USER');

-- 2) User details
INSERT INTO users_details (id, first_name, last_name, email, phone_number, street, street_number, zip_code, locality, country) VALUES
(1, 'Nguyen', 'Anh', 'nguyen.anh@example.com', '0912345678', 'Le Loi', '10', '70000', 'Ho Chi Minh', 'Vietnam'),
(2, 'Tran', 'Binh', 'tran.binh@example.com', '0987654321', 'Pham Ngu Lao', '22', '70000', 'Ho Chi Minh', 'Vietnam'),
(3, 'Le', 'Hoa', 'le.hoa@example.com', '0901122334', 'Nguyen Trai', '45', '70000', 'Ho Chi Minh', 'Vietnam'),
(4, 'Pham', 'Dung', 'pham.dung@example.com', '0911223344', 'Cach Mang Thang 8', '55', '70000', 'Ho Chi Minh', 'Vietnam'),
(5, 'Vo', 'Lan', 'vo.lan@example.com', '0933112233', 'Hung Vuong', '8', '70000', 'Ho Chi Minh', 'Vietnam');

-- 3) Users
INSERT INTO users (id, user_name, user_password, active, user_details_id, role_id) VALUES
(1, 'admin', 'admin123', 1, 1, 1),
(2, 'manager', 'manager123', 1, 2, 2),
(3, 'customer1', 'cust1234', 1, 3, 3),
(4, 'customer2', 'cust2345', 1, 4, 3),
(5, 'customer3', 'cust3456', 1, 5, 3);

-- 4) Products
INSERT INTO products (id, product_name, price, discription, category, availability) VALUES
(1, 'Apple iPhone 15', 29990000.00, 'Điện thoại flagship mới nhất của Apple', 'Smartphone', 15),
(2, 'Samsung Galaxy S24', 24990000.00, 'Smartphone cao cấp Samsung với camera mạnh', 'Smartphone', 20),
(3, 'Xiaomi Redmi Note 13', 6490000.00, 'Điện thoại giá rẻ hiệu năng tốt', 'Smartphone', 30),
(4, 'Dell Inspiron 15', 17990000.00, 'Laptop văn phòng cấu hình ổn', 'Laptop', 12),
(5, 'MacBook Air M2', 32990000.00, 'Laptop mỏng nhẹ Apple', 'Laptop', 8),
(6, 'Sony WH-1000XM5', 7990000.00, 'Tai nghe chống ồn cao cấp', 'Audio', 25),
(7, 'Bose QuietComfort Earbuds', 6990000.00, 'Tai nghe true wireless chống ồn', 'Audio', 18),
(8, 'Logitech MX Master 3', 2390000.00, 'Chuột không dây cao cấp', 'Accessories', 40),
(9, 'Asus ROG Strix G16', 40990000.00, 'Laptop gaming hiệu năng mạnh', 'Laptop', 5),
(10, 'Apple iPad Air', 17990000.00, 'Tablet nhẹ, màn hình đẹp', 'Tablet', 22);

-- 5) Luxury Jewelry (New)
INSERT INTO products (id, product_name, price, discription, category, availability, image) VALUES
(11, 'Nhẫn Kim Cương Eternal Love', 85000000.00, 'Nhẫn vàng trắng 18K đính kim cương tự nhiên 1 carat.', 'Rings', 5, 'ring-1.jpg'),
(12, 'Dây Chuyền Ngọc Trai South Sea', 45000000.00, 'Dây chuyền ngọc trai biển South Sea quý hiếm, ánh ngũ sắc.', 'Necklaces', 3, 'necklace-1.jpg'),
(13, 'Đồng Hồ Rolex Datejust 36', 320000000.00, 'Đồng hồ sang trọng với vành bezel rãnh và dây đeo Jubilee.', 'Watches', 2, 'watch-1.jpg'),
(14, 'Hoa Tai Kim Cương Sapphire Bloom', 55000000.00, 'Hoa tai bạc cao cấp đính đá Sapphire xanh và kim cương tấm.', 'Earrings', 10, 'earring-1.jpg'),
(15, 'Vòng Tay Cartier Love Bracelet', 150000000.00, 'Biểu tượng của tình yêu vĩnh cửu, chất liệu vàng hồng 18K.', 'Bracelets', 4, 'bracelet-1.jpg'),
(16, 'Nhẫn Ruby Huyết Bồ Câu', 95000000.00, 'Nhẫn đá quý Ruby đỏ rực rỡ, thiết kế cổ điển quý phái.', 'Rings', 3, 'ring-2.jpg'),
(17, 'Dây Chuyền Kim Cương Giọt Nước', 120000000.00, 'Mặt dây chuyền kim cương hình giọt nước tinh khiết.', 'Necklaces', 5, 'necklace-2.jpg'),
(18, 'Đồng Hồ Patek Philippe Nautilus', 1500000000.00, 'Đẳng cấp thượng lưu với thiết kế thể thao sang trọng.', 'Watches', 1, 'watch-2.jpg'),
(19, 'Bật Lửa S.T. Dupont Ligne 2', 25000000.00, 'Bật lửa cao cấp mạ vàng, họa tiết kim cương.', 'Accessories', 15, 'acc-1.jpg'),
(20, 'Vương Miện Emerald Princess', 500000000.00, 'Vương miện đính đá Emerald xanh lục bảo và kim cương.', 'Luxury', 1, 'luxury-1.jpg');

