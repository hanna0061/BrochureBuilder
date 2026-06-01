import React, { createContext, useEffect, useState } from 'react';
import Login from '../pages/Login';

export const AuthContext = createContext({ isAuthenticated: false, login: () => {}, logout: () => {} });

export default function AuthGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('isAuthenticated') === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'isAuthenticated') {
        setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = () => {
    try { localStorage.setItem('isAuthenticated', 'true'); } catch (e) {}
    setIsAuthenticated(true);
  };

  const logout = () => {
    try { localStorage.removeItem('isAuthenticated'); } catch (e) {}
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
