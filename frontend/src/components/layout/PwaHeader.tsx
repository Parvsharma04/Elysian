'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export function PwaHeader() {
  const { profile, signOut } = useAuth();
  const [isStandalone, setIsStandalone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
  }, []);

  // Only show in standalone PWA mode on mobile/tablet (desktop has the sidebar)
  if (!isStandalone || !profile) return null;

  return (
    <>
      <div
        className="pwa-header fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:hidden"
        style={{
          paddingTop: 'calc(var(--safe-top, 0px) + 8px)',
          paddingBottom: '8px',
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span
          className="text-xs font-semibold truncate"
          style={{ color: 'var(--text-secondary)' }}
        >
          {profile.name || profile.email}
        </span>

        <motion.button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-pointer"
          style={{
            background: menuOpen ? 'var(--bg-elevated)' : 'transparent',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronDown
            size={14}
            style={{
              color: 'var(--text-tertiary)',
              transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms',
            }}
          />
        </motion.button>
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            {/* Menu */}
            <motion.div
              className="fixed right-4 z-50 rounded-md border overflow-hidden lg:hidden"
              style={{
                top: 'calc(var(--safe-top, 0px) + 44px)',
                background: 'var(--bg-card-solid)',
                borderColor: 'var(--border-default)',
              }}
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut();
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium w-full transition-colors hover:bg-white/[0.04] cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
              >
                <LogOut size={13} style={{ color: 'var(--text-tertiary)' }} />
                Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
