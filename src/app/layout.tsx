import type { Metadata } from "next";
import { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import "./globals.css";
import JsonLd from '../components/JsonLd';
import { AuthProvider } from '@/contexts/AuthContext';
import { inter, playfair } from './fonts';

export const metadata: Metadata = {
  title: 'Prashantkumar Khatri | Full Stack & ML Automation Engineer',
  description: 'Experienced Full Stack Developer specializing in Machine Learning, Test Automation, CI/CD pipelines, and Cloud Architecture with expertise in React, TypeScript, and Next.js',
  keywords: [
    // Core Professional Keywords (High Search Volume)
    'full stack developer', 'machine learning engineer', 'automation expert', 
    'software engineer', 'AI developer', 'tech lead',

    // Framework & Technology Keywords (Trending)
    'react developer', 'typescript developer', 'next.js expert',
    'node.js specialist', 'python developer', 'generative AI engineer',
    'large language models', 'LLM integration', 'ChatGPT API expert',
    
    // Specialized Technical Skills (Rising Searches)
    'test automation', 'CI/CD pipeline expert', 'API integration specialist',
    'cloud architecture', 'devops engineer', 'mlops specialist',
    'kubernetes expert', 'docker specialist', 'microservices architect',
    
    // Emerging Tech Trends (High Growth Keywords)
    'AI application development', 'machine learning integration',
    'GenAI solutions', 'AI-powered web apps', 'LLM fine-tuning specialist',
    'vector database implementation', 'RAG systems developer',
    
    // Industry-Specific Keywords
    'enterprise software developer', 'fintech developer',
    'healthtech solutions architect', 'saas developer', 'edtech specialist',
    
    // Problem-Solving Keywords (Long Tail)
    'custom AI solution developer', 'automated testing framework developer',
    'full stack AI integration expert', 'end-to-end ML pipeline architect',
    'production ML systems developer', 'AI workflow automation specialist',
    
    // Technical Ecosystem Keywords
    'aws certified developer', 'azure cloud expert', 'google cloud platform',
    'jest testing expert', 'cypress automation developer', 'github actions specialist',
    'vercel deployment expert', 'mongodb developer', 'postgresql specialist',
    
    // Cutting-Edge Technologies (Future-Proofing)
    'web3 developer', 'blockchain integration', 'IoT systems architect',
    'AI agent developer', 'multimodal AI specialist', 'computer vision engineer'
  ],
  metadataBase: new URL('https://prashantkhatri.com'),
  alternates: {
    canonical: '/',
  },
  creator: 'Prashantkumar Khatri',
  authors: [{ name: 'Prashantkumar Khatri' }],
  category: 'Technology',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://prashantkhatri.com',
    siteName: 'Prashantkumar Khatri | Full Stack & ML Automation Engineer',
    title: 'Prashantkumar Khatri | Full Stack & ML Automation Engineer',
    description: 'Experienced Full Stack Developer specializing in Machine Learning, Test Automation, CI/CD pipelines, and Cloud Architecture with expertise in React, TypeScript, and Next.js',
    images: [
      {
        url: 'https://prashantkhatri.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Prashantkumar Khatri - Full Stack & ML Automation Engineer',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prashantkumar Khatri | Full Stack & ML Automation Engineer',
    description: 'Experienced Full Stack Developer specializing in Machine Learning, Test Automation, CI/CD pipelines, and Cloud Architecture',
    images: ['https://prashantkhatri.com'],
  },
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
    other: [{ rel: 'manifest', url: '/site.webmanifest' }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head />
      <body className="font-sans">
        <JsonLd />
        <Navbar />
        <AuthProvider>
          <main className="relative z-10">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
