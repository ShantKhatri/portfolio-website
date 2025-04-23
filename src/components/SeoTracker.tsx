'use client';

import { useEffect } from 'react';

interface SeoTrackerProps {
  slug: string;
  title: string;
}

declare global {
    interface Window {
      gtag: (
        command: 'event' | 'config' | 'set' | 'js',
        action: string,
        params?: { [key: string]: string | number | boolean }
      ) => void;
    }
  }
  
  export {};

export default function SeoTracker({ slug, title }: SeoTrackerProps) {
  useEffect(() => {
    // Track page view timing for Core Web Vitals
    const trackTiming = () => {
      if (window.performance) {
        // Get performance entries
        const paintMetrics = performance.getEntriesByType('paint');
        const navigationMetrics = performance.getEntriesByType('navigation');
        
        // Log these metrics (or send to your analytics service)
        console.log('SEO Performance:', { slug, title, paintMetrics, navigationMetrics });
        
        // Send data to your analytics service here
        // Example: if you're using Google Analytics 4
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'page_view', {
            page_title: title,
            page_location: `https://prashantkhatri.com/blog/${slug}`,
            page_path: `/blog/${slug}`,
            send_to: 'G-YOURGAID' // Replace with your actual GA4 measurement ID
          });
        }
      }
    };
    
    // Run after page has fully loaded
    if (document.readyState === 'complete') {
      trackTiming();
    } else {
      window.addEventListener('load', trackTiming);
      return () => window.removeEventListener('load', trackTiming);
    }
  }, [slug, title]);
  
  return null; // This component doesn't render anything
}