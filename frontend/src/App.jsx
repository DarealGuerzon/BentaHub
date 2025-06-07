import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axiosInstance from './services/axiosConfig';

//import components
import Home from './components/Home';
import Inventory from './components/Inventory';
import AddProduct from './components/AddProduct';
import SalesReport from './components/SalesReport';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Create a wrapper component to handle the sidebar visibility
function AppContent() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [saleReceipt, setSaleReceipt] = useState(null);

  // Fetch products from backend on mount
  useEffect(() => {
    axiosInstance.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  // Add product to cart or increase quantity
  const handleAddToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.productId === product._id);
      if (exists) {
        if (exists.quantity < product.quantity) { // stock check
          return prev.map(item =>
            item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          alert('No more stock available');
          return prev;
        }
      }
      return [...prev, { productId: product._id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  // Checkout handler: send sale, update inventory, clear cart, save receipt
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    try {
      // Update inventory for each cart item
      for (const item of cart) {
        const res = await axiosInstance.post('/products/reduce', {
          productId: item.productId,
          quantity: item.quantity
        });
        if (!res.data) throw new Error('Error updating inventory');
      }

      // Prepare sale data
      const saleItems = cart.map(({ productId, name, quantity, price }) => ({
        productId,
        name,
        quantity,
        price,
      }));
      const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

      // Add sale record
      const saleRes = await axiosInstance.post('/sales/add', {
        items: saleItems,
        totalAmount
      });

      if (!saleRes.data) throw new Error('Error recording sale');
      const saleData = saleRes.data;

      setSaleReceipt(saleData);
      setCart([]);

      // Refresh products stock after sale
      const productsRes = await axiosInstance.get('/products');
      setProducts(productsRes.data);

      alert('Sale successful! Receipt is shown below.');

    } catch (error) {
      alert(error.message);
    }
  };

  if (location.pathname === '/login') {
    return <Login />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        padding: '20px',
        backgroundColor: '#f8fafc',
        overflowY: 'auto'
      }}>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Home products={products} cart={cart} onAddToCart={handleAddToCart} onCheckout={handleCheckout} />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute>
              <Inventory products={products} onAddToCart={handleAddToCart} />
            </ProtectedRoute>
          } />
          <Route path="/add-product" element={
            <ProtectedRoute>
              <AddProduct onProductAdded={() => {
                axiosInstance.get('/products')
                  .then(res => setProducts(res.data))
                  .catch(err => console.error('Error refreshing products:', err));
              }} />
            </ProtectedRoute>
          } />
          <Route path="/sales-report" element={
            <ProtectedRoute>
              <SalesReport saleReceipt={saleReceipt} />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}