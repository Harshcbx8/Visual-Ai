import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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

export default Particles;
 
