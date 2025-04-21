import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <div>
            <Link href="/" className="inline-block">
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">PK</h3>
            </Link>
            <p className="text-gray-400">
              Machine Learning & Automation Engineer, blending intelligent systems with test automation and full-stack development.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/#home" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#projects" className="text-gray-400 hover:text-white transition-colors">Projects</Link></li>
              <li><Link href="/#skills" className="text-gray-400 hover:text-white transition-colors">Skills</Link></li>
              <li><Link href="/#experience" className="text-gray-400 hover:text-white transition-colors">Experience</Link></li>
              <li><Link href="/#education" className="text-gray-400 hover:text-white transition-colors">Education</Link></li>
              <li><Link href="/#achievements" className="text-gray-400 hover:text-white transition-colors">Achievements</Link></li>
              <li><Link href="/#contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
            <div className="flex space-x-4">
              <Link href="https://github.com/ShantKhatri" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://linkedin.com/in/prashantkumar-khatri" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="https://www.upwork.com/freelancers/~013eb705bbd0af4810" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
                </svg>
                <span className="sr-only">Upwork</span>
              </Link>
              <Link href="mailto:prashantkhatri202@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-6 w-6" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Prashantkumar Khatri. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;