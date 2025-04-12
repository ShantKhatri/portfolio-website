import { Calendar } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { experiences } from '@/data/experienceData';


const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="min-h-screen py-20 px-8 bg-black/30">
      <div className="max-w-5xl mx-auto">
        <SectionHeading 
          title="Professional Experience" 
          subtitle="My journey in the tech industry"
        />
        
        <div className="relative mt-16">
          {/* Timeline line */}
          <div className="absolute top-0 left-6 md:left-1/2 h-full w-1 bg-gradient-to-b from-purple-500 to-blue-500 transform -translate-x-1/2"></div>
          
          {/* Timeline entries */}
          <div className="space-y-16">
            {experiences.map((exp, index) => (
              <div key={index} className="relative">
                {/* Timeline dot */}
                <div className="absolute top-0 left-6 md:left-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transform -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Content card */}
                <div className={`relative md:w-[calc(50%-40px)] ${
                  index % 2 === 0 ? 'md:ml-auto' : ''
                } ml-16 md:ml-0`}>
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/60 transition-all">
                    <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
                    <h4 className="text-lg mb-2 text-purple-400">{exp.company}</h4>
                    
                    <div className="flex space-x-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {exp.period}
                      </span>
                      {/* <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {exp.location}
                      </span> */}
                    </div>
                    
                    <ul className="space-y-2">
                      {exp.description.map((item, i) => (
                        <li key={i} className="flex">
                          <span className="text-purple-500 mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;