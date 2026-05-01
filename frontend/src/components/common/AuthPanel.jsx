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
  return (
    <div className="auth-overlay" onClick={(e) => e.target.className === 'auth-overlay' && closeAuth()}>
      <div className="auth-modal animate-fade-in">
        <button className="close-auth" onClick={closeAuth} title="Đóng">✕</button>
        
        <div className="auth-header">
          <div className="auth-icon-wrap">💎</div>
          <h2>{isLoginMode ? 'Chào mừng trở lại' : 'Gia nhập hệ thống'}</h2>
          <p>{isLoginMode ? 'Đăng nhập để tiếp tục mua sắm trang sức cao cấp.' : 'Đăng ký thành viên để nhận ưu đãi đặc biệt.'}</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLoginMode ? 'active' : ''}`}
            onClick={() => setIsLoginMode(true)}
          >
            Đăng nhập
          </button>
          <button 
            className={`auth-tab ${!isLoginMode ? 'active' : ''}`}
            onClick={() => setIsLoginMode(false)}
          >
            Đăng ký
          </button>
        </div>

        {isLoginMode ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="login-username">Tên đăng nhập</label>
              <input 
                id="login-username"
                type="text" 
                placeholder="Nhập username..."
                value={loginData.userName}
                onChange={(e) => setLoginData({...loginData, userName: e.target.value})}
                required
                autoFocus
              />
            </div>
            <div className="input-group">
              <label htmlFor="login-password">Mật khẩu</label>
              <input 
                id="login-password"
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
              <a href="#" className="forgot-link">Quên mật khẩu?</a>
            </div>
            <button type="submit" className="auth-submit btn-gold">Tiến vào cửa hàng</button>
            {loginMessage && <div className="auth-message error">{loginMessage}</div>}
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="reg-name">Họ</label>
                <input 
                  id="reg-name"
                  type="text" 
                  placeholder="Nguyễn"
                  value={regData.name}
                  onChange={(e) => setRegData({...regData, name: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="reg-lastname">Tên</label>
                <input 
                  id="reg-lastname"
                  type="text" 
                  placeholder="An"
                  value={regData.lastName}
                  onChange={(e) => setRegData({...regData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="reg-email">Email</label>
              <input 
                id="reg-email"
                type="email" 
                placeholder="email@example.com"
                value={regData.email}
                onChange={(e) => setRegData({...regData, email: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="reg-username">Tên đăng nhập</label>
              <input 
                id="reg-username"
                type="text" 
                placeholder="Vd: an_nguyen"
                value={regData.userName}
                onChange={(e) => setRegData({...regData, userName: e.target.value})}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="reg-password">Mật khẩu</label>
              <input 
                id="reg-password"
                type="password" 
                placeholder="Tối thiểu 6 ký tự"
                value={regData.password}
                onChange={(e) => setRegData({...regData, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="auth-submit btn-gold">Khởi tạo tài khoản</button>
            {regMessage && <div className={`auth-message ${regMessage.includes('thành công') ? 'success' : 'error'}`}>{regMessage}</div>}
          </form>
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
