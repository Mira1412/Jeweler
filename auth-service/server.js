const express = require('express');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- CẤU HÌNH DATABASE ---
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// --- CẤU HÌNH MAIL ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lucy139200556@gmail.com', // Email của bạn
    pass: 'djts puzk ygxv hbpi' // Mật khẩu ứng dụng thật của bạn
  }
});

// Hàm gửi mã OTP thật
async function sendOTPEmail(targetEmail, otpCode) {
  const mailOptions = {
    from: 'lucy139200556@gmail.com',
    to: targetEmail,
    subject: 'Mã xác thực thay đổi mật khẩu - Jewelry Store',
    text: `Mã OTP của bạn là: ${otpCode}. Mã có hiệu lực trong 5 phút.`
  };

  return await transporter.sendMail(mailOptions);
}

// --- API: QUÊN MẬT KHẨU (GỬI OTP) ---
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [users] = await pool.execute(
      'SELECT u.id FROM users u JOIN users_details ud ON u.user_details_id = ud.id WHERE ud.email = ?',
      [email]
    );

    if (users.length === 0) return res.status(404).json({ message: "Email không tồn tại!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60000);

    await pool.execute('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?', [otp, expires, users[0].id]);

    await sendOTPEmail(email, otp);

    return res.json({ message: "Mã OTP đã được gửi!" });
  } catch (error) {
    console.error("Lỗi forgot-password:", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
});

// --- API: ĐỔI MẬT KHẨU ---
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const [users] = await pool.execute(
      'SELECT u.id FROM users u JOIN users_details ud ON u.user_details_id = ud.id WHERE ud.email = ? AND u.reset_token = ? AND u.reset_token_expires > NOW()',
      [email, otp]
    );

    if (users.length === 0) return res.status(400).json({ message: "OTP không hợp lệ!" });

    await pool.execute('UPDATE users SET user_password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', [newPassword, users[0].id]);

    return res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
