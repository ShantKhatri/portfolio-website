"use client"
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.z = 30;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 1000;
    
    // Positions array (3 values per vertex - x, y, z)
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    // Fill positions with random values
    for (let i = 0; i < count * 3; i+=3) {
      // Positions
      positions[i] = (Math.random() - 0.5) * 50;     // x
      positions[i+1] = (Math.random() - 0.5) * 50;   // y
      positions[i+2] = (Math.random() - 0.5) * 50;   // z
      
      // Colors with purple/blue gradient
      colors[i] = Math.random() * 0.5 + 0.5;         // r (0.5-1, purplish)
      colors[i+1] = Math.random() * 0.2;             // g (0-0.2)
      colors[i+2] = Math.random() * 0.5 + 0.5;       // b (0.5-1, blueish)
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    // Create points mesh
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Mouse interaction
    const mouse = {
      x: 0,
      y: 0
    };
    
    window.addEventListener('mousemove', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate particles based on mouse position (subtle effect)
      particles.rotation.x += mouse.y * 0.0005;
      particles.rotation.y += mouse.x * 0.0005;
      
      // Slow constant rotation
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', () => {});
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none"
    />
  );
};

export default ParticleBackground;