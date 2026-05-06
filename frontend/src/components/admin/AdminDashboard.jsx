import React, { useState, useMemo } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');

  // --- LOGIC: DYNAMIC STATS ---
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => o.status === 'Completed' ? sum + (o.total || 0) : sum, 0);
    const completedOrders = orders.filter(o => o.status === 'Completed').length;
    const lowStockCount = products.filter(p => p.availability <= 5).length;
    
    return {
      revenue: totalRevenue,
      orders: orders.length,
      products: products.length,
      users: users.length,
      lowStock: lowStockCount
    };
  }, [products, orders, users]);

  // --- LOGIC: FILTERING ---
  const filteredProducts = useMemo(() => 
    products.filter(p => p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString().includes(searchTerm)),
    [products, searchTerm]
  );

  const filteredUsers = useMemo(() => 
    users.filter(u => u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || u.id.toString().includes(searchTerm)),
    [users, searchTerm]
  );

  const filteredOrders = useMemo(() => 
    orders.filter(o => o.id?.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer?.toLowerCase().includes(searchTerm.toLowerCase())),
    [orders, searchTerm]
  );

  const renderStats = () => {
    // --- LOGIC: ADVANCED ANALYTICS ---
    const categoryStats = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    const topProducts = [...products]
      .sort((a, b) => (b.sales || 0) - (a.sales || 0))
      .slice(0, 4);

    return (
      <div className="adm-overview">
        <div className="adm-stats-grid">
          <div className="adm-stat-card animate-slide-up">
            <div className="adm-stat-icon" style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981'}}>💰</div>
            <div className="adm-stat-info">
              <div className="adm-stat-lbl">TỔNG DOANH THU</div>
              <div className="adm-stat-val">{stats.revenue.toLocaleString()}₫</div>
            </div>
          </div>
          <div className="adm-stat-card animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="adm-stat-icon" style={{background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1'}}>📦</div>
            <div className="adm-stat-info">
              <div className="adm-stat-lbl">ĐƠN HÀNG</div>
              <div className="adm-stat-val">{stats.orders}</div>
            </div>
          </div>
          <div className="adm-stat-card animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="adm-stat-icon" style={{background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b'}}>💎</div>
            <div className="adm-stat-info">
              <div className="adm-stat-lbl">SẢN PHẨM</div>
              <div className="adm-stat-val">{stats.products}</div>
            </div>
          </div>
          <div className="adm-stat-card animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="adm-stat-icon" style={{background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7'}}>👥</div>
            <div className="adm-stat-info">
              <div className="adm-stat-lbl">NGƯỜI DÙNG</div>
              <div className="adm-stat-val">{stats.users}</div>
            </div>
          </div>
        </div>

        <div className="adm-dash-row">
          <div className="adm-dash-col">
            <div className="adm-table-card">
              <div className="adm-table-hdr">
                <h3>Phân bổ Danh mục 📊</h3>
              </div>
              <div className="adm-analytics-body">
                {Object.entries(categoryStats).map(([cat, count]) => {
                  const percent = Math.round((count / products.length) * 100);
                  return (
                    <div key={cat} className="adm-progress-item">
                      <div className="adm-progress-info">
                        <span>{cat}</span>
                        <span>{percent}% ({count})</span>
                      </div>
                      <div className="adm-progress-bg">
                        <div className="adm-progress-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="adm-table-card" style={{marginTop: '24px'}}>
              <div className="adm-table-hdr">
                <h3>Người dùng mới nhất 👥</h3>
              </div>
              <div className="adm-list-simple">
                {users.slice(-5).reverse().map(u => (
                  <div key={u.id} className="adm-list-item">
                    <div className="adm-item-info">
                      <strong>{u.userName}</strong>
                      <span>{u.userDetails?.email || 'No email'}</span>
                    </div>
                    <span className="status-badge-sm completed" style={{background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7'}}>USER</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="adm-dash-col">
            <div className="adm-table-card">
              <div className="adm-table-hdr">
                <h3>Sản phẩm bán chạy 🔥</h3>
              </div>
              <div className="adm-list-simple">
                {topProducts.map((p, idx) => (
                  <div key={p.id} className="adm-list-item">
                    <div className="adm-item-rank">{idx + 1}</div>
                    <div className="adm-img-cell" style={{width: '40px', height: '40px', marginRight: '12px'}}>
                       {p.image ? (
                         <img src={`http://localhost:8810/uploads/${p.image}`} alt="" className="adm-img-thumb" />
                       ) : <div className="adm-img-placeholder" style={{fontSize: '0.8rem'}}>💎</div>}
                    </div>
                    <div className="adm-item-info" style={{flex: 1}}>
                      <strong>{p.productName}</strong>
                      <span>{p.price?.toLocaleString()}₫</span>
                    </div>
                    <span className="adm-badge-gold">HOT</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="adm-table-card" style={{marginTop: '24px'}}>
              <div className="adm-table-hdr">
                <h3>Đơn hàng mới nhất ⚡</h3>
              </div>
              <div className="adm-list-simple">
                {orders.slice(0, 5).map(o => (
                  <div key={o.id} className="adm-list-item">
                    <div className="adm-item-info">
                      <strong>Mã {o.id}</strong>
                      <span>{o.customer} - {o.total.toLocaleString()}₫</span>
                    </div>
                    <span className={`status-badge-sm ${o.status.toLowerCase()}`}>{o.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          <button className={`adm-nav-btn ${adminSection === 'stats' ? 'active' : ''}`} onClick={() => { setAdminSection('stats'); setSearchTerm(''); }}>
            <span>📊</span> Tổng quan
          </button>
          <button className={`adm-nav-btn ${adminSection === 'products' ? 'active' : ''}`} onClick={() => { setAdminSection('products'); setSearchTerm(''); }}>
            <span>💎</span> Sản phẩm
          </button>
          <button className={`adm-nav-btn ${adminSection === 'users' ? 'active' : ''}`} onClick={() => { setAdminSection('users'); setSearchTerm(''); }}>
            <span>👥</span> Người dùng
          </button>
          <button className={`adm-nav-btn ${adminSection === 'orders' ? 'active' : ''}`} onClick={() => { setAdminSection('orders'); setSearchTerm(''); }}>
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
          {adminSection === 'stats' ? renderStats() : (
            <div className="adm-table-card">
              <div className="adm-table-hdr">
                <div className="adm-hdr-left">
                  <h3>Danh sách {adminSection === 'products' ? 'Sản phẩm' : adminSection === 'users' ? 'Người dùng' : 'Đơn hàng'}</h3>
                  <div className="adm-search-box">
                    <span>🔍</span>
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                {adminSection !== 'orders' && (
                  <button className="top-btn btn-gold-sm" onClick={() => setAdminModal(adminSection === 'products' ? 'addProduct' : 'addUser')}>
                    + Thêm mới
                  </button>
                )}
              </div>
              <table className="adm-table">
                <thead>
                  {adminSection === 'products' ? (
                    <tr>
                       <th>ID</th>
                       <th>ẢNH</th>
                       <th>Tên</th>
                       <th>Danh mục</th>
                       <th>Kho</th>
                       <th>Giá</th>
                       <th>Thao tác</th>
                    </tr>
                  ) : adminSection === 'users' ? (
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                      <th>Thao tác</th>
                    </tr>
                  ) : (
                    <tr>
                      <th>Mã Đơn</th>
                      <th>Khách hàng</th>
                      <th>Ngày đặt</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {adminSection === 'products' ? filteredProducts.map(p => (
                     <tr key={p.id}>
                       <td>#{p.id}</td>
                       <td>
                         <div className="adm-img-cell">
                           {p.image ? (
                             <img src={`http://localhost:8810/uploads/${p.image}`} alt={p.productName} className="adm-img-thumb" />
                           ) : (
                             <div className="adm-img-placeholder">💎</div>
                           )}
                         </div>
                       </td>
                       <td>{p.productName}</td>
                       <td>{p.category}</td>
                       <td>
                          <span className={p.availability <= 5 ? 'text-danger fw-bold' : ''}>
                            {p.availability}
                          </span>
                       </td>
                       <td>{p.price?.toLocaleString()}₫</td>
                       <td>
                         <button className="adm-btn-edit" onClick={() => { setAdminFormData(p); setAdminModal('editProduct'); }}>Sửa</button>
                         <button className="adm-btn-danger" onClick={() => { setAdminFormData(p); setAdminModal('deleteProduct'); }}>Xóa</button>
                       </td>
                     </tr>
                  )) : adminSection === 'users' ? filteredUsers.map(u => (
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
                  )) : filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.customer}</td>
                      <td>{o.date}</td>
                      <td>{o.total?.toLocaleString()}₫</td>
                      <td>
                        <span className={`status-badge ${o.status.toLowerCase()}`}>
                          {o.status === 'Completed' ? 'Hoàn thành' : o.status === 'Processing' ? 'Đang xử lý' : o.status === 'Cancelled' ? 'Đã hủy' : 'Chờ duyệt'}
                        </span>
                      </td>
                      <td>
                        <button className="adm-btn-edit" onClick={() => { setAdminFormData(o); setAdminModal('editOrder'); }}>Sửa</button>
                        <button className="adm-btn-danger" onClick={() => { setAdminFormData(o); setAdminModal('deleteOrder'); }}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(adminSection === 'products' ? filteredProducts : adminSection === 'users' ? filteredUsers : filteredOrders).length === 0 && (
                <div className="adm-empty-state">Không tìm thấy dữ liệu phù hợp.</div>
              )}
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
                      </div>
                    </>
                  ) : adminModal.includes('User') ? (
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
                  ) : (
                    <>
                      <div className="adm-form-group">
                        <label>Mã Đơn hàng</label>
                        <input value={adminFormData.id} disabled />
                      </div>
                      <div className="adm-form-group">
                        <label>Khách hàng</label>
                        <input value={adminFormData.customer} disabled />
                      </div>
                      <div className="adm-form-group">
                        <label>Trạng thái</label>
                        <select name="status" value={adminFormData.status} onChange={handleAdminInputChange}>
                          <option value="Pending">Chờ duyệt</option>
                          <option value="Processing">Đang xử lý</option>
                          <option value="Completed">Hoàn thành</option>
                          <option value="Cancelled">Đã hủy</option>
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