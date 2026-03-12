'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Chatbot from '@/components/Chatbot';
import { FiSend, FiMessageSquare, FiAlertTriangle, FiFileText, FiCheck, FiArrowLeft } from 'react-icons/fi';

type CT = 'request' | 'feedback' | 'issue' | null;

export default function ContactPage() {
  const [active, setActive] = useState<CT>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [roll, setRoll] = useState(''); const [role, setRole] = useState('student');
  const [reqType, setReqType] = useState('event'); const [desc, setDesc] = useState('');
  const [feedback, setFeedback] = useState(''); const [issue, setIssue] = useState('');
  const [email, setEmail] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try { await new Promise(r => setTimeout(r, 1500)); setSubmitted(true); }
    catch { alert('Failed. Try again.'); }
    finally { setSubmitting(false); }
  };
  const reset = () => { setActive(null); setSubmitted(false); setRoll(''); setRole('student'); setReqType('event'); setDesc(''); setFeedback(''); setIssue(''); setEmail(''); };

  const inp = { background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' };

  const types = [
    { type: 'request' as CT, icon: FiFileText, t: 'Request System', d: 'Submit event or class exchange requests', g: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
    { type: 'feedback' as CT, icon: FiMessageSquare, t: 'Feedback', d: 'Share your experience and suggestions', g: 'linear-gradient(135deg,#8b5cf6,#a78bfa)' },
    { type: 'issue' as CT, icon: FiAlertTriangle, t: 'Issue / Report', d: 'Report bugs or navigation issues', g: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="mb-3">Get in <span className="gradient-text">Touch</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Have a request, feedback, or issue? We&apos;re here to help.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div key="ok" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }} className="glass-card p-10 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: .5 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'linear-gradient(135deg,#10b981,#34d399)', boxShadow: '0 0 30px rgba(16,185,129,.4)' }}>
                <FiCheck className="text-white text-3xl" />
              </motion.div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Submitted Successfully!</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>We will get back to you soon.</p>
              <button onClick={reset} className="btn-primary">Submit Another</button>
            </motion.div>
          ) : !active ? (
            <motion.div key="sel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-8">
              <div className="grid sm:grid-cols-3 gap-4">
                {types.map(ct => (
                  <motion.button key={ct.type} whileHover={{ y: -8, scale: 1.03 }} whileTap={{ scale: .97 }}
                    onClick={() => setActive(ct.type)}
                    className="p-6 rounded-2xl text-center group" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                      style={{ background: ct.g, boxShadow: '0 0 20px rgba(59,130,246,.2)' }}>
                      <ct.icon className="text-white text-xl" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{ct.t}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{ct.d}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8">
              <button onClick={() => setActive(null)} className="flex items-center gap-2 text-sm mb-6 hover:opacity-70" style={{ color: 'var(--text-tertiary)' }}><FiArrowLeft /> Back</button>
              <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                {active === 'request' ? 'Submit a Request' : active === 'feedback' ? 'Share Feedback' : 'Report an Issue'}
              </h2>
              <form onSubmit={submit} className="space-y-4">
                {active === 'request' && <>
                  <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Roll Number</label>
                    <input type="text" value={roll} onChange={e => setRoll(e.target.value)} placeholder="e.g., 21BQ1A0501" required className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inp} /></div>
                  <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Role</label>
                    <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inp}>
                      <option value="student">Student</option><option value="faculty">Faculty</option>
                    </select></div>
                  <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Request Type</label>
                    <select value={reqType} onChange={e => setReqType(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inp}>
                      <option value="event">Event Request</option><option value="class_exchange">Class Exchange</option>
                    </select></div>
                  <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Description</label>
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe your request…" required rows={4} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inp} /></div>
                </>}
                {active === 'feedback' && <>
                  <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Email (optional)</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inp} /></div>
                  <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Your Feedback</label>
                    <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Tell us about your experience…" required rows={5} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inp} /></div>
                </>}
                {active === 'issue' && <>
                  <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={inp} /></div>
                  <div><label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Describe the Issue</label>
                    <textarea value={issue} onChange={e => setIssue(e.target.value)} placeholder="Describe the bug or issue…" required rows={5} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={inp} /></div>
                </>}
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }} disabled={submitting}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', boxShadow: '0 4px 15px rgba(59,130,246,.3)' }}>
                  {submitting ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    : <>Submit <FiSend /></>}
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Chatbot />
    </div>
  );
}
