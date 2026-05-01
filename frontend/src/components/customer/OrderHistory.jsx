import React from 'react';
import './OrderHistory.css';

const OrderHistory = ({ orders, onClose }) => {
  return (
    <div className="order-history-overlay">
      <div className="order-history-modal">
        <div className="order-history-header">
          <div className="header-title">
            <span className="history-icon">📦</span>
            <h2>Lịch sử đơn hàng</h2>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="order-history-body">
          {orders && orders.length > 0 ? (
            <div className="orders-list">
              {orders.sort((a,b) => b.id - a.id).map((order) => (
                <div key={order.id} className="order-card-v2">
                  <div className="order-main-info">
                    <div className="order-id">Đơn hàng #{order.id}</div>
                    <div className="order-date">{new Date(order.orderedDate).toLocaleDateString('vi-VN')}</div>
                  </div>
                  
                  <div className="order-items-preview">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-mini">
                        <span className="mini-name">{item.productName}</span>
                        <span className="mini-qty">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary-row">
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status === 'PAYMENT_EXPECTED' ? 'Đang xử lý' : order.status}
                    </span>
                    <span className="order-total-price">
                      {order.total.toLocaleString()} VNĐ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-orders">
              <span className="empty-box">📥</span>
              <p>Bạn chưa có đơn đặt hàng nào.</p>
            </div>
          )}
        </div>

        <div className="order-history-footer">
          <button className="done-btn" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
