'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2,
  Wallet,
  Shield,
  Settings,
  DollarSign,
  Users,
  Bell,
  CheckCheck,
  Inbox,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

type NotificationType = 'trade' | 'wallet' | 'security' | 'system' | 'commission' | 'referral';
type FilterTab = 'all' | 'unread' | NotificationType;

interface Notification {
  id: string;
  type: NotificationType;
  priority?: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  // Derived display field
  time: string;
}

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'trade', label: 'Trade' },
  { key: 'wallet', label: 'Wallet' },
  { key: 'security', label: 'Security' },
  { key: 'system', label: 'System' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  if (diffWeek < 5) return `${diffWeek} week${diffWeek !== 1 ? 's' : ''} ago`;
  return `${diffMonth} month${diffMonth !== 1 ? 's' : ''} ago`;
}

function mapNotification(raw: {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}): Notification {
  return {
    ...raw,
    time: formatRelativeTime(raw.createdAt),
  };
}

function getIcon(type: NotificationType) {
  switch (type) {
    case 'trade':
      return <BarChart2 size={18} style={{ color: 'var(--accent-blue)' }} />;
    case 'wallet':
      return <Wallet size={18} style={{ color: 'var(--accent-green)' }} />;
    case 'security':
      return <Shield size={18} style={{ color: 'var(--accent-amber)' }} />;
    case 'system':
      return <Settings size={18} style={{ color: 'var(--text-muted)' }} />;
    case 'commission':
      return <DollarSign size={18} style={{ color: 'var(--accent-purple)' }} />;
    case 'referral':
      return <Users size={18} style={{ color: '#06b6d4' }} />;
    default:
      return <Bell size={18} style={{ color: 'var(--text-muted)' }} />;
  }
}

