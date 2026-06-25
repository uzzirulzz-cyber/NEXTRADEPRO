'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, ChevronLeft, Shield, Settings, LogOut, Gift } from 'lucide-react';
import { useStore, Pages } from '@/store/useStore';
import Link from 'next/link';
import Image from 'next/image';

const pageTitles: Record<string, string> = {
  [Pages.DASHBOARD]: 'NexTrade',
  [Pages.TRADING]: 'Trading',
  [Pages.SPOT]: 'Spot',
  [Pages.FUTURES]: 'Futures',
  [Pages.WALLET]: 'Wallet',
  [Pages.DEPOSIT]: 'Deposit',
  [Pages.WITHDRAW]: 'Withdraw',
  [Pages.EARN]: 'Earn',
  [Pages.TRANSACTIONS]: 'Transactions',
  [Pages.PROFILE]: 'Profile',
  [Pages.SECURITY]: 'Security',
  [Pages.NOTIFICATIONS]: 'Notifications',
  [Pages.REFERRAL]: 'Referral',
  [Pages.LOCK_SCREEN]: 'Locked',
};

export default function MobileTopBar() {
  const { currentPage, user, navigate, goBack, pageHistory, logout } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const title = pageTitles[currentPage] || 'NexTrade';
  const canGoBack = pageHistory.length > 1 && currentPage !== Pages.DASHBOARD;

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'SUB_AGENT';

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 54,
        background: 'rgba(10, 15, 26, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(192, 199, 209, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {canGoBack && (
          <button onClick={goBack} style={{ background: 'none', border: 'none', color: '#C0C7D1', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <ChevronLeft size={22} />
          </button>
        )}
        {currentPage === Pages.DASHBOARD ? (
          <Image src="/logo-sm.png" alt="NexTrade Pro" width={32} height={32} style={{ borderRadius: 8, objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>
            {title}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <button onClick={() => navigate(Pages.NOTIFICATIONS)} style={{ background: 'none', border: 'none', color: '#C0C7D1', cursor: 'pointer', padding: 6, borderRadius: 8 }}>
          <Bell size={20} />
        </button>

        <div ref={menuRef} style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(229, 57, 53, 0.1)', border: '1px solid rgba(229, 57, 53, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#FFD700' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8, minWidth: 200,
              background: '#0E2248', border: '1px solid rgba(192, 199, 209, 0.15)',
              borderRadius: 14, padding: '6px 0', boxShadow: '0 12px 48px rgba(0,0,0,0.5), 0 0 20px rgba(229,57,53,0.08)', zIndex: 200,
            }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(192,199,209,0.1)' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#FFFFFF', fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: 11, color: '#7A8599', marginTop: 2 }}>{user?.email || ''}</div>
              </div>
              <MenuRow icon={<Gift size={16} />} label="Referral" onClick={() => { navigate(Pages.REFERRAL); setMenuOpen(false); }} />
              <MenuRow icon={<Shield size={16} />} label="Security" onClick={() => { navigate(Pages.SECURITY); setMenuOpen(false); }} />
              <MenuRow icon={<Settings size={16} />} label="Notifications" onClick={() => { navigate(Pages.NOTIFICATIONS); setMenuOpen(false); }} />

              {isAdmin && (
                <>
                  <div style={{ height: 1, background: 'rgba(192,199,209,0.1)', margin: '4px 0' }} />
                  <Link href="/admin" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', color: '#FFD700', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
                    <Settings size={16} /> Admin Panel
                  </Link>
                </>
              )}

              <div style={{ height: 1, background: 'rgba(192,199,209,0.1)', margin: '4px 0' }} />
              <MenuRow icon={<LogOut size={16} />} label="Sign Out" danger onClick={() => { logout(); setMenuOpen(false); }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuRow({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px',
      background: 'none', border: 'none', color: danger ? '#FF4757' : '#C0C7D1',
      fontSize: 13, cursor: 'pointer', textAlign: 'left',
    }}>
      {icon}{label}
    </button>
  );
}