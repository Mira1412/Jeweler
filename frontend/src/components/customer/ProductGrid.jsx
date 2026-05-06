import React, { useState, useMemo } from 'react';
import './ProductGrid.css';

const ProductGrid = ({ products, loading, error, handleAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(p => {
      const matchesSearch = p.productName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  return (
    <div className="products-container">
      
      {/* --- SEARCH & FILTER BAR --- */}
      <div className="customer-filter-bar animate-fade-in" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div className="search-input-wrapper" style={{ position: 'relative', minWidth: '300px', flex: '1', maxWidth: '500px' }}>
          <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm trang sức, đồng hồ..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 15px 12px 45px', borderRadius: '50px', border: '1px solid var(--glass-border)', background: 'var(--bg-elevated)', color: 'white', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s' }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-gold)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
          />
        </div>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '12px 20px', borderRadius: '50px', border: '1px solid var(--glass-border)', background: 'var(--bg-elevated)', color: 'white', fontSize: '1rem', outline: 'none', cursor: 'pointer' }}
        >
          <option value="All">Tất cả danh mục</option>
          <option value="Nhẫn">Nhẫn cao cấp</option>
          <option value="Dây chuyền">Dây chuyền</option>
          <option value="Bông tai">Bông tai</option>
          <option value="Vòng tay">Vòng tay</option>
          <option value="Đồng hồ">Đồng hồ</option>
        </select>
      </div>

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
          {filteredProducts && filteredProducts.length > 0 ? filteredProducts.map(product => (
            <div key={product.id} className="product-card animate-fade-in">
              <div className="product-image-wrapper">
                <span className="product-badge">Exclusive</span>
                {product.image ? (
                  <img src={product.image.startsWith('blob:') || product.image.startsWith('http') ? product.image : `http://localhost:8810/uploads/${product.image}`} alt={product.productName} />
                ) : (
                  <div className="placeholder-icon" style={{fontSize: '4rem'}}>💍</div>
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
            <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'var(--glass)', borderRadius: '24px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <h3>Không tìm thấy sản phẩm</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Vui lòng thử từ khóa khác hoặc xóa bộ lọc.</p>
              <button className="btn-premium btn-outline" style={{ marginTop: '1.5rem' }} onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}>Xóa bộ lọc</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
