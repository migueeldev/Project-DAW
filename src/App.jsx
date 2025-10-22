/*import './index.css'
import React from 'react';
import Home from './pages/Home';

function App() {
  return <Home />;
}

export default App; */

import './index.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import AddResource from './pages/AddResource';
import Login from './pages/Login';
import ResourceDetail from './pages/ResourceDetail';  // ← Agregar esta línea

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agregar" element={<AddResource />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recurso/:id" element={<ResourceDetail />} />  {/* ← Agregar esta línea */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;