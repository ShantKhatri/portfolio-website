"use client"
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Cookies from 'js-cookie';

const AdminHeader = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const username = Cookies.get('admin_user') || 'Admin';

  const handleLogout = () => {
    // Remove auth cookies
    Cookies.remove('admin_authenticated');
    Cookies.remove('admin_user');
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/blog" className="text-xl font-bold text-white">
              Admin Dashboard
            </Link>
            
            <nav className="ml-10 hidden md:flex space-x-4">
              <Link 
                href="/admin/blog" 
                className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-gray-700"
              >
                Blog Posts
              </Link>
              <Link 
                href="/admin/messages" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Messages
              </Link>
            </nav>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center text-sm px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 focus:outline-none"
            >
              <span className="mr-2">{username}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 py-1 bg-gray-700 rounded-md shadow-lg z-10">
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;