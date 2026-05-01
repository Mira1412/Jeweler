import React, { useState } from 'react';
import './CheckoutModal.css';

const CheckoutModal = ({ cart, user, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await onConfirm();
      setIsSuccess(true);
    } catch (error) {
      alert('Đặt hàng thất bại: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        {isSuccess ? (
          <div className="checkout-success" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ color: 'var(--success)', marginBottom: '1rem' }}>Thanh toán thiết lập chờ xử lý thành công!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Cảm ơn bạn đã mua sắm tại cửa hàng. Đơn hàng của bạn đang được tiến hành.</p>
            <button className="confirm-btn-premium" onClick={onClose} style={{ width: '100%' }}>Trở về trang chủ</button>
          </div>
        ) : (
          <>
            <div className="checkout-header">
              <div className="header-title">
                <span className="premium-icon">💎</span>
                <h2>Xác nhận đơn hàng</h2>
              </div>
              <button className="close-btn" onClick={onClose}>✕</button>
            </div>

            <div className="checkout-body">
              <div className="order-summary">
                <h3>Tóm tắt đơn hàng</h3>
                <div className="cart-items-list">
                  {cart.length > 0 ? cart.map((item, index) => (
                    <div key={index} className="cart-item-row-v2">
                      <div className="item-thumb">
                        {item.image ? (
                          <img src={`http://localhost:8810/uploads/${item.image}`} alt={item.productName} />
                        ) : (
                          <span className="placeholder">💍</span>
                        )}
                      </div>
                      <div className="item-details">
                        <span className="item-name">{item.productName}</span>
                        <span className="item-meta">Số lượng: {item.quantity} | Đơn giá: {item.price.toLocaleString()} VNĐ</span>
                      </div>
                      <div className="item-price">
                        {(item.price * item.quantity).toLocaleString()} VNĐ
                      </div>
                    </div>
                  )) : (
                    <div className="empty-cart-message">Giỏ hàng của bạn đang trống.</div>
                  )}
                </div>
                
                <div className="order-total-v2">
                  <span className="total-label">Tổng thanh toán</span>
                  <span className="total-amount">{total.toLocaleString()} VNĐ</span>
                </div>
              </div>

              <div className="shipping-info-v2">
                <h3>Thông tin khách hàng</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Người nhận</label>
                    <span>{user.userDetails?.firstName} {user.userDetails?.lastName}</span>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <span>{user.userDetails?.email}</span>
                  </div>
                  <div className="info-item full-width">
                    <label>Địa chỉ giao hàng</label>
                    <span>{user.userDetails?.street || 'Chưa cập nhật'}, {user.userDetails?.locality || 'Hà Nội'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="checkout-footer">
              <button className="cancel-btn" onClick={onClose}>Hủy</button>
              <button 
                className="confirm-btn-premium" 
                onClick={handlePlaceOrder}
                disabled={loading || cart.length === 0}
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
