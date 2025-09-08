import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import RedirectPage from './RedirectPage';
import StatsPage from './StatsPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/r/:shortcode" element={<RedirectPage />} />
        <Route path="/stats/:shortcode" element={<StatsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
