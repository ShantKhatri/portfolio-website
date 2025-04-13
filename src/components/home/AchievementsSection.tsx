"use client"
import { useState } from 'react';
import { Award, ExternalLink } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { achievements } from '../../data/achievementsData'; // Updated import path

interface Achievement {
  title: string;
  organization: string;
  year: string;
  description?: string;
  link?: string;
}

const AchievementCard = ({ achievement }: { achievement: Achievement, index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/60 transition-all border border-gray-800/50 hover:border-purple-500/50 ${
        hovered ? 'transform scale-[1.02] shadow-lg shadow-purple-700/20' : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start">
        <div className={`mt-1 mr-4 p-3 rounded-full ${
          hovered ? 'bg-purple-600/30' : 'bg-purple-900/20'
        } transition-colors`}>
          <Award className={`w-8 h-8 ${
            hovered ? 'text-purple-300' : 'text-purple-500'
          } transition-colors`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center">
            <h3 className="text-xl font-bold">{achievement.title}</h3>
            {achievement.link && (
              <a 
                href={achievement.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`ml-2 ${
                  hovered ? 'text-purple-300' : 'text-purple-400'
                } hover:text-purple-200 transition-colors`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          
          <div className="flex flex-wrap items-center mt-1 mb-3">
            <span className="text-gray-300">{achievement.organization}</span>
            <span className="mx-2 text-gray-600">•</span>
            <span className={`${
              hovered ? 'text-purple-300' : 'text-purple-400'
            } transition-colors`}>
              {achievement.year}
            </span>
          </div>
          
          {achievement.description && (
            <p className="text-gray-400 transition-colors">
              {achievement.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const AchievementsSection: React.FC = () => {
  return (
    <section id="achievements" className="py-20 px-8 bg-black/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Achievements & Recognition" 
          subtitle="My contributions to open source and professional accomplishments" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {achievements.map((achievement, index) => (
            <AchievementCard key={index} achievement={achievement} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;