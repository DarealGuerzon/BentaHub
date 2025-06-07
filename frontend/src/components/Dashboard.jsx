// Dashboard.js
import React from 'react';
import { supabase } from './services/supabaseClient'; // Make sure path is correct

// Assuming your sidebar is part of this dashboard layout
// Or you can create a separate Sidebar component and include it here
import Sidebar from './Sidebar'; // You'll need to create this component if it's separate

export default function Dashboard() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}> {/* Overall container for the dashboard */}
      {/* Sidebar - Make sure your sidebar styles are here or in Sidebar.js */}
      <div style={{
          width: '250px', // Fixed width for sidebar
          backgroundColor: '#2c3e50', // Dark background for sidebar
          color: '#ecf0f1',
          padding: '20px',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // Center sidebar content horizontally
          // Other sidebar styles to match your image
      }}>
          <h2 style={{ color: '#fff', marginBottom: '30px' }}>BentaHub</h2>
          <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
              <li style={{ marginBottom: '15px' }}><a href="#" style={{ color: '#ecf0f1', textDecoration: 'none', display: 'block', padding: '10px 0' }}>Home</a></li>
              <li style={{ marginBottom: '15px' }}><a href="#" style={{ color: '#ecf0f1', textDecoration: 'none', display: 'block', padding: '10px 0' }}>Inventory</a></li>
              <li style={{ marginBottom: '15px' }}><a href="#" style={{ color: '#ecf0f1', textDecoration: 'none', display: 'block', padding: '10px 0' }}>Add Product</a></li>
              <li style={{ marginBottom: '15px' }}><a href="#" style={{ color: '#ecf0f1', textDecoration: 'none', display: 'block', padding: '10px 0' }}>Sales Report</a></li>
          </ul>
          <button
              onClick={handleLogout}
              style={{
                  marginTop: 'auto', // Pushes button to the bottom of the flex container
                  background: '#e74c3c', // Red logout button
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
              }}
          >
              Logout
          </button>
      </div>

      {/* Main content area (the large white space) */}
      <div style={{
          flexGrow: 1, // Takes up remaining space
          padding: '20px',
          backgroundColor: '#fff', // White background
          borderRadius: '8px',
          margin: '20px', // Some margin around the white content area
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
          {/* Content for your dashboard will go here */}
          <h1>Welcome to your Dashboard!</h1>
          <p>This is where your main application content will be displayed.</p>
      </div>
    </div>
  );
}