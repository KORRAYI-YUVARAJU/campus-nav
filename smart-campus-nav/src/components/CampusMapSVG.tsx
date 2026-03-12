'use client';
import { motion } from 'framer-motion';
import { campusNodes, CampusNode } from '@/lib/dijkstra';
import { useState } from 'react';

interface Props {
  routePath?: { x: number; y: number; id: string }[];
  selectedBuilding?: string | null;
  onBuildingClick?: (node: CampusNode) => void;
  highlightBuilding?: string | null;
  densityData?: Record<string, 'low' | 'medium' | 'high'>;
}

const shapes: Record<string, { w: number; h: number }> = {
  main_gate:{w:40,h:20}, ground:{w:100,h:80}, admin:{w:60,h:40},
  ece_block:{w:55,h:40}, cse_block:{w:55,h:40}, library:{w:60,h:35},
  civil_block:{w:50,h:35}, canteen:{w:45,h:30}, bus_stand:{w:50,h:25},
  it_dept:{w:50,h:35}, chem_lab:{w:45,h:30}, mech_dept:{w:55,h:35},
  workshop:{w:45,h:30}, auditorium:{w:55,h:40}, pond:{w:70,h:50},
};

const catColors: Record<string, string> = {
  academic:'#60a5fa', admin:'#a78bfa', community:'#34d399', infrastructure:'#f59e0b',
};

export default function CampusMapSVG({ routePath, selectedBuilding, onBuildingClick, highlightBuilding, densityData }: Props) {
  const [hovered, setHovered] = useState<string|null>(null);
  const buildings = campusNodes.filter(n => n.type !== 'intersection');

  const roads = [
    'M780,520 L680,520 L480,520 L340,520 L190,520',
    'M340,520 L340,290 L340,140',
    'M480,520 L480,290',
    'M680,520 L680,290',
    'M190,520 L190,290',
    'M190,290 L340,290 L480,290 L680,290',
    'M340,140 L240,195',
  ];

  const polyline = routePath ? routePath.map((p,i) => `${i?'L':'M'}${p.x},${p.y}`).join(' ') : '';

  return (
    <svg viewBox="0 0 900 700" className="w-full h-full">
      <defs>
        <filter id="bGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="rGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="hGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Grid */}
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-color)" strokeWidth=".3" opacity=".3" />
      </pattern>
      <rect width="900" height="700" fill="url(#grid)" />

      {/* Roads */}
      {roads.map((d,i) => <path key={i} d={d} className="campus-road" strokeLinecap="round" />)}

      {/* Density */}
      {densityData && buildings.map(b => {
        const d = densityData[b.id]; if (!d) return null;
        const s = shapes[b.id] || {w:40,h:30};
        return <circle key={`d-${b.id}`} cx={b.x} cy={b.y} r={Math.max(s.w,s.h)*.8}
          className={d==='low'?'density-low':d==='medium'?'density-medium':'density-high'} opacity=".5" />;
      })}

      {/* Buildings */}
      {buildings.map(b => {
        const s = shapes[b.id]||{w:40,h:30};
        const col = catColors[b.category||'infrastructure'];
        const hl = hovered===b.id || selectedBuilding===b.id || highlightBuilding===b.id;
        return (
          <g key={b.id} className="cursor-pointer"
            onClick={() => onBuildingClick?.(b)}
            onMouseEnter={() => setHovered(b.id)}
            onMouseLeave={() => setHovered(null)}>
            <motion.rect
              x={b.x-s.w/2} y={b.y-s.h/2} width={s.w} height={s.h} rx="4"
              fill="none" stroke={col} strokeWidth={hl?2.5:1.5}
              filter={hl?'url(#hGlow)':'url(#bGlow)'}
              animate={{ opacity: highlightBuilding===b.id ? [.7,1,.7] : 1 }}
              transition={{ duration:1.5, repeat: highlightBuilding===b.id ? Infinity : 0 }}
            />
            <text x={b.x} y={b.y+s.h/2+14} textAnchor="middle"
              fill="var(--text-secondary)" fontSize="9" fontFamily="Inter,sans-serif" fontWeight="500">
              {b.name}
            </text>
            {hovered===b.id && (
              <g>
                <rect x={b.x-50} y={b.y-s.h/2-28} width="100" height="22" rx="6"
                  fill="var(--bg-secondary)" stroke={col} strokeWidth=".5" opacity=".95" />
                <text x={b.x} y={b.y-s.h/2-13} textAnchor="middle" fill={col} fontSize="10" fontWeight="600">
                  {b.name}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Route */}
      {routePath && polyline && (
        <>
          <motion.path d={polyline} fill="none" stroke="rgba(34,211,238,.2)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:2, ease:'easeInOut' }} />
          <motion.path d={polyline} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="10,5" filter="url(#rGlow)"
            initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:2, ease:'easeInOut' }} />
          <motion.path d={polyline} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="10,5" filter="url(#rGlow)"
            animate={{ strokeDashoffset:[-20,0] }} transition={{ duration:1, repeat:Infinity, ease:'linear' }} />
          {routePath.map((p,i) => (
            <motion.circle key={i} cx={p.x} cy={p.y}
              r={i===0||i===routePath.length-1?6:3}
              fill={i===0?'#22d3ee':i===routePath.length-1?'#f43f5e':'#22d3ee'}
              filter="url(#rGlow)"
              initial={{ scale:0 }} animate={{ scale:[0,1.3,1] }}
              transition={{ delay:i*.2, duration:.4 }} />
          ))}
        </>
      )}

      {/* Legend */}
      <g transform="translate(20,650)">
        {[{l:'Academic',c:'#60a5fa'},{l:'Admin',c:'#a78bfa'},{l:'Community',c:'#34d399'},{l:'Infrastructure',c:'#f59e0b'}].map((it,i) => (
          <g key={i} transform={`translate(${i*130},0)`}>
            <rect width="12" height="12" rx="2" fill="none" stroke={it.c} strokeWidth="1.5" />
            <text x="18" y="10" fill="var(--text-tertiary)" fontSize="10" fontFamily="Inter,sans-serif">{it.l}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
