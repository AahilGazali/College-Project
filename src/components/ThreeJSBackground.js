import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';

const ThreeJSBackground = ({ 
  particleCount = 100, 
  speed = 0.5, 
  size = 2,
  opacity = 0.6,
  className = "fixed inset-0 -z-10"
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  // Create gradient colors that match our theme
  const colors = useMemo(() => [
    new THREE.Color('#2C0F12'), // primary-dark
    new THREE.Color('#4A1518'), // primary-soft
    new THREE.Color('#6B1E23'), // primary-medium
    new THREE.Color('#8B2A2F'), // primary-accent
    new THREE.Color('#681E23'), // primary-light
  ], []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Create particles
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors_array = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

      // Color
      const colorIndex = Math.floor(Math.random() * colors.length);
      const color = colors[colorIndex];
      colors_array[i * 3] = color.r;
      colors_array[i * 3 + 1] = color.g;
      colors_array[i * 3 + 2] = color.b;

      // Size
      sizes[i] = Math.random() * size + 1;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors_array, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Create shader material for particles
    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
          gl_FragColor = vec4(vColor, ${opacity});
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    // Create particle system
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Add to DOM
    mountRef.current.appendChild(renderer.domElement);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate particles
      particleSystem.rotation.x += speed * 0.001;
      particleSystem.rotation.y += speed * 0.002;

      // Move particles in a gentle wave pattern
      const positions = particleSystem.geometry.attributes.position.array;
      const time = Date.now() * 0.001;
      
      for (let i = 0; i < particleCount; i++) {
        const x = positions[i * 3];
        const y = positions[i * 3 + 1];
        const z = positions[i * 3 + 2];
        
        positions[i * 3 + 1] = y + Math.sin(time + x * 0.01) * 0.1;
        positions[i * 3 + 2] = z + Math.cos(time + y * 0.01) * 0.1;
      }
      
      particleSystem.geometry.attributes.position.needsUpdate = true;

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

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [particleCount, speed, size, opacity, colors]);

  return <div ref={mountRef} className={className} />;
};

export default ThreeJSBackground;
