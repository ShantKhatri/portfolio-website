"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, LogOut, ChevronDown, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { soundEngine } from '@/lib/soundEngine';
import Cookies from 'js-cookie';

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mounted, setMounted] = useState(false);

  const [xpLevel] = useState(42); // Easter egg level

  const isAdminRoute = pathname?.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    // Keep for admin display
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.removeItem('firebaseToken');
      sessionStorage.clear();
      Cookies.remove('admin_authenticated');
      Cookies.remove('admin_user');
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (isAdminRoute || isLoginPage) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['home', 'projects', 'skills', 'experience', 'education', 'achievements', 'conferences', 'contact'];
      for (const section of [...sections].reverse()) {
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

  useEffect(() => { setMounted(true); }, []);

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
    { href: '/#home', text: 'Home', icon: '⌂' },
    { href: '/#projects', text: 'Projects', icon: '◆' },
    { href: '/#skills', text: 'Skills', icon: '★' },
    { href: '/#experience', text: 'XP Log', icon: '⚡' },
    { href: '/#achievements', text: 'Trophies', icon: '🏆' },
    { href: '/#conferences', text: 'Passport', icon: '✈' },
    { href: '/blog', text: 'Blog', icon: '✎' },
  ];

  const handleClick = () => setIsOpen(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    soundEngine.playHover();
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

  if (isLoginPage) return null;

  // Admin navbar (unchanged)
  if (isAdminRoute) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/blog" className="font-bold text-xl">
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">PK Admin</span>
              </Link>
              <div className="ml-10 hidden md:flex space-x-4">
                <Link href="/admin/blog" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/admin/blog' ? 'text-white bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Blog Posts</Link>
                <Link href="/admin/messages" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === '/admin/messages' ? 'text-white bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>Messages</Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/" className="mr-4 px-3 py-1.5 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">View Site</Link>
              {mounted ? (
                <div className="relative">
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center">
                    <span className="mr-2">{currentUser?.email || Cookies.get('admin_user') || "Admin"}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md">
                      <button onClick={handleLogout} className="flex items-center w-full px-4 py-2">
                        <LogOut className="h-4 w-4 mr-2" />Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-9 w-24 bg-gray-700 rounded-md animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Public gamified navbar
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled
        ? 'py-0 bg-gray-950/90 backdrop-blur-xl border-b border-purple-500/10 shadow-lg shadow-purple-500/5'
        : 'py-1 bg-transparent'
    }`}>
      {/* Top accent line — animated gradient */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo with level badge */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="font-bold text-lg relative group" onClick={() => soundEngine.playClick()}>
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] group-hover:animate-[holoShimmer_2s_ease-in-out_infinite]">
                PK
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
              <Gamepad2 className="w-3 h-3 text-purple-400" />
              <span className="text-[10px] font-mono text-purple-400">LVL {xpLevel}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(link => {
              const isActive = (link.href === '/blog' && pathname?.startsWith('/blog'))
                || (!pathname?.startsWith('/blog') && activeSection === link.href.replace('/#', ''));

              return (
                <Link
                  key={link.text}
                  href={link.href}
                  className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 group ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  onMouseEnter={() => soundEngine.playHover()}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30" />
                  )}
                  <span className="relative z-10 flex items-center gap-1">
                    <span className={`text-[10px] transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100 opacity-50 group-hover:opacity-80'}`}>
                      {link.icon}
                    </span>
                    {link.text}
                  </span>
                </Link>
              );
            })}

            {/* Contact CTA */}
            <Link
              href="/#contact"
              className="ml-2 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-500 hover:to-cyan-500 transition-all duration-200 border border-purple-500/20 hover:shadow-md hover:shadow-purple-500/10"
              onClick={(e) => handleNavClick(e, '/#contact')}
            >
              📡 Contact
            </Link>



            {/* Admin link */}
            {isAdmin && (
              <Link
                href="/admin/blog"
                className="ml-1 px-2 py-1 rounded-md text-[10px] font-mono text-gray-500 bg-gray-800/50 hover:text-white hover:bg-gray-700 transition-all"
              >
                ADMIN
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => { setIsOpen(!isOpen); soundEngine.playClick(); }}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-3 pt-2 pb-3 space-y-1 bg-gray-950/95 backdrop-blur-xl border-t border-purple-500/10">
          {navLinks.map(link => {
            const isActive = (link.href === '/blog' && pathname?.startsWith('/blog'))
              || (!pathname?.startsWith('/blog') && activeSection === link.href.replace('/#', ''));
            return (
              <Link
                key={link.text}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/20'
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                }`}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                <span className="text-xs">{link.icon}</span>
                {link.text}
              </Link>
            );
          })}
          <Link
            href="/#contact"
            className="flex items-center gap-2 mt-2 mx-1 px-3 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-purple-600/80 to-cyan-600/80 border border-purple-500/20"
            onClick={(e) => handleNavClick(e, '/#contact')}
          >
            📡 Mission Control
          </Link>
          {isAdmin && (
            <Link href="/admin/blog" className="block mt-2 mx-1 px-3 py-2 rounded-md text-sm text-gray-400 bg-gray-800 hover:text-white" onClick={handleClick}>
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;