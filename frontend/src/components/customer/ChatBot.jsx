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

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Xin chào! 💎 Tôi là trợ lý AI của Jewelry Store. Tôi có thể tư vấn cho bạn về nhẫn kim cương, dây chuyền vàng, đồng hồ cao cấp. Bạn cần gì ạ?' }
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

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3005/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau!' }]);
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
