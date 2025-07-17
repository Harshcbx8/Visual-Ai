import React, {useRef, useState, useEffect, useContext } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Lightning from './VISAI_Components/Lightning';
import Particles from './VISAI_Components/Particles';
import * as THREE from 'three';
import { Context } from '../context/Context';
import WaveEffect from './VISAI_Components/WaveEffect';

const Globe = ({animatedGlobeColors}) => {
  const { globeSpeed } = useContext(Context);
  const globeRef = useRef();

  // Adjust rotation speed based on globeSpeed
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += globeSpeed;
    }
  });

  return (
    <mesh ref={globeRef}>
      <sphereGeometry args={[0.6, 64, 64]} />
      <shaderMaterial
        attach="material"
        uniforms={{
          color1: { value: new THREE.Color(animatedGlobeColors.color1) },
          color2: { value: new THREE.Color(animatedGlobeColors.color2) },
          color3: { value: new THREE.Color(animatedGlobeColors.color3) },
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


const TheVISAI = ({width}) => {
  const {isTyping, isSpeaking} = useContext(Context);
  const containerRef = useRef(null);
  const [position, setPosition] = useState({x: 100, y: 100});
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const phaseRef = useRef(0);

  // Animated Globe Color State
  const [animatedGlobeColors, setAnimatedGlobeColors] = useState({
    color1: 'white',
    color2: 'aqua',
    color3: 'cyan',
  });

  useEffect(() => {
    const speed = 0.015; // Slightly slower for smoother transition

    const animateColor = () => {
      phaseRef.current += speed;
      const wave = Math.sin(phaseRef.current) * 0.5 + 0.5;

      setAnimatedGlobeColors({
        color1: `hsl(${180 + wave * 30}, ${80 + wave * 20}%, ${70 + wave * 30}%)`,
        color2: `hsl(${190 + wave * 20}, ${90 + wave * 10}%, ${50 + wave * 20}%)`,
        color3: `hsl(${200 - wave * 20}, ${85 + wave * 15}%, ${40 + wave * 15}%)`,
      });

      if (isTyping) {
        animationFrameRef.current = requestAnimationFrame(animateColor);
      }
    };

    if (isTyping) {
      animateColor();
    } else {
      // Smoothly transition back to default colors
      const resetColors = () => {
        phaseRef.current *= 0.95; // Gradually decrease phase
        const wave = Math.sin(phaseRef.current) * 0.5 + 0.5;

        if (phaseRef.current > 0.01) {
          setAnimatedGlobeColors({
            color1: `hsl(${180 + wave * 30}, ${80 + wave * 20}%, ${70 + wave * 30}%)`,
            color2: `hsl(${190 + wave * 20}, ${90 + wave * 10}%, ${50 + wave * 20}%)`,
            color3: `hsl(${200 - wave * 20}, ${85 + wave * 15}%, ${40 + wave * 15}%)`,
          });
          animationFrameRef.current = requestAnimationFrame(resetColors);
        } else {
          // Final reset to default colors
          setAnimatedGlobeColors({
            color1: 'white',
            color2: 'aqua',
            color3: 'cyan',
          });
        }
      };
      resetColors();
    }

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isTyping]);


  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      let newX = position.x + (clientX - dragStartRef.current.x);
      let newY = position.y + (clientY - dragStartRef.current.y);

      // Prevent going out of screen
      const screenWidth = window.innerWidth - 200;
      const screenHeight = window.innerHeight - 200;
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
        width:  width<520? '180px' : '300px',
        height:  width<520? '180px' :'300px',
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}

      className="rounded-full w-fit h-fit overflow-hidden"
    >
      <Canvas camera={{ position: [2, 2, 2], fov: 50 }} className=" rounded-full w-fit h-fit " >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <Globe animatedGlobeColors={animatedGlobeColors} />
        <Lightning />
        <Particles width={width}/>
        {isSpeaking && <WaveEffect width={width}/>}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default TheVISAI;
