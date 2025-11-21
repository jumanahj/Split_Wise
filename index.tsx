import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// FIX: Replaced invalid placeholder content with the standard React entry point.
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);