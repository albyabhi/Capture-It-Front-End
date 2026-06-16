import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './Store/store';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// ============================================
// FILE: main.jsx
// PURPOSE: Entry point of the React application - where everything starts
// HOW IT WORKS: Finds the HTML element with id="root" and renders the App component inside it.
//   Wraps App with:
//   - React.StrictMode: Helps catch common mistakes during development
//   - Redux Provider: Makes the global state store available to all components
// CONNECTS TO: App.jsx, store.js
// USER IMPACT: When you open the app in browser, this file bootstraps everything you see on screen.
// ============================================
