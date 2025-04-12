"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle scroll events
  useEffect(() => {
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
  }, []);

  const navLinks = [
    { href: '#home', text: 'Home' },
    { href: '#projects', text: 'Projects' },
    { href: '#skills', text: 'Skills' },
    { href: '#experience', text: 'Experience' },
    // { href: '#blog', text: 'Blog' },
    { href: '#education', text: 'Education' },
    { href: '#achievements', text: 'Achievements' },
    { href: '#contact', text: 'Contact' }
  ];
  
  const handleClick = () => {
    setIsOpen(false);
  };

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
                href="/blog" 
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800/40 hover:text-white transition-colors"
              >
                All Posts
              </Link>
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
            href="/blog" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800/60 hover:text-white"
            onClick={handleClick}
          >
            All Posts
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;