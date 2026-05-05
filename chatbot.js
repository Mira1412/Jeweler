const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Khai báo thư viện
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 2. API Key Gemini
const genAI = new GoogleGenerativeAI("AIzaSyCOsbpL8EX5BY2FrVX9xuK01XPER0A1r-A");

// 3. Cấu hình mô hình
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  systemInstruction: "Bạn là nhân viên tư vấn của Jewelry Store. Hãy trả lời khách lịch sự về trang sức." 
});

// ============================================
// HỆ THỐNG TRẢ LỜI TỰ ĐỘNG (Smart Fallback)
// Khi AI Gemini chưa sẵn sàng, chatbot vẫn 
// trả lời được các câu hỏi phổ biến.
// ============================================
const smartReplies = [
  {
    keywords: ['xin chào', 'hello', 'hi ', 'chào', 'hey'],
    reply: 'Xin chào quý khách! 💎 Chào mừng đến với Jewelry Store. Tôi có thể tư vấn cho bạn về nhẫn kim cương, dây chuyền vàng, đồng hồ cao cấp. Bạn quan tâm đến sản phẩm nào ạ?'
  },
  {
    keywords: ['nhẫn', 'nhan', 'ring'],
    reply: '💍 Cửa hàng chúng tôi có nhiều loại nhẫn cao cấp:\n\n• **Nhẫn kim cương solitaire** - Từ 15 triệu\n• **Nhẫn vàng 18K** - Từ 5 triệu\n• **Nhẫn cưới đôi** - Từ 8 triệu/đôi\n• **Nhẫn đính đá sapphire** - Từ 12 triệu\n\nBạn muốn xem mẫu nào ạ? Tôi có thể tư vấn chi tiết hơn!'
  },
  {
    keywords: ['dây chuyền', 'day chuyen', 'vòng cổ', 'necklace'],
    reply: '✨ Bộ sưu tập dây chuyền của chúng tôi:\n\n• **Dây chuyền vàng 24K** - Từ 8 triệu\n• **Dây chuyền ngọc trai** - Từ 3 triệu\n• **Dây chuyền kim cương** - Từ 20 triệu\n• **Dây chuyền bạc cao cấp** - Từ 1.5 triệu\n\nQuý khách muốn mua tặng hay dùng cá nhân ạ?'
  },
  {
    keywords: ['đồng hồ', 'dong ho', 'watch'],
    reply: '⌚ Đồng hồ cao cấp tại Jewelry Store:\n\n• **Đồng hồ Automatic** - Từ 10 triệu\n• **Đồng hồ đính kim cương** - Từ 25 triệu\n• **Đồng hồ dây da cao cấp** - Từ 5 triệu\n• **Đồng hồ couple** - Từ 8 triệu/đôi\n\nBạn cần tư vấn thêm không ạ?'
  },
  {
    keywords: ['kim cương', 'kim cuong', 'diamond'],
    reply: '💎 Về kim cương, chúng tôi cung cấp:\n\n• Kim cương tự nhiên GIA certified\n• Độ tinh khiết từ VS1 trở lên\n• Màu từ D đến H\n• Giác cắt Excellent\n\n**Mẹo phân biệt kim cương thật:** Kim cương thật sẽ không bị mờ khi hà hơi vào, và có thể cắt được kính. Bạn muốn xem mẫu nào ạ?'
  },
  {
    keywords: ['vàng', 'vang', 'gold'],
    reply: '🥇 Trang sức vàng tại cửa hàng:\n\n• **Vàng 24K (999)** - Vàng nguyên chất, mềm, phù hợp tích trữ\n• **Vàng 18K (750)** - Cứng hơn, phù hợp làm nhẫn, dây chuyền\n• **Vàng 14K (585)** - Bền, giá tốt, đa dạng mẫu mã\n\nBạn quan tâm loại nào ạ?'
  },
  {
    keywords: ['giá', 'gia', 'bao nhiêu', 'bao nhieu', 'price', 'tiền', 'tien'],
    reply: '💰 Giá sản phẩm tại Jewelry Store rất đa dạng:\n\n• Trang sức bạc: Từ 500K - 3 triệu\n• Trang sức vàng: Từ 3 triệu - 50 triệu\n• Trang sức kim cương: Từ 10 triệu - 200 triệu\n\nBạn cho tôi biết ngân sách dự kiến, tôi sẽ tư vấn sản phẩm phù hợp nhất ạ!'
  },
  {
    keywords: ['quà', 'qua', 'tặng', 'tang', 'gift', 'valentine', 'sinh nhật', 'cưới', 'cuoi'],
    reply: '🎁 Gợi ý quà tặng trang sức:\n\n• **Tặng bạn gái:** Dây chuyền ngọc trai, nhẫn đính đá\n• **Quà cưới:** Nhẫn cưới đôi, bộ trang sức vàng\n• **Sinh nhật:** Vòng tay, bông tai kim cương\n• **Valentine:** Mặt dây chuyền trái tim\n\nBạn muốn tặng ai và dịp gì ạ? Tôi sẽ tư vấn chi tiết hơn!'
  },
  {
    keywords: ['giao hàng', 'giao hang', 'ship', 'vận chuyển', 'delivery'],
    reply: '🚚 Chính sách giao hàng:\n\n• **Nội thành:** Giao miễn phí trong 2-4h\n• **Ngoại thành:** Giao trong 1-2 ngày, phí 30K\n• **Toàn quốc:** Giao trong 3-5 ngày qua GHTK/GHN\n• Đóng gói cao cấp, bảo hiểm hàng hóa 100%\n\nBạn ở khu vực nào ạ?'
  },
  {
    keywords: ['bảo hành', 'bao hanh', 'đổi trả', 'doi tra', 'warranty'],
    reply: '🛡️ Chính sách bảo hành Jewelry Store:\n\n• **Bảo hành vĩnh viễn** đánh bóng, làm mới\n• **Đổi trả trong 7 ngày** nếu không ưng ý\n• **Bảo hành 1 năm** cho khóa, chốt, mắt xích\n• **Kiểm định GIA** cho tất cả kim cương\n\nBạn cần hỗ trợ gì thêm không ạ?'
  },
  {
    keywords: ['liên hệ', 'lien he', 'địa chỉ', 'dia chi', 'số điện thoại', 'sdt', 'contact'],
    reply: '📞 Thông tin liên hệ Jewelry Store:\n\n• **Địa chỉ:** 123 Nguyễn Huệ, Q.1, TP.HCM\n• **Hotline:** 0901 234 567\n• **Email:** contact@jewelrystore.vn\n• **Giờ mở cửa:** 9:00 - 21:00 (T2-CN)\n\nHẹn gặp quý khách tại cửa hàng! 💎'
  },
  {
    keywords: ['cảm ơn', 'cam on', 'thank', 'ok', 'được rồi'],
    reply: 'Cảm ơn quý khách đã quan tâm đến Jewelry Store! 💎 Nếu cần thêm tư vấn, đừng ngại nhắn tin cho tôi nhé. Chúc quý khách một ngày tốt lành! ✨'
  }
];

