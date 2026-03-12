'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Chatbot from '@/components/Chatbot';
import { FiAward, FiUsers, FiBookOpen, FiMapPin, FiStar, FiZap, FiShield, FiGlobe } from 'react-icons/fi';

function Counter({ target, label, icon: Icon }: { target: number; label: string; icon: React.ElementType }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let s = 0; const inc = target / 125;
    const t = setInterval(() => { s += inc; if (s >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(s)); }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return (
    <motion.div ref={ref} whileHover={{ y: -5, scale: 1.03 }} className="glass-card p-6 text-center">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
        style={{ background: 'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))', boxShadow: '0 0 15px var(--accent-blue-glow)' }}>
        <Icon className="text-white text-xl" />
      </div>
      <div className="text-3xl font-bold gradient-text">{count}+</div>
      <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{label}</div>
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="mb-4">About <span className="gradient-text">MVGR</span></h1>
          <p className="max-w-2xl mx-auto text-lg" style={{ color: 'var(--text-secondary)' }}>
            Maharaj Vijayaram Gajapathi Raj College of Engineering — A premier institution committed to academic excellence and innovation.
          </p>
        </motion.div>

        {/* About College */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 mb-12">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>About the <span className="gradient-text">College</span></h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>MVGR College of Engineering (MVGRCE) is a prestigious autonomous engineering college located in Vizianagaram, Andhra Pradesh, affiliated to JNTU Kakinada.</p>
              <p>The college offers UG and PG programs across engineering branches with state-of-the-art infrastructure, experienced faculty, and a strong research culture.</p>
              <p>Spanning 30+ acres with modern buildings, labs, a central library, sports facilities, and lush green landscapes — one of the finest campuses in AP.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Counter target={50} label="Buildings" icon={FiMapPin} />
              <Counter target={5000} label="Students" icon={FiUsers} />
              <Counter target={200} label="Faculty" icon={FiBookOpen} />
              <Counter target={15} label="Departments" icon={FiAward} />
            </div>
          </div>
        </motion.section>

        {/* Achievements */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <h2 className="text-xl font-bold mb-8 text-center"><span className="gradient-text">Achievements</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FiAward, t: 'NAAC A+ Grade', d: 'Highest grade by the National Assessment and Accreditation Council.' },
              { icon: FiStar, t: 'NBA Accredited', d: 'Multiple departments accredited by the National Board of Accreditation.' },
              { icon: FiBookOpen, t: 'Research Excellence', d: '500+ research papers published in international journals.' },
              { icon: FiGlobe, t: 'Global Placements', d: 'Students placed in top MNCs around the world.' },
            ].map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .1 }}
                whileHover={{ y: -8 }} className="glass-card p-6 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))', boxShadow: '0 0 15px var(--accent-blue-glow)' }}>
                  <a.icon className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{a.t}</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{a.d}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Infrastructure */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 mb-12">
          <h2 className="text-xl font-bold mb-6">Campus <span className="gradient-text">Infrastructure</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: 'Academic Blocks', items: ['CSE Department', 'ECE Department', 'IT Department', 'Civil Engineering', 'Mechanical Dept'], c: '#60a5fa' },
              { t: 'Facilities', items: ['Central Library', 'Auditorium', 'Canteen', 'Sports Ground', 'Bus Stand'], c: '#34d399' },
              { t: 'Technology', items: ['Wi-Fi Campus', 'Smart Classrooms', 'Computer Labs', 'Digital Library', 'Research Centers'], c: '#a78bfa' },
            ].map((sec, i) => (
              <div key={i}>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: sec.c }} />{sec.t}
                </h4>
                <ul className="space-y-2">
                  {sec.items.map((it, j) => (
                    <li key={j} className="text-xs flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <span className="w-1 h-1 rounded-full" style={{ background: sec.c, opacity: .6 }} />{it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Website Features */}
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-bold mb-8 text-center">Website <span className="gradient-text">Features</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FiMapPin, t: 'Interactive 2D Map', d: 'Click-to-navigate SVG campus map with building categories.' },
              { icon: FiZap, t: 'Smart Pathfinding', d: 'Dijkstra algorithm for shortest routes between locations.' },
              { icon: FiShield, t: '3D Building View', d: 'Three.js transparent models with floor-level navigation.' },
              { icon: FiUsers, t: 'Crowd Tracking', d: 'Real-time density monitoring with Firebase Realtime DB.' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .1 }}
                whileHover={{ y: -5, scale: 1.02 }} className="p-6 rounded-2xl text-center"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--bg-tertiary)' }}>
                  <f.icon style={{ color: 'var(--accent-blue)' }} />
                </div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{f.t}</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{f.d}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
      <Chatbot />
    </div>
  );
}
