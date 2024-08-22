"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode, useLayoutEffect } from "react";
import jwt from "jsonwebtoken"; // Import jsonwebtoken

interface DecodedToken {
  id: string;
  name: string;
  image: string;
  role: string;
  exp?: number;
}

interface User {
  id: number | null;
  name: string | null;
  image: string | null;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  user: User;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User>({ id: null, name: null, image: null });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useLayoutEffect(() => {
    login(); 
  }, []);

  const login = () => {
    setIsLoading(true); // Set loading to true when starting login

    try {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwt.decode(token) as DecodedToken;
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Token expired
          setIsAuthenticated(false);
          setUser({ id: null, name: null, image: null });
          localStorage.removeItem("token");
        } else {
          // Token valid
          setIsAuthenticated(true);
          setUser({
            id: parseInt(decodedToken.id),
            name: decodedToken.name,
            image: decodedToken.image,
            role: decodedToken.role,
          });
        }
      } else {
        // No token
        setIsAuthenticated(false);
        setUser({ id: null, name: null, image: null });
      }
    } catch (error) {
      console.error('Failed to decode token', error);
      setIsAuthenticated(false);
      setUser({ id: null, name: null, image: null });
    } finally {
      setIsLoading(false); 
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser({ id: null, name: null, image: null });
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, user, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
