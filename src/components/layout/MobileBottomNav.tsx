'use client';

import React from 'react';
import {
  LayoutDashboard,
  CandlestickChart,
  Wallet,
  User,
} from 'lucide-react';
import { useStore, Pages } from '@/store/useStore';

const tabs = [
  { icon: LayoutDashboard, label: 'Home', page: Pages.DASHBOARD },
  { icon: CandlestickChart, label: 'Trade', page: Pages.TRADING },
  { icon: Wallet, label: 'Wallet', page: Pages.WALLET },
  { icon: User, label: 'Profile', page: Pages.PROFILE },
];

export default function MobileBottomNav() {
  const { currentPage, navigate } = useStore();

  const tabMap: Record<string, string> = {
    [Pages.DASHBOARD]: Pages.DASHBOARD,
    [Pages.TRADING]: Pages.TRADING,
    [Pages.SPOT]: Pages.TRADING,
    [Pages.FUTURES]: Pages.TRADING,
    [Pages.WALLET]: Pages.WALLET,
    [Pages.DEPOSIT]: Pages.WALLET,
    [Pages.WITHDRAW]: Pages.WALLET,
    [Pages.EARN]: Pages.WALLET,
    [Pages.TRANSACTIONS]: Pages.WALLET,
    [Pages.PROFILE]: Pages.PROFILE,
    [Pages.SECURITY]: Pages.PROFILE,
    [Pages.NOTIFICATIONS]: Pages.DASHBOARD,
    [Pages.REFERRAL]: Pages.DASHBOARD,
    [Pages.LOCK_SCREEN]: Pages.DASHBOARD,
  };

  const activeTab = tabMap[currentPage] || Pages.DASHBOARD;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 72,
        background: 'rgba(10, 15, 26, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(192, 199, 209, 0.1)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        paddingTop: 8,
        paddingBottom: 24,
        zIndex: 50,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.page;
        const Icon = tab.icon;
        return (
          <button
            key={tab.page}
            onClick={() => navigate(tab.page)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 16px',
              transition: 'all 0.2s',
            }}
          >
            <div
              style={{
                width: 44,
                height: 28,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive ? 'rgba(229, 57, 53, 0.12)' : 'transparent',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 0 12px rgba(229, 57, 53, 0.15)' : 'none',
              }}
            >
              <Icon
                size={21}
                style={{
                  color: isActive ? '#FFD700' : '#7A8599',
                  transition: 'color 0.2s',
                  strokeWidth: isActive ? 2.2 : 1.6,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#FFD700' : '#7A8599',
                transition: 'color 0.2s',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}