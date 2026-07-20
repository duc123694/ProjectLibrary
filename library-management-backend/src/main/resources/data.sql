-- =============================================================================
-- LIBRARY MANAGEMENT SYSTEM - SAMPLE DATA
-- Password for every account: password
-- Admin/Librarian hash ($2a$14$...): password
-- User hash ($2a$10$...): password
-- =============================================================================

-- =============================================================================
-- 1. USERS
-- =============================================================================
INSERT INTO users (full_name, email, phone, password, role, status, created_at, updated_at)
VALUES
    ('System Admin',      'admin@library.com',        '0900000001', '$2a$14$d2SLCDORUpGSkgrFrR7Ua.nzqt.3O1TcT5baWPv7efJag3Zu42yxG', 'ADMIN',     'ACTIVE', NOW(), NOW()),
    ('Main Librarian',    'librarian@library.com',    '0900000002', '$2a$14$d2SLCDORUpGSkgrFrR7Ua.nzqt.3O1TcT5baWPv7efJag3Zu42yxG', 'LIBRARIAN', 'ACTIVE', NOW(), NOW()),
    ('Nguyen Van An',     'user1@library.com',        '0900000003', '$2a$14$d2SLCDORUpGSkgrFrR7Ua.nzqt.3O1TcT5baWPv7efJag3Zu42yxG', 'USER',      'ACTIVE', NOW(), NOW()),
    ('Tran Thi Binh',     'user2@library.com',        '0900000004', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER',      'ACTIVE', NOW(), NOW()),
    ('Le Van Cuong',      'locked.user@library.com',  '0900000005', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER',      'LOCKED', NOW(), NOW()),
    ('Test Login User',   'test@library.com',         '0900000006', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER',      'ACTIVE', NOW(), NOW()),
    ('Pham Thi Dung',     'user3@library.com',        '0900000007', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER',      'ACTIVE', NOW(), NOW()),
    ('Hoang Minh Duc',    'user4@library.com',        '0900000008', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER',      'ACTIVE', NOW(), NOW()),
    ('Vo Thi Lan',        'user5@library.com',        '0900000009', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER',      'ACTIVE', NOW(), NOW()),
    ('Bui Van Manh',      'user6@library.com',        '0900000010', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER',      'ACTIVE', NOW(), NOW()),
    ('Do Thi Ngoc',       'user7@library.com',        '0900000011', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER',      'ACTIVE', NOW(), NOW()),
    ('Dang Van Phuong',   'user8@library.com',        '0900000012', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER',      'ACTIVE', NOW(), NOW()),
    ('Le Tien Duc',       'user01@library.com',       '0909999901', '$2b$10$Kc.J7gTM/hWiJfKhPkRBz.HV0mYy/F9MgoAdqn5oNqRQG.ddgOhGO', 'USER',      'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE
    full_name  = VALUES(full_name),
    password   = VALUES(password),
    role       = VALUES(role),
    status     = VALUES(status),
    updated_at = NOW();

-- =============================================================================
-- 2. CATEGORIES
-- =============================================================================
INSERT INTO categories (name, description, created_at, updated_at)
VALUES
    ('Văn học',           'Tiểu thuyết, truyện ngắn, thơ ca và các tác phẩm văn học trong và ngoài nước', NOW(), NOW()),
    ('Khoa học tự nhiên', 'Vật lý, hóa học, sinh học, toán học và các ngành khoa học cơ bản',            NOW(), NOW()),
    ('Công nghệ thông tin','Lập trình, mạng máy tính, trí tuệ nhân tạo, an toàn thông tin',              NOW(), NOW()),
    ('Lịch sử',           'Lịch sử Việt Nam, lịch sử thế giới, khảo cổ học, văn hóa',                   NOW(), NOW()),
    ('Kinh tế',           'Kinh tế học, quản trị kinh doanh, tài chính, đầu tư, khởi nghiệp',            NOW(), NOW()),
    ('Tâm lý học',        'Tâm lý học đại cương, tâm lý trẻ em, kỹ năng mềm, phát triển bản thân',      NOW(), NOW()),
    ('Thiếu nhi',         'Truyện tranh, truyện cổ tích, sách giáo dục dành cho trẻ em',                 NOW(), NOW()),
    ('Ngoại ngữ',         'Sách học tiếng Anh, Nhật, Hàn, Trung và các ngôn ngữ khác',                  NOW(), NOW()),
    ('Y học',             'Y học cơ sở, dược học, dinh dưỡng, sức khỏe gia đình',                        NOW(), NOW()),
    ('Triết học',         'Triết học Đông Tây, đạo đức học, logic học, lịch sử tư tưởng',               NOW(), NOW())
ON DUPLICATE KEY UPDATE
    description = VALUES(description),
    updated_at  = NOW();

-- =============================================================================
-- 3. BOOKS
-- =============================================================================
INSERT INTO books (title, author, category_id, isbn, description, cover_image, daily_rental_price, deposit_amount, stock_quantity, status, publisher, published_year, page_count, created_at, updated_at)
VALUES
-- Văn học (category_id = 1)
('Dế Mèn Phiêu Lưu Ký',
 'Tô Hoài',
 (SELECT id FROM categories WHERE name='Văn học'),
 '978-604-1-01001-1',
 'Tác phẩm kinh điển của văn học thiếu nhi Việt Nam kể về cuộc phiêu lưu của chú Dế Mèn dũng cảm qua nhiều vùng đất khác nhau.',
 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-li2f7j70hoe92e',
 2000.00, 20000.00, 10, 'AVAILABLE', 'NXB Kim Đồng', 1941, 180, NOW(), NOW()),

('Số Đỏ',
 'Vũ Trọng Phụng',
 (SELECT id FROM categories WHERE name='Văn học'),
 '978-604-1-01002-2',
 'Tiểu thuyết trào phúng xuất sắc nhất của Vũ Trọng Phụng, châm biếm sâu cay xã hội thượng lưu Hà Nội thời Pháp thuộc.',
 'https://i.pinimg.com/originals/88/76/1a/88761a81450af688cd5386e36190dd02.jpg',
 2500.00, 25000.00, 8, 'AVAILABLE', 'NXB Hội Nhà Văn', 1936, 312, NOW(), NOW()),

('Chí Phèo',
 'Nam Cao',
 (SELECT id FROM categories WHERE name='Văn học'),
 '978-604-1-01003-3',
 'Tập truyện ngắn xuất sắc của Nam Cao, trong đó Chí Phèo là truyện nổi tiếng nhất về bi kịch tha hóa của người nông dân.',
 'https://tse2.mm.bing.net/th/id/OIP.VNulO-UgcwtKU7IlAHcGQwHaLH?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
 2000.00, 20000.00, 12, 'AVAILABLE', 'NXB Văn Học', 1941, 260, NOW(), NOW()),

('Tắt Đèn',
 'Ngô Tất Tố',
 (SELECT id FROM categories WHERE name='Văn học'),
 '978-604-1-01004-4',
 'Tiểu thuyết hiện thực phê phán về số phận người nông dân Việt Nam trước Cách mạng tháng Tám qua hình tượng chị Dậu.',
 'https://cdn0.fahasa.com/media/flashmagazine/images/page_images/tat_den___ngo_tat_to_tb2023/2023_08_31_15_58_29_1-390x510.jpg',
 1500.00, 15000.00, 7, 'AVAILABLE', 'NXB Văn Học', 1939, 190, NOW(), NOW()),

('Nhà Thờ Đức Bà Paris',
 'Victor Hugo',
 (SELECT id FROM categories WHERE name='Văn học'),
 '978-604-1-01005-5',
 'Tiểu thuyết lãng mạn vĩ đại của Victor Hugo, kể câu chuyện bi thương của Esmeralda và Quasimodo trong Paris thế kỷ 15.',
 'https://bizweb.dktcdn.net/100/180/408/files/nha-tho-duc-ba-paris-bia-cung-jpeg.jpg?v=1657595008961',
 3000.00, 30000.00, 6, 'AVAILABLE', 'NXB Văn Học', 1831, 520, NOW(), NOW()),

('Bố Già',
 'Mario Puzo',
 (SELECT id FROM categories WHERE name='Văn học'),
 '978-604-1-01006-6',
 'Tiểu thuyết kinh điển về thế giới mafia Mỹ qua gia tộc Corleone, một trong những cuốn sách bán chạy nhất mọi thời đại.',
 'https://th.bing.com/th/id/R.7a11d7f911da914dc2d01e2bb0fd1b72?rik=3ydrxMSO%2b5nvOg&pid=ImgRaw&r=0',
 3500.00, 35000.00, 5, 'AVAILABLE', 'NXB Hội Nhà Văn', 1969, 448, NOW(), NOW()),

('Nhật Ký Trong Tù',
 'Hồ Chí Minh',
 (SELECT id FROM categories WHERE name='Văn học'),
 '978-604-1-01007-7',
 'Tập thơ chữ Hán của Hồ Chí Minh viết trong thời gian bị giam cầm ở nhà tù Tưởng Giới Thạch (1942-1943).',
 'https://newshop.vn/public/uploads/products/5894/nhat-ky-trong-tu-bia-mem.png',
 2000.00, 20000.00, 15, 'AVAILABLE', 'NXB Chính Trị Quốc Gia', 1960, 134, NOW(), NOW()),

('Hoàng Tử Bé',
 'Antoine de Saint-Exupéry',
 (SELECT id FROM categories WHERE name='Văn học'),
 '978-604-1-01008-8',
 'Tác phẩm kinh điển viết cho trẻ em nhưng chứa đựng những triết lý sâu sắc về tình bạn, tình yêu và ý nghĩa cuộc sống.',
 'https://sachnoi.cc/wp-content/uploads/2023/04/Sach-Noi-Hoang-Tu-Be-Antoine-De-Saint-Exupery-3-526x526.jpg',
 2500.00, 25000.00, 9, 'AVAILABLE', 'NXB Trẻ', 1943, 96, NOW(), NOW()),

-- Khoa học tự nhiên (category_id = 2)
('Lược Sử Thời Gian',
 'Stephen Hawking',
 (SELECT id FROM categories WHERE name='Khoa học tự nhiên'),
 '978-604-2-02001-1',
 'Cuốn sách khoa học phổ thông nổi tiếng của Stephen Hawking về vũ trụ học, thuyết tương đối và cơ học lượng tử.',
 'https://th.bing.com/th/id/R.bd0995138e05ce6ccb60ccd687469fcc?rik=RpcfnGpIGBD4mA&riu=http%3a%2f%2fproduct.hstatic.net%2f1000290493%2fproduct%2fluoc_su_thoi_gian_-_bia_1_e5607dfff87945d1bb969189ebba9f87_grande.png&ehk=%2bkfV8pRXVtqcggJn29DLMaLhiSr8ym8UWZRvmAloARM%3d&risl=&pid=ImgRaw&r=0',
 4000.00, 40000.00, 6, 'AVAILABLE', 'NXB Trẻ', 1988, 212, NOW(), NOW()),

('Nguồn Gốc Các Loài',
 'Charles Darwin',
 (SELECT id FROM categories WHERE name='Khoa học tự nhiên'),
 '978-604-2-02002-2',
 'Tác phẩm nền tảng của sinh học hiện đại, trình bày học thuyết tiến hóa của Darwin qua chọn lọc tự nhiên.',
 'https://www.netabooks.vn/Data/Sites/1/Product/35148/nguon-goc-cac-loai-1.jpg',
 3500.00, 35000.00, 4, 'AVAILABLE', 'NXB Khoa Học Tự Nhiên', 1859, 502, NOW(), NOW()),

('Vật Lý Vui',
 'Yakov Perelman',
 (SELECT id FROM categories WHERE name='Khoa học tự nhiên'),
 '978-604-2-02003-3',
 'Sách khoa học phổ thông nổi tiếng giúp độc giả hiểu các hiện tượng vật lý thông qua các câu đố và tình huống thú vị.',
 "https://newshop.vn/public/uploads/products/56737/vat-ly-vui-nhon-nhung-cau-hoi-vi-sao-ve-vat-ly.jpg",
 2500.00, 25000.00, 8, 'AVAILABLE', 'NXB Giáo Dục', 1913, 320, NOW(), NOW()),

-- Công nghệ thông tin (category_id = 3)
('Clean Code',
 'Robert C. Martin',
 (SELECT id FROM categories WHERE name='Công nghệ thông tin'),
 '978-604-3-03001-1',
 'Cuốn sách gối đầu của mọi lập trình viên về cách viết code sạch, dễ đọc, dễ bảo trì và mở rộng.',
 'https://my-test-11.slatic.net/p/3e55e57fac4d8d71f675f3f1a14764b3.jpg',
 5000.00, 50000.00, 7, 'AVAILABLE', 'NXB Lao Động', 2008, 464, NOW(), NOW()),

('Design Patterns',
 'Gang of Four',
 (SELECT id FROM categories WHERE name='Công nghệ thông tin'),
 '978-604-3-03002-2',
 'Cuốn sách kinh điển về 23 mẫu thiết kế phần mềm hướng đối tượng, là nền tảng không thể thiếu với mọi lập trình viên.',
 'https://hanoibookstore.com/storage/sach-design-patterns-elements-of-reusable-object-oriented-software-hanoi-bookstore.webp',
 6000.00, 60000.00, 5, 'AVAILABLE', 'NXB Lao Động', 1994, 395, NOW(), NOW()),

('Học Python Trong 21 Ngày',
 'Mark Lutz',
 (SELECT id FROM categories WHERE name='Công nghệ thông tin'),
 '978-604-3-03003-3',
 'Hướng dẫn toàn diện học lập trình Python từ cơ bản đến nâng cao, phù hợp cho người mới bắt đầu.',
 "https://vtiacademy.edu.vn/upload/images/banner-home/top-10-dau-sach-hoc-python-co-ban-danh-cho-nguoi-moi-bat-dau-1.jpeg",
 4000.00, 40000.00, 10, 'AVAILABLE', 'NXB Thông Tin và Truyền Thông', 2019, 540, NOW(), NOW()),

-- Lịch sử (category_id = 4)
('Đất Nước Đứng Lên',
 'Nguyên Ngọc',
 (SELECT id FROM categories WHERE name='Lịch sử'),
 '978-604-4-04001-1',
 'Tiểu thuyết lịch sử về cuộc kháng chiến chống thực dân Pháp của đồng bào Tây Nguyên, đặc biệt là dân tộc Ba Na.',
 "https://tse3.mm.bing.net/th/id/OIP.oNwveza2wbqzIIxrEtKp1AHaMV?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
 2500.00, 25000.00, 8, 'AVAILABLE', 'NXB Quân Đội Nhân Dân', 1955, 290, NOW(), NOW()),

('Sapiens: Lược Sử Loài Người',
 'Yuval Noah Harari',
 (SELECT id FROM categories WHERE name='Lịch sử'),
 '978-604-4-04002-2',
 'Cuốn sách lịch sử toàn cầu từ thời tiền sử đến hiện đại, giải thích làm thế nào Homo Sapiens thống trị Trái Đất.',
 'https://th.bing.com/th/id/R.6ffc50200c5c175ba98c8ccd3d2f710e?rik=xhIwPnROfhFwqw&pid=ImgRaw&r=0',
 5000.00, 50000.00, 6, 'AVAILABLE', 'NXB Thế Giới', 2011, 443, NOW(), NOW()),

('Lịch Sử Việt Nam Từ Nguồn Gốc Đến Thế Kỷ XIX',
 'Đào Duy Anh',
 (SELECT id FROM categories WHERE name='Lịch sử'),
 '978-604-4-04003-3',
 'Công trình nghiên cứu lịch sử đồ sộ của học giả Đào Duy Anh, là tài liệu tham khảo quan trọng về lịch sử Việt Nam.',
 "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmqx7fqxmcpre6",
 3000.00, 30000.00, 5, 'AVAILABLE', 'NXB Khoa Học Xã Hội', 1958, 622, NOW(), NOW()),

-- Kinh tế (category_id = 5)
('Nghĩ Giàu Làm Giàu',
 'Napoleon Hill',
 (SELECT id FROM categories WHERE name='Kinh tế'),
 '978-604-5-05001-1',
 'Cuốn sách kinh điển về tư duy làm giàu, chia sẻ 13 nguyên tắc thành công được đúc kết từ nghiên cứu 500 người giàu nhất nước Mỹ.',
 "https://down-vn.img.susercontent.com/file/sg-11134201-22120-jpwc7o4fb5kv4b",
 3000.00, 30000.00, 12, 'AVAILABLE', 'NXB Lao Động - Xã Hội', 1937, 320, NOW(), NOW()),

('Cha Giàu Cha Nghèo',
 'Robert Kiyosaki',
 (SELECT id FROM categories WHERE name='Kinh tế'),
 '978-604-5-05002-2',
 'Bài học tài chính cá nhân qua câu chuyện hai người cha với quan điểm hoàn toàn khác nhau về tiền bạc và đầu tư.',
 "https://bizweb.dktcdn.net/thumb/grande/100/496/744/products/60f0a4400166a738fe77.jpg?v=1726998472793",
 3500.00, 35000.00, 10, 'AVAILABLE', 'NXB Trẻ', 1997, 336, NOW(), NOW()),

('Khởi Nghiệp Tinh Gọn',
 'Eric Ries',
 (SELECT id FROM categories WHERE name='Kinh tế'),
 '978-604-5-05003-3',
 'Phương pháp khởi nghiệp tinh gọn (Lean Startup) giúp xây dựng công ty mới thông qua vòng lặp xây dựng - đo lường - học hỏi.',
 "https://tse4.mm.bing.net/th/id/OIP.ScxwXTGTRe56ldmTdOg4cwHaG4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
 4000.00, 40000.00, 8, 'AVAILABLE', 'NXB Lao Động', 2011, 299, NOW(), NOW()),

('Bộ Não Triệu Đô',
 'T. Harv Eker',
 (SELECT id FROM categories WHERE name='Kinh tế'),
 '978-604-5-05004-4',
 'Khám phá những suy nghĩ, cảm xúc và hành động vô thức quyết định mức độ thành công tài chính của mỗi người.',
 "https://tse3.mm.bing.net/th/id/OIP.SC63OOEb8KhnMlX-3sSMLwHaFk?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
 3000.00, 30000.00, 9, 'AVAILABLE', 'NXB Tổng Hợp TP.HCM', 2005, 240, NOW(), NOW()),

-- Tâm lý học (category_id = 6)
('Đắc Nhân Tâm',
 'Dale Carnegie',
 (SELECT id FROM categories WHERE name='Tâm lý học'),
 '978-604-6-06001-1',
 'Cuốn sách kỹ năng sống kinh điển nhất mọi thời đại, hướng dẫn cách giao tiếp, tạo ảnh hưởng và chinh phục lòng người.',
 'https://upload.wikimedia.org/wikipedia/vi/7/78/Dac-nhan-tam.jpg',
 3000.00, 30000.00, 15, 'AVAILABLE', 'NXB Tổng Hợp TP.HCM', 1936, 320, NOW(), NOW()),

('Sức Mạnh Của Thói Quen',
 'Charles Duhigg',
 (SELECT id FROM categories WHERE name='Tâm lý học'),
 '978-604-6-06002-2',
 'Khoa học đằng sau thói quen và cách thay đổi thói quen xấu, xây dựng thói quen tốt để thành công trong cuộc sống.',
 "https://cungdocsach.vn/wp-content/uploads/2020/10/%C4%90%E1%BA%AFc-nh%C3%A2n-t%C3%A2m-3.jpg",
 3500.00, 35000.00, 10, 'AVAILABLE', 'NXB Lao Động', 2012, 371, NOW(), NOW()),

('Người Khổng Lồ Trong Tôi',
 'Tony Robbins',
 (SELECT id FROM categories WHERE name='Tâm lý học'),
 '978-604-6-06003-3',
 'Hướng dẫn toàn diện để thức tỉnh tiềm năng ẩn giấu trong mỗi người, kiểm soát cảm xúc và định hướng cuộc sống.',
 "https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mmha8isdm51ee6",
 4000.00, 40000.00, 7, 'AVAILABLE', 'NXB Lao Động - Xã Hội', 1991, 544, NOW(), NOW()),

-- Thiếu nhi (category_id = 7)
('Doraemon - Nobita Và Bảo Vật Không Gian',
 'Fujiko F. Fujio',
 (SELECT id FROM categories WHERE name='Thiếu nhi'),
 '978-604-7-07001-1',
 'Tập truyện tranh Doraemon nổi tiếng, kể về cuộc phiêu lưu của Nobita cùng người bạn robot Doraemon.',
 "https://tse3.mm.bing.net/th/id/OIP.PFuHNQ0sxVMtuEvVtEyNIwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
 1500.00, 15000.00, 20, 'AVAILABLE', 'NXB Kim Đồng', 2005, 192, NOW(), NOW()),

('Harry Potter Và Hòn Đá Phù Thủy',
 'J.K. Rowling',
 (SELECT id FROM categories WHERE name='Thiếu nhi'),
 '978-604-7-07002-2',
 'Tập đầu tiên của bộ truyện Harry Potter kỳ diệu, kể về cậu bé phù thủy Harry và thế giới phép thuật Hogwarts.',
 'https://th.bing.com/th/id/R.2faf3659b95754dc6d126c469dde3f22?rik=lNyX5PWtBlUrBQ&pid=ImgRaw&r=0',
 4000.00, 40000.00, 8, 'AVAILABLE', 'NXB Trẻ', 1997, 320, NOW(), NOW()),

('Thám Tử Lừng Danh Conan',
 'Gosho Aoyama',
 (SELECT id FROM categories WHERE name='Thiếu nhi'),
 '978-604-7-07003-3',
 'Tuyển tập truyện tranh trinh thám về thám tử nhí Conan, sử dụng trí thông minh để phá các vụ án bí ẩn.',
 'https://th.bing.com/th/id/OIP.TTLasJMmYc8UzmY_Rs4rFAHaHa?w=208&h=208&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
 1500.00, 15000.00, 15, 'AVAILABLE', 'NXB Kim Đồng', 1994, 200, NOW(), NOW()),

-- Ngoại ngữ (category_id = 8)
('English Grammar In Use',
 'Raymond Murphy',
 (SELECT id FROM categories WHERE name='Ngoại ngữ'),
 '978-604-8-08001-1',
 'Bộ sách ngữ pháp tiếng Anh nổi tiếng nhất thế giới của Cambridge, từ trung cấp đến nâng cao với bài tập thực hành.',
 "https://tse4.mm.bing.net/th/id/OIP.hNWcB2Y0wL0rLx-9dEal4wHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
 4000.00, 40000.00, 12, 'AVAILABLE', 'NXB Đại Học Quốc Gia', 2019, 380, NOW(), NOW()),

('Minna No Nihongo - Tiếng Nhật Cho Mọi Người',
 'Nhiều Tác Giả',
 (SELECT id FROM categories WHERE name='Ngoại ngữ'),
 '978-604-8-08002-2',
 'Bộ giáo trình học tiếng Nhật phổ biến nhất thế giới, phù hợp cho người học từ N5 lên N3.',
 "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-ma0qz774ceb2ad",
 4500.00, 45000.00, 10, 'AVAILABLE', 'NXB Đại Học Quốc Gia Hà Nội', 2012, 260, NOW(), NOW()),

('Học Tiếng Hàn Tổng Hợp Sơ Cấp',
 'Seoul National University',
 (SELECT id FROM categories WHERE name='Ngoại ngữ'),
 '978-604-8-08003-3',
 'Giáo trình tiếng Hàn nổi tiếng của Đại học Quốc gia Seoul, phù hợp cho người mới bắt đầu học tiếng Hàn.',
 "https://th.bing.com/th/id/OIP.yH8zCp5WDU2XGUFJlVdeOQHaKT?w=154&h=215&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
 4000.00, 40000.00, 8, 'AVAILABLE', 'NXB Đại Học Quốc Gia Hà Nội', 2015, 318, NOW(), NOW())

ON DUPLICATE KEY UPDATE
    description        = VALUES(description),
    daily_rental_price = VALUES(daily_rental_price),
    deposit_amount     = VALUES(deposit_amount),
    stock_quantity     = VALUES(stock_quantity),
    status             = VALUES(status),
    cover_image        = VALUES(cover_image),
    updated_at         = NOW();

-- =============================================================================
-- 4. WALLETS (1 wallet per user)
-- =============================================================================
INSERT INTO wallets (user_id, balance, created_at, updated_at)
SELECT id, 0.00, NOW(), NOW() FROM users
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Nạp số dư ban đầu cho các tài khoản
UPDATE wallets w
JOIN users u ON w.user_id = u.id
SET w.balance = CASE u.email
    WHEN 'admin@library.com'       THEN 500000.00
    WHEN 'librarian@library.com'   THEN 300000.00
    WHEN 'user1@library.com'       THEN 250000.00
    WHEN 'user2@library.com'       THEN 180000.00
    WHEN 'locked.user@library.com' THEN 50000.00
    WHEN 'test@library.com'        THEN 320000.00
    WHEN 'user3@library.com'       THEN 150000.00
    WHEN 'user4@library.com'       THEN 400000.00
    WHEN 'user5@library.com'       THEN 75000.00
    WHEN 'user6@library.com'       THEN 220000.00
    WHEN 'user7@library.com'       THEN 90000.00
    WHEN 'user8@library.com'       THEN 350000.00
    ELSE 0.00
END,
w.updated_at = NOW();

-- =============================================================================
-- 5. RENTAL ORDERS
-- =============================================================================
INSERT INTO rental_orders (user_id, book_id, start_date, end_date, actual_return_date, rental_days, rental_price, deposit_amount, total_amount, status, delivery_address, notes, created_at, updated_at)
SELECT
    u.id,
    b.id,
    '2026-06-01', '2026-06-08', '2026-06-08',
    7,
    b.daily_rental_price * 7,
    b.deposit_amount,
    b.daily_rental_price * 7 + b.deposit_amount,
    'RETURNED',
    '12 Nguyễn Huệ, Quận 1, TP.HCM',
    'Trả đúng hạn',
    '2026-06-01 09:00:00', '2026-06-08 15:00:00'
FROM users u, books b
WHERE u.email = 'user1@library.com' AND b.isbn = '978-604-1-01001-1'
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO rental_orders (user_id, book_id, start_date, end_date, actual_return_date, rental_days, rental_price, deposit_amount, total_amount, status, delivery_address, notes, created_at, updated_at)
SELECT
    u.id,
    b.id,
    '2026-06-05', '2026-06-12', '2026-06-12',
    7,
    b.daily_rental_price * 7,
    b.deposit_amount,
    b.daily_rental_price * 7 + b.deposit_amount,
    'RETURNED',
    '45 Lê Lợi, Quận 1, TP.HCM',
    'Sách tốt, đọc vui.',
    '2026-06-05 10:00:00', '2026-06-12 14:00:00'
FROM users u, books b
WHERE u.email = 'user2@library.com' AND b.isbn = '978-604-6-06001-1'
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO rental_orders (user_id, book_id, start_date, end_date, actual_return_date, rental_days, rental_price, deposit_amount, total_amount, status, delivery_address, notes, created_at, updated_at)
SELECT
    u.id,
    b.id,
    '2026-06-10', '2026-06-20', '2026-06-21',
    10,
    b.daily_rental_price * 10,
    b.deposit_amount,
    b.daily_rental_price * 10 + b.deposit_amount,
    'RETURNED',
    '78 Trần Hưng Đạo, Quận 5, TP.HCM',
    'Trả trễ 1 ngày',
    '2026-06-10 08:00:00', '2026-06-21 11:00:00'
FROM users u, books b
WHERE u.email = 'user3@library.com' AND b.isbn = '978-604-3-03001-1'
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO rental_orders (user_id, book_id, start_date, end_date, actual_return_date, rental_days, rental_price, deposit_amount, total_amount, status, delivery_address, notes, created_at, updated_at)
SELECT
    u.id,
    b.id,
    '2026-06-15', '2026-06-29', '2026-06-29',
    14,
    b.daily_rental_price * 14,
    b.deposit_amount,
    b.daily_rental_price * 14 + b.deposit_amount,
    'RETURNED',
    '23 Phan Đình Phùng, Quận Phú Nhuận, TP.HCM',
    NULL,
    '2026-06-15 13:00:00', '2026-06-29 16:00:00'
FROM users u, books b
WHERE u.email = 'user4@library.com' AND b.isbn = '978-604-4-04002-2'
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO rental_orders (user_id, book_id, start_date, end_date, actual_return_date, rental_days, rental_price, deposit_amount, total_amount, status, delivery_address, notes, created_at, updated_at)
SELECT
    u.id,
    b.id,
    '2026-07-01', '2026-07-08', NULL,
    7,
    b.daily_rental_price * 7,
    b.deposit_amount,
    b.daily_rental_price * 7 + b.deposit_amount,
    'ACTIVE',
    '5 Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
    'Giao buổi sáng',
    '2026-07-01 07:30:00', '2026-07-01 07:30:00'
FROM users u, books b
WHERE u.email = 'user1@library.com' AND b.isbn = '978-604-3-03003-3'
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO rental_orders (user_id, book_id, start_date, end_date, actual_return_date, rental_days, rental_price, deposit_amount, total_amount, status, delivery_address, notes, created_at, updated_at)
SELECT
    u.id,
    b.id,
    '2026-07-03', '2026-07-10', NULL,
    7,
    b.daily_rental_price * 7,
    b.deposit_amount,
    b.daily_rental_price * 7 + b.deposit_amount,
    'ACTIVE',
    '100 Đinh Tiên Hoàng, Quận Bình Thạnh, TP.HCM',
    NULL,
    '2026-07-03 09:00:00', '2026-07-03 09:00:00'
FROM users u, books b
WHERE u.email = 'user2@library.com' AND b.isbn = '978-604-5-05002-2'
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO rental_orders (user_id, book_id, start_date, end_date, actual_return_date, rental_days, rental_price, deposit_amount, total_amount, status, delivery_address, notes, created_at, updated_at)
SELECT
    u.id,
    b.id,
    '2026-07-05', '2026-07-12', NULL,
    7,
    b.daily_rental_price * 7,
    b.deposit_amount,
    b.daily_rental_price * 7 + b.deposit_amount,
    'ACTIVE',
    '33 Lý Thường Kiệt, Quận 10, TP.HCM',
    'Đọc nghiên cứu',
    '2026-07-05 11:00:00', '2026-07-05 11:00:00'
FROM users u, books b
WHERE u.email = 'user5@library.com' AND b.isbn = '978-604-2-02001-1'
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO rental_orders (user_id, book_id, start_date, end_date, actual_return_date, rental_days, rental_price, deposit_amount, total_amount, status, delivery_address, notes, created_at, updated_at)
SELECT
    u.id,
    b.id,
    '2026-06-20', '2026-07-04', NULL,
    14,
    b.daily_rental_price * 14,
    b.deposit_amount,
    b.daily_rental_price * 14 + b.deposit_amount,
    'OVERDUE',
    '9 Hoàng Diệu, Quận 4, TP.HCM',
    'Chưa trả sau hạn',
    '2026-06-20 08:00:00', '2026-06-20 08:00:00'
FROM users u, books b
WHERE u.email = 'user6@library.com' AND b.isbn = '978-604-1-01002-2'
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO rental_orders (user_id, book_id, start_date, end_date, actual_return_date, rental_days, rental_price, deposit_amount, total_amount, status, delivery_address, notes, created_at, updated_at)
SELECT
    u.id,
    b.id,
    '2026-06-25', '2026-07-09', NULL,
    14,
    b.daily_rental_price * 14,
    b.deposit_amount,
    b.daily_rental_price * 14 + b.deposit_amount,
    'OVERDUE',
    '27 Pasteur, Quận 3, TP.HCM',
    'Liên hệ nhắc nhở',
    '2026-06-25 10:00:00', '2026-06-25 10:00:00'
FROM users u, books b
WHERE u.email = 'user7@library.com' AND b.isbn = '978-604-6-06002-2'
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO rental_orders (user_id, book_id, start_date, end_date, actual_return_date, rental_days, rental_price, deposit_amount, total_amount, status, delivery_address, notes, created_at, updated_at)
SELECT
    u.id,
    b.id,
    '2026-07-10', '2026-07-17', NULL,
    7,
    b.daily_rental_price * 7,
    b.deposit_amount,
    b.daily_rental_price * 7 + b.deposit_amount,
    'PENDING',
    '88 Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM',
    'Cần sách gấp',
    '2026-07-10 07:00:00', '2026-07-10 07:00:00'
FROM users u, books b
WHERE u.email = 'user8@library.com' AND b.isbn = '978-604-7-07002-2'
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO rental_orders (user_id, book_id, start_date, end_date, actual_return_date, rental_days, rental_price, deposit_amount, total_amount, status, delivery_address, notes, created_at, updated_at)
SELECT
    u.id,
    b.id,
    '2026-07-11', '2026-07-18', NULL,
    7,
    b.daily_rental_price * 7,
    b.deposit_amount,
    b.daily_rental_price * 7 + b.deposit_amount,
    'PENDING',
    '15 Võ Văn Tần, Quận 3, TP.HCM',
    NULL,
    '2026-07-11 09:00:00', '2026-07-11 09:00:00'
FROM users u, books b
WHERE u.email = 'test@library.com' AND b.isbn = '978-604-5-05001-1'
ON DUPLICATE KEY UPDATE updated_at = NOW();

INSERT INTO rental_orders (user_id, book_id, start_date, end_date, actual_return_date, rental_days, rental_price, deposit_amount, total_amount, status, delivery_address, notes, created_at, updated_at)
SELECT
    u.id,
    b.id,
    '2026-07-08', '2026-07-09', NULL,
    1,
    b.daily_rental_price * 1,
    b.deposit_amount,
    b.daily_rental_price * 1 + b.deposit_amount,
    'CANCELLED',
    '60 Bà Huyện Thanh Quan, Quận 3, TP.HCM',
    'Khách huỷ đơn',
    '2026-07-08 08:30:00', '2026-07-08 10:00:00'
FROM users u, books b
WHERE u.email = 'user4@library.com' AND b.isbn = '978-604-3-03002-2'
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- =============================================================================
-- 6. WALLET TRANSACTIONS
-- =============================================================================
-- Giao dịch nạp tiền
INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, rental_order_id, created_at)
SELECT w.id, 'DEPOSIT', 250000.00, 250000.00, 'Nạp tiền lần đầu vào ví', NULL, '2026-05-20 10:00:00'
FROM wallets w JOIN users u ON w.user_id = u.id WHERE u.email = 'user1@library.com';

INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, rental_order_id, created_at)
SELECT w.id, 'DEPOSIT', 180000.00, 180000.00, 'Nạp tiền vào ví', NULL, '2026-05-22 11:00:00'
FROM wallets w JOIN users u ON w.user_id = u.id WHERE u.email = 'user2@library.com';

INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, rental_order_id, created_at)
SELECT w.id, 'DEPOSIT', 300000.00, 300000.00, 'Nạp tiền lần đầu', NULL, '2026-05-25 09:00:00'
FROM wallets w JOIN users u ON w.user_id = u.id WHERE u.email = 'user3@library.com';

INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, rental_order_id, created_at)
SELECT w.id, 'DEPOSIT', 400000.00, 400000.00, 'Nạp tiền vào ví thư viện', NULL, '2026-05-28 14:00:00'
FROM wallets w JOIN users u ON w.user_id = u.id WHERE u.email = 'user4@library.com';

INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, rental_order_id, created_at)
SELECT w.id, 'DEPOSIT', 320000.00, 320000.00, 'Nạp tiền', NULL, '2026-05-30 16:00:00'
FROM wallets w JOIN users u ON w.user_id = u.id WHERE u.email = 'test@library.com';

INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, rental_order_id, created_at)
SELECT w.id, 'DEPOSIT', 100000.00, 100000.00, 'Nạp tiền lần đầu', NULL, '2026-06-01 08:00:00'
FROM wallets w JOIN users u ON w.user_id = u.id WHERE u.email = 'user5@library.com';

INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, rental_order_id, created_at)
SELECT w.id, 'DEPOSIT', 250000.00, 250000.00, 'Nạp tiền vào ví', NULL, '2026-06-02 09:30:00'
FROM wallets w JOIN users u ON w.user_id = u.id WHERE u.email = 'user6@library.com';

INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, rental_order_id, created_at)
SELECT w.id, 'DEPOSIT', 120000.00, 120000.00, 'Nạp tiền lần đầu', NULL, '2026-06-03 10:00:00'
FROM wallets w JOIN users u ON w.user_id = u.id WHERE u.email = 'user7@library.com';

INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, rental_order_id, created_at)
SELECT w.id, 'DEPOSIT', 350000.00, 350000.00, 'Nạp tiền vào ví', NULL, '2026-06-04 11:00:00'
FROM wallets w JOIN users u ON w.user_id = u.id WHERE u.email = 'user8@library.com';

-- Giao dịch thanh toán thuê sách (cho các đơn RETURNED)
INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, rental_order_id, created_at)
SELECT w.id, 'RENTAL_DEPOSIT', b.deposit_amount,
       250000.00 - b.deposit_amount,
       CONCAT('Đặt cọc thuê sách: ', b.title),
       ro.id,
       ro.created_at
