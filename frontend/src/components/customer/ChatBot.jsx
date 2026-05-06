import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

// Chuyển markdown text thành HTML để hiển thị đẹp
const formatMessage = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')   // **bold**
    .replace(/\*(.*?)\*/g, '<em>$1</em>')                // *italic*
    .replace(/\n/g, '<br/>')                              // xuống dòng
    .replace(/• /g, '<span class="chat-bullet">•</span> '); // bullet
};

const ChatBot = ({ currentUser, products, orders, users }) => {
  const isAdmin = currentUser?.role?.roleName === 'ROLE_ADMIN';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: isAdmin 
        ? `Xin chào Quản trị viên **${currentUser?.userName}**! ⚡ Tôi là trợ lý Admin AI. Tôi có thể giúp bạn kiểm tra doanh thu, tồn kho và báo cáo nhanh. Bạn cần hỗ trợ gì?`
        : 'Xin chào! 💎 Tôi là trợ lý AI của Jewelry Store. Tôi có thể tư vấn cho bạn về nhẫn kim cương, dây chuyền vàng, đồng hồ cao cấp. Bạn cần gì ạ?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- LOGIC: ADMIN AI INTELLIGENCE (Hỗ trợ từ viết tắt & Ngôn ngữ tự nhiên) ---
  const handleAdminQueries = (query) => {
    let q = query.toLowerCase();
    
    // Từ điển viết tắt phong phú (Vietnamese shorthand + English business terms)
    const abbreviations = {
      'dt': 'doanh thu',
      'dthu': 'doanh thu',
      'rev': 'doanh thu',
      'revenue': 'doanh thu',
      'lãi': 'doanh thu',
      'tiền': 'doanh thu',
      'money': 'doanh thu',
      'sp': 'sản phẩm',
      'item': 'sản phẩm',
      'hàng': 'sản phẩm',
      'jewelry': 'sản phẩm',
      'kh': 'khách hàng',
      'khách': 'khách hàng',
      'client': 'khách hàng',
      'guest': 'khách hàng',
      'ng dùng': 'người dùng',
      'user': 'người dùng',
      'mem': 'thành viên',
      'member': 'thành viên',
      'dh': 'đơn hàng',
      'đh': 'đơn hàng',
      'đơn': 'đơn hàng',
      'bill': 'đơn hàng',
      'order': 'đơn hàng',
      'tk': 'tồn kho',
      'kho': 'tồn kho',
      'stock': 'tồn kho',
      'tt': 'trạng thái',
      'stt': 'trạng thái',
      'status': 'trạng thái',
      'ad': 'admin',
      'boss': 'admin',
      'check': 'kiểm tra',
      'xem': 'kiểm tra',
      'show': 'kiểm tra',
      'lấy': 'kiểm tra'
    };

    // Thay thế các từ viết tắt đứng độc lập
    Object.keys(abbreviations).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      q = q.replace(regex, abbreviations[key]);
    });
    
    // 1. Phân tích Doanh thu & Tài chính
    if (q.includes('doanh thu') || q.includes('bán được') || q.includes('tiền') || q.includes('tài chính') || q.includes('lãi')) {
      const completedRevenue = orders.reduce((sum, o) => o.status === 'Completed' ? sum + (o.total || 0) : sum, 0);
      const pendingRevenue = orders.reduce((sum, o) => (o.status === 'Pending' || o.status === 'Processing') ? sum + (o.total || 0) : sum, 0);
      
      return `Báo cáo tài chính nhanh:\n` +
             `• **Doanh thu thực tế:** ${completedRevenue.toLocaleString()}₫ (Đã hoàn thành)\n` +
             `• **Doanh thu dự kiến:** ${pendingRevenue.toLocaleString()}₫ (Đang xử lý/Chờ duyệt)\n` +
             `• **Tổng giá trị đơn hàng:** ${(completedRevenue + pendingRevenue).toLocaleString()}₫\n\n` +
             `Hiệu suất bán hàng đang đạt mức **${orders.length > 0 ? Math.round((orders.filter(o => o.status === 'Completed').length / orders.length) * 100) : 0}%** tỷ lệ hoàn tất.`;
    }

    // 2. Phân tích Đơn hàng & Trạng thái
    if (q.includes('đơn hàng') || q.includes('tình hình đơn') || q.includes('trạng thái') || q.includes('check đơn')) {
      const statusCounts = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      }, {});

      return `Tình trạng đơn hàng hệ thống:\n` +
             `• ⏳ **Chờ duyệt:** ${statusCounts['Pending'] || 0} đơn\n` +
             `• ⚙️ **Đang xử lý:** ${statusCounts['Processing'] || 0} đơn\n` +
             `• ✅ **Hoàn thành:** ${statusCounts['Completed'] || 0} đơn\n` +
             `• ❌ **Đã hủy:** ${statusCounts['Cancelled'] || 0} đơn\n\n` +
             `Bạn nên ưu tiên xử lý **${statusCounts['Pending'] || 0}** đơn hàng đang chờ nhé!`;
    }

    // 3. Phân tích Kho & Sản phẩm
    if (q.includes('kho') || q.includes('sản phẩm') || q.includes('hàng') || q.includes('restock')) {
      const lowStock = products.filter(p => p.availability <= 5);
      const categories = [...new Set(products.map(p => p.category))];
      
      let reply = `Thống kê kho hàng:\n` +
                  `• Tổng số mẫu: **${products.length}** mẫu thiết kế\n` +
                  `• Số danh mục: **${categories.length}** (${categories.join(', ')})\n`;
      
      if (lowStock.length > 0) {
        reply += `• ⚠️ **Cảnh báo:** Có **${lowStock.length}** sản phẩm sắp hết hàng (< 5 món).\n\n` +
                 `Các món cần nhập thêm: ${lowStock.slice(0, 3).map(p => p.productName).join(', ')}...`;
      } else {
        reply += `• ✅ Trạng thái kho: **Rất tốt**, tất cả sản phẩm đều đủ số lượng.`;
      }
      return reply;
    }

    // 4. Phân tích Người dùng
    if (q.includes('người dùng') || q.includes('khách hàng') || q.includes('user') || q.includes('thành viên') || q.includes('mem')) {
      const admins = users.filter(u => u.role?.roleName === 'ROLE_ADMIN').length;
      const customers = users.length - admins;
      return `Thông tin cộng đồng:\n` +
             `• Tổng số tài khoản: **${users.length}**\n` +
             `• Khách hàng VIP: **${customers}** thành viên\n` +
             `• Ban quản trị: **${admins}** tài khoản\n\n` +
             `Hệ thống đang hoạt động ổn định với lượng tương tác từ người dùng đều đặn.`;
    }

    // 5. Tổng hợp (Health Check)
    if (q.includes('tổng quát') || q.includes('tất cả') || q.includes('sức khỏe') || q.includes('như thế nào') || q.includes('all')) {
      const totalRev = orders.reduce((sum, o) => o.status === 'Completed' ? sum + (o.total || 0) : sum, 0);
      return `Bản tin tổng hợp Luxury Jewelry:\n` +
             `• 💎 **Sản phẩm:** ${products.length} mẫu\n` +
             `• 📦 **Đơn hàng:** ${orders.length} đơn\n` +
             `• 👥 **Thành viên:** ${users.length} người\n` +
             `• 💰 **Doanh thu:** ${totalRev.toLocaleString()}₫\n\n` +
             `Mọi chỉ số đều nằm trong tầm kiểm soát. Tôi có thể giúp gì thêm cho bạn?`;
    }

    return null; // Fallback to Backend AI
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    // Xử lý Admin Query cục bộ nếu là Admin
    if (isAdmin) {
      const adminReply = handleAdminQueries(userMsg);
      if (adminReply) {
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'ai', text: adminReply }]);
          setLoading(false);
        }, 600);
        return;
      }
    }

    try {
      const res = await fetch('http://localhost:3005/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Xin lỗi, tôi đang gặp sự cố kết nối. Nhưng dựa trên dữ liệu tôi thấy hệ thống vẫn đang hoạt động ổn định!' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      {/* Nút bấm góc màn hình */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Khung chat */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">💎</div>
              <div>
                <h4>Jewelry AI Assistant</h4>
                <span className="chatbot-status">● Đang trực tuyến</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
              {msg.role === 'ai' && <span className="chat-avatar">💎</span>}
                <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
              </div>
            ))}
            {loading && (
              <div className="chat-message ai">
                <span className="chat-avatar">💎</span>
                <div className="chat-bubble typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
