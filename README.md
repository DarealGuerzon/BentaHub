# Simple MERN POS

A simple Point of Sale (POS) system built with the MERN stack (MongoDB, Express, React, Node.js).

---

## Features

- Product inventory management
- Add products to cart
- Checkout and save sales
- Update product stock
- Delete products
- View sales reports

---

## Project Structure
── backend/
│ ├── models/ # Mongoose models for Product and Sale
│ ├── routes/ # Express routes for products and sales
│ ├── controllers/ # Controller logic for product and sale operations
│ ├── server.js # Express server setup
│ └── .env # Environment variables (not included in repo)
├── frontend/
│ ├── public/ # React public files (index.html)
│ ├── src/
│ │ ├── components/ # React components (Home, Inventory, Cart, etc.)
│ │ ├── App.jsx # Main React app component
│ │ ├── index.js # React entry point
│ │ └── styles.css # CSS styles
└── README.md # Project documentation

Important Notes
Make sure your .env file is NOT committed to the repository.

node_modules folders are ignored in Git.

This is a simple demo project; for production, add authentication and security.