FROM wallets w
JOIN users u ON w.user_id = u.id
JOIN rental_orders ro ON ro.user_id = u.id
JOIN books b ON ro.book_id = b.id
WHERE u.email = 'user1@library.com' AND ro.status = 'RETURNED' AND ro.start_date = '2026-06-01';

INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, rental_order_id, created_at)
SELECT w.id, 'RENTAL_PAYMENT', ro.rental_price,
       250000.00 - b.deposit_amount - ro.rental_price,
       CONCAT('Thanh toán thuê sách: ', b.title),
       ro.id,
       ro.actual_return_date
FROM wallets w
JOIN users u ON w.user_id = u.id
JOIN rental_orders ro ON ro.user_id = u.id
JOIN books b ON ro.book_id = b.id
WHERE u.email = 'user1@library.com' AND ro.status = 'RETURNED' AND ro.start_date = '2026-06-01';

INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, rental_order_id, created_at)
SELECT w.id, 'DEPOSIT_REFUND', b.deposit_amount,
       250000.00,
       CONCAT('Hoàn cọc sách: ', b.title),
       ro.id,
       ro.actual_return_date
FROM wallets w
JOIN users u ON w.user_id = u.id
JOIN rental_orders ro ON ro.user_id = u.id
JOIN books b ON ro.book_id = b.id
WHERE u.email = 'user1@library.com' AND ro.status = 'RETURNED' AND ro.start_date = '2026-06-01';

INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, rental_order_id, created_at)
SELECT w.id, 'RENTAL_DEPOSIT', b.deposit_amount,
       180000.00 - b.deposit_amount,
       CONCAT('Đặt cọc thuê sách: ', b.title),
       ro.id,
       ro.created_at
FROM wallets w
JOIN users u ON w.user_id = u.id
JOIN rental_orders ro ON ro.user_id = u.id
JOIN books b ON ro.book_id = b.id
WHERE u.email = 'user2@library.com' AND ro.status = 'RETURNED';

INSERT INTO wallet_transactions (wallet_id, type, amount, balance_after, description, rental_order_id, created_at)
SELECT w.id, 'DEPOSIT', 100000.00, 250000.00, 'Nạp thêm tiền', NULL, '2026-06-18 10:00:00'
FROM wallets w JOIN users u ON w.user_id = u.id WHERE u.email = 'user1@library.com';