"use client"
import React, { ReactNode, useEffect, useState } from 'react';
import Footer from './Footer';
import ParticleBackground from '../ui/ParticleBackground';
import ScrollToTop from '../ui/ScrollToTop';


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isMounted, setIsMounted] = useState(false);
  
    useEffect(() => {
      setIsMounted(true);
    }, []);
  
    // This prevents hydration errors by waiting until client-side
    if (!isMounted) {
      return null; // Or a simple loading indicator
    }
  return (
    <div className="min-h-screen text-white bg-black">
      <ParticleBackground />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Layout;