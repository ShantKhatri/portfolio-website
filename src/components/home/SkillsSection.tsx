import { Code, Terminal, Database, Globe, Cpu, Paintbrush } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { skills } from '../../data/skillsData';

// Icon mapping helper
const getIconComponent = (iconName: string, className = "") => {
  switch (iconName.toLowerCase()) {
    case 'code': return <Code className={className} />;
    case 'terminal': return <Terminal className={className} />;
    case 'database': return <Database className={className} />;
    case 'globe': return <Globe className={className} />;
    case 'cpu': return <Cpu className={className} />;
    case 'paintbrush': return <Paintbrush className={className} />;
    default: return <Code className={className} />;
  }
};

const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="min-h-screen py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Skills & Expertise" 
          subtitle="Technologies and tools I work with on a regular basis"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill) => (
            <div 
              key={skill.category}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/60 transition-all"
            >
              <div className="flex items-center mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: skill.color }}
                >
                  {getIconComponent(skill.icon, "text-white")}
                </div>
                <h3 className="text-xl font-semibold">{skill.category}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {skill.items.map((item) => (
                  <div 
                    key={item} 
                    className="bg-gray-800/60 backdrop-blur-sm py-2 px-3 rounded text-sm hover:bg-gray-700/60 transition-colors"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;