import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosConfig';

export default function Home({ products, cart, onAddToCart, onCheckout }) {
  const [localCart, setLocalCart] = useState(cart || []);
  const [localProducts, setLocalProducts] = useState(products || []);

  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const totalAmount = localCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deleteProduct = async (productId) => {
    try {
      await axiosInstance.delete(`/products/${productId}`);
      setLocalProducts(
        localProducts.filter((product) => product._id !== productId)
      );
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product');
    }
  };

  const removeFromCart = (productId) => {
    setLocalCart(localCart.filter((item) => item.productId !== productId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Products Section */}
          <div className="flex-grow lg:w-2/3">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                Product List
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">
                  {localProducts.length} products available
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {localProducts.map((product) => (
                <div
                  key={product._id}
                  className="group relative flex transform flex-col overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex-grow">
                    <h2 className="mb-2 text-xl font-semibold text-slate-900">
                      {product.name}
                    </h2>
                    <div className="space-y-2">
                      <p className="flex items-center text-slate-600">
                        <span className="mr-2 text-lg font-medium text-blue-600">
                          ₱{product.price}
                        </span>
                      </p>
                      <p className="flex items-center text-slate-600">
                        <span className="mr-2 text-sm">Stock:</span>
                        <span className={`font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.quantity}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="relative mt-5 flex gap-3">
                    <button
                      onClick={() => onAddToCart(product)}
                      disabled={product.quantity === 0}
                      className="flex-1 transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="flex-1 transform rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 font-semibold text-white shadow-md transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-8 overflow-hidden rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Shopping Cart</h2>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                  {localCart.length} items
                </span>
              </div>
              {localCart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 rounded-full bg-slate-100 p-3">
                    <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-slate-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <ul className="divide-y divide-slate-200">
                    {localCart.map((item) => (
                      <li
                        key={item.productId}
                        className="flex items-center justify-between py-4"
                      >
                        <div>
                          <span className="font-medium text-slate-800">
                            {item.name}
                          </span>
                          <span className="ml-3 text-sm text-slate-500">
                            x {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-slate-800">
                            ₱{item.price * item.quantity}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-600 transition-colors duration-200 hover:bg-red-200"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-slate-600">Total</span>
                      <span className="text-2xl font-bold text-slate-900">
                        ₱{totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={onCheckout}
                      className="w-full transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3.5 font-bold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}