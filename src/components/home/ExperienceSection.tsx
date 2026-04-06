"use client"
import { useState, useRef, useEffect } from 'react';
import { Terminal, ChevronRight, Zap, Clock, Briefcase } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { experiences } from '@/data/experienceData';
import { useIntersectionObserver } from '@/lib/useIntersectionObserver';
import { soundEngine } from '@/lib/soundEngine';

const ExperienceSection: React.FC = () => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.05 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [glitchText, setGlitchText] = useState('');
  const xpBarRef = useRef<HTMLDivElement>(null);

  const activeExp = experiences[activeIndex];

  // Typing/glitch effect for company name
  useEffect(() => {
    if (!isVisible || !activeExp) return;
    const target = activeExp.company;
    let i = 0;
    setGlitchText('');
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const interval = setInterval(() => {
      if (i <= target.length) {
        const resolved = target.slice(0, i);
        const scrambled = Array.from({ length: Math.min(3, target.length - i) }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join('');
        setGlitchText(resolved + scrambled);
        i++;
      } else {
        clearInterval(interval);
        setGlitchText(target);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [activeIndex, isVisible, activeExp]);

  // Calculate total XP
  const totalXP = experiences.length * 500;
  const currentXP = (activeIndex + 1) * 500;
  const xpPercent = (currentXP / totalXP) * 100;

  return (
    <section id="experience" ref={ref} className="py-20 px-4 sm:px-8 bg-black/20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="XP Log"
          subtitle="Select a mission entry to decrypt the details"
        />

        {/* XP Header Bar */}
        <div className={`flex items-center justify-between mb-10 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800/50">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-mono text-yellow-400">{currentXP} / {totalXP} XP</span>
            </div>
            <div className="flex-1 h-2 bg-gray-800/50 rounded-full overflow-hidden max-w-xs" ref={xpBarRef}>
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400 rounded-full transition-all duration-700"
                style={{ width: isVisible ? `${xpPercent}%` : '0%' }}
              />
            </div>
            <span className="text-xs text-gray-500 font-mono">{experiences.length} missions</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Mission Selector — vertical tabs */}
          <div className={`lg:col-span-4 space-y-2 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            {experiences.map((exp, index) => {
              const isActive = activeIndex === index;
              const isHovered = hoveredIndex === index;

              return (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                    soundEngine.playClick();
                  }}
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    soundEngine.playHover();
                  }}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? 'bg-gray-800/70 border-purple-500/40 shadow-lg shadow-purple-500/5'
                      : isHovered
                        ? 'bg-gray-800/40 border-gray-700/50'
                        : 'bg-gray-900/30 border-gray-800/30 hover:border-gray-700/40'
                  }`}
                >
                  {/* Active border glow */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-l-xl" />
                  )}

                  <div className="flex items-center gap-3">
                    {/* Status indicator */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                      isActive
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-gray-800/60 text-gray-500 group-hover:text-gray-400'
                    }`}>
                      <span className="text-xs font-mono font-bold">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium truncate transition-colors ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                      }`}>
                        {exp.title}
                      </h4>
                      <p className={`text-xs truncate mt-0.5 ${
                        isActive ? 'text-purple-400' : 'text-gray-600'
                      }`}>
                        {exp.company}
                      </p>
                    </div>

                    <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-all ${
                      isActive ? 'text-purple-400 translate-x-0' : 'text-gray-600 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Mission Details Panel */}
          <div className={`lg:col-span-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="rounded-xl bg-gray-900/50 border border-gray-800/50 backdrop-blur-sm overflow-hidden h-full">
              {/* Panel header — terminal style */}
              <div className="flex items-center gap-3 px-5 py-3 bg-gray-800/30 border-b border-gray-800/50">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3 h-3" />
                  mission_log_{String(activeIndex + 1).padStart(2, '0')}.dat
                </span>
              </div>

              {/* Panel content */}
              <div className="p-6">
                {/* Company with glitch effect */}
                <div className="mb-1">
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-wider">
                    {glitchText || activeExp?.company}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">{activeExp?.title}</h3>

                {/* Period & meta */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    {activeExp?.period}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Briefcase className="w-3.5 h-3.5" />
                    Mission #{String(activeIndex + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Tech stack */}
                {activeExp?.tech && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {activeExp.tech.map(t => (
                      <span
                        key={t}
                        className="text-xs px-3 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Mission objectives — bullet points with terminal feel */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                    &gt; Mission Objectives
                  </h4>
                  {activeExp?.description.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-3 group/item"
                      style={{
                        animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both`,
                      }}
                    >
                      <div className="w-5 h-5 rounded flex items-center justify-center bg-green-500/10 border border-green-500/20 flex-shrink-0 mt-0.5">
                        <span className="text-[10px] text-green-400 font-mono">✓</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>

                {/* XP earned for this mission */}
                <div className="mt-6 pt-4 border-t border-gray-800/50 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500">Mission complete</span>
                  <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/20">
                    +500 XP earned
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;