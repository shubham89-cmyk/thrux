"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function PointerLight() {
  const light = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();
  useFrame(state => {
    if (!light.current) return;
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;
    light.current.position.x = THREE.MathUtils.lerp(light.current.position.x, x, 0.08);
    light.current.position.y = THREE.MathUtils.lerp(light.current.position.y, y, 0.08);
  });
  return <pointLight ref={light} intensity={2.4} distance={14} color="#d7ff8b" position={[2, 1, 4]} />;
}

function ChromeCore({ density }: { density: number }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!group.current || !ring.current) return;
    group.current.rotation.y += delta * 0.22;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.35, 0.04);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -state.pointer.x * 0.25, 0.04);
    ring.current.rotation.x += delta * 0.55;
    ring.current.rotation.y -= delta * 0.35;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.03;
    group.current.scale.setScalar(pulse);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.55}>
      <group ref={group} position={[0.55, 0.1, 0]}>
        <mesh>
          <icosahedronGeometry args={[1.15, 1]} />
          <MeshDistortMaterial
            color="#f4f4f2"
            emissive="#2a3318"
            emissiveIntensity={0.35}
            metalness={0.95}
            roughness={0.12}
            distort={0.28}
            speed={1.6}
          />
        </mesh>
        <mesh ref={ring} scale={1.55}>
          <torusGeometry args={[1.05, 0.035, 24, density > 0.7 ? 128 : 64]} />
          <meshStandardMaterial color="#d7ff8b" metalness={1} roughness={0.18} emissive="#d7ff8b" emissiveIntensity={0.45} />
        </mesh>
        <mesh rotation={[Math.PI / 2.4, 0.4, 0.2]} scale={1.85}>
          <torusGeometry args={[1.05, 0.012, 16, density > 0.7 ? 96 : 48]} />
          <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.25} transparent opacity={0.55} />
        </mesh>
        <Sparkles count={Math.round(40 * density)} scale={4.2} size={2.2} speed={0.35} opacity={0.55} color="#d7ff8b" />
      </group>
    </Float>
  );
}

function ParticleField({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.02;
    points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, state.pointer.y * 0.08, 0.02);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.028} color="#d7ff8b" transparent opacity={0.55} depthWrite={false} sizeAttenuation />
    </points>
  );
}

function SceneContents() {
  const { size } = useThree();
  const compact = size.width < 800;
  const density = compact ? 0.45 : 1;
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 6, 18]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 2]} intensity={1.1} color="#ffffff" />
      <PointerLight />
      <ChromeCore density={density} />
      <ParticleField count={compact ? 420 : 1100} />
      <mesh position={[0, -2.4, -2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshBasicMaterial color="#d7ff8b" transparent opacity={0.03} />
      </mesh>
    </>
  );
}

export function ThruxScene({ className = "" }: { className?: string }) {
  return (
    <div className={`webgl-stage ${className}`} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.2, 5.2], fov: 42, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <SceneContents />
      </Canvas>
      <div className="webgl-vignette" />
    </div>
  );
}
