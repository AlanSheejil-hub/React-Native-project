import React, { createContext, useContext, useState } from 'react';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import storage from '@/app/service/storage';

type AuthContextType = {
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = async (username: string, password: string) => {
    try {
      const formBody = new URLSearchParams();
      formBody.append('grant_type', 'password');
      formBody.append('username', username);
      formBody.append('password', password);
      const res = await fetch('http://app.acecms.in/Token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });
      const data = await res.json();
      if (data.access_token) {
        storage.storeToken(data.access_token);
        setIsAuthenticated(true);
        router.push('/(app)/(drawer)/dashboard');
        return true;
      } else {
        Alert.alert('Error', 'Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const signOut = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel', // Cancel button
          style: 'cancel',
        },
        {
          text: 'Logout', // Logout button
          onPress: () => {
            setIsAuthenticated(false);
            router.replace('/(auth)/login');
          },
        },
      ],
      { cancelable: true } // Allow tapping outside the alert to cancel
    );
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
