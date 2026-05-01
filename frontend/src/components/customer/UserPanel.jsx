import React from 'react';
import './UserPanel.css';
import ProductGrid from './ProductGrid';

const UserPanel = ({
  currentUser,
  isUser,
  handleLogout,
  products,
  loading,
  error,
  handleAddToCart,
  onOpenCart,
  onOpenOrders,
  cartItemsCount
}) => {
  return (
    <div className="user-panel-wrapper">
      <div className="user-dashboard animate-fade-in">
        <div className="welcome-card">
          <div className="user-avatar">✨</div>
          <div className="welcome-text">
            <h2>Chào mừng quay trở lại, <span className="gold-gradient-text">{currentUser.userDetails?.firstName || currentUser.userName}</span>!</h2>
            <p>Khám phá những đặc quyền dành riêng cho khách hàng VIP của Luxury Jewelry.</p>
            <div className="user-stats">
              <span><strong>Email:</strong> {currentUser.userDetails?.email || 'N/A'}</span>
              <span><strong>ID:</strong> #{currentUser.id}</span>
              <span><strong>Hạng:</strong> {isUser ? 'Member Gold' : 'Administrator'}</span>
            </div>
          </div>
          <button className="top-btn logout-btn" onClick={handleLogout}>Đăng xuất</button>
        </div>

        <div className="user-quick-actions">
          <h3>🚀 Truy cập nhanh</h3>
          <div className="quick-buttons">
            <button className="quick-btn" onClick={onOpenCart}>
              <span style={{ fontSize: '1.5rem' }}>🛒</span>
              <span>Giỏ hàng ({cartItemsCount || 0})</span>
            </button>
            <button className="quick-btn" onClick={onOpenOrders}>
              <span style={{ fontSize: '1.5rem' }}>📦</span>
              <span>Lịch sử đơn hàng</span>
            </button>
            <button className="quick-btn">
              <span style={{ fontSize: '1.5rem' }}>❤️</span>
              <span>Danh sách yêu thích</span>
            </button>
            <button className="quick-btn">
              <span style={{ fontSize: '1.5rem' }}>👤</span>
              <span>Hồ sơ cá nhân</span>
            </button>
          </div>
        </div>
      </div>

      <div className="section-padding">
        <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h2 className="premium-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Dành Cho Bạn</h2>
          <div style={{ width: '60px', height: '3px', background: 'var(--primary-gold)', margin: '0 auto' }}></div>
        </div>
        <ProductGrid products={products} loading={loading} error={error} handleAddToCart={handleAddToCart} />
      </div>
    </div>
  );
};

export default UserPanel;
