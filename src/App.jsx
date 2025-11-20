import './index.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import AddResource from './pages/AddResource';
import EditResource from './pages/EditResource';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ResourceDetail from './pages/ResourceDetail';  

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agregar" element={<AddResource />} />
          <Route path="/editar/:id" element={<EditResource />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recurso/:id" element={<ResourceDetail />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;