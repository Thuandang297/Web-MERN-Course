1.Mã hóa mật khẩu - Hash password

- Đăng ký người dùng => Người dùng gửi (email, password) để đăng ký
email = quan@gmail.com
pass = quan2k7

-Mã hóa:
+Sinh ra một chuỗi ngẫu nhiên => bcrypt.genSaltSync() => 'abc123@#ccc'
+Kết hợp mật khẩu (password) và chuỗi ngẫu nhiên (salt) => Mật khẩu đã được mã hóa: $2a$12$ZsP1M/AYdxuk1px5XDBbHud8RDmF5gP5ycoY.lNuI52iWhdlCFwTK

Yêu cầu
-Lưu mật khẩu được mã hóa và chuỗi ngẫu nhiên vào database

----Đăng nhập: Người dùng truyền =>  (email, password)

-So sánh mật khẩu của người dùng trong database ($2a$12$ZsP1M/AYdxuk1px5XDBbHud8RDmF5gP5ycoY.lNuI52iWhdlCFwTK) và một mật khẩu mã hóa được sinh ra từ password và chuỗi ngẫu nhiên đã được lưu trong db trước đó

