import React from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({
  currentUser,
  adminSection,
  setAdminSection,
  users,
  products,
  orders,
  adminModal,
  setAdminModal,
  adminFormData,
  setAdminFormData,
  selectedFile,
  setSelectedFile,
  handleLogout,
  handleAdminInputChange,
  handleFileChange,
  handleAdminSubmit
}) => {

  const renderStats = () => (
    <div className="adm-stats-grid">
      <div className="adm-stat-card">
        <div className="adm-stat-lbl">TỔNG DOANH THU</div>
        <div className="adm-stat-val">1.280.000.000₫</div>
      </div>
      <div className="adm-stat-card">
        <div className="adm-stat-lbl">ĐƠN HÀNG</div>
        <div className="adm-stat-val">42</div>
      </div>
      <div className="adm-stat-card">
        <div className="adm-stat-lbl">SẢN PHẨM</div>
        <div className="adm-stat-val">{products.length}</div>
      </div>
      <div className="adm-stat-card">
        <div className="adm-stat-lbl">NGƯỜI DÙNG</div>
        <div className="adm-stat-val">{users.length}</div>
      </div>
    </div>
  );

  return (
    <div className="adm-wrap">
      <aside className="adm-sb">
        <div className="adm-brand">
          <div className="adm-gem">💎</div>
          <div>
            <div className="adm-brand-name">LUXURY ADMIN</div>
          </div>
        </div>
        
        <nav className="adm-nav">
          <button className={`adm-nav-btn ${adminSection === 'stats' ? 'active' : ''}`} onClick={() => setAdminSection('stats')}>
            <span>📊</span> Tổng quan
          </button>
          <button className={`adm-nav-btn ${adminSection === 'products' ? 'active' : ''}`} onClick={() => setAdminSection('products')}>
            <span>💎</span> Sản phẩm
          </button>
          <button className={`adm-nav-btn ${adminSection === 'users' ? 'active' : ''}`} onClick={() => setAdminSection('users')}>
            <span>👥</span> Người dùng
          </button>
          <button className={`adm-nav-btn ${adminSection === 'orders' ? 'active' : ''}`} onClick={() => setAdminSection('orders')}>
            <span>📦</span> Đơn hàng
          </button>
        </nav>

        <div className="adm-sb-foot">
          <button className="adm-logout-btn" onClick={handleLogout}>
            <span>🚪</span> Đăng xuất
          </button>
        </div>
      </aside>

      <main className="adm-main">
        <header className="adm-hdr">
          <div className="adm-hdr-title">Hệ thống Quản trị</div>
          <div className="adm-user-badge">
            Xin chào, <strong>{currentUser?.userName}</strong>
          </div>
        </header>

        <div className="adm-content">
          {adminSection === 'stats' && renderStats()}
          
          {(adminSection === 'products' || adminSection === 'users') && (
            <div className="adm-table-card">
              <div className="adm-table-hdr">
                <h3>Danh sách {adminSection === 'products' ? 'Sản phẩm' : 'Người dùng'}</h3>
                <button className="top-btn btn-gold-sm" onClick={() => setAdminModal(adminSection === 'products' ? 'addProduct' : 'addUser')}>
                  + Thêm mới
                </button>
              </div>
              <table className="adm-table">
                <thead>
                  {adminSection === 'products' ? (
                    <tr>
                      <th>ID</th>
                      <th>Tên</th>
                      <th>Danh mục</th>
                      <th>Giá</th>
                      <th>Thao tác</th>
                    </tr>
                  ) : (
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                      <th>Thao tác</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {adminSection === 'products' ? products.map(p => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td>{p.productName}</td>
                      <td>{p.category}</td>
                      <td>{p.price?.toLocaleString()}₫</td>
                      <td>
                        <button className="adm-btn-edit" onClick={() => { setAdminFormData(p); setAdminModal('editProduct'); }}>Sửa</button>
                        <button className="adm-btn-danger" onClick={() => { setAdminFormData(p); setAdminModal('deleteProduct'); }}>Xóa</button>
                      </td>
                    </tr>
                  )) : users.map(u => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>{u.userName}</td>
                      <td>{u.userDetails?.email}</td>
                      <td>{u.role?.roleName}</td>
                      <td>
                        <button className="adm-btn-edit" onClick={() => { setAdminFormData(u); setAdminModal('editUser'); }}>Sửa</button>
                        <button className="adm-btn-danger" onClick={() => { setAdminFormData(u); setAdminModal('deleteUser'); }}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {adminModal && (
        <div className="adm-overlay" onClick={(e) => e.target.className === 'adm-overlay' && setAdminModal(null)}>
          <div className="adm-modal">
            <h3>{adminModal.includes('delete') ? 'Xác nhận xóa' : 'Thông tin chi tiết'}</h3>
            <form onSubmit={handleAdminSubmit}>
              {!adminModal.includes('delete') && (
                <div className="adm-form">
                  {adminModal.includes('Product') ? (
                    <>
                      <div className="adm-form-group">
                        <label>Tên sản phẩm</label>
                        <input name="productName" value={adminFormData.productName || ''} onChange={handleAdminInputChange} required />
                      </div>
                      <div className="adm-form-group">
                        <label>Giá (₫)</label>
                        <input type="number" name="price" value={adminFormData.price || ''} onChange={handleAdminInputChange} required />
                      </div>
                      <div className="adm-form-group">
                        <label>Mô tả</label>
                        <textarea name="discription" value={adminFormData.discription || ''} onChange={handleAdminInputChange} />
                      </div>
                      <div className="adm-form-group">
                        <label>Danh mục</label>
                        <select name="category" value={adminFormData.category || 'Rings'} onChange={handleAdminInputChange}>
                          <option value="Rings">Nhẫn (Rings)</option>
                          <option value="Necklaces">Dây chuyền (Necklaces)</option>
                          <option value="Earrings">Bông tai (Earrings)</option>
                          <option value="Bracelets">Vòng tay (Bracelets)</option>
                        </select>
                      </div>
                      <div className="adm-form-group">
                        <label>Số lượng kho</label>
                        <input type="number" name="availability" value={adminFormData.availability || ''} onChange={handleAdminInputChange} required />
                      </div>
                      <div className="adm-form-group">
                        <label>Hình ảnh</label>
                        <input type="file" onChange={handleFileChange} accept="image/*" />
                        {adminFormData.image && <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>File hiện tại: {adminFormData.image}</p>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="adm-form-group">
                        <label>Username</label>
                        <input name="userName" value={adminFormData.userName || ''} onChange={handleAdminInputChange} required />
                      </div>
                      <div className="adm-form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={adminFormData.password || ''} onChange={handleAdminInputChange} required={adminModal === 'addUser'} />
                      </div>
                      <div className="adm-form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={adminFormData.email || (adminFormData.userDetails?.email) || ''} onChange={handleAdminInputChange} required />
                      </div>
                      <div className="adm-form-group">
                        <label>Vai trò</label>
                        <select name="role" value={adminFormData.role?.roleName || adminFormData.role || 'ROLE_USER'} onChange={handleAdminInputChange}>
                          <option value="ROLE_USER">Người dùng (USER)</option>
                          <option value="ROLE_ADMIN">Quản trị viên (ADMIN)</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              )}
              {adminModal.includes('delete') && <p>Bạn có chắc chắn muốn xóa mục này không? Thao tác này không thể hoàn tác.</p>}
              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px'}}>
                <button type="button" className="adm-nav-btn" onClick={() => setAdminModal(null)}>Hủy</button>
                <button type="submit" className="top-btn btn-gold-sm">
                  {adminModal.includes('delete') ? 'Xóa' : adminModal.includes('add') ? 'Thêm mới' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;