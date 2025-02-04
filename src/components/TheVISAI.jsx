import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Lightning from './VISAI_Components/Lightning';
import Particles from './VISAI_Components/Particles';
import * as THREE from 'three';

const Globe = () => {
  const globeRef = useRef();

  // Rotate the globe continuously
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[0.6, 64, 64]} />
      <shaderMaterial
        attach="material"
        uniforms={{
          color1: { value: new THREE.Color('white') },
          color2: { value: new THREE.Color('aqua') },
          color3: { value: new THREE.Color('cyan') },
        }}
        vertexShader={`
          varying vec3 vPosition;
          void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vPosition;
          uniform vec3 color1;
          uniform vec3 color2;
          uniform vec3 color3;
          void main() {
            float height = (vPosition.y + 0.6) / 1.2;
            vec3 gradient = mix(color1, color2, height);
            gradient = mix(gradient, color3, smoothstep(0.3, 0.8, height));
            gl_FragColor = vec4(gradient, 1.0);
          }
        `}
      />
    </mesh>
  );
};


const TheVISAI = () => {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      let newX = position.x + (clientX - dragStartRef.current.x);
      let newY = position.y + (clientY - dragStartRef.current.y);

      // Prevent going out of screen
      const screenWidth = window.innerWidth - 300;
      const screenHeight = window.innerHeight - 300;
      newX = Math.max(0, Math.min(newX, screenWidth));
      newY = Math.max(0, Math.min(newY, screenHeight));

      setPosition({ x: newX, y: newY });
      dragStartRef.current = { x: clientX, y: clientY };
    };

    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, position]);

  const handleStart = (e) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.touches ? e.touches[0].clientX : e.clientX,
      y: e.touches ? e.touches[0].clientY : e.clientY,
    };
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        cursor: isDragging ? 'grabbing' : 'grab',
        width: '300px',
        height: '300px',
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}

      className="rounded-full w-fit h-fit bg-red-200 "
    >
      <Canvas camera={{ position: [2, 2, 2], fov: 50 }} className=" rounded-full w-fit h-fit " >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <Globe />
        <Lightning />
        <Particles/>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default TheVISAI;
