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
  const { currentUser, isAdmin, logout } = useAuth();
  
  // New state to handle user display name
  const [userDisplay, setUserDisplay] = useState<string>("Admin");
  
  // Only update the display name on the client side after initial render
  useEffect(() => {
    if (currentUser?.email) {
      setUserDisplay(currentUser.email);
      console.log("User display set to:", userDisplay);
    } else if (Cookies.get('admin_user')) {
      setUserDisplay(Cookies.get('admin_user') || "Admin");
    }
  }, [currentUser, userDisplay]);
  
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

  useEffect(() => {
    if (pathname === '/') {
      const params = new URLSearchParams(window.location.search);
      const section = params.get('section');
      
      if (section) {
        const timer = setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            
            window.history.replaceState({}, document.title, '/');
          }
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  const navLinks = [
    { href: '/#home', text: 'Home' },
    { href: '/#projects', text: 'Projects' },
    { href: '/#skills', text: 'Skills' },
    { href: '/blog', text: 'Blog' },
    { href: '/#experience', text: 'Experience' },
    { href: '/#education', text: 'Education' },
  ];
  
  const handleClick = () => {
    setIsOpen(false);
  };
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    setIsOpen(false);
    
    if (href.includes('/#')) {
      const sectionId = href.split('#')[1];
      
      if (pathname === '/' || pathname === '') {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push(`/?section=${sectionId}`);
      }
    } else {
      router.push(href);
    }
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
    className={`fixed top-0 w-full z-50 transition-all duration-300 bg-black/75 backdrop-blur-md ${
      scrolled ? 'shadow-lg bg-black/85 backdrop-blur-lg py-1' : 'py-2'
    }`}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-14">
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
          <div className="flex items-center space-x-1">
            {navLinks.map(link => (
              <Link 
                key={link.text}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  // Check if we're on a blog page first
                  (link.href === '/blog' && pathname?.startsWith('/blog'))
                    ? 'text-white bg-gradient-to-r from-purple-500/40 to-blue-500/40'
                    // Only use activeSection for non-blog pages
                    : (!pathname?.startsWith('/blog') && activeSection === link.href.replace('/#', ''))
                      ? 'text-white bg-gradient-to-r from-purple-500/40 to-blue-500/40'
                      : 'text-gray-300 hover:bg-gray-800/40 hover:text-white'
                }`}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.text}
              </Link>
            ))}
            <Link 
              href="/#contact" 
              className="ml-3 px-4 py-1.5 rounded-md text-sm font-medium text-white
                bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600
                transition-all duration-200 shadow-sm shadow-purple-500/20"
              onClick={(e) => handleNavClick(e, '/#contact')}
            >
              Contact
            </Link>
            
            {/* Admin link - only visible when authenticated */}
            {isAdmin && (
              <Link 
                href="/admin/blog" 
                className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium text-white
                  bg-gray-800 hover:bg-gray-700 transition-all duration-200"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile menu button - Cleaner version */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-800/60 inline-flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/80 focus:outline-none"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <X className="block h-5 w-5" />
            ) : (
              <Menu className="block h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>

    {/* Mobile Navigation - Improved version */}
    <div
      className={`md:hidden transition-all duration-300 ease-in-out transform ${
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}
    >
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
        {navLinks.map(link => (
          <Link
            key={link.text}
            href={link.href}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              // Check if we're on a blog page first
              (link.href === '/blog' && pathname?.startsWith('/blog'))
                ? 'text-white bg-gradient-to-r from-purple-500/40 to-blue-500/40'
                // Only use activeSection for non-blog pages
                : (!pathname?.startsWith('/blog') && activeSection === link.href.replace('/#', ''))
                  ? 'text-white bg-gradient-to-r from-purple-500/40 to-blue-500/40'
                  : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
            }`}
            onClick={(e) => handleNavClick(e, link.href)}
          >
            {link.text}
          </Link>
        ))}
        <Link 
          href="/#contact" 
          className="block mt-3 mx-1 px-4 py-2 rounded-md text-base font-medium text-white
            bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600
            transition-all duration-200"
          onClick={(e) => handleNavClick(e, '/#contact')}
        >
          Contact Me
        </Link>
        
        {/* Admin link in mobile menu */}
        {isAdmin && (
          <Link 
            href="/admin/blog" 
            className="block mt-2 mx-1 px-4 py-2 rounded-md text-base font-medium text-white
              bg-gray-800 hover:bg-gray-700 transition-all duration-200"
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