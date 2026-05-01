import React from 'react';
import './ProductGrid.css';

const ProductGrid = ({ products, loading, error, handleAddToCart }) => {
  return (
    <div className="products-container">
      {loading ? (
        <div className="loading-skeleton">
          <p>Đang tải tinh hoa trang sức...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-text">{error}</p>
        </div>
      ) : (
        <div className="products-grid">
          {products && products.length > 0 ? products.map(product => (
            <div key={product.id} className="product-card animate-fade-in">
              <div className="product-image-wrapper">
                <span className="product-badge">Exclusive</span>
                {product.image ? (
                  <img src={`http://localhost:8810/uploads/${product.image}`} alt={product.productName} />
                ) : (
                  <div className="placeholder-icon">💍</div>
                )}
              </div>
              <div className="product-details">
                <div className="product-meta">
                  <span className="product-category">{product.category || 'Jewelry'}</span>
                </div>
                <h3 className="product-name">{product.productName}</h3>
                <div className="product-meta">
                  <span className="product-price">{product.price.toLocaleString()} VNĐ</span>
                </div>
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                  <span>Thêm vào giỏ hàng</span>
                  <span>+</span>
                </button>
              </div>
            </div>
          )) : (
            <div className="empty-state">
              <p>Chưa có sản phẩm nào trong cửa hàng.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
