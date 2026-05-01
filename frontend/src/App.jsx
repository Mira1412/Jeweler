import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'
import { productService, userService } from './services/api'

// Components
import AuthPanel from './components/common/AuthPanel'
import PremiumLanding from './components/customer/PremiumLanding'
import AdminDashboard from './components/admin/AdminDashboard'
import UserPanel from './components/customer/UserPanel'
import CheckoutModal from './components/customer/CheckoutModal'
import Cart from './components/customer/Cart'
import OrderHistory from './components/customer/OrderHistory'
import { cartService, orderService } from './services/api'

function App() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Registration state
  const [regData, setRegData] = useState({ userName: '', password: '', name: '', lastName: '', email: '' })
  const [regMessage, setRegMessage] = useState('')

  // Login state
  const [loginData, setLoginData] = useState({ userName: '', password: '' })
  const [loginMessage, setLoginMessage] = useState('')
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showAuthPanel, setShowAuthPanel] = useState(false)

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  
  const [cart, setCart] = useState([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const [userOrders, setUserOrders] = useState([])
  const cartId = String(currentUser?.id || 0)

  // Admin CRUD states
  const [adminModal, setAdminModal] = useState(null)
  const [adminFormData, setAdminFormData] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)
  const [adminSection, setAdminSection] = useState('stats')
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([
    { id: 'ORD-1001', customer: 'Nguyễn Văn A', date: '2026-04-10', total: 1500000, status: 'Completed' },
    { id: 'ORD-1002', customer: 'Trần Thị B', date: '2026-04-11', total: 2750000, status: 'Processing' },
    { id: 'ORD-1003', customer: 'Lê Văn C', date: '2026-04-11', total: 950000, status: 'Pending' }
  ])

  const isAdmin = currentUser?.role?.roleName === 'ROLE_ADMIN'
  const isUser = currentUser?.role?.roleName === 'ROLE_USER'

  const openAuth = (mode) => {
    setIsLoginMode(mode === 'login')
    setShowAuthPanel(true)
  }

  const closeAuth = () => setShowAuthPanel(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      fetchCart(user.id);
      
      // Redirect to admin if already logged in as admin and on root
      if (user.role?.roleName === 'ROLE_ADMIN' && window.location.pathname === '/') {
        navigate('/admin');
      }
    }
    fetchProducts();
    fetchUsers();
  }, []);

  const fetchCart = async (userId) => {
    try {
      const cartData = await cartService.getCart(String(userId));
      const formattedCart = cartData.map(item => ({
        ...item.product,
        quantity: item.quantity
      }));
      setCart(formattedCart);
    } catch (err) {
    }
  };

  const fetchUsers = async () => {
    const data = await userService.getAllUsers()
    if (!data._isOffline) {
      setUsers(data)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAllProducts()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError('Không thể lấy danh sách sản phẩm. Hãy đảm bảo API Gateway đang chạy.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await userService.login(loginData)
      setCurrentUser(user)
      setIsLoggedIn(true)
      localStorage.setItem('user', JSON.stringify(user))
      setLoginData({ userName: '', password: '' })
      setLoginMessage('')
      setShowAuthPanel(false)
      
      // Automatic Redirection
      if (user.role?.roleName === 'ROLE_ADMIN') {
        navigate('/admin')
      } else {
        fetchCart(user.id);
        navigate('/')
      }
    } catch (err) {
      setLoginMessage('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
      console.error(err)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const newUser = await userService.register(regData)
      setRegMessage('Đăng ký thành công! Đang chuyển hướng...')
      setTimeout(() => {
        setCurrentUser(newUser)
        setIsLoggedIn(true)
        localStorage.setItem('user', JSON.stringify(newUser))
        setRegData({ userName: '', password: '', name: '', lastName: '', email: '' })
        setRegMessage('')
        setShowAuthPanel(false)
        navigate('/')
      }, 1500)
    } catch (err) {
      setRegMessage('Đăng ký thất bại. Vui lòng thử lại.')
      console.error(err)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      openAuth('login');
      return;
    }
    
    // UI update instantly for avoiding lag feel
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    try {
      await cartService.addToCart(product.id, 1, cartId);
      console.log(`Đã thêm ${product.productName} vào giỏ hàng!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
      // Revert UI change on fail but hide the popup to prevent annoying behavior
      // when network fetch throws misleading error codes despite Redis success.
      fetchCart(currentUser.id);
    }
  }

  const handleConfirmOrder = async () => {
    try {
      await orderService.createOrder(currentUser.id, cartId);
      setCart([]);
      alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
    } catch (err) {
      console.error('Order creation failed:', err);
      throw err;
    }
  }

  const handleUpdateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  }

  const handleRemoveFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }

  const handleProceedToCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  }

  const handleOpenOrderHistory = async () => {
    if (!currentUser) return;
    try {
      const orders = await orderService.getOrdersByUser(currentUser.id);
      setUserOrders(orders);
      setShowOrderHistory(true);
    } catch (err) {
      alert('Không thể tải lịch sử đơn hàng.');
    }
  }

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  }

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      if (adminModal === 'addProduct') {
        let finalImageName = adminFormData.image || '';
        if (selectedFile) {
          const uploadedName = await productService.uploadImage(selectedFile);
          finalImageName = uploadedName;
        }
        const payload = {
          productName: adminFormData.productName,
          price: parseFloat(adminFormData.price),
          discription: adminFormData.discription || '',
          category: adminFormData.category || 'Rings',
          availability: parseInt(adminFormData.availability) || 0,
          image: finalImageName
        };
        await productService.addProduct(payload);
      } else if (adminModal === 'editProduct') {
        let finalImageName = adminFormData.image || '';
        if (selectedFile) {
          const uploadedName = await productService.uploadImage(selectedFile);
          finalImageName = uploadedName;
        }
        const payload = {
          productName: adminFormData.productName,
          price: parseFloat(adminFormData.price),
          discription: adminFormData.discription || '',
          category: adminFormData.category || 'Rings',
          availability: parseInt(adminFormData.availability) || 0,
          image: finalImageName
        };
        await productService.updateProduct(adminFormData.id, payload);
      } else if (adminModal === 'deleteProduct') {
        await productService.deleteProduct(adminFormData.id);
      } else if (adminModal === 'addUser') {
        const payload = {
          userName: adminFormData.userName,
          password: adminFormData.password,
          email: adminFormData.email,
          name: adminFormData.firstName || 'User',
          lastName: adminFormData.lastName || 'Member'
        };
        await userService.register(payload);
      } else if (adminModal === 'editUser') {
        // Extract role string correctly
        const roleStr = typeof adminFormData.role === 'object' 
          ? adminFormData.role.roleName 
          : (adminFormData.role || 'ROLE_USER');
          
        const payload = {
          userName: adminFormData.userName,
          userPassword: adminFormData.password,
          userDetails: { 
            email: adminFormData.email || adminFormData.userDetails?.email 
          },
          role: { roleName: roleStr }
        };
        await userService.updateUser(adminFormData.id, payload);
      } else if (adminModal === 'deleteUser') {
        await userService.deleteUser(adminFormData.id);
      }
      
      fetchProducts();
      fetchUsers();
      setAdminModal(null);
      setAdminFormData({});
      setSelectedFile(null);
    } catch (err) {
      alert('Thao tác thất bại: ' + (err.response?.data?.message || err.message));
    }
  }

  const showCustomerLayout = window.location.pathname !== '/admin' && !isAdmin;

  return (
    <div className="app-container">
      <main className="main-content">
        <Routes>
          {/* CUSTOMER ROUTES GROUP */}
          <Route path="/" element={
            <>
              {/* Customer Top Bar */}
              <div className="top-bar">
                <div className="top-bar-container">
                  <div className="top-left">
                    <div className="brand-logo gold-gradient-text" style={{ fontWeight: '800', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
                      LUXURY
                    </div>
                  </div>
                  <div className="top-right">
                    <button className="top-btn cart-btn" onClick={() => setShowCart(true)}>
                      <span className="icon">🛒</span>
                      <span>Giỏ hàng ({cart.length})</span>
                    </button>
                    
                    {!isLoggedIn ? (
                      <div className="auth-group">
                        <button className="top-btn" onClick={() => openAuth('login')}>Đăng nhập</button>
                        <button className="top-btn btn-gold-sm" onClick={() => openAuth('register')}>Đăng ký</button>
                      </div>
                    ) : (
                      <button className="top-btn logout-btn" onClick={handleLogout}>
                        <span className="icon">🚪</span>
                        <span>Đăng xuất</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Viewports */}
              <div className="customer-viewport">
                {!isLoggedIn ? (
                  <PremiumLanding 
                    openAuth={openAuth} 
                    products={products}
                    loading={loading}
                    error={error}
                    handleAddToCart={handleAddToCart}
                  />
                ) : isAdmin ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <UserPanel 
                    currentUser={currentUser}
                    isUser={isUser}
                    handleLogout={handleLogout}
                    products={products}
                    loading={loading}
                    error={error}
                    handleAddToCart={handleAddToCart}
                    openCheckout={() => setShowCheckout(true)}
                    cartItemsCount={cart.length}
                    onOpenCart={() => setShowCart(true)}
                    onOpenOrders={handleOpenOrderHistory}
                  />
                )}
              </div>

              {/* Customer Footer */}
              <footer style={{ padding: '4rem 2rem', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', background: 'rgba(0,0,0,0.3)' }}>
                <div className="footer-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                  <div className="gold-gradient-text" style={{ fontWeight: '700', marginBottom: '1rem' }}>LUXURY JEWELRY</div>
                  <p>&copy; 2026 Premium Microservices Experience. All rights reserved.</p>
                </div>
              </footer>
            </>
          } />
          
          {/* ADMIN ROUTES GROUP - COMPLETELY INDEPENDENT */}
          <Route path="/admin/*" element={
            isAdmin ? (
              <div className="admin-root">
                <AdminDashboard 
                  currentUser={currentUser}
                  adminSection={adminSection}
                  setAdminSection={setAdminSection}
                  users={users}
                  products={products}
                  orders={orders}
                  adminModal={adminModal}
                  setAdminModal={setAdminModal}
                  adminFormData={adminFormData}
                  setAdminFormData={setAdminFormData}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  fetchProducts={fetchProducts}
                  fetchUsers={fetchUsers}
                  handleLogout={handleLogout}
                  handleAdminInputChange={handleAdminInputChange}
                  handleFileChange={handleFileChange}
                  handleAdminSubmit={handleAdminSubmit}
                />
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* SHARED MODALS (Still accessible but scoped by state) */}
        {!isLoggedIn && showAuthPanel && (
          <AuthPanel 
            isLoginMode={isLoginMode}
            setIsLoginMode={setIsLoginMode}
            setShowAuthPanel={setShowAuthPanel}
            closeAuth={closeAuth}
            loginData={loginData}
            setLoginData={setLoginData}
            handleLogin={handleLogin}
            loginMessage={loginMessage}
            regData={regData}
            setRegData={setRegData}
            handleRegister={handleRegister}
            regMessage={regMessage}
          />
        )}

        {showCheckout && (
          <CheckoutModal 
            cart={cart}
            user={currentUser}
            onClose={() => setShowCheckout(false)}
            onConfirm={handleConfirmOrder}
          />
        )}

        {showCart && (
          <Cart 
            cart={cart}
            onClose={() => setShowCart(false)}
            onRemove={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
            onCheckout={handleProceedToCheckout}
          />
        )}

        {showOrderHistory && (
          <OrderHistory 
            orders={userOrders}
            onClose={() => setShowOrderHistory(false)}
          />
        )}
      </main>
    </div>
  )
}

export default App
