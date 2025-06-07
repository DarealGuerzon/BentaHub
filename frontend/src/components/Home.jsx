import React, { useState } from 'react';

export default function Home({ products, cart, onAddToCart, onRemoveFromCart, onCheckout, onDeleteProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleAddToCart = (product) => {
    console.log('=== Home: Adding to cart ===', product);
    onAddToCart({
      ...product,
      productId: product._id,
      quantity: 1,
      price: product.price,
      name: product.name
    });
  };

  const handleRemoveFromCart = (productId) => {
    console.log('=== Home: Removing from cart ===', productId);
    onRemoveFromCart(productId);
  };

  const handleCheckout = () => {
    console.log('=== Home: Initiating checkout ===');
    console.log('Current cart:', cart);
    onCheckout();
  };

  // Debug render
  console.log('=== Home: Rendering ===');
  console.log('Current state:', {
    productsCount: products?.length || 0,
    cartCount: cart?.length || 0,
    searchTerm,
    selectedCategory,
    cart
  });

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = ['all', ...new Set(products?.map(product => product.category || 'uncategorized') || [])];

  const totalAmount = cart?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;

  console.log('=== Home: Rendering main content ===');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Products Section */}
          <div className="flex-grow lg:w-2/3">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">Product List</h1>
                <p className="mt-2 text-slate-600">Browse and add products to your cart</p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : 
                       category === 'uncategorized' ? 'Uncategorized' :
                       category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center shadow-lg">
                <p className="text-lg text-slate-600">No products found</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
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
                          <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="relative mt-5 flex gap-3">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="flex-1 transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this product?')) {
                            onDeleteProduct(product._id);
                          }
                        }}
                        className="transform rounded-lg bg-red-100 px-4 py-2.5 font-semibold text-red-600 shadow-md transition-all duration-200 hover:bg-red-200 hover:shadow-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Section */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-8 overflow-hidden rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Shopping Cart</h2>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                  {cart?.length || 0} items
                </span>
              </div>
              {!cart?.length ? (
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
                    {cart.map((item) => (
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
                            onClick={() => handleRemoveFromCart(item.productId)}
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
                      onClick={handleCheckout}
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