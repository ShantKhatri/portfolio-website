import React from 'react';
import { Github, Globe, Code, Database, Cpu, Camera, Paintbrush } from 'lucide-react';
import { Project } from '../../data/projectsData';

// Icon mapper function to render the appropriate icon
const getIconComponent = (iconName: string, className = "") => {
  switch (iconName) {
    case 'code': return <Code className={className} />;
    case 'globe': return <Globe className={className} />;
    case 'database': return <Database className={className} />;
    case 'cpu': return <Cpu className={className} />;
    case 'camera': return <Camera className={className} />;
    case 'paintbrush': return <Paintbrush className={className} />;
    default: return <Code className={className} />;
  }
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-800/50 transform hover:scale-105 transition-all duration-300">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-4">
          {getIconComponent(project.icon, "text-white")}
        </div>
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-400 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech: any) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
        {/* <div className="flex space-x-4 mt-4">
          <a
            href={project.links.github}
            className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4" />
            <span>Code</span>
          </a>
          <a
            href={project.links.live}
            className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe className="w-4 h-4" />
            <span>Live Demo</span>
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default ProjectCard;