"use client"
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import Cookies from 'js-cookie';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// Define Firebase error type with code property
interface FirebaseError extends Error {
  code?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { currentUser, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<FirebaseError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAdmin) {
      router.push('/admin/blog');
    }
  }, [isAdmin, router, currentUser]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // First try Firebase Auth
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
        const token = await userCredential.user.getIdToken();
        sessionStorage.setItem('firebaseToken', token);
        
        Cookies.set('admin_authenticated', 'true', { expires: 1 });
        Cookies.set('admin_user', userCredential.user.email || 'admin', { expires: 1 });
        
        console.log("Login successful - redirecting");
        router.push('/admin/blog');
        return;
      } catch (error: unknown) {
        console.log("Firebase auth failed, trying fallback", error);
        const firebaseError = error as FirebaseError;
        if (firebaseError.code === 'auth/user-not-found' || 
            firebaseError.code === 'auth/wrong-password') {
        } else {
          setError(firebaseError);
          setIsLoading(false);
          return;
        }
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-purple-900/20 mb-4">
            <Lock className="h-8 w-8 text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-400 mt-2">Enter your credentials to access admin area</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error.code}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              Back to <Link href="/" className="text-purple-400 hover:text-purple-300">website</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;