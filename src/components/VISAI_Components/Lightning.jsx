import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useContext } from 'react';
import { Context } from '../../context/Context';

const Lightning = ({width}) => {
   const {globeSpeed, isSpeaking} = useContext(Context);
      
  const [lines, setLines] = useState([]);
  const [rings, setRings] = useState([]); // Add this at the beginning of your Lightning component

  const timeRef = useRef(0);
  const radius = 0.8; // Radius of the globe
  const numRings = 10; // Number of lightning strikes at a time
  const numPoints = 5; // Number of points per lightning line
  const angleSpeed = 0.5; // Speed of rotation for animation
  const lightningDuration = 300; // Duration of each lightning in milliseconds
  const numCircularRings = 5; // Number of circular rings around the globe

  // Memoize lightning colors to prevent unnecessary re-renders
  const lightningColors = useMemo(() => [
    new THREE.Color(0x00ffff), // Cyan
    new THREE.Color(0xffd700), // Golden
    new THREE.Color(0xffffff), // White
  ], []);

  // Generate a lightning strike from a random point on the globe
  const generateLightningLine = useCallback(() => {
    const points = [];
    const maxDisplacement = 0.15;

    // Random starting point on the globe
    const theta = Math.random() * Math.PI * 2; // Longitude
    const phi = Math.acos(2 * Math.random() - 1); // Latitude
    const start = new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );

    points.push(start);

    // Generate zigzag path
    for (let i = 1; i < numPoints; i++) {
      const displacement = new THREE.Vector3(
        (Math.random() - 0.6) * maxDisplacement,
        (Math.random() - 0.5) * maxDisplacement,
        (Math.random() - 0.5 ) * maxDisplacement
      );
      const nextPoint = points[i - 1].clone().add(displacement);
      points.push(nextPoint);
    }

    return {
      points,
      color: lightningColors[Math.floor(Math.random() * lightningColors.length)],
    };
  }, [radius, numPoints, lightningColors]);


  // Generate circular rings
  const generateRings = useCallback(() => {
    const newRings = Array.from({ length: numCircularRings }, (_, i) => ({
      radius: radius + i * 0.1,
      axis: new THREE.Vector3(0.2, 0.5, 0.4),
      direction: Math.random() > 0.5 ? 1 : -1,
      color: lightningColors[Math.floor(Math.random() * lightningColors.length)],
      rotationSpeed: Math.random() * globeSpeed + 0.01, // Dynamically adjust rotation speed
    }));
    setRings(newRings);
  }, [radius, numCircularRings, lightningColors, globeSpeed]); // Add globeSpeed as dependency
  

  // Update lightning periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newLines = Array.from({ length: numRings }, generateLightningLine);
      setLines(newLines);

      // Clear lightning after the duration
      setTimeout(() => setLines([]), lightningDuration);
    }, lightningDuration + 300); // Add a slight delay between lightning bursts
    generateRings(); // Generate rings initially
    return () => clearInterval(interval);
  }, [generateLightningLine, generateRings, globeSpeed]);

  // Animate lightning lines (optional, if you want them to shift slightly)
  useFrame(() => {
    timeRef.current += angleSpeed;

    setLines((prevLines) =>
      prevLines.map((line) => {
        const animatedPoints = line.points.map((point) => {
          const noise = new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
          );
          return point.clone().add(noise);
        });
        return { ...line, points: animatedPoints };
      })
    );

    // Rotate rings around the globe (flip effect)
    setRings((prevRings) =>
      prevRings.map((ring) => ({
        ...ring,
        rotation: (ring.rotation || 0) + ring.rotationSpeed * ring.direction,
      }))
    );
  });

  return (
    <group>
      {lines.map((line, index) => {
        const vertices = new Float32Array(
          line.points.flatMap((point) => [point.x, point.y, point.z])
        );

        return (
          <line key={index}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={vertices}
                count={line.points.length}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={line.color} linewidth={2} />
          </line>
        );
      })}

      {rings.map((ring, index) => (
        <mesh
          key={index}
          position={[0, 0, 0]} // Center the rings around the globe
          rotation={[ring.rotation, ring.rotation, ring.rotation]} // Apply rotation on the x-axis
        >
          {!isSpeaking &&  <ringGeometry args={[ring.radius - 0.01, ring.radius, 64]} />}
          <meshBasicMaterial
            color={ring.color}
            side={THREE.DoubleSide}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

export default Lightning;
