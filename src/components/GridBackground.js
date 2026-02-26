import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const GridBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      if (!renderer.domElement) {
        throw new Error('Failed to create WebGL canvas');
      }

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.zIndex = '-1';

      if (!mountRef.current) {
        throw new Error('Mount point not found');
      }

      mountRef.current.appendChild(renderer.domElement);
    } catch (error) {
      return;
    }

    // Grid setup
    const gridSize = 20;
    const gridDivisions = 20;
    const grid = new THREE.GridHelper(gridSize, gridDivisions, 0x888888, 0x888888);
    grid.material.opacity = 0.8;
    grid.material.transparent = true;
    scene.add(grid);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Camera position
    camera.position.set(10, 10, 15);
    camera.lookAt(scene.position);

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update grid material based on mouse position
      grid.material.color.setHSL(Math.abs(mouse.x), Math.abs(mouse.y), 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 -z-10" />;
};

export default GridBackground;
