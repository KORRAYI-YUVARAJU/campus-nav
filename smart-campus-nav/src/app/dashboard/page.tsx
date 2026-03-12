'use client';
import { useState, useEffect, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import CampusMapSVG from '@/components/CampusMapSVG';
import Chatbot from '@/components/Chatbot';
import dynamic from 'next/dynamic';
import { campusNodes, dijkstra, CampusNode } from '@/lib/dijkstra';
import { FiSearch, FiX, FiNavigation, FiMapPin, FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';

const Building3DView = dynamic(() => import('@/components/Building3DView'), { ssr: false });

const events = [
  { title: 'Tech Talk: AI in Education', loc: 'auditorium', time: '2:00 PM', date: 'Today', emoji: '🎤' },
  { title: 'Coding Workshop', loc: 'cse_block', time: '3:00 PM', date: 'Today', emoji: '💻' },
  { title: 'Cultural Practice', loc: 'ground', time: '5:00 PM', date: 'Today', emoji: '🎭' },
  { title: 'Book Fair', loc: 'library', time: '10:00 AM', date: 'Tomorrow', emoji: '📚' },
];

function Content() {
  const sp = useSearchParams();
  const mode = sp.get('mode') || 'visitor';

  const [q, setQ] = useState('');
  const [focused, setFocused] = useState(false);
  const [sel, setSel] = useState<CampusNode | null>(null);
  const [route, setRoute] = useState<{ x: number; y: number; id: string }[] | undefined>();
  const [dest, setDest] = useState<string | null>(null);
  const [show3D, setShow3D] = useState(false);
  const [targetRoom, setTargetRoom] = useState<string | undefined>();
  const [hlBuilding, setHlBuilding] = useState<string | null>(null);

  // Crowd density (simulated)
  const [density, setDensity] = useState<Record<string, 'low' | 'medium' | 'high'>>({
    cse_block: 'high', library: 'medium', canteen: 'high', auditorium: 'low', admin: 'low', ece_block: 'medium', ground: 'low',
  });
  useEffect(() => {
    const iv = setInterval(() => {
      const lvls: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
      setDensity(p => { const n = { ...p }; const k = Object.keys(n); n[k[Math.floor(Math.random() * k.length)]] = lvls[Math.floor(Math.random() * 3)]; return n; });
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const lq = q.toLowerCase();
    const r: { id: string; name: string; type: string; parent?: string }[] = [];
    campusNodes.forEach(n => {
      if (n.type === 'intersection') return;
      if (n.name.toLowerCase().includes(lq) || n.id.includes(lq)) r.push({ id: n.id, name: n.name, type: 'Building' });
      n.rooms?.forEach(rm => { if (rm.toLowerCase().includes(lq)) r.push({ id: rm, name: rm, type: `Room in ${n.name}`, parent: n.id }); });
    });
    return r.slice(0, 8);
  }, [q]);

  const navigate = (did: string) => {
    setDest(did);
    const res = dijkstra('main_gate', did);
    if (res) { setRoute(res.pathCoords); setSel(campusNodes.find(n => n.id === did) || null); }
  };

  const onSearch = (r: { id: string; parent?: string; name: string }) => {
    setQ(''); setFocused(false);
    if (r.parent) { navigate(r.parent); setTargetRoom(r.name); setTimeout(() => setShow3D(true), 2500); }
    else navigate(r.id);
  };

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Campus <span className="gradient-text">Dashboard</span></h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>{mode === 'visitor' ? '👋 Welcome, Visitor' : '🎓 Welcome, Student'}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 z-20">
          <motion.div animate={{ boxShadow: focused ? '0 0 30px var(--accent-blue-glow)' : 'none' }}
            className="relative rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-secondary)', border: `1px solid ${focused ? 'var(--accent-blue)' : 'var(--border-color)'}` }}>
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
            <input value={q} onChange={e => setQ(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 200)}
              placeholder="Search buildings, departments, classrooms…"
              className="w-full pl-12 pr-12 py-4 text-sm outline-none bg-transparent" style={{ color: 'var(--text-primary)' }} />
            {q && <button onClick={() => setQ('')} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}><FiX /></button>}
          </motion.div>
          <AnimatePresence>
            {focused && results.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 w-full rounded-xl overflow-hidden shadow-xl z-30"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                {results.map((r, i) => (
                  <button key={`${r.id}-${i}`} onClick={() => onSearch(r)}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:opacity-80"
                    style={{ borderBottom: i < results.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <FiMapPin style={{ color: 'var(--accent-blue)' }} />
                    <div><p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.name}</p><p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{r.type}</p></div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map / 3D */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {show3D && sel ? (
                <motion.div key="3d" initial={{ opacity: 0, rotateX: 90 }} animate={{ opacity: 1, rotateX: 0 }} exit={{ opacity: 0, rotateX: -90 }} transition={{ duration: .8 }}
                  className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>3D View — {sel.name}</h3>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{targetRoom ? `Navigating to: ${targetRoom}` : 'Interactive 3D model'}</p>
                    </div>
                    <button onClick={() => { setShow3D(false); setTargetRoom(undefined); }} className="px-3 py-1 rounded-lg text-xs" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>Back to Map</button>
                  </div>
                  <Building3DView building={sel} targetFloor={targetRoom ? 1 : -1} targetRoom={targetRoom} />
                </motion.div>
              ) : (
                <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                  <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>MVGR Campus Map</h3>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{route ? `Route: Main Gate → ${sel?.name}` : 'Click a building to navigate'}</p>
                    </div>
                    {route && (
                      <div className="flex gap-2">
                        {sel?.floors && <button onClick={() => setShow3D(true)} className="px-3 py-1 rounded-lg text-xs text-white font-medium"
                          style={{ background: 'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))' }}>View 3D</button>}
                        <button onClick={() => { setRoute(undefined); setSel(null); setDest(null); }} className="px-3 py-1 rounded-lg text-xs"
                          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>Clear Route</button>
                      </div>
                    )}
                  </div>
                  <div className="p-2"><CampusMapSVG routePath={route} selectedBuilding={dest} onBuildingClick={n => { setSel(n); navigate(n.id); }} highlightBuilding={hlBuilding} densityData={density} /></div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Density legend */}
            <div className="mt-4 p-4 rounded-xl flex flex-wrap gap-6" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Crowd Density:</span>
              {[{ l: 'Low', c: '#10b981' }, { l: 'Moderate', c: '#f59e0b' }, { l: 'High', c: '#ef4444' }].map(it => (
                <span key={it.l} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-3 h-3 rounded-full" style={{ background: it.c }} />{it.l}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Building info */}
            {sel && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><FiMapPin style={{ color: 'var(--accent-blue)' }} />{sel.name}</h3>
                <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <p>Category: <span className="font-medium capitalize">{sel.category}</span></p>
                  {sel.floors && <p>Floors: {sel.floors}</p>}
                  {sel.rooms && <div><p className="font-medium mb-1">Rooms:</p>
                    <div className="flex flex-wrap gap-1">
                      {sel.rooms.map(r => (
                        <button key={r} onClick={() => { setTargetRoom(r); setShow3D(true); }}
                          className="px-2 py-1 rounded-md text-xs hover:scale-105 transition-transform"
                          style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>{r}</button>
                      ))}
                    </div>
                  </div>}
                  {density[sel.id] && <p>Crowd: <span className={`font-medium ${density[sel.id] === 'low' ? 'text-green-500' : density[sel.id] === 'medium' ? 'text-yellow-500' : 'text-red-500'}`}>{density[sel.id]?.toUpperCase()}</span></p>}
                </div>
              </motion.div>
            )}

            {/* Events (visitor) */}
            {mode === 'visitor' && (
              <div className="glass-card p-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><FiCalendar style={{ color: 'var(--accent-purple)' }} />Campus Events</h3>
                <div className="space-y-3">
                  {events.map((ev, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .1 }}
                      whileHover={{ scale: 1.02 }}
                      onMouseEnter={() => setHlBuilding(ev.loc)} onMouseLeave={() => setHlBuilding(null)}
                      className="p-3 rounded-xl flex items-center gap-3 cursor-pointer"
                      style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                      <div className="text-2xl">{ev.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{ev.title}</p>
                        <p className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}><FiClock /> {ev.time} · {ev.date}</p>
                      </div>
                      <button onClick={() => navigate(ev.loc)} className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))' }}>
                        <FiNavigation className="text-white text-xs" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick navigate */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><FiNavigation style={{ color: 'var(--accent-blue)' }} />Quick Navigate</h3>
              <div className="grid grid-cols-2 gap-2">
                {campusNodes.filter(n => n.type !== 'intersection').slice(0, 8).map(n => (
                  <button key={n.id} onClick={() => navigate(n.id)}
                    className="px-3 py-2 rounded-lg text-xs text-left hover:scale-105 transition-transform flex items-center gap-2"
                    style={{
                      background: dest === n.id ? 'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))' : 'var(--bg-primary)',
                      color: dest === n.id ? '#fff' : 'var(--text-secondary)',
                      border: `1px solid ${dest === n.id ? 'transparent' : 'var(--border-color)'}`,
                    }}>
                    <FiArrowRight className="text-xs shrink-0" /><span className="truncate">{n.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Chatbot onNavigate={navigate} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p style={{ color: 'var(--text-secondary)' }}>Loading…</p></div>}>
      <Content />
    </Suspense>
  );
}
