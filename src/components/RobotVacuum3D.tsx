import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const RobotVacuumModel = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const tealDark = "#1a5c5c";
  const tealMid = "#2d8a8a";
  const tealBright = "#3dbfbf";
  const tealGlow = "#4dd9d9";

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}>
      {/* Main body - outer ring */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 0.25, 64]} />
        <meshStandardMaterial color={tealDark} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Outer groove ring */}
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[1.5, 0.05, 16, 64]} />
        <meshStandardMaterial color="#0a3333" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Middle section */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.3, 64]} />
        <meshStandardMaterial color={tealMid} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Inner groove ring */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[1.0, 0.04, 16, 64]} />
        <meshStandardMaterial color="#0a3333" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Center bright ring */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.15, 64]} />
        <meshStandardMaterial color={tealBright} metalness={0.5} roughness={0.4} emissive={tealBright} emissiveIntensity={0.2} />
      </mesh>

      {/* Center dark core */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.2, 64]} />
        <meshStandardMaterial color="#0a2626" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Side extensions - left */}
      <mesh position={[-2.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
        <meshStandardMaterial color={tealDark} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Side extensions - right */}
      <mesh position={[2.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
        <meshStandardMaterial color={tealDark} metalness={0.4} roughness={0.6} />
      </mesh>

      {/* LIDAR bump on top */}
      <mesh position={[0, 0.25, -0.7]}>
        <cylinderGeometry args={[0.3, 0.35, 0.15, 32]} />
        <meshStandardMaterial color={tealDark} metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Decorative floating dots */}
      <mesh position={[1.5, 0.8, 1.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={tealGlow} emissive={tealGlow} emissiveIntensity={0.8} />
      </mesh>

      <mesh position={[-1.2, -0.3, 1.5]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={tealGlow} emissive={tealGlow} emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
};

const RobotVacuum3D = () => {
  return (
    <div className="w-64 h-64">
      <Canvas camera={{ position: [0, 2, 5], fov: 40 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#4dd9d9" />
        <pointLight position={[0, 3, 0]} intensity={0.5} color="#3dbfbf" />
        <RobotVacuumModel />
      </Canvas>
    </div>
  );
};

export default RobotVacuum3D;
