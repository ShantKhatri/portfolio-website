"use client"
import { useState } from 'react';
import { GraduationCap, CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { education } from '../../data/educationData'; // Updated import path

// Add additional information to showcase in expandable sections
const educationWithDetails = education.map(edu => ({
  ...edu,
  expanded: false,
  courses: edu.degree.includes('Data Science') ? [
    'Advanced Machine Learning Algorithms',
    'Deep Learning with PyTorch & TensorFlow',
    'Natural Language Processing',
    'Computer Vision & Image Recognition',
    'Big Data Processing & Analytics'
  ] : [
    'Data Structures & Algorithms',
    'Analysis and Design of Algorithms',
    'Machine Learning',
    'Software Engineering Principles',
    'Operating Systems',
    'Database Management Systems',
    'Object-Oriented Programming',
    'Computer Architecture',
    'Computer Networks & Security'
  ]
}));

const EducationSection: React.FC = () => {
  const [educationItems, setEducationItems] = useState(educationWithDetails);

  const toggleExpand = (index: number) => {
    const updated = [...educationItems];
    updated[index] = { ...updated[index], expanded: !updated[index].expanded };
    setEducationItems(updated);
  };

  return (
    <section id="education" className="py-20 px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeading 
          title="Education" 
          subtitle="My academic background and qualifications" 
        />
        
        <div className="space-y-8 mt-12">
          {educationItems.map((edu, index) => (
            <div 
              key={index} 
              className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/60 transition-all border border-gray-800/50 ${
                edu.expanded ? 'border-purple-500/50' : 'hover:border-purple-500/30'
              }`}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-full mr-4 ${
                  edu.expanded ? 'bg-purple-600/30' : 'bg-purple-500/20'
                } transition-colors`}>
                  <GraduationCap className={`w-8 h-8 ${
                    edu.expanded ? 'text-purple-300' : 'text-purple-500'
                  } transition-colors`} />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{edu.degree}</h3>
                  <h4 className="text-lg text-purple-400 mt-1">{edu.institution}</h4>
                  
                  <div className="flex items-center mt-2 mb-3 text-gray-400">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {edu.period}
                  </div>
                  
                  {edu.description && (
                    <p className="text-gray-400 mt-2">{edu.description}</p>
                  )}
                  
                  <button 
                    className={`mt-4 flex items-center text-sm font-medium ${
                      edu.expanded ? 'text-purple-300' : 'text-purple-400'
                    } hover:text-purple-300 transition-colors`}
                    onClick={() => toggleExpand(index)}
                    aria-expanded={edu.expanded}
                  >
                    {edu.expanded ? 'Hide courses' : 'Show key courses'}
                    {edu.expanded ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    )}
                  </button>
                  
                  {edu.expanded && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fadeIn">
                      {edu.courses.map((course, i) => (
                        <div 
                          key={i}
                          className="flex items-center bg-purple-900/20 px-3 py-2 rounded-lg border border-purple-900/30"
                        >
                          <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                          <span className="text-sm">{course}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;