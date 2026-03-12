'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Spline from '@splinetool/react-spline';
import Chatbot from '@/components/Chatbot';
import Link from 'next/link';
import { FiArrowRight, FiMapPin, FiNavigation, FiWifi, FiCamera, FiUsers, FiSearch, FiZap } from 'react-icons/fi';

const features = [
  { icon:FiMapPin, title:'Interactive Maps', desc:'Navigate campus with interactive 2D and 3D maps with real-time updates.' },
  { icon:FiNavigation, title:'Shortest Routes', desc:'AI-powered pathfinding using Dijkstra\'s algorithm for optimal routes.' },
  { icon:FiWifi, title:'BLE Navigation', desc:'Bluetooth beacon-based indoor positioning for in-building guidance.' },
  { icon:FiCamera, title:'AR Directions', desc:'Augmented reality overlays with arrows and distances in the real world.' },
  { icon:FiUsers, title:'Crowd Density', desc:'Real-time crowd tracking with color-coded heatmaps per building.' },
  { icon:FiSearch, title:'Smart Search', desc:'Find buildings, rooms, departments, and events with intelligent search.' },
];

const stats = [{value:'50+',label:'Buildings'},{value:'200+',label:'Classrooms'},{value:'15+',label:'Departments'},{value:'24/7',label:'Navigation'}];

