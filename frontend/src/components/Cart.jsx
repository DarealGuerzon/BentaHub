import React from 'react';

export default function Cart({ cartItems, onRemoveItem, onCheckout }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Cart</h2>
      {cartItems.length === 0 ? <p>No items in cart</p> : (
        <>
          <table border="1" cellPadding="10">
            <thead>
              <tr><th>Name</th><th>Price</th><th>Quantity</th><th>Remove</th></tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td><button onClick={() => onRemoveItem(item._id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total: ₱{total.toFixed(2)}</h3>
          <button onClick={onCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
}
