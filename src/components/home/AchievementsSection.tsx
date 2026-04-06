"use client"
import { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, ExternalLink } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { achievements } from '../../data/achievementsData';
import { useIntersectionObserver } from '@/lib/useIntersectionObserver';
import { soundEngine } from '@/lib/soundEngine';

const AchievementsSection: React.FC = () => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  const [unlockedIndices, setUnlockedIndices] = useState<Set<number>>(new Set());
  const [xpCount, setXpCount] = useState(0);
  const unlockTimeouts = useRef<NodeJS.Timeout[]>([]);
  const hasUnlocked = useRef(false);

  const targetXp = achievements.reduce((sum, a) => {
    return sum + (a.rarity === 'legendary' ? 500 : a.rarity === 'epic' ? 300 : 150);
  }, 0);

  const triggerUnlocks = useCallback(() => {
    if (hasUnlocked.current) return;
    hasUnlocked.current = true;

    achievements.forEach((a, index) => {
      const timeout = setTimeout(() => {
        setUnlockedIndices(prev => new Set(prev).add(index));
        soundEngine.playUnlock();

        // Animate XP
        const xpGain = a.rarity === 'legendary' ? 500 : a.rarity === 'epic' ? 300 : 150;
        let current = 0;
        const step = xpGain / 20;
        const xpInterval = setInterval(() => {
          current += step;
          if (current >= xpGain) {
            clearInterval(xpInterval);
            setXpCount(prev => {
              const newVal = prev + xpGain;
              return Math.min(newVal, targetXp);
            });
          } else {
            setXpCount(prev => prev + step);
          }
        }, 30);
      }, 600 + index * 700);

      unlockTimeouts.current.push(timeout);
    });

    return () => {
      unlockTimeouts.current.forEach(clearTimeout);
    };
  }, [targetXp]);

  useEffect(() => {
    if (isVisible) {
      triggerUnlocks();
    }
  }, [isVisible, triggerUnlocks]);

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return {
          border: 'border-yellow-500/50',
          bg: 'bg-yellow-900/10',
          glow: '0 0 25px rgba(245, 158, 11, 0.15)',
          badge: 'bg-gradient-to-r from-yellow-500 to-amber-500',
          text: 'rarity-legendary',
        };
      case 'epic':
        return {
          border: 'border-purple-500/50',
          bg: 'bg-purple-900/10',
          glow: '0 0 25px rgba(168, 85, 247, 0.15)',
          badge: 'bg-gradient-to-r from-purple-500 to-violet-500',
          text: 'rarity-epic',
        };
      default:
        return {
          border: 'border-blue-500/50',
          bg: 'bg-blue-900/10',
          glow: '0 0 25px rgba(59, 130, 246, 0.15)',
          badge: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          text: 'rarity-rare',
        };
    }
  };

  return (
    <section id="achievements" ref={ref} className="py-20 px-4 sm:px-8 bg-black/30 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Trophy Room"
          subtitle="Achievements unlock as you scroll — watch for the golden bursts"
        />

        {/* XP Counter */}
        <div className={`flex justify-center mb-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-gray-900/60 border border-gray-700/50 backdrop-blur-sm">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <div className="text-center">
              <div className="text-3xl font-bold font-mono bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                {Math.round(xpCount)} XP
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Total Achievement Points</div>
            </div>
            <div className="w-40 h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all duration-300"
                style={{ width: `${(xpCount / targetXp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Achievement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => {
            const isUnlocked = unlockedIndices.has(index);
            const rarityStyle = getRarityStyles(achievement.rarity);

            return (
              <div
                key={index}
                className={`relative rounded-xl p-6 border backdrop-blur-sm transition-all duration-300 ${
                  isUnlocked
                    ? `${rarityStyle.border} ${rarityStyle.bg} achievement-unlocked`
                    : 'border-gray-800/50 bg-gray-900/30 achievement-locked'
                }`}
                style={{
                  boxShadow: isUnlocked ? rarityStyle.glow : 'none',
                }}
              >
                {/* Unlock burst overlay */}
                {isUnlocked && (
                  <div className="absolute inset-0 rounded-xl achievement-glow pointer-events-none" />
                )}

                <div className="flex items-start gap-4">
                  {/* Trophy icon */}
                  <div className={`flex-shrink-0 text-4xl ${
                    isUnlocked ? '' : 'grayscale opacity-40'
                  } transition-all duration-500`}>
                    {achievement.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                      {achievement.link && isUnlocked && (
                        <a
                          href={achievement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-400 text-sm">{achievement.organization}</span>
                      <span className="text-gray-600">·</span>
                      <span className="text-gray-500 text-sm">{achievement.year}</span>
                    </div>

                    {/* Rarity badge */}
                    <span
                      className={`inline-block mt-2 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-white ${
                        isUnlocked ? rarityStyle.badge : 'bg-gray-700'
                      }`}
                    >
                      {achievement.rarity}
                    </span>

                    {achievement.description && isUnlocked && (
                      <p className="text-gray-400 text-sm mt-3 leading-relaxed achievement-text">
                        {achievement.description}
                      </p>
                    )}

                    {/* XP value */}
                    {isUnlocked && (
                      <div className="mt-3 text-xs font-mono text-yellow-400/70 achievement-text">
                        +{achievement.rarity === 'legendary' ? 500 : achievement.rarity === 'epic' ? 300 : 150} XP
                      </div>
                    )}
                  </div>
                </div>

                {/* Locked overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                    <span className="text-gray-600 text-sm font-medium px-4 py-2 rounded-full bg-gray-900/80 border border-gray-700/50">
                      🔒 Scroll to unlock
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;