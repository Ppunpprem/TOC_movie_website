import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Ensure this points to the correct path of your App component

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);