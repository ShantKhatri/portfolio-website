"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, isAdmin, logout, loading } = useAuth();
  
  // New state to handle user display name
  const [userDisplay, setUserDisplay] = useState<string>("Admin");
  
  // Only update the display name on the client side after initial render
  useEffect(() => {
    if (currentUser?.email) {
      setUserDisplay(currentUser.email);
    } else if (Cookies.get('admin_user')) {
      setUserDisplay(Cookies.get('admin_user') || "Admin");
    }
  }, [currentUser]);
  
  const handleLogout = async () => {
    try {
      console.log("Logout button clicked");
      await logout();
      
      // Force clear everything again to be sure
      sessionStorage.removeItem('firebaseToken');
      sessionStorage.clear();
      Cookies.remove('admin_authenticated');
      Cookies.remove('admin_user');
      
      console.log("Logout successful, redirecting to login");
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mounted, setMounted] = useState(false);
  
  const isAdminRoute = pathname?.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  // Handle scroll events - only for public pages
  useEffect(() => {
    if (isAdminRoute || isLoginPage) return;
    
    const handleScroll = () => {
      // Add background when scrolled
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Determine active section
      const sections = ['home', 'projects', 'skills', 'experience', 'blog', 'contact'];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdminRoute, isLoginPage]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: '#home', text: 'Home' },
    { href: '#projects', text: 'Projects' },
    { href: '#skills', text: 'Skills' },
    { href: '#experience', text: 'Experience' },
    { href: '#education', text: 'Education' },
    { href: '#achievements', text: 'Achievements' },
  ];
  
  const handleClick = () => {
    setIsOpen(false);
  };
  // Don't render navbar on login page
  if (isLoginPage) {
    return null;
  }
  
  // Render AdminHeader for admin routes
  if (isAdminRoute) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and links */}
            <div className="flex items-center">
              <Link href="/admin/blog" className="font-bold text-xl">
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  PK Admin
                </span>
              </Link>
              
              <div className="ml-10 hidden md:flex space-x-4">
                <Link 
                  href="/admin/blog" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === '/admin/blog' 
                      ? 'text-white bg-gray-700'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Blog Posts
                </Link>
                <Link
                  href="/admin/messages"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === '/admin/messages' 
                      ? 'text-white bg-gray-700'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Messages
                </Link>
              </div>
            </div>
            
            {/* Right side - User menu */}
            <div className="flex items-center">
              <Link 
                href="/"
                className="mr-4 px-3 py-1.5 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                View Site
              </Link>
              
              {mounted ? (
                <div className="relative">
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center">
                    <span className="mr-2">
                      {currentUser?.email || Cookies.get('admin_user') || "Admin"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md">
                      <button onClick={handleLogout} className="flex items-center w-full px-4 py-2">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-9 w-24 bg-gray-700 rounded-md animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Default: render public navbar
  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl">
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                PK
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map(link => (
                <Link 
                  key={link.text}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === link.href.substring(1)
                      ? 'text-white bg-gradient-to-r from-purple-500/40 to-blue-500/40'
                      : 'text-gray-300 hover:bg-gray-800/40 hover:text-white'
                  }`}
                  onClick={handleClick}
                >
                  {link.text}
                </Link>
              ))}
              <Link 
                href="#contact" 
                className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium text-white
                  bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600
                  transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg
                  shadow-sm shadow-purple-500/20 border border-purple-500/30 flex items-center justify-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
                Contact
              </Link>
              
              {/* Admin link - only visible when authenticated */}
              {isAdmin && (
                <Link 
                  href="/admin/blog" 
                  className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium text-white
                    bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500
                    transition-all duration-300"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-800/60 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out transform ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 backdrop-blur-lg">
          {navLinks.map(link => (
            <Link
              key={link.text}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                activeSection === link.href.substring(1)
                  ? 'bg-gradient-to-r from-purple-500/40 to-blue-500/40 text-white'
                  : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
              }`}
              onClick={handleClick}
            >
              {link.text}
            </Link>
          ))}
          <Link 
            href="#contact" 
            className="block mt-3 mx-1 px-4 py-2.5 rounded-lg text-base font-medium text-white
              bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600
              transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg
              shadow-md shadow-purple-500/20 border border-purple-500/30 flex items-center justify-center"
            onClick={handleClick}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-1.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            Contact Me
          </Link>
          
          {/* Admin link in mobile menu - only visible when authenticated */}
          {isAdmin && (
            <Link 
              href="/admin/blog" 
              className="block mt-3 mx-1 px-4 py-2.5 rounded-lg text-base font-medium text-white
                bg-gradient-to-r from-gray-700 to-gray-600
                transition-all duration-300 ease-in-out"
              onClick={handleClick}
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;