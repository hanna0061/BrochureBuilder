import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrochureProvider } from './context/BrochureContext';
import App from './App';

// Global styles — load order must be preserved
import './styles/variables.css';
import './styles/reset.css';
import './styles/style.css';
import './styles/utilities.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/responsive.css';
// App-specific styles
import './styles/brochure.css';
import './styles/editor.css';
import './styles/app.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrochureProvider>
      <App />
    </BrochureProvider>
  </React.StrictMode>
);
