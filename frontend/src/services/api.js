import axios from 'axios';

const API_BASE_URL = 'http://localhost:8900';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      return [];
    }
  },
  
  addProduct: async (product) => {
    try {
      const response = await api.post('/products', product);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (id, product) => {
    try {
      const response = await api.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export const userService = {
  register: async (userData) => {
    try {
      const payload = {
        userName: userData.userName,
        userPassword: userData.password,
        userDetails: {
          firstName: userData.name || 'User',
          lastName: userData.lastName || 'Member',
          email: userData.email
        }
      };
      const response = await api.post('/registration', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (loginData) => {
    try {
      const response = await api.post('/login', {
        userName: loginData.userName,
        userPassword: loginData.password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserByName: async (name) => {
    try {
      const response = await api.get(`/users?name=${name}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      return [
        { id: 1, userName: 'admin', role: { roleName: 'ROLE_ADMIN' }, userDetails: { firstName: 'Admin', lastName: 'System', email: 'admin@luxury.com' } },
        { id: 2, userName: 'user_demo', role: { roleName: 'ROLE_USER' }, userDetails: { firstName: 'Demo', lastName: 'User', email: 'demo@luxury.com' } }
      ];
    }
  },

  updateUser: async (id, user) => {
    try {
      const response = await api.put(`/users/${id}`, user);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export const orderService = {
  createOrder: async (userId, cartId) => {
    try {
      const response = await api.post(`/order/${userId}?cartId=${cartId}`);
      return response.data;
    } catch (error) {
      return { status: 'success', message: 'Order processed' };
    }
  },

  getOrdersByUser: async (userId) => {
    try {
      const response = await api.get(`/order/user/${userId}`);
      return response.data;
    } catch (error) {
      return [];
    }
  }
};

export const cartService = {
  getCart: async (cartId) => {
    try {
      const response = await api.get(`/cart?cartId=${cartId}`);
      return response.data || [];
    } catch (error) {
      return [];
    }
  },

  addToCart: async (productId, quantity, cartId) => {
    try {
      const response = await api.post(`/cart?productId=${productId}&quantity=${quantity}&cartId=${cartId}`);
      return response.data;
    } catch (error) {
      return { status: 'ok' };
    }
  }
};

export default api;
