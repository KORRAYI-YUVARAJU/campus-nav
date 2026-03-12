'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { useRouter } from 'next/navigation';
import { FiUser, FiUsers, FiLock, FiMail, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

export default function ExplorePage() {
  const [showOpts, setShowOpts] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [roll, setRoll] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();

  const onInsider = () => { setShowOpts(false); setShowLogin(true); setTimeout(() => setFlipped(true), 300); };
  const onVisitor = () => router.push('/dashboard?mode=visitor');

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setErr('');
    try {
      await new Promise(r => setTimeout(r, 1500));
      if (roll && pw) router.push('/dashboard?mode=insider');
      else setErr('Please fill in all fields');
    } catch { setErr('Login failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-20">
      {/* Blurred Spline Map bg */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 top-[20%] flex items-center justify-center opacity-30" style={{ filter: 'blur(8px)', mixBlendMode: 'screen' }}>
          <Spline scene="https://prod.spline.design/qTdzlCwJAPfMm3ji/scene.splinecode" />
        </div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center,transparent 30%,var(--bg-primary) 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-lg px-4">
        <AnimatePresence mode="wait">
          {/* ── Options ── */}
          {showOpts && (
            <motion.div key="opts" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }} className="glass-card p-8">
              <div className="text-center mb-8">
                <h2 className="mb-3"><span className="gradient-text">Explore</span> Campus</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Choose how you&apos;d like to navigate the MVGR campus</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <motion.button whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: .98 }} onClick={onInsider}
                  className="p-6 rounded-2xl text-center group" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                    style={{ background: 'linear-gradient(135deg,#3b82f6,#60a5fa)', boxShadow: '0 0 20px rgba(59,130,246,.3)' }}>
                    <FiUser className="text-white text-2xl" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>College Insiders</h3>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Students & Faculty</p>
                </motion.button>

                <motion.button whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: .98 }} onClick={onVisitor}
                  className="p-6 rounded-2xl text-center group" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                    style={{ background: 'linear-gradient(135deg,#8b5cf6,#a78bfa)', boxShadow: '0 0 20px rgba(139,92,246,.3)' }}>
                    <FiUsers className="text-white text-2xl" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Visitors</h3>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Guests & Parents</p>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Flip-Card Login ── */}
          {showLogin && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className={`flip-card ${flipped ? 'flipped' : ''}`} style={{ minHeight: 480 }}>
                <div className="flip-card-inner" style={{ minHeight: 480 }}>
                  {/* Front */}
                  <div className="flip-card-front glass-card flex items-center justify-center">
                    <div className="text-center">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' }}>
                        <FiLock className="text-white text-2xl" />
                      </motion.div>
                      <p style={{ color: 'var(--text-secondary)' }}>Preparing login…</p>
                    </div>
                  </div>

                  {/* Back – Form */}
                  <div className="flip-card-back glass-card p-8">
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                        style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', boxShadow: '0 0 20px rgba(59,130,246,.3)' }}>
                        <FiLock className="text-white text-xl" />
                      </div>
                      <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Welcome Back</h2>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Sign in to navigate</p>
                    </div>
                    <form onSubmit={onLogin} className="space-y-4">
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-tertiary)' }} />
                        <input type="text" placeholder="Roll Number" value={roll} onChange={e => setRoll(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none"
                          style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
                      </div>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-tertiary)' }} />
                        <input type={showPw ? 'text' : 'password'} placeholder="Password" value={pw} onChange={e => setPw(e.target.value)}
                          className="w-full pl-11 pr-12 py-3 rounded-xl text-sm outline-none"
                          style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                          {showPw ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded accent-blue-500" />
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Remember me</span>
                        </label>
                        <button type="button" className="text-xs font-medium" style={{ color: 'var(--accent-blue)' }}>Forgot password?</button>
                      </div>
                      {err && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-500 text-center">{err}</motion.p>}
                      <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }} disabled={loading}
                        className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', boxShadow: '0 4px 15px rgba(59,130,246,.3)' }}>
                        {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                          : <>Sign In <FiArrowRight /></>}
                      </motion.button>
                    </form>
                    <div className="mt-4 text-center">
                      <button onClick={() => { setFlipped(false); setTimeout(() => { setShowLogin(false); setShowOpts(true); }, 500); }}
                        className="text-xs" style={{ color: 'var(--text-tertiary)' }}>← Back to options</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