function getSmartReply(message) {
  const lowerMsg = message.toLowerCase();
  for (const item of smartReplies) {
    if (item.keywords.some(kw => lowerMsg.includes(kw))) {
      return item.reply;
    }
  }
  return null;
}

// 4. Hàm xử lý tin nhắn
async function handleChat(req, res) {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ reply: 'Vui lòng nhập câu hỏi.' });
    }

    // Thử gọi AI Gemini trước
    try {
      const result = await model.generateContent(userMessage);
      const response = await result.response;
      const text = response.text();
      return res.json({ reply: text });
    } catch (aiError) {
      // Nếu AI lỗi, dùng Smart Fallback
      const smartReply = getSmartReply(userMessage);
      if (smartReply) {
        return res.json({ reply: smartReply });
      }
      // Nếu không khớp từ khóa nào
      return res.json({ reply: 'Cảm ơn bạn đã hỏi! 💎 Để được tư vấn chi tiết nhất, bạn có thể gọi hotline **0901 234 567** hoặc để lại số điện thoại, nhân viên sẽ liên hệ lại ngay ạ!' });
    }
  } catch (error) {
    return res.json({ reply: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau!' });
  }
}

// API Chat
app.post('/api/chat', handleChat);

const PORT = 3005;
app.listen(PORT, () => console.log(`Chatbot AI Server running on port ${PORT}`));
