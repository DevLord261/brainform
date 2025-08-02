"use client";

import {
  authService,
  AuthState,
  LoginCredentials,
  SignupCredentials,
  VerifyOTPCredentials,
} from "@/lib/auth";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
// import type {
//   AuthState,
//   LoginCredentials,
//   SignupCredentials,
//   VerifyOTPCredentials,
// } from "@/lib/auth";
// import { authService } from "@/lib/auth";

interface AuthContextType extends AuthState {
  login: (
    credentials: LoginCredentials,
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    credentials: SignupCredentials,
  ) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (
    credentials: VerifyOTPCredentials,
  ) => Promise<{ success: boolean; error?: string }>;
  resendOTP: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: !!user,
        });
      } catch (error) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const result = await authService.login(credentials);
    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isLoading: false,
        isAuthenticated: true,
      });
    }
    return result;
  };

  const signup = async (credentials: SignupCredentials) => {
    return await authService.signup(credentials);
  };

  const verifyOTP = async (credentials: VerifyOTPCredentials) => {
    const result = await authService.verifyOTP(credentials);
    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isLoading: false,
        isAuthenticated: true,
      });
    }
    return result;
  };

  const resendOTP = async (email: string) => {
    return await authService.resendOTP(email);
  };

  const logout = async () => {
    await authService.logout();
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        verifyOTP,
        resendOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
