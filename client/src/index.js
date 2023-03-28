import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './components/App/App';
import { AppProviders } from './context/app-providers';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
