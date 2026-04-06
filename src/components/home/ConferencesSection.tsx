"use client"
import { useState } from 'react';
import { MapPin, Plane, Mic, Backpack } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { conferences } from '../../data/conferencesData';
import { useIntersectionObserver } from '@/lib/useIntersectionObserver';
import { soundEngine } from '@/lib/soundEngine';

const ConferencesSection: React.FC = () => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.15 });
  const [activeConf, setActiveConf] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'conference' | 'backpacking'>('all');

  const conferenceEntries = conferences.filter(c => c.type === 'conference');
  const backpackingEntries = conferences.filter(c => c.type === 'backpacking');
  const filtered = filter === 'all' ? conferences : conferences.filter(c => c.type === filter);

  return (
    <section id="conferences" ref={ref} className="py-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Global Passport"
          subtitle={`${conferences.length} countries explored — conferences & backpacking adventures`}
        />

        {/* Filter tabs */}
        <div className={`flex items-center justify-center gap-2 mb-10 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {[
            { key: 'all' as const, label: 'All', count: conferences.length, icon: '🌍' },
            { key: 'conference' as const, label: 'Conferences', count: conferenceEntries.length, icon: '🎤' },
            { key: 'backpacking' as const, label: 'Backpacking', count: backpackingEntries.length, icon: '🎒' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { setFilter(tab.key); soundEngine.playClick(); setActiveConf(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all border ${
                filter === tab.key
                  ? 'bg-purple-500/15 border-purple-500/30 text-white'
                  : 'bg-gray-900/40 border-gray-800/40 text-gray-400 hover:border-gray-700/50 hover:text-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                filter === tab.key ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800/50 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Passport book */}
        <div className={`relative transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="relative rounded-2xl bg-gray-900/40 border border-gray-800/40 backdrop-blur-sm p-6 sm:p-8 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23fff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }} />

            {/* Stamps grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((conf, index) => {
                const isActive = activeConf === index;
                const isConference = conf.type === 'conference';
                const delay = index * 0.12;

                return (
                  <div
                    key={`${conf.title}-${conf.year}`}
                    className={`relative transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: `${delay + 0.3}s` }}
                    onMouseEnter={() => { setActiveConf(index); soundEngine.playHover(); }}
                    onMouseLeave={() => setActiveConf(null)}
                  >
                    <div
                      className={`rounded-xl p-5 border transition-all duration-300 cursor-pointer h-full ${
                        isActive
                          ? 'bg-gray-800/60 border-purple-500/30 shadow-lg shadow-purple-500/5 -translate-y-1'
                          : 'bg-gray-900/30 border-gray-800/30 hover:border-gray-700/40'
                      }`}
                    >
                      {/* Type badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider ${
                          isConference
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {isConference ? <Mic className="w-3 h-3" /> : <Backpack className="w-3 h-3" />}
                          {conf.type}
                        </div>
                        <span className="text-xs font-mono text-gray-500">{conf.year}</span>
                      </div>

                      {/* Flag + title */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl" role="img" aria-label={conf.country}>
                          {conf.icon}
                        </span>
                        <div>
                          <h3 className="font-bold text-white text-base">{conf.title}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {conf.location}
                          </div>
                        </div>
                      </div>

                      {/* Description — revealed on hover */}
                      <div className={`overflow-hidden transition-all duration-400 ${
                        isActive ? 'max-h-32 opacity-100 mt-3' : 'max-h-0 opacity-0'
                      }`}>
                        <p className="text-sm text-gray-400 leading-relaxed border-t border-gray-700/30 pt-3">
                          {conf.description}
                        </p>
                      </div>

                      {/* Verified stamp */}
                      <div className={`mt-3 flex items-center gap-1.5 text-[10px] font-mono transition-colors ${
                        isActive ? 'text-green-400' : 'text-gray-600'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? 'bg-green-400' : 'bg-gray-600'
                        }`} />
                        VERIFIED ✓
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Flight path */}
            <div className="mt-8 flex items-center justify-center gap-2 text-gray-600 text-xs flex-wrap">
              <Plane className="w-3 h-3 text-purple-500" />
              <span>🇮🇳 India</span>
              {conferences.map((c, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="text-gray-700">→</span>
                  <span>{c.icon} {c.country}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConferencesSection;