function Parallax({children,offset=50}:{children:React.ReactNode;offset?:number}){
  const ref=useRef<HTMLDivElement>(null);
  const{scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
  const y=useTransform(scrollYProgress,[0,1],[offset,-offset]);
  return <motion.div ref={ref} style={{y}}>{children}</motion.div>;
}

export default function Home(){
  return(
    <div className="min-h-screen">
      {/* ════════ HERO ════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Full-screen Spline Background */}
        <div className="absolute inset-0 z-0 pointer-events-auto" style={{ mixBlendMode: 'screen' }}>
          <Spline scene="https://prod.spline.design/qTdzlCwJAPfMm3ji/scene.splinecode" />
          <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 40%, var(--bg-primary) 100%)' }} />
        </div>

        {/* Hero Content Overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pointer-events-none">
          <motion.div initial={{opacity:0,x:-50}} animate={{opacity:1,x:0}} transition={{duration:.8}} className="max-w-xl pointer-events-auto">
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.2}}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
              style={{background:'var(--bg-tertiary)',color:'var(--accent-blue)',border:'1px solid var(--border-color)', backdropFilter: 'blur(10px)'}}>
              <FiZap/> Smart Campus Navigation System
            </motion.div>
            <h1 className="mb-6">
              <span style={{color:'var(--text-primary)'}}>Navigate Your </span>
              <span className="gradient-text">Campus</span><br/>
              <span style={{color:'var(--text-primary)'}}>Like Never Before</span>
            </h1>
            <p className="text-lg mb-8 leading-relaxed max-w-lg" style={{color:'var(--text-secondary)'}}>
              Experience seamless campus navigation with AI-powered pathfinding,
              augmented reality directions, real-time crowd tracking, and indoor
              positioning — all in one intelligent platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/explore"><motion.button whileHover={{scale:1.05}} whileTap={{scale:.95}} className="btn-primary flex items-center gap-2">Explore Map <FiArrowRight/></motion.button></Link>
              <Link href="/about"><motion.button whileHover={{scale:1.05}} whileTap={{scale:.95}} className="btn-secondary glass">Learn More</motion.button></Link>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-12 glass-card p-4 mx-[-1rem]">
              {stats.map((s,i)=>(
                <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.5+i*.1}} className="text-center">
                  <div className="text-2xl font-bold gradient-text">{s.value}</div>
                  <div className="text-xs mt-1" style={{color:'var(--text-tertiary)'}}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════ PARALLAX 1 – Why It Matters ════════ */}
      <section className="py-24 relative overflow-hidden">
        <Parallax offset={60}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-16">
              <h2 className="mb-4">Why <span className="gradient-text">Campus Navigation</span> Matters</h2>
              <p className="max-w-2xl mx-auto" style={{color:'var(--text-secondary)'}}>Large campuses can overwhelm new students, visitors, and sometimes even faculty. Smart navigation transforms the experience.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {[{t:'For New Students',d:'First-year students struggle finding classrooms. Our system gives instant, clear directions from day one.',e:'🎓'},
                {t:'For Visitors',d:'Parents and guests navigate effortlessly without asking, leaving a professional impression.',e:'🏛️'},
                {t:'For Events',d:'Find venues, check crowd levels, and discover activities happening across campus during events.',e:'🎪'},
              ].map((c,i)=>(
                <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.2}}
                  whileHover={{y:-8,scale:1.02}} className="glass-card p-8 text-center">
                  <div className="text-4xl mb-4">{c.e}</div>
                  <h3 className="text-lg font-semibold mb-3" style={{color:'var(--text-primary)'}}>{c.t}</h3>
                  <p className="text-sm leading-relaxed" style={{color:'var(--text-secondary)'}}>{c.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Parallax>
      </section>

      {/* ════════ PARALLAX 2 – Features ════════ */}
      <section className="py-24 relative" style={{background:'var(--bg-secondary)'}}>
        <Parallax offset={40}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-16">
              <h2 className="mb-4">Smart <span className="gradient-text">Navigation Features</span></h2>
              <p className="max-w-2xl mx-auto" style={{color:'var(--text-secondary)'}}>Powered by cutting-edge technology for the most comprehensive navigation experience.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f,i)=>(
                <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}}
                  whileHover={{y:-5}} className="glass-card p-6 group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{background:'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))',boxShadow:'0 0 15px var(--accent-blue-glow)'}}>
                    <f.icon className="text-white text-xl"/>
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{color:'var(--text-primary)'}}>{f.title}</h3>
                  <p className="text-sm" style={{color:'var(--text-secondary)'}}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Parallax>
      </section>

      {/* ════════ PARALLAX 3 – Digital Infrastructure ════════ */}
      <section className="py-24 relative overflow-hidden">
        <Parallax offset={50}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-16">
              <h2 className="mb-4">Digital <span className="gradient-text">Campus Infrastructure</span></h2>
              <p className="max-w-2xl mx-auto" style={{color:'var(--text-secondary)'}}>A comprehensive technology ecosystem powering the future of campus experience.</p>
            </motion.div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                {[{t:'BLE Beacon Network',d:'Bluetooth beacons at strategic points for precise indoor positioning.',c:'#60a5fa'},
                  {t:'Real-time Data Sync',d:'Firebase-powered instant crowd density and event updates.',c:'#a78bfa'},
                  {t:'AI Navigation Engine',d:'ML models for route optimization and natural language queries.',c:'#34d399'},
                  {t:'AR / WebXR Integration',d:'Camera-based augmented reality for immersive wayfinding.',c:'#f59e0b'},
                ].map((tech,i)=>(
                  <motion.div key={i} initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.15}}
                    className="flex gap-4 items-start p-4 rounded-xl hover:scale-[1.02] transition-transform" style={{background:'var(--bg-secondary)'}}>
                    <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{background:tech.c,boxShadow:`0 0 10px ${tech.c}40`}}/>
                    <div><h4 className="font-semibold text-sm mb-1" style={{color:'var(--text-primary)'}}>{tech.t}</h4><p className="text-xs leading-relaxed" style={{color:'var(--text-secondary)'}}>{tech.d}</p></div>
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} className="glass-card p-8 text-center">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((s,i)=>(
                    <motion.div key={i} whileHover={{scale:1.05}} className="p-6 rounded-xl" style={{background:'var(--bg-primary)',border:'1px solid var(--border-color)'}}>
                      <div className="text-3xl font-bold gradient-text">{s.value}</div>
                      <div className="text-xs mt-2" style={{color:'var(--text-tertiary)'}}>{s.label}</div>
                    </motion.div>
                  ))}
                </div>
                <motion.p className="mt-6 text-sm" style={{color:'var(--text-secondary)'}}
                  animate={{opacity:[.5,1,.5]}} transition={{duration:3,repeat:Infinity}}>
                  ⚡ System Active — Real-time Navigation Available
                </motion.p>
              </motion.div>
            </div>
          </div>
        </Parallax>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{borderColor:'var(--border-color)',background:'var(--bg-secondary)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div><h3 className="text-lg font-bold gradient-text mb-3">CampusNav</h3><p className="text-sm" style={{color:'var(--text-secondary)'}}>MVGR Smart Campus Navigation System — Making campus navigation intelligent.</p></div>
            <div><h4 className="font-semibold mb-3" style={{color:'var(--text-primary)'}}>Quick Links</h4>
              <div className="space-y-2 text-sm" style={{color:'var(--text-secondary)'}}>
                <Link href="/explore" className="block hover:text-[var(--accent-blue)]">Explore Map</Link>
                <Link href="/about" className="block hover:text-[var(--accent-blue)]">About</Link>
                <Link href="/contact" className="block hover:text-[var(--accent-blue)]">Contact</Link>
              </div>
            </div>
            <div><h4 className="font-semibold mb-3" style={{color:'var(--text-primary)'}}>Contact</h4>
              <div className="space-y-2 text-sm" style={{color:'var(--text-secondary)'}}>
                <p>MVGR College of Engineering</p><p>Vizianagaram, Andhra Pradesh</p><p>India — 535005</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-xs" style={{borderTop:'1px solid var(--border-color)',color:'var(--text-tertiary)'}}>
            © 2026 CampusNav — Smart Campus Navigation System.
          </div>
        </div>
      </footer>

      <Chatbot/>
    </div>
  );
}
