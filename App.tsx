import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MapPage from './components/MapPage';
import QAPage from './components/qa/QAPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page - доступна всем */}
        <Route path="/" element={<LandingPage />} />
        {/* Map page - доступна всем */}
        <Route path="/map" element={<MapPage />} />
        {/* Q&A - доступно всем, но с разными возможностями */}
        <Route path="/qa/*" element={<QAPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;