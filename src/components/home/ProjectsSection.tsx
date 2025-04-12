import React from 'react';
import SectionHeading from '../ui/SectionHeading';
import ProjectCard from '../projects/ProjectCard';
import { projects } from '../../data/projectsData';

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="min-h-screen py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading 
          title="Featured Projects" 
          subtitle="Explore some of my recent work and personal projects" 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;