import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const RobotVacuumModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const laserRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Gentle floating animation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    }
    // Rotate laser beam
    if (laserRef.current) {
      laserRef.current.rotation.y = state.clock.elapsedTime * 2;
    }
  });

  const bodyDark = "#0a1a2e";
  const bodyMid = "#122840";
  const accentTeal = "#2d8a8a";
  const laserColor = "#4dd9d9";

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0]}>
      {/* Main body - base */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1.6, 1.7, 0.35, 64]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Main body - top surface */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[1.55, 1.6, 0.15, 64]} />
        <meshPhysicalMaterial 
          color={bodyDark} 
          metalness={0.8} 
          roughness={0.2}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Glass-like top cover */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[1.4, 1.5, 0.08, 64]} />
        <meshPhysicalMaterial 
          color={bodyMid} 
          metalness={0.9} 
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          reflectivity={1}
        />
      </mesh>

      {/* LIDAR bump base */}
      <mesh position={[0, 0.25, -0.5]}>
        <cylinderGeometry args={[0.35, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* LIDAR bump top */}
      <mesh position={[0, 0.38, -0.5]}>
        <cylinderGeometry args={[0.28, 0.35, 0.08, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Laser beam effect group */}
      <group ref={laserRef} position={[0, 0.42, -0.5]}>
        {/* Main laser line */}
        <mesh position={[0.8, 0.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <cylinderGeometry args={[0.008, 0.002, 1.2, 8]} />
          <meshBasicMaterial color={laserColor} transparent opacity={0.8} />
        </mesh>
        {/* Laser particles */}
        {[...Array(8)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              0.6 + Math.random() * 0.4, 
              0.2 + Math.random() * 0.3, 
              (Math.random() - 0.5) * 0.3
            ]}
          >
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color={laserColor} transparent opacity={0.6} />
          </mesh>
        ))}
      </group>

      {/* Teal accent ring */}
      <mesh position={[0, 0.16, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.02, 16, 32]} />
        <meshStandardMaterial 
          color={accentTeal} 
          emissive={accentTeal} 
          emissiveIntensity={0.5}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Front bumper */}
      <mesh position={[0, -0.05, 1.3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.25, 0.3]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Side vents - left */}
      <mesh position={[-1.5, -0.05, 0.3]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.4, 0.15, 0.15]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Side vents - right */}
      <mesh position={[1.5, -0.05, 0.3]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.4, 0.15, 0.15]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Bottom edge glow */}
      <mesh position={[0, -0.25, 0]}>
        <torusGeometry args={[1.65, 0.02, 16, 64]} />
        <meshStandardMaterial 
          color="#333" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>

      {/* Center display area */}
      <mesh position={[0, 0.17, 0.2]} rotation={[-0.1, 0, 0]}>
        <planeGeometry args={[0.5, 0.25]} />
        <meshBasicMaterial color={bodyMid} transparent opacity={0.8} />
      </mesh>

      {/* Brand logo placeholder */}
      <mesh position={[0, 0.09, 1.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.12]} />
        <meshBasicMaterial color="#2a2a2a" />
      </mesh>
    </group>
  );
};

const RobotVacuum3D = () => {
  return (
    <div className="w-64 h-64 touch-none">
      <Canvas camera={{ position: [0, 3, 5], fov: 35 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 8, 5]} intensity={1} castShadow />
        <directionalLight position={[-3, 4, -3]} intensity={0.4} color="#4dd9d9" />
        <pointLight position={[0, 5, 0]} intensity={0.3} />
        <spotLight position={[2, 5, 2]} intensity={0.5} angle={0.3} penumbra={1} />
        <RobotVacuumModel />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default RobotVacuum3D;
