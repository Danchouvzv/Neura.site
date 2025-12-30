
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Starting application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log('Root element found, creating root...');

const root = ReactDOM.createRoot(rootElement);

console.log('Rendering App component...');

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
  rootElement.innerHTML = `
    <div style="color: white; padding: 20px; font-family: monospace;">
      <h1>Error loading application</h1>
      <pre>${error instanceof Error ? error.message : String(error)}</pre>
      <pre>${error instanceof Error ? error.stack : ''}</pre>
    </div>
  `;
}
