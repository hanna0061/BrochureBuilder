import React, { createContext, useState } from 'react';
import Login from '../pages/Login';

export const AuthContext = createContext({ isAuthenticated: false, login: () => {}, logout: () => {} });

export default function AuthGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('isAuthenticated') === 'true';
    } catch (e) {
      return false;
    }
  });

  const login = () => {
    try { sessionStorage.setItem('isAuthenticated', 'true'); } catch (e) {}
    setIsAuthenticated(true);
  };

  const logout = () => {
    try { sessionStorage.removeItem('isAuthenticated'); } catch (e) {}
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
