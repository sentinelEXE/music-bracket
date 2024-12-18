// src/hooks/useTokenManagement.tsx
import { useState, useEffect, useCallback } from 'react';
import { refreshAccessToken } from '../api/auth';

export const useTokenManagement = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    const isTokenExpired = () => {
      const expiry = localStorage.getItem('token_expiry');
      return expiry ? parseInt(expiry) < new Date().getTime() : true;
    };
  
    const refreshToken = async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const data = await refreshAccessToken(refreshToken);
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('token_expiry', 
            (new Date().getTime() + data.expires_in * 1000).toString()
          );
          return true;
        } catch (error) {
          console.error('Error refreshing token:', error);
          return false;
        }
      }
      return false;
    };
  
    const checkAuthStatus = useCallback(() => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(!isTokenExpired());
    }, []);
  
    // Initial check
    useEffect(() => {
      checkAuthStatus();
    }, [checkAuthStatus]);
  
    // Periodic check
    useEffect(() => {
      const interval = setInterval(checkAuthStatus, 1000 * 60);
      return () => clearInterval(interval);
    }, [checkAuthStatus]);
  
    return { isAuthenticated, checkAuthStatus, refreshToken };
  };