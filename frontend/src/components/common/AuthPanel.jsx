import React from 'react';
import './AuthPanel.css';

const AuthPanel = ({
  isLoginMode,
  setIsLoginMode,
  setShowAuthPanel,
  closeAuth,
  loginData,
  setLoginData,
  handleLogin,
  loginMessage,
  regData,
  setRegData,
  handleRegister,
  regMessage
}) => {
  const [isForgotMode, setIsForgotMode] = React.useState(false);
  const [forgotStep, setForgotStep] = React.useState(1); // 1: Email, 2: OTP
  const [forgotEmail, setForgotEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState({ text: '', type: '' });

  // Gửi Email yêu cầu OTP
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const response = await fetch('http://localhost:3003/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await response.json();
      
      if (response.ok) {
        setForgotStep(2);
        setMessage({ text: data.message, type: 'success' });
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: "Không thể kết nối tới Server!", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Xác thực OTP và đổi mật khẩu
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:3003/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp, newPassword })
      });
      const data = await response.json();

      if (response.ok) {
        alert("Chúc mừng! Bạn đã đổi mật khẩu thành công.");
        setIsForgotMode(false);
        setForgotStep(1);
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: "Lỗi kết nối!", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={(e) => e.target.className === 'auth-overlay' && closeAuth()}>
      <div className="auth-modal animate-fade-in">
        <button className="close-auth" onClick={closeAuth} title="Đóng">✕</button>
        
        <div className="auth-header">
          <div className="auth-icon-wrap">💎</div>
          <h2>
            {isForgotMode 
              ? (forgotStep === 1 ? 'Khôi phục mật khẩu' : 'Xác thực OTP')
              : (isLoginMode ? 'Chào mừng trở lại' : 'Gia nhập hệ thống')
            }
          </h2>
          <p>
            {isForgotMode 
              ? (forgotStep === 1 ? 'Nhập email để nhận mã xác thực.' : 'Vui lòng kiểm tra email và nhập mã OTP.')
              : (isLoginMode ? 'Đăng nhập để tiếp tục mua sắm trang sức cao cấp.' : 'Đăng ký thành viên để nhận ưu đãi đặc biệt.')
            }
          </p>
        </div>

        {!isForgotMode && (
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${isLoginMode ? 'active' : ''}`}
              onClick={() => { setIsLoginMode(true); setMessage({text:'', type:''}); }}
            >
              Đăng nhập
            </button>
            <button 
              className={`auth-tab ${!isLoginMode ? 'active' : ''}`}
              onClick={() => { setIsLoginMode(false); setMessage({text:'', type:''}); }}
            >
              Đăng ký
            </button>
          </div>
        )}

        {isForgotMode ? (
          forgotStep === 1 ? (
            <form className="auth-form" onSubmit={handleForgotSubmit}>
              <div className="input-group">
                <label>Email khôi phục</label>
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn..."
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="auth-submit btn-gold" disabled={loading}>
                {loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
              </button>
              <button type="button" className="back-to-login" onClick={() => setIsForgotMode(false)}>
                ← Quay lại đăng nhập
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleResetSubmit}>
              <div className="input-group">
                <label>Mã OTP</label>
                <input 
                  type="text" 
                  placeholder="Nhập 6 chữ số..."
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Mật khẩu mới</label>
                <input 
                  type="password" 
                  placeholder="Nhập mật khẩu mới..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="auth-submit btn-gold" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
              <button type="button" className="back-to-login" onClick={() => setForgotStep(1)}>
                ← Quay lại bước trước
              </button>
            </form>
          )
        ) : isLoginMode ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label>Tên đăng nhập</label>
              <input 
                type="text" 
                placeholder="Nhập username..."
                value={loginData.userName}
                onChange={(e) => setLoginData({...loginData, userName: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <label>Mật khẩu</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
              />
            </div>
            <div className="auth-options">
              <label className="checkbox-wrap">
                <input type="checkbox" /> <span>Ghi nhớ đăng nhập</span>
              </label>
              <button type="button" className="forgot-link-btn" onClick={() => setIsForgotMode(true)}>
                Quên mật khẩu?
              </button>
            </div>
            <button type="submit" className="auth-submit btn-gold">Tiến vào cửa hàng</button>
            {loginMessage && <div className="auth-message error">{loginMessage}</div>}
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-row">
              <div className="input-group">
                <label>Họ</label>
                <input 
                  type="text" 
                  value={regData.name}
                  onChange={(e) => setRegData({...regData, name: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Tên</label>
                <input 
                  type="text" 
                  value={regData.lastName}
                  onChange={(e) => setRegData({...regData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label>Email</label>
              <input 
                type="email" 
                value={regData.email}
                onChange={(e) => setRegData({...regData, email: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <label>Tên đăng nhập</label>
              <input 
                type="text" 
                value={regData.userName}
                onChange={(e) => setRegData({...regData, userName: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <label>Mật khẩu</label>
              <input 
                type="password" 
                value={regData.password}
                onChange={(e) => setRegData({...regData, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="auth-submit btn-gold">Khởi tạo tài khoản</button>
            {regMessage && <div className={`auth-message ${regMessage.includes('thành công') ? 'success' : 'error'}`}>{regMessage}</div>}
          </form>
        )}

        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <div className="auth-divider">
          <span>Hoặc tiếp tục với</span>
        </div>
        
        <div className="social-auth">
          <button className="social-btn">Google</button>
          <button className="social-btn">Facebook</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPanel;
