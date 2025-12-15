import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const RobotVacuumModel = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.35, -0.3, 0]}>
      {/* Main body - base */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[1.5, 1.55, 0.3, 64]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Main body - top surface */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[1.48, 1.5, 0.12, 64]} />
        <meshPhysicalMaterial 
          color="#f5f5f5" 
          metalness={0.2} 
          roughness={0.3}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Metallic top plate */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.35, 1.45, 0.05, 64]} />
        <meshPhysicalMaterial 
          color="#fafafa" 
          metalness={0.3} 
          roughness={0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* LIDAR bump base */}
      <mesh position={[0, 0.18, -0.4]}>
        <cylinderGeometry args={[0.35, 0.38, 0.12, 32]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* LIDAR bump top with metallic ring */}
      <mesh position={[0, 0.26, -0.4]}>
        <cylinderGeometry args={[0.32, 0.35, 0.06, 32]} />
        <meshPhysicalMaterial 
          color="#e0e0e0" 
          metalness={0.4} 
          roughness={0.2}
          clearcoat={0.8}
        />
      </mesh>

      {/* LIDAR metallic accent ring */}
      <mesh position={[0, 0.28, -0.4]}>
        <torusGeometry args={[0.28, 0.015, 16, 32]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* V indicator on LIDAR */}
      <mesh position={[0, 0.295, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.04, 0.08, 3]} />
        <meshStandardMaterial color="#14b8a6" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Power button area */}
      <mesh position={[0, 0.12, 0.3]} rotation={[-0.1, 0, 0]}>
        <circleGeometry args={[0.08, 32]} />
        <meshBasicMaterial color="#d0d0d0" />
      </mesh>

      {/* Side indicator lines */}
      <mesh position={[-0.3, 0.12, 0.35]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.08, 0.015, 0.001]} />
        <meshBasicMaterial color="#c0c0c0" />
      </mesh>
      <mesh position={[0.3, 0.12, 0.35]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.08, 0.015, 0.001]} />
        <meshBasicMaterial color="#c0c0c0" />
      </mesh>

      {/* Front bumper */}
      <mesh position={[0, -0.08, 1.25]}>
        <boxGeometry args={[1.0, 0.2, 0.25]} />
        <meshStandardMaterial color="#d8d8d8" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Front sensor strip */}
      <mesh position={[0, -0.02, 1.38]}>
        <boxGeometry args={[0.6, 0.08, 0.02]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Side wheel covers */}
      <mesh position={[-1.3, -0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.15, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[1.3, -0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.15, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Back dock connector */}
      <mesh position={[0, -0.15, -1.4]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
};

interface RobotVacuum3DProps {
  size?: "default" | "large";
}

const RobotVacuum3D = ({ size = "default" }: RobotVacuum3DProps) => {
  const sizeClass = size === "large" ? "w-72 h-72 sm:w-80 sm:h-80" : "w-64 h-64";
  
  return (
    <div className={`${sizeClass} touch-none`}>
      <Canvas camera={{ position: [0, 2.5, 4.5], fov: 35 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-3, 5, -3]} intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={0.2} />
        <RobotVacuumModel />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default RobotVacuum3D;
