import React from 'react';
import ReactDOM from 'react-dom/client';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'; 

// Import custom global CSS (for footer, etc.)
import './index.css'; 

// Import the main App component (your router)
import App from './App';

// Find the 'root' div in your public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your entire App component into that div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);