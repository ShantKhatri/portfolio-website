"use client"
import React, { ReactNode, useEffect, useState } from 'react';
import Footer from './Footer';
import ParticleBackground from '../ui/ParticleBackground';
import ScrollToTop from '../ui/ScrollToTop';
import SoundToggle from '../ui/SoundToggle';
import CustomCursor from '../ui/CustomCursor';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen text-white bg-[#050510]">
      <ParticleBackground />
      <CustomCursor />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
      <SoundToggle />
    </div>
  );
};

export default Layout;