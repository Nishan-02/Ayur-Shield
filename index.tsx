
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

console.log("Searching for root element...");
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Root element NOT found!");
  throw new Error("Could not find root element to mount to");
}
console.log("Root element found:", rootElement);

const root = ReactDOM.createRoot(rootElement!);
console.log("Rendering App...");
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
