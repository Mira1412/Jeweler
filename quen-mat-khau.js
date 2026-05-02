const nodemailer = require('nodemailer');

// 1. Cấu hình trạm gửi mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: 'lucy139200556@gmail.com', // Email của bạn
    pass: 'djts puzk ygxv hbpi'          // Mã 16 ký tự app password
  }
});

// 2. Hàm gửi thử mail kiểm tra
const sendTestMail = async () => {
  try {
    console.log("Đang kết nối tới server Google...");
    
    await transporter.sendMail({
      from: '"Hệ thống Web" <lucy139200556@gmail.com>',
      to: 'lucy139200556@gmail.com', 
      subject: 'Kiểm tra chức năng quên mật khẩu',
      text: 'Chào Ân, nếu bạn thấy thư này thì code của bạn đã chạy thành công rực rỡ!'
    });

    console.log("------------------------------------------");
    console.log("THÀNH CÔNG: Mail đã được gửi đi rồi đó!");
    console.log("Hãy mở hộp thư lucy139200556@gmail.com để xem nhé.");
    console.log("------------------------------------------");

  } catch (error) {
    console.error("LỖI RỐI: ", error.message);
    console.log("Hãy kiểm tra lại xem bạn có copy thiếu ký tự nào trong mã 16 chữ số không.");
  }
};

// 3. Kích hoạt hàm gửi mail
sendTestMail();
