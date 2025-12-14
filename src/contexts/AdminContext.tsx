import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for existing admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('mobile_dwellings_admin');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      // Verify password with the server
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3ab5944d/verify-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setIsAdmin(true);
        localStorage.setItem('mobile_dwellings_admin', 'true');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('mobile_dwellings_admin');
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}