'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {app} from '@/lib/firebase-client';
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const auth = getAuth(app);
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
        // Set auth cookie when user signs in
        user.getIdToken().then((token) => {
          Cookies.set('auth-token', token, { secure: true, sameSite: 'strict' });
        });
      } else {
        // User is signed out
        setUser(null);
        // Remove auth cookie when user signs out
        Cookies.remove('auth-token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);