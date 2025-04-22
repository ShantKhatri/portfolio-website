"use client"
import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Machine Learning & Automation Engineer';
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative pt-16">
      <div className="text-center z-10 px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          I&apos;m <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Prashantkumar Khatri</span>
        </h1>
        <div className="h-6 mb-6">
          <p className="text-xl">
            {typedText}
            <span className="inline-block w-0.5 h-6 bg-purple-500 ml-1 animate-blink"></span>
          </p>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Blending intelligent systems with test automation and full-stack development. Building reliable, production-ready solutions at the intersection of AI and DevOps.
        </p>
        <div className="flex space-x-4 justify-center mb-10">
          <Link 
            href="/#projects" 
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all"
          >
            View Projects
          </Link>
          <Link 
            href="/#contact" 
            className="px-8 py-3 rounded-full border-2 border-purple-500 hover:bg-purple-500/20 transform hover:scale-105 transition-all"
          >
            Contact Me
          </Link>
        </div>
        <div className="flex justify-center space-x-6">
          <a href="https://github.com/ShantKhatri" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <Github size={24} />
          </a>
          <a href="https://linkedin.com/in/prashantkumar-khatri" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <Linkedin size={24} />
          </a>
          <a href="mailto:prashantkhatri202@gmail.com" className="text-gray-400 hover:text-white transition-colors" aria-label="Email">
            <Mail size={24} />
          </a>
          {/* <a href="/resume.pdf" className="text-gray-400 hover:text-white transition-colors" aria-label="Resume" target="_blank" rel="noopener noreferrer">
            <FileText size={24} />
          </a> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;