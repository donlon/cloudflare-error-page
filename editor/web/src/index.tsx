import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('editor') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);