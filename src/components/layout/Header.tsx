'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  Lock,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { useStore, Pages } from '@/store/useStore';

const pageTitles: Record<string, string> = {
  [Pages.LOGIN]: 'Sign In',
  [Pages.REGISTER]: 'Create Account',
  [Pages.DASHBOARD]: 'Dashboard',
  [Pages.TRADING]: 'Trading',
  [Pages.SPOT]: 'Spot Trading',
  [Pages.FUTURES]: 'Futures Trading',
  [Pages.WALLET]: 'Wallet',
  [Pages.DEPOSIT]: 'Deposit',
  [Pages.WITHDRAW]: 'Withdraw',
  [Pages.EARN]: 'Earn',
  [Pages.TRANSACTIONS]: 'Transactions',
  [Pages.PROFILE]: 'Profile',
  [Pages.SECURITY]: 'Security',
  [Pages.NOTIFICATIONS]: 'Notifications',
  [Pages.REFERRAL]: 'Referral',
  [Pages.LOCK_SCREEN]: 'Lock Screen',
  [Pages.ADMIN_USERS]: 'User Management',
  [Pages.ADMIN_AGENTS]: 'Agent Management',
  [Pages.ADMIN_TRADES]: 'Trade Management',
  [Pages.ADMIN_WALLETS]: 'Wallet Management',
  [Pages.ADMIN_ANALYTICS]: 'Analytics',
  [Pages.ADMIN_COMMISSIONS]: 'Commissions',
  [Pages.ADMIN_RISK]: 'Risk Management',
  [Pages.ADMIN_SETTINGS]: 'Platform Settings',
  [Pages.ADMIN_NOTIFICATIONS]: 'Admin Notifications',
  [Pages.ADMIN_AUDIT]: 'Audit Log',
  [Pages.ADMIN_INVITATIONS]: 'Invitation Codes',
};

