'use client';
import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { CampusNode } from '@/lib/dijkstra';

interface Props { building: CampusNode; targetFloor?: number; targetRoom?: string }

function Floor({ y, w, d, num, rooms, isTarget, targetRoom }: {
  y:number; w:number; d:number; num:number; rooms:string[]; isTarget:boolean; targetRoom?:string;
}) {
  return (
    <group position={[0,y,0]}>
      <mesh>
        <boxGeometry args={[w,.05,d]} />
        <meshPhongMaterial color={isTarget?'#22d3ee':'#60a5fa'} transparent opacity={isTarget?.5:.15} wireframe={!isTarget} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(w,.05,d)]} />
        <lineBasicMaterial color={isTarget?'#22d3ee':'#60a5fa'} transparent opacity={.6} />
      </lineSegments>
      {rooms.map((room,i) => {
        const cols = Math.ceil(Math.sqrt(rooms.length));
        const row = Math.floor(i/cols), col = i%cols;
        const rw = (w-.4)/cols, rd = (d-.4)/2;
        const xp = -w/2+.2+col*rw+rw/2, zp = row===0?-d/4:d/4;
        const isR = room===targetRoom;
        return (
          <group key={room} position={[xp,.1,zp]}>
            <mesh>
              <boxGeometry args={[rw-.1,.8,rd-.1]} />
              <meshPhongMaterial color={isR?'#f43f5e':isTarget?'#22d3ee':'#60a5fa'} transparent opacity={isR?.6:.1} wireframe={!isR} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(rw-.1,.8,rd-.1)]} />
              <lineBasicMaterial color={isR?'#f43f5e':isTarget?'#22d3ee':'#60a5fa'} transparent opacity={isR?.9:.4} />
            </lineSegments>
            <Text position={[0,.5,0]} fontSize={.12} color={isR?'#f43f5e':'#60a5fa'} anchorX="center" anchorY="middle">{room}</Text>
          </group>
        );
      })}
      <Text position={[-w/2-.3,.1,0]} fontSize={.15} color={isTarget?'#22d3ee':'#60a5fa'} anchorX="right" anchorY="middle">{`F${num}`}</Text>
    </group>
  );
}

function Model({ building, targetFloor=-1, targetRoom }: Props) {
  const ref = useRef<THREE.Group>(null);
  const floors = building.floors||2, rooms = building.rooms||[];
  const rpf = Math.ceil(rooms.length/floors);
  useFrame(s => { if(ref.current) ref.current.rotation.y = Math.sin(s.clock.elapsedTime*.3)*.1 });
  const w=3, d=2, fh=1.2;
  return (
    <group ref={ref}>
      {Array.from({length:floors}).map((_,i) => {
        const fr = rooms.slice(i*rpf,(i+1)*rpf);
        if(targetFloor!==-1 && Math.abs(i-targetFloor)>1) return null;
        return <Floor key={i} y={i*fh} w={w} d={d} num={i+1} rooms={fr} isTarget={i===targetFloor} targetRoom={targetRoom} />;
      })}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(w+.1,floors*fh,d+.1)]} />
        <lineBasicMaterial color="#60a5fa" transparent opacity={.15} />
      </lineSegments>
      <Text position={[0,floors*fh+.3,0]} fontSize={.2} color="#60a5fa" anchorX="center" anchorY="middle" fontWeight={700}>{building.name}</Text>
    </group>
  );
}

export default function Building3DView({ building, targetFloor, targetRoom }: Props) {
  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden" style={{ background:'var(--map-bg)' }}>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center" style={{color:'var(--text-secondary)'}}>Loading 3D…</div>}>
        <Canvas>
          <PerspectiveCamera makeDefault position={[5,4,5]} />
          <OrbitControls enableDamping dampingFactor={.05} minDistance={3} maxDistance={15} />
          <ambientLight intensity={.5} />
          <pointLight position={[10,10,10]} intensity={.8} />
          <pointLight position={[-10,5,-10]} intensity={.3} color="#a78bfa" />
          <Model building={building} targetFloor={targetFloor} targetRoom={targetRoom} />
          <gridHelper args={[20,20,'#1e293b','#1e293b']} position={[0,-.1,0]} />
        </Canvas>
      </Suspense>
    </div>
  );
}
