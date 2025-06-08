import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      headers: error.config?.headers
    });
    
    if (error.response?.status === 401 && !error.config.url?.includes('/auth/login')) {
      console.log('Token expired or invalid');
      localStorage.removeItem('token');
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Making API request:', {
    url: config.url,
    method: config.method,
    hasToken: !!token,
    headers: config.headers
  });
  
  if (token) {
    // Ensure headers object exists
    config.headers = config.headers || {};
    // Set the Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getFeaturedProduct = async () => {
  const response = await api.get('/products/featured');
  return response.data;
};

export const getProductsByCategory = async (category: string) => {
  const response = await api.get(`/products/category/${category}`);
  return response.data;
};

export const getProduct = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Cart functions
export const addToCart = async (productId: string, quantity: number = 1) => {
  const response = await api.post(`/cart/add/${productId}`, { quantity });
  return response.data;
};

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const updateCartQuantity = async (itemId: string, quantity: number) => {
  const response = await api.put(`/cart/${itemId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (itemId: string) => {
  const response = await api.delete(`/cart/${itemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
};

export const getCartTotal = async () => {
  const response = await api.get('/cart/total');
  return response.data;
};

// Wishlist functions
export const addToWishlist = async (productId: string) => {
  const response = await api.post(`/wishlist/add/${productId}`);
  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const removeFromWishlist = async (itemId: string) => {
  const response = await api.delete(`/wishlist/${itemId}`);
  return response.data;
};

export const clearWishlist = async () => {
  const response = await api.delete('/wishlist');
  return response.data;
};

export const isInWishlist = async (productId: string) => {
  const response = await api.get(`/wishlist/check/${productId}`);
  return response.data;
};

// Profile Management
export const updateProfile = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}) => {
  const user = await getProfile();
  const response = await api.put(`/users/${user.id}/profile`, data);
  return response.data;
};

export const updateAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await api.put('/auth/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.put('/auth/change-password', data);
  return response.data;
};

// Order Management
export const createOrder = async (orderData: {
  shippingDetails: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
  };
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrder = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getOrderDetails = async (orderId: string) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId: string) => {
  const response = await api.post(`/orders/${orderId}/cancel`);
  return response.data;
};

// Address Management
export const getAddresses = async () => {
  const response = await api.get('/addresses');
  return response.data;
};

export const addAddress = async (data: {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}) => {
  const response = await api.post('/addresses', data);
  return response.data;
};

export const updateAddress = async (addressId: string, data: {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}) => {
  const response = await api.put(`/addresses/${addressId}`, data);
  return response.data;
};

export const deleteAddress = async (addressId: string) => {
  const response = await api.delete(`/addresses/${addressId}`);
  return response.data;
};

export const setDefaultAddress = async (addressId: string) => {
  const response = await api.put(`/addresses/${addressId}/default`);
  return response.data;
};

// Payment Methods
export const getPaymentMethods = async () => {
  const response = await api.get('/payment-methods');
  return response.data;
};

export const addPaymentMethod = async (data: {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  isDefault?: boolean;
}) => {
  const response = await api.post('/payment-methods', data);
  return response.data;
};

export const deletePaymentMethod = async (paymentMethodId: string) => {
  const response = await api.delete(`/payment-methods/${paymentMethodId}`);
  return response.data;
};

export const setDefaultPaymentMethod = async (paymentMethodId: string) => {
  const response = await api.put(`/payment-methods/${paymentMethodId}/default`);
  return response.data;
};

// Account Settings
export const updateSettings = async (data: {
  emailNotifications: boolean;
  newsletterSubscription: boolean;
}) => {
  const response = await api.put('/auth/settings', data);
  return response.data;
};

export const deleteAccount = async (password: string) => {
  const response = await api.post('/auth/delete-account', { password });
  return response.data;
};

export default api; 