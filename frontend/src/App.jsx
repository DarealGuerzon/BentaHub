import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import axiosInstance from './services/axiosConfig';
import Login from './components/Login';
import Home from './components/Home';
import AddProduct from './components/AddProduct';
import Inventory from './components/Inventory';
import SalesReport from './components/SalesReport';
import SalesAnalytics from './components/SalesAnalytics';
import Sidebar from './components/Sidebar';
import Receipt from './components/Receipt';
import ReceiptHistory from './components/ReceiptHistory';

function AppContent() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);

  

  const isLoginPage = location.pathname === '/login';

  const fetchProducts = async () => {
    try {
      console.log('=== App: Fetching products ===');
      const response = await axiosInstance.get('/products');
      console.log('Products response:', response.data);
      setProducts(response.data);
      setError('');
    } catch (error) {
      console.error('=== App: Error fetching products ===', error);
      setError(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && !isLoginPage) {
      fetchProducts();
    }
  }, [user, isLoginPage]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, productId: product._id, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const handleCheckout = async () => {
    try {
      if (!cart.length) {
        alert('Your cart is empty!');
        return;
      }
      
      const saleData = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        totalAmount: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
      };

      console.log('Sale data:', saleData);

      const response = await axiosInstance.post('/sales/add', saleData);
      console.log('=== App: Checkout successful ===', response.data);
      
      if (response.data.sale) {
        setCurrentSale(response.data.sale);
        setShowReceipt(true);
        setCart([]);
        await fetchProducts();
        alert('Checkout successful!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('=== App: Checkout failed ===', error);
      console.error('Error response:', error.response);
      alert(error.response?.data?.message || 'Failed to process checkout. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axiosInstance.delete(`/products/${productId}`);
      await fetchProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {!isLoginPage && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                products={products}
                cart={cart}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onCheckout={handleCheckout}
                onDeleteProduct={handleDeleteProduct}
              />
            }
          />
          <Route path="/inventory" element={<Inventory onDeleteProduct={handleDeleteProduct} />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/sales-report" element={<SalesReport />} />
          <Route path="/sales-analytics" element={<SalesAnalytics />} />
          <Route path="/receipt-history" element={<ReceiptHistory />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        {showReceipt && currentSale && (
            <Receipt
                sale={currentSale}
                onClose={() => setShowReceipt(false)}
            />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;