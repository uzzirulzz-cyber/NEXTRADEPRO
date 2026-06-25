'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserCog,
  ArrowLeftRight,
  WalletCards,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  AlertTriangle,
  Settings,
  BellRing,
  FileText,
  Ticket,
  LogOut,
  LayoutDashboard,
  Menu,
  Home,
  Lock,
} from 'lucide-react';
import Image from 'next/image';

const adminNav = [
  { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
  { icon: <UserCog size={20} />, label: 'Agents', path: '/admin/agents' },
  { icon: <ArrowLeftRight size={20} />, label: 'Trades', path: '/admin/trades' },
  { icon: <WalletCards size={20} />, label: 'Wallets', path: '/admin/wallets' },
  { icon: <ArrowUpRight size={20} />, label: 'Withdrawals', path: '/admin/withdrawals' },
  { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/admin/analytics' },
  { icon: <DollarSign size={20} />, label: 'Commissions', path: '/admin/commissions' },
  { icon: <AlertTriangle size={20} />, label: 'Risk', path: '/admin/risk' },
  { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
  { icon: <BellRing size={20} />, label: 'Notifications', path: '/admin/notifications' },
  { icon: <FileText size={20} />, label: 'Audit', path: '/admin/audit' },
  { icon: <Ticket size={20} />, label: 'Invitations', path: '/admin/invitations' },
];

const pageTitles: Record<string, string> = {
  '/admin': 'Admin Dashboard',
  '/admin/users': 'User Management',
  '/admin/agents': 'Agent Management',
  '/admin/trades': 'Trade Management',
  '/admin/wallets': 'Wallet Management',
  '/admin/withdrawals': 'Withdrawal Management',
  '/admin/analytics': 'Analytics',
  '/admin/commissions': 'Commissions',
  '/admin/risk': 'Risk Management',
  '/admin/settings': 'Platform Settings',
  '/admin/notifications': 'Admin Notifications',
  '/admin/audit': 'Audit Log',
  '/admin/invitations': 'Invitation Codes',
};

function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nextrade_token');
      localStorage.removeItem('nextrade_user');
      window.location.href = '/';
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        className="relative z-10 h-full sidebar"
        animate={{ width: open ? 260 : 70 }}
        transition={{ duration: 0.3, ease: 'easeInOut' as const }}
      >
        <div
          className="flex items-center gap-3 px-4 py-5 border-b"
          style={{ borderColor: 'rgba(192, 199, 209, 0.1)' }}
        >
          <Image
            src="/logo-admin.png"
            alt="NexTrade Pro"
            width={36}
            height={36}
            style={{ borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
          />
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                <span style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>
                  NexTrade <span style={{ color: '#FFD700' }}>Pro</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 overflow-y-auto py-3" style={{ overflowX: 'hidden' }}>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-5 py-2"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#7A8599',
                }}
              >
                Admin Panel
              </motion.div>
            )}
          </AnimatePresence>

          {adminNav.map((item) => {
            const isActive = pathname === item.path;
            return (
              <div
                key={item.path}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  router.push(item.path);
                  onClose();
                }}
                title={!open ? item.label : undefined}
                style={{
                  justifyContent: open ? 'flex-start' : 'center',
                  padding: open ? '10px 16px' : '10px 0',
                  margin: open ? '2px 8px' : '2px 0',
                  cursor: 'pointer',
                }}
              >
                <span style={{ flexShrink: 0, color: isActive ? '#FFD700' : undefined }}>{item.icon}</span>
                <AnimatePresence>
                  {open && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="border-t" style={{ borderColor: 'rgba(192, 199, 209, 0.1)' }}>
          <div
            className="sidebar-item"
            onClick={() => router.push('/')}
            style={{
              justifyContent: open ? 'flex-start' : 'center',
              padding: open ? '10px 16px' : '10px 0',
              margin: open ? '2px 8px' : '2px 0',
              cursor: 'pointer',
            }}
          >
            <Home size={20} />
            <AnimatePresence>
              {open && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                >
                  Frontend
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div
            className="sidebar-item"
            onClick={handleLogout}
            style={{
              justifyContent: open ? 'flex-start' : 'center',
              color: '#FF4757',
              padding: open ? '10px 16px' : '10px 0',
              margin: open ? '0 8px 8px' : '0 0 8px',
              cursor: 'pointer',
            }}
          >
            <LogOut size={20} />
            <AnimatePresence>
              {open && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function AdminHeader({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    try {
      const u = localStorage.getItem('nextrade_user');
      if (u) setUser(JSON.parse(u));
    } catch {}
  }, []);

  const title = pageTitles[pathname] || 'Admin';

  return (
    <header
      className="flex items-center justify-between px-6 h-16 border-b"
      style={{
        background: 'rgba(10, 15, 26, 0.95)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(192, 199, 209, 0.1)',
        flexShrink: 0,
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg transition-colors cursor-pointer"
          style={{ color: '#C0C7D1' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,57,53,0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Menu size={20} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF' }}>
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          style={{
            color: '#C0C7D1',
            fontSize: 13,
            border: '1px solid rgba(192,199,209,0.12)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,57,53,0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Home size={14} />
          <span className="hidden sm:inline">Frontend</span>
        </button>

        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
          <div
            className="flex items-center justify-center rounded-full font-semibold"
            style={{
              width: 32,
              height: 32,
              background: 'rgba(229, 57, 53, 0.15)',
              border: '1px solid rgba(229, 57, 53, 0.3)',
              fontSize: 13,
              color: '#FFD700',
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, color: '#FFFFFF' }}>
              {user?.name || 'Admin'}
            </div>
            <span className="badge badge-yellow" style={{ fontSize: 10, padding: '1px 6px' }}>
              {user?.role || 'SUPER_ADMIN'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('nextrade_token');
      const userStr = localStorage.getItem('nextrade_user');
      if (!token || !userStr) {
        router.replace('/');
        return;
      }
      const user = JSON.parse(userStr);
      if (user.role !== 'SUPER_ADMIN' && user.role !== 'SUB_AGENT') {
        router.replace('/');
        return;
      }
      setAuthorized(true);
    } catch {
      router.replace('/');
    } finally {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0F1A' }}>
        <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid rgba(192,199,209,0.12)', borderTopColor: '#E53935', borderRadius: '50%' }} />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="relative flex h-screen overflow-hidden" style={{ background: '#0A0F1A' }}>
      {/* Background image with dark overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/admin-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(10,15,26,0.92), rgba(6,15,35,0.88))',
        }}
      />

      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative z-10 flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminHeader open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={usePathname()}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ minHeight: '100%' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}