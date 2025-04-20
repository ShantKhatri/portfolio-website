"use client"
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simple static authentication
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Set authentication cookie (expires in 24 hours)
        Cookies.set('admin_authenticated', 'true', { expires: 1 });
        Cookies.set('admin_user', username, { expires: 1 });
        
        // Redirect to admin dashboard
        router.push('/admin/blog');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
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
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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