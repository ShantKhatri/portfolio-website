"use client"
import { useRef, useEffect, useState, useCallback } from 'react';
import SectionHeading from '../ui/SectionHeading';
import { skills, softSkills } from '../../data/skillsData';
import { useIntersectionObserver } from '@/lib/useIntersectionObserver';
import { soundEngine } from '@/lib/soundEngine';

interface SkillNode {
  name: string;
  level: number;
  category: string;
  color: string;
  x: number;
  y: number;
  orbitRadius: number;
  angle: number;
  speed: number;
  size: number;
}

const SkillsSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, isVisible } = useIntersectionObserver({ threshold: 0.1 });
  const [hoveredSkill, setHoveredSkill] = useState<SkillNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const nodesRef = useRef<SkillNode[]>([]);
  const animFrameRef = useRef<number>(0);
  const isDragging = useRef(false);
  const rotationOffset = useRef(0);
  const lastMouseX = useRef(0);

  // Build nodes from skills data
  const buildNodes = useCallback((w: number, h: number) => {
    const centerX = w / 2;
    const centerY = h / 2;
    const maxRadius = Math.min(w, h) * 0.38;
    const nodes: SkillNode[] = [];

    skills.forEach((group, groupIndex) => {
      const orbitRadius = maxRadius * (0.35 + (groupIndex / skills.length) * 0.65);
      group.items.forEach((skill, skillIndex) => {
        const angle = (skillIndex / group.items.length) * Math.PI * 2;
        const speed = 0.0003 + (groupIndex * 0.00008);
        nodes.push({
          name: skill.name,
          level: skill.level,
          category: group.category,
          color: group.color,
          x: centerX + Math.cos(angle) * orbitRadius,
          y: centerY + Math.sin(angle) * orbitRadius,
          orbitRadius,
          angle,
          speed: speed * (skillIndex % 2 === 0 ? 1 : -1),
          size: 4 + (skill.level / 100) * 6,
        });
      });
    });

    return nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !isVisible) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      nodesRef.current = buildNodes(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw orbit rings
      const uniqueRadii = [...new Set(nodesRef.current.map(n => n.orbitRadius))];
      uniqueRadii.forEach(radius => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw center sun
      const sunGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
      sunGrad.addColorStop(0, 'rgba(168, 85, 247, 0.8)');
      sunGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.3)');
      sunGrad.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fill();

      // Draw "SKILLS" text at center
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SKILLS', centerX, centerY);

      // Update and draw nodes
      let currentHovered: SkillNode | null = null;

      nodesRef.current.forEach(node => {
        // Update position
        node.angle += node.speed + rotationOffset.current * 0.01;
        node.x = centerX + Math.cos(node.angle) * node.orbitRadius;
        node.y = centerY + Math.sin(node.angle) * node.orbitRadius;

        // Check hover
        const dx = mousePos.x - node.x;
        const dy = mousePos.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isHovered = dist < node.size + 15;

        if (isHovered) currentHovered = node;

        // Draw connection line from center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = `${node.color}${isHovered ? '40' : '15'}`;
        ctx.lineWidth = isHovered ? 1.5 : 0.5;
        ctx.stroke();

        // Draw node glow
        if (isHovered) {
          const glowGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 4);
          glowGrad.addColorStop(0, `${node.color}60`);
          glowGrad.addColorStop(1, `${node.color}00`);
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw node
        const nodeGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, isHovered ? node.size * 2 : node.size);
        nodeGrad.addColorStop(0, isHovered ? '#ffffff' : node.color);
        nodeGrad.addColorStop(1, `${node.color}80`);
        ctx.fillStyle = nodeGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, isHovered ? node.size * 1.8 : node.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw label on hover
        if (isHovered) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 13px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText(node.name, node.x, node.y - node.size * 2.5 - 8);

          // XP bar
          const barWidth = 80;
          const barHeight = 6;
          const barX = node.x - barWidth / 2;
          const barY = node.y - node.size * 2.5;

          // Background
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(barX, barY, barWidth, barHeight);

          // Fill
          ctx.fillStyle = node.color;
          ctx.fillRect(barX, barY, barWidth * (node.level / 100), barHeight);

          // Level text
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.font = '10px system-ui';
          ctx.fillText(`${node.level}%`, node.x, barY + barHeight + 14);
        }
      });

      rotationOffset.current *= 0.95; // Decay drag rotation

      if (currentHovered !== hoveredSkill) {
        if (currentHovered) soundEngine.playHover();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isVisible, mousePos, hoveredSkill, buildNodes]);

  // Mouse handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (isDragging.current) {
      const deltaX = e.clientX - lastMouseX.current;
      rotationOffset.current = deltaX * 0.05;
      lastMouseX.current = e.clientX;
    }

    // Find hovered node
    let found: SkillNode | null = null;
    for (const node of nodesRef.current) {
      const dx = x - node.x;
      const dy = y - node.y;
      if (Math.sqrt(dx * dx + dy * dy) < node.size + 15) {
        found = node;
        break;
      }
    }
    setHoveredSkill(found);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouseX.current = e.clientX;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <section id="skills" ref={sectionRef} className="min-h-screen py-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title="Skills & Expertise"
          subtitle="Drag to rotate the constellation • Hover nodes to see proficiency"
        />

        <div
          ref={containerRef}
          className={`relative w-full aspect-square max-h-[600px] mx-auto transition-opacity duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              handleMouseUp();
              setHoveredSkill(null);
            }}
          />

          {/* Category legend */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-3">
            {skills.map(group => (
              <div key={group.category} className="flex items-center gap-1.5 text-xs text-gray-400">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <span>{group.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div className={`mt-12 text-center transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Soft Skills</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {softSkills.map(skill => (
              <span
                key={skill}
                className="px-4 py-2 rounded-full bg-gray-900/60 border border-gray-700/50 text-sm text-gray-300 hover:border-purple-500/50 hover:text-white transition-all cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;