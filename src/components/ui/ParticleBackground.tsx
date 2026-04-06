"use client"
import { useEffect, useRef } from 'react';

/**
 * Unified hacker background — single canvas that covers the entire page.
 * Combines: subtle grid, floating binary data streams, and mouse-reactive glow nodes.
 * All sections share this one background for consistency.
 */
const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -500, y: -500 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // ---- Config ----
    const GRID_SIZE = 50;
    const MOUSE_RADIUS = 200;
    const NUM_DATA_STREAMS = 12;
    const STREAM_CHARS = '01アイウエオカキクケコサシスセソ'.split('');

    // ---- Resize ----
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // ---- Mouse tracking ----
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resize);

    // ---- Data streams (vertical falling characters) ----
    interface DataStream {
      x: number;
      speed: number;
      chars: { char: string; y: number; alpha: number }[];
      length: number;
    }

    const streams: DataStream[] = [];
    for (let i = 0; i < NUM_DATA_STREAMS; i++) {
      const length = 8 + Math.floor(Math.random() * 15);
      const x = Math.random() * (canvas.width || 1920);
      streams.push({
        x,
        speed: 0.3 + Math.random() * 0.8,
        length,
        chars: Array.from({ length }, (_, j) => ({
          char: STREAM_CHARS[Math.floor(Math.random() * STREAM_CHARS.length)],
          y: -j * 18 - Math.random() * 500,
          alpha: 1 - j / length,
        })),
      });
    }

    // ---- Floating hex addresses ----
    interface HexFloat {
      text: string;
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      life: number;
    }
    const hexFloats: HexFloat[] = [];
    const spawnHex = () => {
      if (hexFloats.length > 6) return;
      const hex = '0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
      hexFloats.push({
        text: hex,
        x: Math.random() * (canvas.width || 1920),
        y: Math.random() * (canvas.height || 1080),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: 0,
        life: 0,
      });
    };

    // ---- Main draw loop ----
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // 1. Grid (very subtle, slightly brighter near mouse)
      for (let x = 0; x < canvas.width; x += GRID_SIZE) {
        for (let y = 0; y < canvas.height; y += GRID_SIZE) {
          const dx = mx - x;
          const dy = my - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / MOUSE_RADIUS);

          // Grid intersection dot
          const dotAlpha = 0.04 + proximity * 0.25;
          const dotSize = 0.5 + proximity * 2.5;

          if (dotAlpha > 0.03) {
            const hue = 260 + proximity * 30;
            ctx.fillStyle = `hsla(${hue}, 60%, 55%, ${dotAlpha})`;
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }

          // Grid connector lines near mouse
          if (proximity > 0.15) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${proximity * 0.08})`;
            ctx.lineWidth = 0.5;

            // Right connector
            if (x + GRID_SIZE <= canvas.width) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + GRID_SIZE, y);
              ctx.stroke();
            }
            // Down connector
            if (y + GRID_SIZE <= canvas.height) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x, y + GRID_SIZE);
              ctx.stroke();
            }
          }
        }
      }

      // 2. Mouse glow orb
      if (mx > 0 && my > 0) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, MOUSE_RADIUS);
        grad.addColorStop(0, 'rgba(168, 85, 247, 0.035)');
        grad.addColorStop(0.4, 'rgba(139, 92, 246, 0.015)');
        grad.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, MOUSE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Data streams (matrix rain — very light)
      ctx.font = '11px monospace';
      for (const stream of streams) {
        let headResetNeeded = true;
        for (const ch of stream.chars) {
          ch.y += stream.speed;
          if (ch.y > canvas.height + 20) {
            if (headResetNeeded) {
              ch.y = -10;
              headResetNeeded = false;
            }
          }
          // Head char is brighter
          const isHead = ch === stream.chars[0];
          const finalAlpha = ch.alpha * (isHead ? 0.2 : 0.06);

          if (ch.y > -10 && ch.y < canvas.height + 10) {
            ctx.fillStyle = `rgba(168, 85, 247, ${finalAlpha})`;
            ctx.fillText(ch.char, stream.x, ch.y);
          }

          // Randomize char occasionally
          if (Math.random() > 0.98) {
            ch.char = STREAM_CHARS[Math.floor(Math.random() * STREAM_CHARS.length)];
          }
        }

        // Reset whole stream if all chars passed bottom
        if (stream.chars.every(c => c.y > canvas.height)) {
          stream.x = Math.random() * canvas.width;
          stream.chars.forEach((c, j) => {
            c.y = -j * 18;
          });
        }
      }

      // 4. Floating hex addresses
      if (Math.random() > 0.995) spawnHex();
      for (let i = hexFloats.length - 1; i >= 0; i--) {
        const hf = hexFloats[i];
        hf.x += hf.vx;
        hf.y += hf.vy;
        hf.life += 0.005;

        // Fade in then out
        if (hf.life < 0.2) {
          hf.alpha = hf.life / 0.2;
        } else if (hf.life > 0.8) {
          hf.alpha = (1 - hf.life) / 0.2;
        } else {
          hf.alpha = 1;
        }

        if (hf.life >= 1) {
          hexFloats.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(100, 160, 255, ${hf.alpha * 0.06})`;
        ctx.font = '10px monospace';
        ctx.fillText(hf.text, hf.x, hf.y);
      }

      // 5. Scan line sweep (very subtle, slow)
      const scanY = (Math.sin(time * 0.5) * 0.5 + 0.5) * canvas.height;
      const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      scanGrad.addColorStop(0, 'transparent');
      scanGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.015)');
      scanGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 40, canvas.width, 80);

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default ParticleBackground;