export default function Header() {
  const { currentPage, user, unreadCount, toggleSidebar, navigate, logout, token } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const title = pageTitles[currentPage] || 'NexTrade Pro';

  // Fetch wallet balance
  useEffect(() => {
    if (!token) return;
    async function fetchWallet() {
      try {
        const res = await fetch('/api/wallet', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setWalletBalance(data.totalEquity || 0);
        }
      } catch {
        // silently fail
      }
    }
    fetchWallet();
  }, [token]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleBadgeClass =
    user?.role === 'SUPER_ADMIN'
      ? 'badge-yellow'
      : user?.role === 'SUB_AGENT'
      ? 'badge-amber'
      : 'badge-blue';

  return (
    <header
      className="flex items-center justify-between px-4 md:px-6 h-16 border-b"
      style={{
        background: 'rgba(10, 15, 26, 0.95)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(192, 199, 209, 0.1)',
        flexShrink: 0,
      }}
    >
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg transition-colors cursor-pointer"
          style={{ color: '#C0C7D1' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,57,53,0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Menu size={20} />
        </button>
        <h1 className="hidden sm:block" style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF' }}>
          {title}
        </h1>
      </div>

      {/* Center: Wallet + Actions (desktop) */}
      <div className="hidden md:flex items-center gap-3">
        {/* Wallet Balance Card */}
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200"
          style={{
            background: 'rgba(15, 21, 37, 0.7)',
            border: '1px solid rgba(192, 199, 209, 0.12)',
          }}
          onClick={() => navigate(Pages.WALLET)}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(229, 57, 53, 0.3)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(229, 57, 53, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(192, 199, 209, 0.12)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, rgba(229,57,53,0.2), rgba(255,215,0,0.1))',
            }}
          >
            <Wallet size={18} style={{ color: '#FFD700' }} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#7A8599', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Assets
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
              {walletBalance !== null
                ? `$${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '$0.00'}
            </div>
          </div>
        </div>

        {/* Add Funds Button */}
        <button
          onClick={() => navigate(Pages.DEPOSIT)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #E53935, #FFD700)',
            color: '#FFFFFF',
            boxShadow: '0 0 15px rgba(229,57,53,0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(229,57,53,0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(229,57,53,0.2)';
          }}
        >
          <ArrowDownLeft size={16} />
          <span>Add Funds</span>
        </button>

        {/* Withdraw Button */}
        <button
          onClick={() => navigate(Pages.WITHDRAW)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200"
          style={{
            background: 'transparent',
            color: '#C0C7D1',
            border: '1px solid rgba(192, 199, 209, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.4)';
            e.currentTarget.style.color = '#FFD700';
            e.currentTarget.style.background = 'rgba(255, 215, 0, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(192, 199, 209, 0.2)';
            e.currentTarget.style.color = '#C0C7D1';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <ArrowUpRight size={16} />
          <span>Withdraw</span>
        </button>
      </div>

      {/* Right: notifications, lock, user */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          onClick={() => navigate(Pages.NOTIFICATIONS)}
          className="relative p-2 rounded-lg transition-colors cursor-pointer"
          style={{ color: '#C0C7D1' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,57,53,0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full text-white"
              style={{
                background: '#FF4757',
                fontSize: 10,
                fontWeight: 700,
                minWidth: 18,
                height: 18,
                padding: '0 4px',
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Lock screen */}
        <button
          onClick={() => navigate(Pages.LOCK_SCREEN)}
          className="hidden sm:block p-2 rounded-lg transition-colors cursor-pointer"
          style={{ color: '#C0C7D1' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,57,53,0.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          title="Lock Screen"
        >
          <Lock size={20} />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,57,53,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div
              className="flex items-center justify-center rounded-full text-white font-semibold"
              style={{
                width: 34,
                height: 34,
                background: 'linear-gradient(135deg, #E53935, #FFD700)',
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, color: '#FFFFFF' }}>
                {user?.name || 'User'}
              </div>
              <span className={`badge ${roleBadgeClass}`} style={{ fontSize: 10, padding: '1px 6px' }}>
                {user?.role || 'USER'}
              </span>
            </div>
            <ChevronDown
              size={14}
              style={{ color: '#7A8599', transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-1 py-1 rounded-lg z-50 animate-fade-in"
              style={{
                background: 'rgba(15, 21, 37, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(192, 199, 209, 0.15)',
                minWidth: 200,
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              }}
            >
              {/* Wallet quick link (mobile) */}
              <button
                className="md:hidden flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors cursor-pointer"
                onClick={() => { navigate(Pages.WALLET); setDropdownOpen(false); }}
                style={{ color: '#C0C7D1', fontSize: 13 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,57,53,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Wallet size={16} />
                <div>
                  <div style={{ fontWeight: 600, color: '#FFFFFF' }}>
                    {walletBalance !== null
                      ? `$${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                      : '$0.00'}
                  </div>
                  <div style={{ fontSize: 11, color: '#7A8599' }}>Total Assets</div>
                </div>
              </button>

              <div className="md:hidden" style={{ height: 1, background: 'rgba(192,199,209,0.1)', margin: '4px 0' }} />

              <button
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors cursor-pointer"
                onClick={() => { navigate(Pages.DEPOSIT); setDropdownOpen(false); }}
                style={{ color: '#22c55e', fontSize: 13 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,57,53,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <ArrowDownLeft size={16} />
                Add Funds
              </button>

              <button
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors cursor-pointer"
                onClick={() => { navigate(Pages.WITHDRAW); setDropdownOpen(false); }}
                style={{ color: '#FFD700', fontSize: 13 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,57,53,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <ArrowUpRight size={16} />
                Withdraw
              </button>

              <div style={{ height: 1, background: 'rgba(192,199,209,0.1)', margin: '4px 0' }} />

              <button
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors cursor-pointer"
                onClick={() => { navigate(Pages.PROFILE); setDropdownOpen(false); }}
                style={{ color: '#C0C7D1', fontSize: 13 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,57,53,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <User size={16} />
                Profile
              </button>
              <button
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors cursor-pointer"
                onClick={() => { navigate(Pages.SECURITY); setDropdownOpen(false); }}
                style={{ color: '#C0C7D1', fontSize: 13 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,57,53,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Settings size={16} />
                Settings
              </button>
              <div style={{ height: 1, background: 'rgba(192,199,209,0.1)', margin: '4px 0' }} />
              <button
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors cursor-pointer"
                onClick={() => { logout(); setDropdownOpen(false); }}
                style={{ color: '#FF4757', fontSize: 13 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229,57,53,0.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}