import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Lightning from './Lightning';
import * as THREE from 'three';
import { useMemo } from 'react';

const Globe = ({ color }) => {
  const globeRef = useRef();

  // Rotate the globe continuously
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.1;
    }
  });

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[0.6, 64, 64]} />
      {/* Custom gradient material */}
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
            float height = (vPosition.y + 0.6) / 1.2; // Normalize height between 0 and 1
            vec3 gradient = mix(color1, color2, height);
            gradient = mix(gradient, color3, smoothstep(0.3, 0.8, height));
            gl_FragColor = vec4(gradient, 1.0);
          }
        `}
      />
    </mesh>
  );
};

const Particles = () => {
  const groupRef = useRef();

  // Wrap particleColors in useMemo to prevent re-initialization
  const particleColors = useMemo(
    () => ['aqua', 'cyan', 'gold', 'white'],
    []
  );

  // Generate particles with useMemo
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ),
      speed: Math.random() * 0.02,
      color: new THREE.Color(particleColors[Math.floor(Math.random() * particleColors.length)]),
    }));
  }, [particleColors]);

  // Update particle movement
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.015; // Rotation speed

      particles.forEach((particle) => {
        particle.position.y += particle.speed;
        if (particle.position.y > 1) {
          particle.position.y = -1; // Reset particle position
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position}>
          <sphereGeometry args={[0.015, 16, 16]} />
           <meshBasicMaterial
                color={particle.color}
                side={THREE.DoubleSide}
                opacity={0.8}
            />
        </mesh>
      ))}
    </group>
  );
};



const TheVISAI = () => {
  const [color] = useState(new THREE.Color('aqua'));
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });



     // Handle mouse/touch events
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      setPosition((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div onMouseMove={handleMouseMove}
     onMouseUp={handleMouseUp}
     onMouseLeave={handleMouseUp} >
      <div className="h-2 w-2" style={{position: 'absolute', top: position.y, left: position.x, cursor: isDragging ? 'grabbing' : 'grab',}} onMouseDown={handleMouseDown}>
      <Canvas  camera={{ position: [3, 3, 3], fov: 50, }} style={{ width: '30rem', height: '30rem' }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <Globe color={color} scale={10} />
        <Lightning />
        <Particles/>
        <OrbitControls enableZoom={true}/>
      </Canvas>
    </div>
    </div>
  );
};

export default TheVISAI;
