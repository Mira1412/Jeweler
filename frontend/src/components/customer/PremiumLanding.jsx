import React from 'react';
import './PremiumLanding.css';
import ProductGrid from './ProductGrid';

const PremiumLanding = ({ openAuth, products, loading, error, handleAddToCart }) => {
  return (
    <div className="landing-page-wrapper">
      {/* 1. Hero Section */}
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
              <button className="btn-premium btn-outline" onClick={() => {
                document.getElementById('featured-products').scrollIntoView({ behavior: 'smooth' });
              }}>
                <span>Khám phá bộ sưu tập</span>
              </button>
            </div>
            <p className="landing-hint">Microservices E-commerce Platform • Secured by JWT</p>
          </div>
        </div>
      </div>

      {/* 2. Trust Badges Section */}
      <div className="trust-badges-section">
        <div className="main-content">
          <div className="trust-badges-grid">
            <div className="trust-badge-item">
              <div className="trust-icon">🚚</div>
              <h4>Miễn phí vận chuyển</h4>
              <p>Cho mọi đơn hàng trên toàn quốc</p>
            </div>
            <div className="trust-badge-item">
              <div className="trust-icon">📜</div>
              <h4>Chứng nhận quốc tế</h4>
              <p>Đá quý đạt chuẩn GIA, IGI</p>
            </div>
            <div className="trust-badge-item">
              <div className="trust-icon">🛡️</div>
              <h4>Bảo hành trọn đời</h4>
              <p>Làm sạch và bảo dưỡng miễn phí</p>
            </div>
            <div className="trust-badge-item">
              <div className="trust-icon">💎</div>
              <h4>Thiết kế độc bản</h4>
              <p>Chế tác thủ công tinh xảo</p>
            </div>
          </div>
        </div>
      </div>

      
      {/* 4. Featured Products (Existing) */}
      <div id="featured-products" className="main-content">

        <div className="section-padding">
          <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 className="premium-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Sản Phẩm Nổi Bật</h2>
            <div style={{ width: '60px', height: '3px', background: 'var(--primary-gold)', margin: '0 auto' }}></div>
          </div>
          <ProductGrid products={products} loading={loading} error={error} handleAddToCart={handleAddToCart} />
        </div>
      </div>

      {/* 5. Brand Story */}
      <div className="brand-story-section section-padding">
        <div className="main-content">
          <div className="brand-story-container">
            <div className="brand-story-text">
              <span className="premium-tag" style={{opacity: 1, animation: 'none', marginBottom: '1rem'}}>Câu Chuyện Thương Hiệu</span>
              <h2 className="premium-text" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Tuyệt tác từ sự đam mê</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Hơn 2 thập kỷ trui rèn và phát triển, Luxury Jewelry tự hào mang đến những kiệt tác trang sức không chỉ tôn vinh vẻ đẹp mà còn lưu giữ những khoảnh khắc quý giá nhất trong cuộc đời bạn. Mỗi sản phẩm là một câu chuyện được chế tác từ đôi bàn tay tài hoa của các nghệ nhân hàng đầu.
              </p>
              <button className="btn-premium btn-outline" onClick={() => openAuth('register')}>Gia nhập cộng đồng VIP</button>
            </div>
            <div className="brand-story-visual">
               <div className="brand-visual-box">✨ Nghệ thuật & Chế tác</div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Newsletter */}
      <div className="newsletter-section">
        <div className="main-content">
          <div className="newsletter-container">
            <h2>Nhận đặc quyền riêng</h2>
            <p>Đăng ký email để nhận thông tin về các bộ sưu tập mới và ưu đãi dành riêng cho bạn.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã đăng ký!'); }}>
              <input type="email" placeholder="Nhập email của bạn..." required />
              <button type="submit" className="btn-premium btn-gold">Đăng ký</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

};

export default PremiumLanding;
