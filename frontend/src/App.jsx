import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import './App.css'
import { productService, userService } from './services/api'
import axios from 'axios'

// Components
import AuthPanel from './components/common/AuthPanel'
import PremiumLanding from './components/customer/PremiumLanding'
import AdminDashboard from './components/admin/AdminDashboard'
import UserPanel from './components/customer/UserPanel'
import CheckoutModal from './components/customer/CheckoutModal'
import Cart from './components/customer/Cart'
import OrderHistory from './components/customer/OrderHistory'
import ChatBot from './components/customer/ChatBot'
import { cartService, orderService } from './services/api'

// --- COMPONENT: KẾT QUẢ THANH TOÁN VNPAY ---
const VNPayReturn = ({ onClose }) => {
  const [searchParams] = useSearchParams();
  const responseCode = searchParams.get('vnp_ResponseCode');
  const amount = searchParams.get('vnp_Amount');
  const orderId = searchParams.get('vnp_TxnRef');
  const isSuccess = responseCode === '00';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #1a1a1a, #0f0f0f)',
        border: `1px solid ${isSuccess ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
        borderRadius: '24px',
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        boxShadow: `0 25px 50px ${isSuccess ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'}`,
        animation: 'slideUp 0.4s ease'
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>
          {isSuccess ? '✅' : '❌'}
        </div>
        <h2 style={{ 
          color: isSuccess ? '#4caf50' : '#f44336', 
          marginBottom: '1rem',
          fontSize: '1.6rem'
        }}>
          {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
        </h2>
        <p style={{ color: '#aaa', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
          {isSuccess 
            ? 'Cảm ơn bạn đã mua sắm tại Luxury Jewelry. Đơn hàng của bạn đang được xử lý.' 
            : 'Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'
          }
        </p>
        {isSuccess && amount && (
          <p style={{ color: '#d4af37', fontWeight: '800', fontSize: '1.3rem', margin: '1.5rem 0' }}>
            💰 {(parseInt(amount) / 100).toLocaleString()} VNĐ
          </p>
        )}
        {orderId && (
          <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '2rem' }}>
            Mã đơn hàng: <span style={{ color: '#fff' }}>{orderId}</span>
          </p>
        )}
        <button 
          onClick={onClose}
          style={{
            background: isSuccess ? 'linear-gradient(135deg, #d4af37, #b8860b)' : 'linear-gradient(135deg, #555, #333)',
            color: isSuccess ? '#000' : '#fff',
            border: 'none',
            padding: '14px 40px',
            borderRadius: '12px',
            fontWeight: '800',
            fontSize: '1rem',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.3s'
          }}
        >
          Trở về trang chủ
        </button>
      </div>
    </div>
  );
};

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
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileData, setProfileData] = useState({})
  const [orders, setOrders] = useState(() => {
    const offlineOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
    return [
      ...offlineOrders,
      { id: 'ORD-1001', customer: 'Nguyễn Văn A', date: '2026-04-10', total: 1500000, status: 'Completed' },
      { id: 'ORD-1002', customer: 'Trần Thị B', date: '2026-04-11', total: 2750000, status: 'Processing' },
      { id: 'ORD-1003', customer: 'Lê Văn C', date: '2026-04-11', total: 950000, status: 'Pending' }
    ];
  });

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
      if (cartData && Array.isArray(cartData)) {
        const formattedCart = cartData.map(item => ({
          ...item.product,
          quantity: item.quantity
        }));
        setCart(formattedCart);
      }
    } catch (err) {
      // Silent fail
    }
  };


  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAllProducts()
      setProducts(data)
    } catch (err) {
      // Fallback: Dữ liệu mẫu từ demo-data.sql khi backend lỗi
      setProducts([
        { id: 1, productName: 'Nhẫn Kim Cương Eternal Love', price: 45000000, category: 'Nhẫn', availability: 10, image: '91854_nhnkimcngeternel.webp' },
        { id: 2, productName: 'Cặp Nhẫn Cưới Tình Nhân', price: 28000000, category: 'Nhẫn', availability: 5, image: '41673_cpnhncitnhnhn.webp' },
        { id: 5, productName: 'Dây Chuyền Bạch Kim Ánh Sao', price: 12000000, category: 'Dây chuyền', availability: 15, image: '39280_dychuynbchkimnhsao.webp' },
        { id: 9, productName: 'Đồng Hồ Nữ Đính Đá Sapphire', price: 65000000, category: 'Đồng hồ', availability: 5, image: '1614_nghnnhsapphire.webp' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers()
      setUsers(data)
    } catch (err) {
      // Fallback: Lấy danh sách local_users + admin mẫu
      const localUsers = JSON.parse(localStorage.getItem('local_users') || '[]')
      setUsers([
        { id: 1, userName: 'admin', role: { roleName: 'ROLE_ADMIN' }, userDetails: { firstName: 'Admin', email: 'admin@luxury.com' } },
        ...localUsers
      ])
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
      // Fallback: Đăng nhập cục bộ khi backend chưa chạy
      const localUsers = JSON.parse(localStorage.getItem('local_users') || '[]')
      const matchedUser = localUsers.find(u => u.userName === loginData.userName && u.password === loginData.password)

      if (loginData.userName === 'admin' && loginData.password === 'admin123') {
        const adminUser = {
          id: 1,
          userName: 'admin',
          role: { roleName: 'ROLE_ADMIN' },
          userDetails: { firstName: 'Admin', lastName: 'System', email: 'admin@luxury.com' }
        }
        setCurrentUser(adminUser)
        setIsLoggedIn(true)
        localStorage.setItem('user', JSON.stringify(adminUser))
        setLoginData({ userName: '', password: '' })
        setLoginMessage('')
        setShowAuthPanel(false)
        navigate('/admin')
      } else if (matchedUser) {
        setCurrentUser(matchedUser)
        setIsLoggedIn(true)
        localStorage.setItem('user', JSON.stringify(matchedUser))
        setLoginData({ userName: '', password: '' })
        setLoginMessage('')
        setShowAuthPanel(false)
        navigate('/')
      } else {
        setLoginMessage('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
      }
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    // Tạo user mẫu để luôn hiển thị vào màn hình ngay lập tức (cho cả Online & Offline)
    const fallbackUser = {
      id: Date.now(),
      userName: regData.userName,
      password: regData.password, // Lưu lại để check login sau này
      role: { roleName: 'ROLE_USER' },
      userDetails: { firstName: regData.name || 'User', lastName: regData.lastName || '', email: regData.email }
    }
    
    // Lưu vào danh sách user cục bộ để có thể đăng nhập lại và admin có thể thấy
    const localUsers = JSON.parse(localStorage.getItem('local_users') || '[]')
    localUsers.push(fallbackUser)
    localStorage.setItem('local_users', JSON.stringify(localUsers))

    // Cập nhật vào danh sách hiển thị của Admin ngay lập tức
    setUsers(prev => [...prev, fallbackUser])

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
      setRegMessage('Đăng ký thành công! (Offline) Đang chuyển hướng...')
      setTimeout(() => {
        setCurrentUser(fallbackUser)
        setIsLoggedIn(true)
        localStorage.setItem('user', JSON.stringify(fallbackUser))
        setRegData({ userName: '', password: '', name: '', lastName: '', email: '' })
        setRegMessage('')
        setShowAuthPanel(false)
        navigate('/')
      }, 1500)
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
    } catch (err) {
      // Giữ nguyên trạng thái UI đã cập nhật trước đó, không báo lỗi
    }
  }

  const handleConfirmOrder = async () => {
    // Tạo đơn hàng mới để hiển thị ngay lập tức (chạy cả Online và Offline)
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: currentUser?.userDetails?.firstName || currentUser?.userName || 'Khách vãng lai',
      date: new Date().toISOString().split('T')[0],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'Pending',
      items: cart.map(item => ({ ...item }))
    };
    
    // Lưu vào LocalStorage
    const offlineOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
    offlineOrders.unshift(newOrder);
    localStorage.setItem('offline_orders', JSON.stringify(offlineOrders));

    // Cập nhật giao diện Admin & User
    setOrders(prev => [newOrder, ...prev]);
    setUserOrders(prev => [newOrder, ...prev]);

    try {
      await orderService.createOrder(currentUser.id, cartId);
      setCart([]);
      setShowCheckout(false);
      alert('Đặt hàng thành công!');
    } catch (err) {
      setCart([]);
      setShowCheckout(false);
      alert('Đặt hàng thành công! (Chế độ Offline)');
    }
  }

  // --- THANH TOÁN VNPAY ONLINE ---
  const handleVNPayPayment = async (totalAmount) => {
    const orderId = `ORD-VN-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Lưu tạm đơn hàng trước khi chuyển sang VNPay
    const newOrder = {
      id: orderId,
      customer: currentUser?.userDetails?.firstName || currentUser?.userName || 'Khách vãng lai',
      date: new Date().toISOString().split('T')[0],
      total: totalAmount,
      status: 'Pending',
      items: cart.map(item => ({ ...item }))
    };
    
    const offlineOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]');
    offlineOrders.unshift(newOrder);
    localStorage.setItem('offline_orders', JSON.stringify(offlineOrders));

    setOrders(prev => [newOrder, ...prev]);
    setUserOrders(prev => [newOrder, ...prev]);

    try {
      const res = await axios.post('http://localhost:3004/api/vnpay/create-payment', {
        amount: totalAmount,
        orderId: orderId
      });
      if (res.data && res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (err) {
      setCart([]);
      setShowCheckout(false);
      alert('Hệ thống VNPay đang bảo trì. Đơn hàng đã được ghi nhận dạng Offline!');
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
      const apiOrders = await orderService.getOrdersByUser(currentUser.id);
      setUserOrders(apiOrders);
      setShowOrderHistory(true);
    } catch (err) {
      // Khi server lỗi, lọc các đơn hàng (offline) của user hiện tại từ danh sách orders chung
      const offlineUserOrders = orders.filter(
        o => o.customer === currentUser?.userName || 
             o.customer === currentUser?.userDetails?.firstName || 
             o.customer === 'Khách vãng lai'
      );
      setUserOrders(offlineUserOrders);
      setShowOrderHistory(true);
    }
  }

  const handleOpenProfile = () => {
    if (!currentUser) return;
    setProfileData({
      firstName: currentUser.userDetails?.firstName || '',
      lastName: currentUser.userDetails?.lastName || '',
      email: currentUser.userDetails?.email || '',
      userName: currentUser.userName
    });
    setShowProfileModal(true);
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userName: profileData.userName,
        userDetails: { 
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email 
        }
      };
      const updatedUser = await userService.updateUser(currentUser.id, payload);
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setShowProfileModal(false);
      alert('Cập nhật hồ sơ thành công!');
    } catch (err) {
      // Fallback Offline
      const updatedUser = {
        ...currentUser,
        userDetails: {
          ...currentUser.userDetails,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email
        }
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setShowProfileModal(false);
      alert('Cập nhật hồ sơ thành công! (Chế độ Offline)');
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
      } else if (adminModal === 'editOrder') {
        // Logic cập nhật trạng thái đơn hàng
        const updatedOrders = orders.map(o => o.id === adminFormData.id ? { ...o, status: adminFormData.status } : o);
        setOrders(updatedOrders);
        localStorage.setItem('offline_orders', JSON.stringify(updatedOrders.filter(o => o.id.startsWith('ORD-'))));
      } else if (adminModal === 'deleteOrder') {
        const updatedOrders = orders.filter(o => o.id !== adminFormData.id);
        setOrders(updatedOrders);
        localStorage.setItem('offline_orders', JSON.stringify(updatedOrders.filter(o => o.id.startsWith('ORD-'))));
      }
      
      fetchProducts();
      fetchUsers();
      setAdminModal(null);
      setAdminFormData({});
      setSelectedFile(null);
    } catch (err) {
      // Fallback: Cập nhật UI cục bộ khi backend chưa chạy
      if (adminModal === 'addUser') {
        const newUser = {
          id: Date.now(),
          userName: adminFormData.userName,
          role: { roleName: adminFormData.role || 'ROLE_USER' },
          userDetails: { 
            firstName: adminFormData.firstName || 'User', 
            lastName: adminFormData.lastName || 'Member', 
            email: adminFormData.email 
          }
        }
        setUsers(prev => [...prev, newUser])
      } else if (adminModal === 'deleteUser') {
        setUsers(prev => prev.filter(u => u.id !== adminFormData.id))
      } else if (adminModal === 'addProduct') {
        const newProduct = {
          id: Date.now(),
          productName: adminFormData.productName,
          price: parseFloat(adminFormData.price),
          discription: adminFormData.discription || '',
          category: adminFormData.category || 'Rings',
          availability: parseInt(adminFormData.availability) || 0,
          image: adminFormData.image || ''
        }
        setProducts(prev => [...prev, newProduct])
      } else if (adminModal === 'deleteProduct') {
        setProducts(prev => prev.filter(p => p.id !== adminFormData.id))
      } else if (adminModal === 'editOrder') {
         const updatedOrders = orders.map(o => o.id === adminFormData.id ? { ...o, status: adminFormData.status } : o);
         setOrders(updatedOrders);
         localStorage.setItem('offline_orders', JSON.stringify(updatedOrders.filter(o => o.id.startsWith('ORD-'))));
      } else if (adminModal === 'deleteOrder') {
         const updatedOrders = orders.filter(o => o.id !== adminFormData.id);
         setOrders(updatedOrders);
         localStorage.setItem('offline_orders', JSON.stringify(updatedOrders.filter(o => o.id.startsWith('ORD-'))));
      }
      setAdminModal(null)
      setAdminFormData({})
      setSelectedFile(null)
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
                    onOpenProfile={handleOpenProfile}
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

          {/* VNPAY RETURN ROUTE */}
          <Route path="/vnpay_return" element={
            <VNPayReturn onClose={() => navigate('/')} />
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
            onVNPayPayment={handleVNPayPayment}
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

        {showProfileModal && (
          <div className="adm-overlay" onClick={(e) => e.target.className === 'adm-overlay' && setShowProfileModal(false)}>
            <div className="adm-modal" style={{maxWidth: '400px'}}>
              <h3 className="gold-gradient-text" style={{fontSize: '1.5rem', marginBottom: '1.5rem'}}>Hồ Sơ Cá Nhân</h3>
              <form onSubmit={handleProfileUpdate}>
                <div className="adm-form">
                  <div className="adm-form-group">
                    <label>Họ (Last Name)</label>
                    <input 
                      value={profileData.lastName} 
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="adm-form-group">
                    <label>Tên (First Name)</label>
                    <input 
                      value={profileData.firstName} 
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="adm-form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={profileData.email} 
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="adm-form-group">
                    <label>Username (Không thể sửa)</label>
                    <input value={profileData.userName} disabled style={{opacity: 0.6}} />
                  </div>
                </div>
                <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px'}}>
                  <button type="button" className="adm-nav-btn" onClick={() => setShowProfileModal(false)}>Hủy</button>
                  <button type="submit" className="top-btn btn-gold-sm">Lưu thay đổi</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ChatBot AI - Hiện trên tất cả các trang với ngữ cảnh người dùng */}
        <ChatBot 
          currentUser={currentUser} 
          products={products} 
          orders={orders} 
          users={users}
        />
      </main>
    </div>
  )
}

export default App
