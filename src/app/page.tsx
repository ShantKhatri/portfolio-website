"use client"
import 'tailwindcss/tailwind.css';
import React, { useState, useEffect } from 'react';
import { Camera, Terminal, Code, Cpu, Globe, Database, Github, Linkedin, Mail } from 'lucide-react';

// Define interfaces for type safety
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
}

interface MousePosition {
  x: number;
  y: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  color: string;
  icon: React.ReactNode;
  links: {
    github: string;
    live: string;
  };
}

interface SkillGroup {
  category: string;
  items: string[];
  icon: React.ReactNode;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string[];
}

const Home: React.FC = () => {
  // const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  // const [scrollProgress, setScrollProgress] = useState<number>(0);
  // const [activeProject, setActiveProject] = useState<number | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle system
  useEffect(() => {
    const createParticle = (): Particle => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
    });

    setParticles(Array.from({ length: 50 }, createParticle));

    const updateParticles = (): void => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
        }))
      );
    };

    const animationId = setInterval(updateParticles, 50);
    return () => clearInterval(animationId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Projects data with tech stacks
  const projects: Project[] = [
    {
      id: 1,
      title: "FloraFinder",
      description: "AI-Powered Plant Recognition",
      tech: ["React Native", "Node.js", "TensorFlow"],
      color: "#4CAF50",
      icon: <Camera className="w-8 h-8" />,
      links: {
        github: "#",
        live: "#"
      }
    },
    {
      id: 2,
      title: "PrintSEC",
      description: "Secure Cloud Printing Platform",
      tech: ["React", "Node.js", "AWS"],
      color: "#2196F3",
      icon: <Terminal className="w-8 h-8" />,
      links: {
        github: "#",
        live: "#"
      }
    },
    {
      id: 3,
      title: "DigitalWiseon",
      description: "Next.js Business Platform",
      tech: ["Next.js", "Firebase", "ChatBot"],
      color: "#9C27B0",
      icon: <Globe className="w-8 h-8" />,
      links: {
        github: "#",
        live: "#"
      }
    }
  ];

  // Skills with interactive visualization
  const skills: SkillGroup[] = [
    {
      category: "Frontend",
      items: ["React", "React Native", "TypeScript", "Next.js"],
      icon: <Code className="w-6 h-6" />
    },
    {
      category: "Backend",
      items: ["Node.js", "Java", "MongoDB", "Firebase"],
      icon: <Database className="w-6 h-6" />
    },
    {
      category: "DevOps",
      items: ["AWS", "Docker", "Git", "Maven"],
      icon: <Cpu className="w-6 h-6" />
    }
  ];

  const experiences: Experience[] = [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Company",
      period: "2022 - Present",
      description: [
        "Led development of enterprise-scale applications",
        "Managed team of 5 developers",
        "Implemented CI/CD pipelines"
      ]
    },
    {
      title: "Full Stack Developer",
      company: "Startup Inc",
      period: "2020 - 2022",
      description: [
        "Developed full-stack applications using React and Node.js",
        "Improved application performance by 40%",
        "Implemented automated testing"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Particle Background */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map((particle, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-blue-500 opacity-50"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="text-center z-10">
          <h1 className="text-6xl font-bold mb-6 animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
            Prashantkumar Khatri
          </h1>
          <p className="text-2xl text-gray-400 mb-8">
            Full Stack Developer & Automation Expert
          </p>
          <div className="flex space-x-4 justify-center">
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all">
              View Projects
            </button>
            <button className="px-8 py-3 rounded-full border-2 border-purple-500 hover:bg-purple-500/20 transform hover:scale-105 transition-all">
              Contact Me
            </button>
          </div>
          <div className="mt-8 flex space-x-6 justify-center">
            <a href="https://github.com/yourusername" className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com/in/yourusername" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
            {/* <a href="https://twitter.com/yourusername" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-6 h-6" />
            </a> */}
            <a href="mailto:your@email.com" className="text-gray-400 hover:text-white transition-colors">
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="min-h-screen py-20 px-8">
        <h2 className="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-800/50 transform hover:scale-105 transition-all duration-300"
              // onMouseEnter={() => setActiveProject(project.id)}
              // onMouseLeave={() => setActiveProject(null)}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                  {project.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-3 py-1 rounded-full bg-gray-800 text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4 mt-4">
                  <a 
                    href={project.links.github}
                    className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>Code</span>
                  </a>
                  <a 
                    href={project.links.live}
                    className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="min-h-screen py-20 px-8 bg-gradient-to-b from-black to-gray-900">
        <h2 className="text-4xl font-bold mb-12 text-center">Skills & Expertise</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {skills.map((skillGroup) => (
            <div
              key={skillGroup.category}
              className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                {skillGroup.icon}
                <h3 className="text-xl font-bold ml-2">{skillGroup.category}</h3>
              </div>
              <div className="space-y-4">
                {skillGroup.items.map((skill) => (
                  <div
                    key={skill}
                    className="bg-gray-800 rounded-lg p-3 transform hover:translate-x-2 transition-transform"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="min-h-screen py-20 px-8">
        <h2 className="text-4xl font-bold mb-12 text-center">Experience</h2>
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-purple-500 to-blue-500" />
          {experiences.map((exp, index) => (
            <div 
              key={index} 
              className={`relative mb-12 ${
                index % 2 === 0 ? 'ml-auto pl-12' : 'mr-auto pr-12'
              } w-1/2`}
            >
              <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-purple-500">{exp.title}</h3>
                <h4 className="text-lg text-gray-400 mb-2">{exp.company}</h4>
                <p className="text-sm text-gray-500 mb-4">{exp.period}</p>
                <ul className="space-y-2">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-gray-400">• {item}</li>
                  ))}
                </ul>
              </div>
              <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-purple-500 
                ${index % 2 === 0 ? 'left-[-8px]' : 'right-[-8px]'}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="min-h-screen py-20 px-8 bg-gradient-to-b from-gray-900 to-black">
        <h2 className="text-4xl font-bold mb-12 text-center">Get In Touch</h2>
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900/50 rounded-xl p-8 backdrop-blur-sm">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Name"
                  className="bg-gray-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-gray-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full bg-gray-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <textarea
                placeholder="Message"
                rows={6}
                className="w-full bg-gray-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="w-full px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 
                hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-4 rounded-full bg-purple-500 hover:bg-purple-600 
            transform hover:scale-110 transition-all"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Home;