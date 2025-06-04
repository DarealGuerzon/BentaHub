import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products:', err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product._id);
    if (existing) {
      if (existing.quantity < product.quantity) {
        setCart(cart.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        alert('No more stock available');
      }
    } else {
      if (product.quantity > 0) {
        setCart([...cart, {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1
        }]);
      } else {
        alert('Product out of stock');
      }
    }
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const checkout = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/sales/add', {
        items: cart,
        totalAmount
      });

      alert('Sale successful!');
      setCart([]);
      fetchProducts(); // update inventory
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout failed');
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      setProducts(products.filter(product => product._id !== productId));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product._id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{product.name}</h2>
            <p>Price: ₱{product.price}</p>
            <p>Stock: {product.quantity}</p>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded mr-2 mt-2"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded mt-2"
              onClick={() => deleteProduct(product._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Cart</h2>
        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            <ul>
              {cart.map(item => (
                <li key={item.productId}>
                  {item.name} x {item.quantity} = ₱{item.price * item.quantity}
                </li>
              ))}
            </ul>
            <p className="mt-2 font-semibold">Total: ₱{totalAmount}</p>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded mt-3"
              onClick={checkout}
            >
              Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
