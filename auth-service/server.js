const express = require('express');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Kết nối Database (Khớp với thông tin bạn cung cấp trong application.properties)
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users'
};

// 2. Cấu hình Mail (Sử dụng thông tin của bạn)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lucy139200556@gmail.com',
    pass: 'djts puzk ygxv hbpi'
  }
});

// --- API 1: YÊU CẦU QUÊN MẬT KHẨU (GỬI OTP) ---
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Tìm user qua email (Join với bảng users_details)
    const [users] = await connection.execute(
      'SELECT u.id FROM users u JOIN users_details ud ON u.user_details_id = ud.id WHERE ud.email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống!" });
    }

    const userId = users[0].id;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60000); // Hết hạn sau 5 phút

    // Lưu OTP vào bảng users
    await connection.execute(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [otp, expires, userId]
    );

    // Gửi Mail
    await transporter.sendMail({
      from: '"Jewelry Store" <lucy139200556@gmail.com>',
      to: email,
      subject: 'Mã xác thực khôi phục mật khẩu',
      html: `<div style="font-family: Arial; padding: 20px; border: 1px solid #d4af37; border-radius: 10px;">
              <h2 style="color: #d4af37;">Khôi phục mật khẩu</h2>
              <p>Mã OTP của bạn là: <b style="font-size: 24px; color: #333;">${otp}</b></p>
              <p>Mã này sẽ hết hạn trong vòng 5 phút.</p>
            </div>`
    });

    await connection.end();
    res.json({ message: "Mã OTP đã được gửi thành công!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống: " + error.message });
  }
});

// --- API 2: XÁC THỰC OTP VÀ ĐỔI MẬT KHẨU ---
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Kiểm tra OTP và thời gian hết hạn
    const [users] = await connection.execute(
      'SELECT u.id FROM users u JOIN users_details ud ON u.user_details_id = ud.id WHERE ud.email = ? AND u.reset_token = ? AND u.reset_token_expires > NOW()',
      [email, otp]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Mã OTP không đúng hoặc đã hết hạn!" });
    }

    // Cập nhật mật khẩu mới và xóa token
    await connection.execute(
      'UPDATE users SET user_password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [newPassword, users[0].id]
    );

    await connection.end();
    res.json({ message: "Đổi mật khẩu thành công!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống: " + error.message });
  }
});

app.listen(3003, () => console.log('Auth Service running on port 3003'));