function getIconBg(type: NotificationType): string {
  switch (type) {
    case 'trade':
      return 'rgba(59, 130, 246, 0.15)';
    case 'wallet':
      return 'rgba(34, 197, 94, 0.15)';
    case 'security':
      return 'rgba(245, 158, 11, 0.15)';
    case 'system':
      return 'rgba(100, 116, 139, 0.15)';
    case 'commission':
      return 'rgba(139, 92, 246, 0.15)';
    case 'referral':
      return 'rgba(6, 182, 212, 0.15)';
    default:
      return 'rgba(100, 116, 139, 0.15)';
  }
}

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function NotificationsPage() {
  const { token, setNotifications, setUnreadCount } = useStore();

  const [notifications, setLocalNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------------------------------------------------
  // Fetch notifications from the API
  // -----------------------------------------------------------------------
  const fetchNotifications = useCallback(
    async (filter?: FilterTab) => {
      if (!token) return;
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filter && filter !== 'all') {
          if (filter === 'unread') {
            params.set('unread', 'true');
          } else {
            params.set('type', filter);
          }
        }

        const query = params.toString();
        const url = `/api/notifications${query ? `?${query}` : ''}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch notifications (${res.status})`);
        }

        const data = await res.json();
        const mapped: Notification[] = (data.notifications ?? []).map(mapNotification);

        setLocalNotifications(mapped);
        setNotifications(mapped);
        setUnreadCount(data.unreadCount ?? mapped.filter((n) => !n.read).length);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [token, setNotifications, setUnreadCount],
  );

  // Initial mount fetch
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------------------------
  // Mark as read (single)
  // -----------------------------------------------------------------------
  const handleMarkAsRead = async (id: string) => {
    if (!token) return;

    // Optimistic update
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    setLocalNotifications(updated);
    const newUnread = updated.filter((n) => !n.read).length;
    setNotifications(updated);
    setUnreadCount(newUnread);

    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: [id], read: true }),
      });

      if (!res.ok) {
        // Revert on failure
        setLocalNotifications(notifications);
        setNotifications(notifications);
        setUnreadCount(notifications.filter((n) => !n.read).length);
      }
    } catch {
      // Revert on network error
      setLocalNotifications(notifications);
      setNotifications(notifications);
      setUnreadCount(notifications.filter((n) => !n.read).length);
    }
  };

  // -----------------------------------------------------------------------
  // Mark all as read
  // -----------------------------------------------------------------------
  const handleMarkAllRead = async () => {
    if (!token || unreadCount === 0) return;

    // Optimistic update
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setLocalNotifications(updated);
    setNotifications(updated);
    setUnreadCount(0);

    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAllRead: true }),
      });

      if (!res.ok) {
        // Revert on failure
        setLocalNotifications(notifications);
        setNotifications(notifications);
        setUnreadCount(notifications.filter((n) => !n.read).length);
      }
    } catch {
      // Revert on network error
      setLocalNotifications(notifications);
      setNotifications(notifications);
      setUnreadCount(notifications.filter((n) => !n.read).length);
    }
  };

  // -----------------------------------------------------------------------
  // Handle filter change — refetch with query params
  // -----------------------------------------------------------------------
  const handleFilterChange = (tab: FilterTab) => {
    setActiveFilter(tab);
    fetchNotifications(tab);
  };

  // -----------------------------------------------------------------------
  // Derived state
  // -----------------------------------------------------------------------
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    if (activeFilter === 'unread') return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  // -----------------------------------------------------------------------
  // Render: Loading skeleton
  // -----------------------------------------------------------------------
  const renderLoading = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="glass-card p-4 flex items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.25 }}
        >
          <div
            className="rounded-full shrink-0 animate-pulse"
            style={{ width: 8, height: 8, background: 'var(--accent-blue)', opacity: 0.3 }}
          />
          <div
            className="rounded-lg shrink-0 animate-pulse"
            style={{ width: 40, height: 40, background: 'var(--bg-elevated)' }}
          />
          <div className="flex-1 space-y-2">
            <div
              className="rounded animate-pulse"
              style={{ width: '60%', height: 14, background: 'var(--bg-elevated)' }}
            />
            <div
              className="rounded animate-pulse"
              style={{ width: '90%', height: 12, background: 'var(--bg-elevated)', opacity: 0.7 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );

  // -----------------------------------------------------------------------
  // Render: Error state
  // -----------------------------------------------------------------------
  const renderError = () => (
    <motion.div
      className="glass-card p-12 text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AlertTriangle
        size={48}
        style={{ color: 'var(--accent-amber)', margin: '0 auto 16px' }}
      />
      <p
        className="text-base font-medium"
        style={{ color: 'var(--text-secondary)' }}
      >
        Failed to load notifications
      </p>
      <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
        {error}
      </p>
      <motion.button
        className="btn-secondary flex items-center gap-2 mx-auto mt-4"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => fetchNotifications(activeFilter)}
      >
        <RefreshCw size={14} />
        Retry
      </motion.button>
    </motion.div>
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <motion.div
      className="space-y-6 animate-fade-in"
      style={{ paddingBottom: 40 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' as const }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="badge badge-blue">{unreadCount} unread</span>
          )}
        </div>
        <motion.button
          className="btn-secondary flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          style={{ opacity: unreadCount === 0 ? 0.5 : 1 }}
        >
          <CheckCheck size={14} />
          Mark All Read
        </motion.button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleFilterChange(tab.key)}
              className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                background: isActive ? 'var(--bg-card)' : 'transparent',
                border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="notif-tab-indicator"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    zIndex: -1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content area */}
      {loading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : filteredNotifications.length === 0 ? (
        <motion.div
          className="glass-card p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Inbox
            size={48}
            style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }}
          />
          <p
            className="text-base font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            No notifications
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {activeFilter === 'all'
              ? "You're all caught up!"
              : `No ${activeFilter} notifications found.`}
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-2"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {filteredNotifications.map((notif) => (
              <motion.div
                key={notif.id}
                className="glass-card p-4 flex items-start gap-4 cursor-pointer"
                style={{
                  cursor: 'pointer',
                  opacity: notif.read ? 0.65 : 1,
                  transition: 'opacity 0.2s',
                }}
                variants={listItemVariants}
                exit="exit"
                layout
                whileHover={{
                  borderColor: 'rgba(59, 130, 246, 0.3)',
                }}
                onClick={() => !notif.read && handleMarkAsRead(notif.id)}
              >
                {/* Unread dot */}
                <div className="flex items-center pt-1 shrink-0" style={{ width: 8 }}>
                  {!notif.read && (
                    <motion.div
                      layoutId={`dot-${notif.id}`}
                      className="rounded-full"
                      style={{
                        width: 8,
                        height: 8,
                        background: 'var(--accent-blue)',
                        boxShadow: '0 0 6px rgba(59,130,246,0.6)',
                      }}
                    />
                  )}
                </div>

                {/* Icon */}
                <div
                  className="flex items-center justify-center rounded-lg shrink-0"
                  style={{
                    width: 40,
                    height: 40,
                    background: getIconBg(notif.type),
                    marginTop: 2,
                  }}
                >
                  {getIcon(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {notif.title}
                    </p>
                    <span
                      className="text-xs shrink-0 whitespace-nowrap"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {notif.time}
                    </span>
                  </div>
                  <p
                    className="text-sm mt-1"
                    style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}
                  >
                    {notif.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}