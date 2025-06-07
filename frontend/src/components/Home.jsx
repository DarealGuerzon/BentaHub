import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home({ products, cart, onAddToCart }) {
  const [localCart, setLocalCart] = useState(cart || []);
  const [localProducts, setLocalProducts] = useState(products || []);

  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const totalAmount = localCart.reduce((total, item) => total + item.price * item.quantity, 0);

  const checkout = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/sales/add', {
        items: localCart,
        totalAmount
      });

      alert('Sale successful!');
      setLocalCart([]);
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout failed');
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      setLocalProducts(localProducts.filter(product => product._id !== productId));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product');
    }
  };

  const removeFromCart = (productId) => {
    setLocalCart(localCart.filter(item => item.productId !== productId));
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Products Section */}
        <div style={{ flex: 2 }}>
          <h1 style={{ marginBottom: '20px', color: '#1e293b' }}>Product List</h1>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            {localProducts.map(product => (
              <div key={product._id} style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <h2 style={{ marginBottom: '10px', color: '#1e293b' }}>{product.name}</h2>
                <p style={{ color: '#64748b' }}>Price: ₱{product.price}</p>
                <p style={{ color: '#64748b' }}>Stock: {product.quantity}</p>
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => onAddToCart(product)}
                    style={{
                      padding: '8px 16px',
                      background: '#2563eb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => deleteProduct(product._id)}
                    style={{
                      padding: '8px 16px',
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: '20px'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Cart</h2>
            {localCart.length === 0 ? (
              <p style={{ color: '#64748b' }}>No items in cart.</p>
            ) : (
              <>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {localCart.map(item => (
                    <li key={item.productId} style={{
                      padding: '10px 0',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <span style={{ color: '#1e293b' }}>{item.name}</span>
                        <span style={{ color: '#64748b', marginLeft: '10px' }}>x {item.quantity}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#1e293b' }}>₱{item.price * item.quantity}</span>
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          style={{
                            padding: '4px 8px',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                  <p style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold',
                    color: '#1e293b',
                    marginBottom: '15px'
                  }}>
                    Total: ₱{totalAmount.toFixed(2)}
                  </p>
                  <button 
                    onClick={checkout}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#2563eb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
