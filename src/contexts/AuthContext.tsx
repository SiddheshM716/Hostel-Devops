import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../lib/api';

interface User {
  id: string | number;
  email?: string;
  role?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, role: string) => Promise<void>;
  signUp: (data: { 
    email: string; 
    password: string; 
    name: string; 
    role: string;
    contact_number: string;
    gender: 'Male' | 'Female' | 'Other';
    date_of_birth: string;
  }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then((data) => {
          setUser({ ...data.user, role: data.role });
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string, role: string) => {
    try {
      const data = await api.post('/auth/signin', { email, password, role });
      localStorage.setItem('token', data.token);
      setUser({ ...data.user, role });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signUp = async (data: { 
    email: string; 
    password: string; 
    name: string; 
    role: string;
    contact_number: string;
    gender: 'Male' | 'Female' | 'Other';
    date_of_birth: string;
  }) => {
    try {
      const resData = await api.post('/auth/signup', data);
      localStorage.setItem('token', resData.token);
      setUser({ ...resData.user, role: data.role });
      return { error: null };
    } catch (error) {
      console.error('Signup process failed:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
 