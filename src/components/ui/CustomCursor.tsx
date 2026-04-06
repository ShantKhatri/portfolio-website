"use client"
import { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const trailPoints = useRef<{ x: number; y: number; age: number }[]>([]);

  useEffect(() => {
    // Don't show on touch devices
    if ('ontouchstart' in window) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const canvas = trailCanvasRef.current;
    if (!dot || !ring || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animFrame: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Add trail point
      trailPoints.current.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (trailPoints.current.length > 30) {
        trailPoints.current.shift();
      }

      // Check if hovering interactive element
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, .card-3d, [onclick]');
      setIsHovering(!!interactive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const animate = () => {
      // Smooth ring follow
      const dx = mousePos.current.x - ringPos.current.x;
      const dy = mousePos.current.y - ringPos.current.y;
      ringPos.current.x += dx * 0.15;
      ringPos.current.y += dy * 0.15;

      // Position dot (instant)
      dot.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
      // Position ring (delayed smooth)
      ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;

      // Draw trail
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Age trail points
      for (let i = trailPoints.current.length - 1; i >= 0; i--) {
        trailPoints.current[i].age += 1;
        if (trailPoints.current[i].age > 20) {
          trailPoints.current.splice(i, 1);
        }
      }

      // Draw trail line
      if (trailPoints.current.length > 2) {
        ctx.beginPath();
        ctx.moveTo(trailPoints.current[0].x, trailPoints.current[0].y);

        for (let i = 1; i < trailPoints.current.length; i++) {
          const point = trailPoints.current[i];
          const alpha = 1 - point.age / 20;
          ctx.lineTo(point.x, point.y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.15})`;
          ctx.lineWidth = alpha * 2;
        }
        ctx.stroke();
      }

      // Draw trail dots
      for (const point of trailPoints.current) {
        const alpha = 1 - point.age / 20;
        const size = alpha * 1.5;

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.3})`;
        ctx.fill();
      }

      animFrame = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);
    animFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <>
      {/* Trail canvas */}
      <canvas
        ref={trailCanvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
      />

      {/* Inner dot — precise cursor point */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: isClicking ? '4px' : '6px',
          height: isClicking ? '4px' : '6px',
          marginLeft: isClicking ? '-2px' : '-3px',
          marginTop: isClicking ? '-2px' : '-3px',
          borderRadius: '50%',
          background: '#fff',
          boxShadow: `0 0 6px rgba(168, 85, 247, 0.8), 0 0 12px rgba(168, 85, 247, 0.4)`,
          transition: 'width 0.15s, height 0.15s, margin 0.15s',
          willChange: 'transform',
        }}
      />

      {/* Outer ring — atmospheric follow */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: isHovering ? '48px' : isClicking ? '24px' : '32px',
          height: isHovering ? '48px' : isClicking ? '24px' : '32px',
          marginLeft: isHovering ? '-24px' : isClicking ? '-12px' : '-16px',
          marginTop: isHovering ? '-24px' : isClicking ? '-12px' : '-16px',
          borderRadius: '50%',
          border: `1.5px solid rgba(168, 85, 247, ${isHovering ? 0.6 : 0.3})`,
          background: isHovering
            ? 'rgba(168, 85, 247, 0.08)'
            : 'transparent',
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), height 0.3s cubic-bezier(0.4,0,0.2,1), margin-left 0.3s, margin-top 0.3s, border-color 0.3s, background 0.3s',
          willChange: 'transform',
          ...(isHovering ? {
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.15), inset 0 0 20px rgba(168, 85, 247, 0.05)',
          } : {}),
        }}
      >
        {/* Crosshair lines */}
        {!isHovering && (
          <>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '-4px',
              right: '-4px',
              height: '1px',
              background: `linear-gradient(90deg, transparent, rgba(168, 85, 247, ${isClicking ? 0.6 : 0.2}), transparent)`,
              transition: 'opacity 0.2s',
            }} />
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '-4px',
              bottom: '-4px',
              width: '1px',
              background: `linear-gradient(180deg, transparent, rgba(168, 85, 247, ${isClicking ? 0.6 : 0.2}), transparent)`,
              transition: 'opacity 0.2s',
            }} />
          </>
        )}
      </div>
    </>
  );
};

export default CustomCursor;
