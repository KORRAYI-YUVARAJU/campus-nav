'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';
import { FiSun, FiMoon, FiMenu, FiX, FiNavigation } from 'react-icons/fi';

const links = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore Map' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const path = usePathname();
  const { theme, toggleTheme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('campus-theme') as 'light' | 'dark' | null;
    if (saved) useThemeStore.getState().setTheme(saved);
    else document.documentElement.setAttribute('data-theme', 'dark');
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      {/* ── Top Navbar ── */}
      <motion.nav
        initial={{ y: -100 }} animate={{ y: 0 }}
        transition={{ duration: .6, ease: 'easeOut' }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 shadow-lg backdrop-blur-xl' : 'py-4'}`}
        style={{ background: scrolled ? 'var(--navbar-bg)' : 'transparent', borderBottom: scrolled ? '1px solid var(--border-color)' : 'none' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))', boxShadow:'0 0 20px var(--accent-blue-glow)' }}>
              <FiNavigation className="text-white text-lg" />
            </div>
            <div>
              <span className="text-lg font-bold gradient-text">CampusNav</span>
              <span className="block text-[10px] font-medium" style={{ color:'var(--text-tertiary)' }}>MVGR Smart Navigation</span>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                style={{ color: path === l.href ? 'var(--accent-blue)' : 'var(--text-secondary)' }}>
                {l.label}
                {path === l.href && (
                  <motion.div layoutId="nav-active"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                    style={{ background:'var(--accent-blue)', boxShadow:'0 0 8px var(--accent-blue-glow)' }} />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Theme in navbar */}
            <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:.9 }}
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background:'var(--bg-tertiary)', border:'1px solid var(--border-color)' }}>
              <AnimatePresence mode="wait">
                <motion.div key={theme} initial={{ rotate:-90,opacity:0 }} animate={{ rotate:0,opacity:1 }} exit={{ rotate:90,opacity:0 }} transition={{ duration:.2 }}>
                  {theme === 'dark' ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-indigo-500" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {/* Mobile toggle */}
            <button className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background:'var(--bg-tertiary)', border:'1px solid var(--border-color)' }}
              onClick={() => setOpen(!open)}>
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
              className="md:hidden overflow-hidden"
              style={{ background:'var(--navbar-bg)', borderTop:'1px solid var(--border-color)' }}>
              <div className="px-4 py-4 space-y-2">
                {links.map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium"
                    style={{ color: path === l.href ? 'var(--accent-blue)' : 'var(--text-secondary)', background: path === l.href ? 'var(--bg-tertiary)' : 'transparent' }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Floating Theme Button ── */}
      <motion.button
        initial={{ scale:0 }} animate={{ scale:1 }}
        whileHover={{ scale:1.15 }} whileTap={{ scale:.9 }}
        onClick={toggleTheme}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl cursor-pointer"
        style={{ background:'linear-gradient(135deg,var(--accent-blue),var(--accent-purple))', boxShadow:'0 0 25px var(--accent-blue-glow)' }}>
        {theme === 'dark' ? <FiSun className="text-white text-xl" /> : <FiMoon className="text-white text-xl" />}
      </motion.button>
    </>
  );
}
