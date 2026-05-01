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
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  addProduct: async (product) => {
    try {
      const response = await api.post('/products', product);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
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
      return response.data; // This returns the unique filename
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  updateProduct: async (id, product) => {
    try {
      const response = await api.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};

export const userService = {
  register: async (userData) => {
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
  },

  login: async (loginData) => {
    try {
      const response = await api.post('/login', {
        userName: loginData.userName,
        userPassword: loginData.password
      });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  getUserByName: async (name) => {
    try {
      const response = await api.get(`/users?name=${name}`);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  updateUser: async (id, user) => {
    try {
      const response = await api.put(`/users/${id}`, user);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
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
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getOrdersByUser: async (userId) => {
    try {
      const response = await api.get(`/order/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }
};

export const cartService = {
  getCart: async (cartId) => {
    try {
      const response = await api.get(`/cart?cartId=${cartId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  addToCart: async (productId, quantity, cartId) => {
    try {
      const response = await api.post(`/cart?productId=${productId}&quantity=${quantity}&cartId=${cartId}`);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }
};

export default api;
