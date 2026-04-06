"use client"
import { useEffect, useState, useRef, useCallback } from 'react';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { soundEngine } from '@/lib/soundEngine';

import { TerminalLine, COMMANDS, INTRO_SEQUENCE } from '@/data/terminalCommands';

const HeroSection: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [introComplete, setIntroComplete] = useState(false);
  const [isTypingIntro, setIsTypingIntro] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);



  // Auto-scroll terminal
  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);



  // Intro typing sequence
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let idx = 0;

    const typeNextLine = () => {
      if (idx < INTRO_SEQUENCE.length) {
        const line = INTRO_SEQUENCE[idx];
        if (line) {
          setLines(prev => [...prev, line]);
          soundEngine.playType();
        }
        idx++;
        scrollToBottom();
        timeoutId = setTimeout(typeNextLine, idx < 3 ? 400 : 80);
      } else {
        setIsTypingIntro(false);
        setIntroComplete(true);
      }
    };

    timeoutId = setTimeout(typeNextLine, 800);

    return () => clearTimeout(timeoutId);
  }, [scrollToBottom]);

  // Focus terminal on click
  const focusInput = () => {
    if (introComplete) {
      inputRef.current?.focus();
    }
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    // Add the prompt line
    setLines(prev => [...prev, { type: 'prompt', content: `visitor@pk:~$ ${cmd}` }]);
    soundEngine.playClick();

    if (trimmed === 'clear') {
      setLines([]);
      return;
    }

    let response = COMMANDS[trimmed];

    // Dynamic 'echo' support
    if (!response && trimmed.startsWith('echo ')) {
      const parts = trimmed.substring(5).trim();
      response = [{ type: 'output', content: parts }];
    }

    if (response) {
      // Add each line with slight delay effect
      response.forEach((line, i) => {
        setTimeout(() => {
          setLines(prev => [...prev, line]);
          scrollToBottom();
          if (i === 0) soundEngine.playWhoosh();
        }, i * 50);
      });
    } else {
      setLines(prev => [
        ...prev,
        { type: 'error', content: `  Command not found: ${trimmed}. Type "help" for available commands.` },
      ]);
    }

    setTimeout(scrollToBottom, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative pt-16">
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        {/* Terminal Window */}
        <div className="terminal-window" onClick={focusInput}>
          {/* Terminal Header */}
          <div className="terminal-header">
            <div className="terminal-dot bg-red-500/80" />
            <div className="terminal-dot bg-yellow-500/80" />
            <div className="terminal-dot bg-green-500/80" />
            <span className="ml-4 text-sm text-gray-500 font-mono">
              visitor@prashantkhatri.com — bash
            </span>
          </div>

          {/* Terminal Body */}
          <div ref={terminalRef} className="terminal-body scanline-overlay relative">
            {lines.filter(Boolean).map((line, i) => (
              <div key={i} className={`${
                line.type === 'prompt' ? 'terminal-prompt font-bold' :
                line.type === 'system' ? 'terminal-highlight' :
                line.type === 'ascii' ? 'text-purple-400 font-bold' :
                line.type === 'error' ? 'text-red-400' :
                'terminal-output'
              }`}>
                {line.content || '\u00A0'}
              </div>
            ))}

            {/* Input line */}
            {introComplete && (
              <div className="flex items-center mt-1">
                <span className="terminal-prompt mr-2">visitor@pk:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    soundEngine.playType();
                  }}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none outline-none text-white font-mono flex-1 caret-purple-400"
                  autoFocus
                  spellCheck={false}
                  placeholder="type a command..."
                  aria-label="Terminal command input"
                />
                <span className="terminal-cursor inline-block w-2 h-5 bg-purple-400 ml-0.5" />
              </div>
            )}

            {isTypingIntro && (
              <span className="terminal-cursor inline-block w-2 h-5 bg-purple-400" />
            )}
          </div>
        </div>

        {/* CTA Buttons (below terminal) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            href="/#projects"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transform hover:scale-105 transition-all text-white font-medium shadow-lg shadow-purple-500/25"
          >
            Explore Projects ↓
          </Link>
          <Link
            href="/#contact"
            className="px-8 py-3 rounded-full border border-purple-500/50 hover:bg-purple-500/10 transform hover:scale-105 transition-all text-gray-300 hover:text-white"
          >
            Mission Control →
          </Link>
        </div>

        {/* Social links */}
        <div className="flex justify-center space-x-6 mt-6">
          <a href="https://github.com/ShantKhatri" className="text-gray-500 hover:text-purple-400 transition-colors" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <Github size={22} />
          </a>
          <a href="https://linkedin.com/in/prashantkumar-khatri" className="text-gray-500 hover:text-purple-400 transition-colors" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <Linkedin size={22} />
          </a>
          <a href="https://www.upwork.com/freelancers/~013eb705bbd0af4810" className="text-gray-500 hover:text-purple-400 transition-colors" aria-label="Upwork" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={22} />
          </a>
          <a href="mailto:prashantkhatri202@gmail.com" className="text-gray-500 hover:text-purple-400 transition-colors" aria-label="Email">
            <Mail size={22} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;