const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyCOsbpL8EX5BY2FrVX9xuK01XPER0A1r-A");
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash",
  systemInstruction: "Bạn là nhân viên tư vấn của Jewelry Store. Hãy trả lời khách lịch sự về trang sức." 
});

// ============================================
// HỆ THỐNG TRẢ LỜI THÔNG MINH
// Dữ liệu sản phẩm + đặt hàng thực tế
// ============================================
const smartReplies = [
  {
    keywords: ['xin chào', 'hello', 'hi ', 'chào', 'hey'],
    reply: 'Xin chào quý khách! 💎 Chào mừng đến với Jewelry Store.\n\nTôi có thể tư vấn về:\n• **Sản phẩm:** Nhẫn, Dây chuyền, Đồng hồ\n• **Đặt hàng:** Cách mua, thanh toán, giao hàng\n• **Khuyến mãi:** Ưu đãi đặc biệt\n\nBạn quan tâm đến gì ạ?'
  },
  {
    keywords: ['sản phẩm', 'san pham', 'có gì', 'co gi', 'bán gì', 'ban gi', 'danh mục', 'menu'],
    reply: '🏪 Jewelry Store có **12 sản phẩm** thuộc 3 danh mục:\n\n💍 **NHẪN:**\n• Nhẫn Kim Cương Eternal Love - 45tr\n• Cặp Nhẫn Cưới Tình Nhân - 28tr\n• Nhẫn Ruby Hoàng Gia - 62tr\n• Nhẫn Ngọc Lục Bảo Emerald - 38tr\n\n✨ **DÂY CHUYỀN:**\n• Dây Chuyền Bạch Kim Ánh Sao - 12tr\n• Vòng Cổ Ngọc Trai Akoya - 22tr\n• Mặt Dây Kim Cương Trái Tim - 35tr\n• Choker Vàng Hồng Nữ Hoàng - 18.5tr\n\n⌚ **ĐỒNG HỒ:**\n• ĐH Nữ Đính Đá Sapphire - 65tr\n• ĐH Cơ Lộ Máy Limited - 85tr\n• ĐH Nữ Rose Gold Petite - 42tr\n• ĐH Nam Chronograph Elite - 78tr'
  },
  {
    keywords: ['nhẫn', 'nhan', 'ring'],
    reply: '💍 **Bộ sưu tập NHẪN:**\n\n1. **Nhẫn Kim Cương Eternal Love** - 45,000,000đ\n   Kim cương 18K, biểu tượng tình yêu (Còn 10)\n\n2. **Cặp Nhẫn Cưới Tình Nhân** - 28,000,000đ\n   Vàng hồng tinh tế cho cặp đôi (Còn 5)\n\n3. **Nhẫn Ruby Hoàng Gia** - 62,000,000đ\n   Đá Ruby đỏ rực, phong cách hoàng gia (Còn 3)\n\n4. **Nhẫn Ngọc Lục Bảo Emerald** - 38,000,000đ\n   Sắc xanh lục bảo trên vàng trắng (Còn 4)\n\nNhấn **"Thêm vào giỏ"** trên web để mua ạ!'
  },
  {
    keywords: ['dây chuyền', 'day chuyen', 'vòng cổ', 'necklace', 'choker', 'mặt dây'],
    reply: '✨ **Bộ sưu tập DÂY CHUYỀN:**\n\n1. **Dây Chuyền Bạch Kim Ánh Sao** - 12,000,000đ\n   Thanh mảnh, mặt kim cương lấp lánh (Còn 15)\n\n2. **Vòng Cổ Ngọc Trai Akoya** - 22,000,000đ\n   Ngọc trai Nhật Bản trắng hồng (Còn 8)\n\n3. **Mặt Dây Kim Cương Trái Tim** - 35,000,000đ\n   Trái tim nạm kim cương toàn bộ (Còn 7)\n\n4. **Choker Vàng Hồng Nữ Hoàng** - 18,500,000đ\n   Phong cách quý phái, ôm sát cổ (Còn 12)\n\nBán chạy nhất: **Dây Chuyền Bạch Kim Ánh Sao** ạ!'
  },
  {
    keywords: ['đồng hồ', 'dong ho', 'watch'],
    reply: '⌚ **Bộ sưu tập ĐỒNG HỒ:**\n\n1. **ĐH Nữ Đính Đá Sapphire** - 65,000,000đ\n   Kính Sapphire chống trầy, viền đá (Còn 5)\n\n2. **ĐH Cơ Lộ Máy Limited** - 85,000,000đ\n   Phiên bản giới hạn, máy cơ tinh xảo (Còn 2)\n\n3. **ĐH Nữ Rose Gold Petite** - 42,000,000đ\n   Nhỏ gọn, vàng hồng thời thượng (Còn 6)\n\n4. **ĐH Nam Chronograph Elite** - 78,000,000đ\n   Mạnh mẽ, bấm giờ thể thao (Còn 3)\n\n⚡ **ĐH Cơ Lộ Máy Limited** chỉ còn 2 chiếc!'
  },
  {
    keywords: ['đặt hàng', 'dat hang', 'mua', 'order', 'cách mua', 'cach mua', 'mua hàng'],
    reply: '🛒 **Hướng dẫn đặt hàng:**\n\n**Bước 1:** Đăng nhập/Đăng ký tài khoản\n**Bước 2:** Chọn sản phẩm → Nhấn **"Thêm vào giỏ"**\n**Bước 3:** Nhấn 🛒 xem giỏ hàng\n**Bước 4:** Nhấn **"Thanh toán"**\n**Bước 5:** Chọn thanh toán:\n   💵 **COD** - Trả khi nhận hàng\n   💳 **VNPay** - Trả online\n**Bước 6:** Xác nhận → Hoàn tất! 🎉'
  },
  {
    keywords: ['thanh toán', 'thanh toan', 'payment', 'trả tiền', 'vnpay', 'cod'],
    reply: '💳 **Phương thức thanh toán:**\n\n1. **💵 COD** - Thanh toán khi nhận hàng\n   Không cần trả trước\n\n2. **💳 VNPay Online**\n   Thẻ ATM/Visa/MasterCard\n   An toàn, xác nhận tức thì\n\nTất cả đơn đều có hộp cao cấp + giấy bảo hành!'
  },
  {
    keywords: ['giỏ hàng', 'gio hang', 'cart'],
    reply: '🛒 **Về giỏ hàng:**\n\n• Nhấn **"Thêm vào giỏ"** trên sản phẩm\n• Biểu tượng 🛒 góc trên hiện số lượng\n• Trong giỏ: tăng/giảm số lượng hoặc xóa\n• Nhấn **"Thanh toán"** khi sẵn sàng\n\n**Lưu ý:** Cần đăng nhập trước khi thêm giỏ!'
  },
  {
    keywords: ['đăng nhập', 'dang nhap', 'login', 'tài khoản', 'tai khoan', 'đăng ký', 'dang ky'],
    reply: '🔐 **Tài khoản:**\n\n**Đăng ký:** Nhấn "Đăng nhập" → Tab "Đăng ký" → Điền thông tin → Xong!\n\n**Đăng nhập:** Nhập tên + mật khẩu → "Tiến vào cửa hàng"\n\n**Quên mật khẩu:** Nhấn "Quên mật khẩu?" → Nhập email → Nhận link đổi mật khẩu'
  },
  {
    keywords: ['eternal', 'eternal love'],
    reply: '💍 **Nhẫn Kim Cương Eternal Love** - 45,000,000đ\n\n• Chất liệu: Vàng 18K\n• Đá: Kim cương tự nhiên GIA\n• Ý nghĩa: Tình yêu vĩnh cửu\n• Còn: 10 chiếc\n\nSản phẩm yêu thích nhất cho cầu hôn! 💕'
  },
  {
    keywords: ['ruby', 'hoàng gia', 'hoang gia'],
    reply: '👑 **Nhẫn Ruby Hoàng Gia** - 62,000,000đ\n\n• Đá Ruby đỏ rực tự nhiên\n• Phong cách hoàng gia châu Âu\n• Chỉ còn 3 chiếc!\n\nSản phẩm cao cấp nhất dòng nhẫn!'
  },
  {
    keywords: ['emerald', 'lục bảo', 'luc bao'],
    reply: '💚 **Nhẫn Ngọc Lục Bảo Emerald** - 38,000,000đ\n\n• Ngọc lục bảo tự nhiên\n• Nền vàng trắng sang trọng\n• Còn 4 chiếc\n\nMang lại may mắn và thịnh vượng!'
  },
  {
    keywords: ['akoya', 'ngọc trai', 'ngoc trai', 'pearl'],
    reply: '🦪 **Vòng Cổ Ngọc Trai Akoya** - 22,000,000đ\n\n• Ngọc trai Akoya Nhật Bản\n• Màu trắng hồng tự nhiên\n• Còn 8 chiếc\n\nNổi tiếng về độ bóng và tròn đều!'
  },
  {
    keywords: ['trái tim', 'trai tim', 'heart'],
    reply: '💖 **Mặt Dây Kim Cương Trái Tim** - 35,000,000đ\n\n• Kim cương nạm toàn bộ\n• Hình trái tim tình yêu\n• Còn 7 chiếc\n\nMón quà hoàn hảo cho người thương! 💝'
  },
  {
    keywords: ['limited', 'lộ máy', 'lo may', 'giới hạn'],
    reply: '⌚ **ĐH Cơ Lộ Máy Limited** - 85,000,000đ\n\n• Phiên bản giới hạn\n• Bộ máy cơ tinh xảo lộ diện\n• ⚡ **CHỈ CÒN 2 CHIẾC!**\n\nSản phẩm đắt nhất và hiếm nhất!'
  },
  {
    keywords: ['rẻ nhất', 're nhat', 'giá rẻ', 'gia re', 'rẻ', 'tiết kiệm'],
    reply: '💰 **Sản phẩm giá tốt nhất:**\n\n1. Dây Chuyền Bạch Kim Ánh Sao - **12tr** ⭐\n2. Choker Vàng Hồng Nữ Hoàng - **18.5tr**\n3. Vòng Cổ Ngọc Trai Akoya - **22tr**'
  },
  {
    keywords: ['đắt nhất', 'dat nhat', 'cao nhất', 'luxury', 'vip'],
    reply: '👑 **Top sản phẩm cao cấp:**\n\n1. ĐH Cơ Lộ Máy Limited - **85tr** 👑\n2. ĐH Nam Chronograph Elite - **78tr**\n3. ĐH Nữ Đính Đá Sapphire - **65tr**\n4. Nhẫn Ruby Hoàng Gia - **62tr**'
  },
  {
    keywords: ['kim cương', 'kim cuong', 'diamond'],
    reply: '💎 **Sản phẩm kim cương:**\n\n• Nhẫn Kim Cương Eternal Love - 45tr\n• Mặt Dây Kim Cương Trái Tim - 35tr\n• Dây Chuyền Bạch Kim Ánh Sao - 12tr\n\nTất cả đều có **giấy kiểm định GIA**!'
  },
  {
    keywords: ['giá', 'gia', 'bao nhiêu', 'bao nhieu', 'price', 'tiền'],
    reply: '💰 **Bảng giá:**\n\n💍 Nhẫn: 28 - 62 triệu\n✨ Dây chuyền: 12 - 35 triệu\n⌚ Đồng hồ: 42 - 85 triệu\n\nRẻ nhất: **Dây Chuyền Bạch Kim** 12tr\nĐắt nhất: **ĐH Lộ Máy Limited** 85tr'
  },
  {
    keywords: ['quà', 'qua', 'tặng', 'tang', 'gift', 'valentine', 'sinh nhật', 'cưới'],
    reply: '🎁 **Gợi ý quà tặng:**\n\n💕 **Bạn gái:** Mặt Dây Trái Tim 35tr / Dây Chuyền Ánh Sao 12tr\n💍 **Cầu hôn:** Nhẫn Eternal Love 45tr\n👫 **Cưới:** Cặp Nhẫn Tình Nhân 28tr\n👑 **VIP:** ĐH Lộ Máy Limited 85tr'
  },
  {
    keywords: ['giao hàng', 'giao hang', 'ship', 'vận chuyển', 'delivery'],
    reply: '🚚 **Giao hàng:**\n\n• **Nội thành HCM:** Miễn phí, 2-4h\n• **Ngoại thành:** 1-2 ngày, 30K\n• **Toàn quốc:** 3-5 ngày\n• Đóng hộp cao cấp + bảo hiểm 100%'
  },
  {
    keywords: ['bảo hành', 'bao hanh', 'đổi trả', 'doi tra', 'warranty'],
    reply: '🛡️ **Bảo hành:**\n\n• Đổi trả **7 ngày**\n• Đánh bóng, làm mới **vĩnh viễn**\n• Khóa, chốt: **1 năm**\n• Đồng hồ máy: **2 năm**\n• Kim cương: **Giấy GIA**'
  },
  {
    keywords: ['liên hệ', 'lien he', 'địa chỉ', 'dia chi', 'sdt', 'contact', 'hotline'],
    reply: '📞 **Liên hệ:**\n\n• 123 Nguyễn Huệ, Q.1, TP.HCM\n• Hotline: **0901 234 567**\n• Email: contact@jewelrystore.vn\n• Giờ mở: 9:00 - 21:00 (T2-CN)'
  },
  {
    keywords: ['khuyến mãi', 'khuyen mai', 'giảm giá', 'giam gia', 'sale', 'ưu đãi', 'voucher'],
    reply: '🔥 **Ưu đãi:**\n\n• Giảm **10%** đơn hàng đầu tiên\n• Miễn phí ship đơn từ 20 triệu\n• Tặng hộp trang sức mỗi đơn\n• Tích điểm thành viên đổi quà\n\nĐăng ký ngay để nhận ưu đãi!'
  },
  {
    keywords: ['sapphire', 'đá quý', 'da quy'],
    reply: '💙 **ĐH Nữ Đính Đá Sapphire** - 65,000,000đ\n\n• Kính Sapphire chống trầy\n• Viền đính đá sang trọng\n• Còn 5 chiếc\n\nSapphire cứng thứ 2, chỉ sau kim cương!'
  },
  {
    keywords: ['chronograph', 'nam', 'thể thao', 'the thao', 'sport'],
    reply: '🏆 **ĐH Nam Chronograph Elite** - 78,000,000đ\n\n• Thiết kế mạnh mẽ, nam tính\n• Chức năng bấm giờ thể thao\n• Thép không gỉ cao cấp\n• Còn 3 chiếc'
  },
  {
    keywords: ['rose gold', 'vàng hồng', 'petite', 'nữ'],
    reply: '🌹 **ĐH Nữ Rose Gold Petite** - 42,000,000đ\n\n• Kích thước nhỏ gọn thanh lịch\n• Màu vàng hồng thời thượng\n• Còn 6 chiếc\n\nPhù hợp cho quý cô yêu sự tinh tế!'
  },
  {
    keywords: ['cảm ơn', 'cam on', 'thank', 'ok', 'được rồi', 'bye', 'tạm biệt'],
    reply: 'Cảm ơn quý khách! 💎 Nếu cần tư vấn thêm, nhắn tin cho tôi bất cứ lúc nào nhé. Chúc quý khách một ngày tốt lành! ✨'
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

async function handleChat(req, res) {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ reply: 'Vui lòng nhập câu hỏi.' });
    }
    try {
      const result = await model.generateContent(userMessage);
      const response = await result.response;
      return res.json({ reply: response.text() });
    } catch (aiError) {
      const smartReply = getSmartReply(userMessage);
      if (smartReply) return res.json({ reply: smartReply });
      return res.json({ reply: 'Cảm ơn bạn đã hỏi! 💎 Gọi hotline **0901 234 567** hoặc để lại số điện thoại, nhân viên sẽ liên hệ lại ạ!' });
    }
  } catch (error) {
    return res.json({ reply: 'Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau!' });
  }
}

app.post('/api/chat', handleChat);

const PORT = 3005;
app.listen(PORT, () => console.log(`Chatbot AI Server running on port ${PORT}`));
