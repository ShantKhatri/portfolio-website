"use client"
import React, { useState, useRef, useCallback } from 'react';
import { Github, Globe, Search, Bot, Leaf, Printer, MessageSquare } from 'lucide-react';
import { Project } from '../../data/projectsData';
import { soundEngine } from '@/lib/soundEngine';

const getIconComponent = (iconName: string, className = "") => {
  switch (iconName) {
    case 'search': return <Search className={className} />;
    case 'bot': return <Bot className={className} />;
    case 'leaf': return <Leaf className={className} />;
    case 'printer': return <Printer className={className} />;
    case 'globe': return <Globe className={className} />;
    case 'messageSquare': return <MessageSquare className={className} />;
    default: return <Search className={className} />;
  }
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setTilt({
      x: (y - 0.5) * -20,
      y: (x - 0.5) * 20,
    });
    setGlarePos({
      x: x * 100,
      y: y * 100,
    });
  }, [isFlipped]);

  const resetTilt = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    soundEngine.playClick();
  };

  return (
    <div
      ref={cardRef}
      className="card-3d group"
      style={{
        perspective: '1000px',
        animationDelay: `${index * 0.15}s`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        soundEngine.playHover();
      }}
      onMouseLeave={resetTilt}
      onClick={handleFlip}
    >
      <div
        className={`card-3d-inner relative w-full h-[360px] cursor-pointer ${isFlipped ? 'flipped' : ''}`}
        style={{
          transform: isFlipped
            ? 'rotateY(180deg)'
            : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isFlipped ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'transform 0.1s ease-out',
        }}
      >
        {/* Front Face */}
        <div className="card-3d-face absolute inset-0 rounded-2xl overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm border border-gray-700/40 rounded-2xl"
            style={{
              boxShadow: isHovered
                ? `0 0 30px ${project.color}30, 0 20px 60px rgba(0,0,0,0.4)`
                : '0 4px 20px rgba(0,0,0,0.3)',
            }}
          />

          {/* Holographic shimmer overlay */}
          {isHovered && (
            <div
              className="absolute inset-0 rounded-2xl opacity-60 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
              }}
            />
          )}

          {/* Rainbow refraction border */}
          {isHovered && (
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none holo-shimmer"
              style={{ opacity: 0.4 }}
            />
          )}

          {/* Content */}
          <div className="relative z-10 p-6 h-full flex flex-col">
            {/* Category badge */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: `${project.color}20`,
                  color: project.color,
                  border: `1px solid ${project.color}30`,
                }}
              >
                {project.category}
              </span>
              <span className="text-xs text-gray-500">Click to flip →</span>
            </div>

            {/* Icon */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300"
              style={{
                background: `linear-gradient(135deg, ${project.color}40, ${project.color}20)`,
                border: `1px solid ${project.color}30`,
                transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
              }}
            >
              {getIconComponent(project.icon, "w-7 h-7 text-white")}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed flex-1 line-clamp-3">
              {project.description}
            </p>

            {/* Tech preview */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {project.tech.slice(0, 4).map(tech => (
                <span
                  key={tech}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-gray-800/80 text-gray-400 border border-gray-700/50"
                >
                  {tech}
                </span>
              ))}
              {project.tech.length > 4 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-800/80 text-gray-500">
                  +{project.tech.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Particle aura on hover */}
          {isHovered && (
            <div
              className="absolute -inset-1 rounded-2xl pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${project.color}10 0%, transparent 70%)`,
                animation: 'particleAura 3s ease-in-out infinite',
              }}
            />
          )}
        </div>

        {/* Back Face */}
        <div className="card-3d-back absolute inset-0 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-900/90 backdrop-blur-md border border-gray-700/40 rounded-2xl"
            style={{
              boxShadow: `0 0 30px ${project.color}20, 0 20px 60px rgba(0,0,0,0.4)`,
            }}
          />

          <div className="relative z-10 p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{project.title}</h3>
              <span className="text-xs text-gray-500">Click to flip back</span>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {project.description}
            </p>

            {/* Full tech stack */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(tech => (
                  <span
                    key={tech}
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: `${project.color}15`,
                      color: project.color,
                      border: `1px solid ${project.color}25`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="mt-auto flex gap-3">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/80 text-gray-300 hover:text-white hover:bg-gray-700/80 transition-all text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-4 h-4" />
                  Source Code
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${project.color}80, ${project.color}60)`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Globe className="w-4 h-4" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;