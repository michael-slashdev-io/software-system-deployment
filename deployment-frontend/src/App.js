import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ClientsList from './components/ClientsList';
import PackagesList from './components/PackagesList';
import DeploymentsList from './components/DeploymentsList';
import NewDeployment from './components/NewDeployment';

// Services
import apiService from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (has token)
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (username, password) => {
    try {
      await apiService.login(username, password);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <div className="container mt-4">
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? (
                  <Dashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/clients" 
              element={
                isAuthenticated ? (
                  <ClientsList />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/packages" 
              element={
                isAuthenticated ? (
                  <PackagesList />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/deployments" 
              element={
                isAuthenticated ? (
                  <DeploymentsList />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route 
              path="/new-deployment" 
              element={
                isAuthenticated ? (
                  <NewDeployment />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;