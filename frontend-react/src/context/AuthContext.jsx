import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('msme_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [business, setBusiness] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('msme_token'));
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const storedToken = localStorage.getItem('msme_token');
    if (!storedToken) {
      setUser(null);
      setBusiness(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res.data) {
        setUser(res.data.user);
        setBusiness(res.data.business);
        localStorage.setItem('msme_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.warn('Failed to fetch profile:', err);
      // If unauthorized, clear session
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('msme_token');
        localStorage.removeItem('msme_user');
        setToken(null);
        setUser(null);
        setBusiness(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { access_token, user: loggedUser } = res.data;
    localStorage.setItem('msme_token', access_token);
    localStorage.setItem('msme_user', JSON.stringify(loggedUser));
    setToken(access_token);
    setUser(loggedUser);
    await refreshProfile();
    return loggedUser;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register({ name, email, password });
    const { access_token, user: newUser } = res.data;
    localStorage.setItem('msme_token', access_token);
    localStorage.setItem('msme_user', JSON.stringify(newUser));
    setToken(access_token);
    setUser(newUser);
    await refreshProfile();
    return newUser;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Continue cleanup regardless
    } finally {
      localStorage.removeItem('msme_token');
      localStorage.removeItem('msme_user');
      setToken(null);
      setUser(null);
      setBusiness(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshProfile,
        setBusiness,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
