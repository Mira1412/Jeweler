import React from 'react';
import './PremiumLanding.css';
import ProductGrid from './ProductGrid';

const PremiumLanding = ({ openAuth, products, loading, error, handleAddToCart }) => {
  return (
    <div className="landing-page-wrapper">
      <div className="landing-premium">
        <div className="landing-container">
          <div className="landing-hero-v2">
            <span className="premium-tag">💎 Tuyệt tác trang sức 2026</span>
            <h1 className="gold-gradient-text">LUXURY JEWELRY</h1>
            <p className="landing-subtitle">
              Đánh thức vẻ đẹp tiềm ẩn với những bộ sưu tập trang sức được chế tác thủ công tinh xảo, 
              nơi nghệ thuật gặp gỡ sự sang trọng đẳng cấp.
            </p>
            <div className="landing-actions">
              <button className="btn-premium btn-gold" onClick={() => openAuth('login')}>
                <span>Bắt đầu mua sắm</span>
                <span>✨</span>
              </button>
              <button className="btn-premium btn-outline" onClick={() => openAuth('register')}>
                <span>Khám phá bộ sưu tập</span>
              </button>
            </div>
            <p className="landing-hint">Microservices E-commerce Platform • Secured by JWT</p>
          </div>
        </div>
      </div>
      
      <div className="main-content">
        <div className="section-padding">
          <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 className="premium-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Sản Phẩm Nổi Bật</h2>
            <div style={{ width: '60px', height: '3px', background: 'var(--primary-gold)', margin: '0 auto' }}></div>
          </div>
          <ProductGrid products={products} loading={loading} error={error} handleAddToCart={handleAddToCart} />
        </div>
      </div>
    </div>
  );
};

export default PremiumLanding;
