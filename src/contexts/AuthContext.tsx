"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Cookies from 'js-cookie';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminState, setAdminState] = useState(false);

  // Check for admin status whenever currentUser or cookies change
  useEffect(() => {
    const checkIsAdmin = () => {
      // Two ways to be admin: Firebase auth user or cookie
      const hasAdminCookie = Cookies.get('admin_authenticated') === 'true';
      const hasUser = currentUser !== null;
      
      console.log("Admin check:", { hasAdminCookie, hasUser, loading });
      
      // Set admin state if either condition is true
      setAdminState(hasAdminCookie || hasUser);
    };
    
    if (!loading) {
      checkIsAdmin();
    }
  }, [currentUser, loading]);

  // Setup auth state listener
  useEffect(() => {
    console.log("Setting up auth listener");
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", !!user);
      setCurrentUser(user);
      
      if (user) {
        // User is signed in - ensure admin cookie is set
        Cookies.set('admin_authenticated', 'true', { expires: 1 });
        Cookies.set('admin_user', user.email || 'admin', { expires: 1 });
        
        // IMPORTANT: Get and store token in sessionStorage
        try {
          const token = await user.getIdToken();
          sessionStorage.setItem('firebaseToken', token);
          console.log("Firebase token stored in auth state change");
        } catch (err) {
          console.error("Failed to get auth token:", err);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      Cookies.remove('admin_authenticated');
      Cookies.remove('admin_user');
      sessionStorage.removeItem('firebaseToken');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Context value
  const value = {
    currentUser,
    isAdmin: adminState,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};