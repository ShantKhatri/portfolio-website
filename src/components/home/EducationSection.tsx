"use client"
import { useState } from 'react';
import { GraduationCap, Star, ChevronDown, Lock, Unlock, Cpu, BookOpen } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { education } from '../../data/educationData';
import { useIntersectionObserver } from '@/lib/useIntersectionObserver';
import { soundEngine } from '@/lib/soundEngine';

const coursesMap: Record<string, { name: string; mastered: boolean }[]> = {
  'PG Certificate in Data Science & AI': [
    { name: 'Advanced Machine Learning', mastered: true },
    { name: 'Deep Learning & Neural Nets', mastered: true },
    { name: 'Natural Language Processing', mastered: true },
    { name: 'Computer Vision', mastered: true },
    { name: 'Big Data Analytics', mastered: true },
    { name: 'Statistical Modelling', mastered: true },
  ],
  'B.Tech in Computer Engineering': [
    { name: 'Data Structures & Algorithms', mastered: true },
    { name: 'Algorithm Design & Analysis', mastered: true },
    { name: 'Machine Learning', mastered: true },
    { name: 'Software Engineering', mastered: true },
    { name: 'Operating Systems', mastered: true },
    { name: 'Database Management', mastered: true },
    { name: 'OOP & Design Patterns', mastered: true },
    { name: 'Computer Architecture', mastered: true },
    { name: 'Computer Networks', mastered: true },
  ],
};

const EducationSection: React.FC = () => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.15 });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [unlockedCourses, setUnlockedCourses] = useState<Set<string>>(new Set());

  const handleCourseClick = (courseName: string) => {
    if (!unlockedCourses.has(courseName)) {
      setUnlockedCourses(prev => new Set(prev).add(courseName));
      soundEngine.playUnlock();
    }
  };

  const totalCourses = Object.values(coursesMap).flat().length;
  const unlocked = unlockedCourses.size;

  return (
    <section id="education" ref={ref} className="py-20 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="Skill Tree"
          subtitle="Click degree nodes to expand — unlock courses by clicking them"
        />

        {/* Progress bar */}
        <div className={`flex items-center justify-center mb-10 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-900/50 border border-gray-800/50">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-gray-400">Knowledge</span>
            <div className="w-32 h-2 bg-gray-800/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${totalCourses > 0 ? (unlocked / totalCourses) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs font-mono text-cyan-400">{unlocked}/{totalCourses}</span>
          </div>
        </div>

        {/* Education cards as interactive tech tree nodes */}
        <div className="space-y-6">
          {education.map((edu, index) => {
            const isExpanded = expandedIndex === index;
            const courses = coursesMap[edu.degree] || [];
            const cgpaPercentage = (parseFloat(edu.cgpa) / 10) * 100;
            const eduUnlocked = courses.filter(c => unlockedCourses.has(c.name)).length;
            const delay = index * 0.2;

            return (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${delay}s` }}
              >
                <div
                  className={`rounded-xl overflow-hidden transition-all duration-500 border ${
                    isExpanded
                      ? 'bg-gray-800/60 border-purple-500/30 shadow-xl shadow-purple-500/5'
                      : 'bg-gray-900/40 border-gray-800/40 hover:border-gray-700/50 hover:bg-gray-900/50'
                  } backdrop-blur-sm`}
                >
                  {/* Top colored accent */}
                  <div className={`h-1 transition-all duration-500 ${
                    isExpanded
                      ? 'bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500'
                      : 'bg-gradient-to-r from-purple-500/30 to-cyan-500/30'
                  }`} />

                  {/* Header (clickable) */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => {
                      setExpandedIndex(isExpanded ? null : index);
                      soundEngine.playClick();
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Degree icon */}
                      <div className={`p-3 rounded-xl transition-all duration-300 flex-shrink-0 ${
                        isExpanded
                          ? 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20'
                          : 'bg-gray-800/50'
                      }`}>
                        <GraduationCap className={`w-6 h-6 transition-colors ${
                          isExpanded ? 'text-purple-300' : 'text-gray-500'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`} />
                        </div>

                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-purple-400 text-sm">{edu.institution}</span>
                          <span className="text-gray-600 text-sm">·</span>
                          <span className="text-gray-500 text-sm">{edu.period}</span>
                        </div>

                        {/* XP bar and CGPA */}
                        <div className="mt-4 flex items-center gap-4 flex-wrap">
                          <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400" />
                                CGPA: {edu.cgpa}
                              </span>
                              <span className="text-[11px] font-mono text-purple-400">
                                {Math.round(cgpaPercentage)}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-800/60 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-1500"
                                style={{
                                  width: isVisible ? `${cgpaPercentage}%` : '0%',
                                  background: 'linear-gradient(90deg, #a855f7, #06b6d4)',
                                  transitionDelay: `${delay + 0.3}s`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Course unlock status */}
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/40">
                            <Cpu className="w-3 h-3 text-cyan-400" />
                            <span className="text-[11px] font-mono text-gray-400">
                              {eduUnlocked}/{courses.length} courses
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded courses tech tree */}
                  <div className={`overflow-hidden transition-all duration-500 ${
                    isExpanded ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-700/30 pt-5">
                        <h5 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <span className="w-4 h-[1px] bg-gray-700" />
                          Skill Nodes
                          <span className="flex-1 h-[1px] bg-gray-700/50" />
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {courses.map((course, i) => {
                            const isUnlocked = unlockedCourses.has(course.name);
                            return (
                              <button
                                key={i}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCourseClick(course.name);
                                }}
                                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all duration-300 group/course ${
                                  isUnlocked
                                    ? 'bg-purple-500/10 border-purple-500/25 hover:bg-purple-500/15'
                                    : 'bg-gray-800/30 border-gray-700/20 hover:border-purple-500/30 hover:bg-gray-800/50'
                                }`}
                                style={{
                                  animation: isExpanded ? `fadeInUp 0.3s ease-out ${i * 0.04}s both` : 'none',
                                }}
                              >
                                <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                                  isUnlocked
                                    ? 'bg-purple-500/20 text-purple-400'
                                    : 'bg-gray-700/30 text-gray-600 group-hover/course:text-gray-400'
                                }`}>
                                  {isUnlocked
                                    ? <Unlock className="w-3 h-3" />
                                    : <Lock className="w-3 h-3" />
                                  }
                                </div>
                                <span className={`text-xs transition-colors ${
                                  isUnlocked ? 'text-purple-200' : 'text-gray-400 group-hover/course:text-gray-200'
                                }`}>
                                  {course.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;