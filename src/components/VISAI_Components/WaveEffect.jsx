import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WaveRing = ({ position, initialSize, speed, color, onFadeOut, width }) => {
  const meshRef = useRef();
  const [scale, setScale] = useState(initialSize);
  const [opacity, setOpacity] = useState(1);

  useFrame((_, delta) => {
    setScale((prev) => prev + speed * delta);
    setOpacity((prev) => Math.max(prev - speed * delta * 0.5, 0));
    
    if (opacity <= 0) {
      onFadeOut();
    }
  });
 
  let ringWidth = width<520? 0.005 : 0.01;

  return (
    <mesh ref={meshRef} position={position}>
      <ringGeometry args={[scale , scale + ringWidth , 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const WaveEffect = ({width}) => {
  const [rings, setRings] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRings((prev) => [
        ...prev,
        {
          id: Math.random(),
          position: [0, 0, 0.5],
          initialSize: 0,
          speed: 0.5,
          color: 'white',
        },
      ]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {rings.map((ring) => (
        <WaveRing
          width={width}
          key={ring.id}
          position={ring.position}
          initialSize={ring.initialSize}
          speed={ring.speed}
          color={ring.color}
          onFadeOut={() => setRings((prev) => prev.filter((r) => r.id !== ring.id))}
        />
      ))}
    </>
  );
};

export default WaveEffect;
