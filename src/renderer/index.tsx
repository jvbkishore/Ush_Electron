// filepath: src/renderer/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the root element from index.html
const rootElement = document.getElementById('app');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement); // React 18+
    root.render(<App />);
} else {
    console.error('Root element not found. Ensure <div id="app"></div> exists in index.html.');
}