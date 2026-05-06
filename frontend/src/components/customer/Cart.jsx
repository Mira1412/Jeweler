import React from 'react';
import './Cart.css';

const Cart = ({ cart, onRemove, onUpdateQuantity, onCheckout, onClose }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-drawer-overlay">
      <div className="cart-drawer">
        <div className="cart-header">
          <h2>Giỏ hàng của bạn ({cart.length})</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <span className="empty-icon">🛒</span>
              <p>Giỏ hàng của bạn đang trống</p>
              <button className="shop-now-btn" onClick={onClose}>Tiếp tục mua sắm</button>
            </div>
          ) : (
            <div className="cart-items-wrapper">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    {item.image ? (
                      <img src={item.image.startsWith('blob:') || item.image.startsWith('http') ? item.image : `http://localhost:8810/uploads/${item.image}`} alt={item.productName} />
                    ) : (
                      <span className="placeholder">💍</span>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <h4>{item.productName}</h4>
                    <p className="item-price">{item.price.toLocaleString()} VNĐ</p>
                    <div className="quantity-controls">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} disabled={item.quantity <= 1}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)}>+</button>
                    </div>
                  </div>
                  <button className="remove-item-btn" onClick={() => onRemove(item.id)}>🗑️</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Tổng cộng:</span>
              <span className="total-value">{total.toLocaleString()} VNĐ</span>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              Thanh toán ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
