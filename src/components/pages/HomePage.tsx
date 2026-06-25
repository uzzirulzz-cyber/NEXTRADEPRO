'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  Users,
  ArrowRight,
  BarChart3,
  Shield,
  Globe,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/* ─── NexTrade Pro Theme: Silver / Yellow / White / Red ─── */
const C = {
  bgDarkest: '#060A14',
  bgDark: '#0A0F1A',
  bgBase: '#0E1525',
  bgCard: 'rgba(15, 21, 37, 0.6)',
  bgCardHover: 'rgba(229, 57, 53, 0.08)',
  bgSubtle: 'rgba(10, 15, 26, 0.9)',
  border: 'rgba(192, 199, 209, 0.12)',
  borderHover: 'rgba(192, 199, 209, 0.25)',
  accent: '#E53935',
  accentDark: '#C62828',
  accentYellow: '#FFD700',
  ctaRed: '#E53935',
  ctaRedHover: '#FFD700',
  ctaRedGlow: 'rgba(229, 57, 53, 0.35)',
  textPrimary: '#FFFFFF',
  textSecondary: '#C0C7D1',
  textMuted: '#7A8599',
  green: '#22c55e',
  red: '#FF4757',
  gold: '#FFD700',
  silver: '#C0C7D1',
};

/* ─── Data ─── */

const achievementStats = [
  { value: '$21M+', label: 'Paid to Traders' },
  { value: '15,000+', label: 'Funded Traders' },
  { value: '90%', label: 'Profit Split' },
  { value: '24/7', label: 'Reward Processing' },
];

const challengeTypes = [
  {
    name: '1-Phase',
    tagline: 'For expert traders',
    desc: 'Complete in as little as 3 days. Fastest route to funded.',
    highlights: ['Cheapest base price', 'Can be completed in 3 days', 'Higher leverage'],
    accent: C.accent,
  },
  {
    name: 'Classic 2-Phase',
    tagline: 'Ideal for beginners',
    desc: 'No consistency rule, lower Phase 2 target at just 5%.',
    highlights: ['No Consistency Rule', '5% Phase 2 Target', 'Lower price point'],
    accent: '#7F8BAB',
  },
  {
    name: 'Pro 2-Phase',
    tagline: 'Best for intra-day traders',
    desc: 'Daily and weekly reward options with fewer restrictions.',
    highlights: ['Daily & Weekly Rewards', 'Fewer restrictions', 'Swing Option'],
    accent: C.ctaRed,
    popular: true,
  },
];

const accountSizes = ['$5,000', '$10,000', '$25,000', '$50,000', '$100,000', '$200,000'];

const traderReviews = [
  {
    name: 'Marcus T.',
    role: 'Forex Trader',
    text: 'NexTrade Pro changed my career. Got funded in 5 days and I\'ve been earning rewards daily ever since. The platform is rock solid.',
    reward: '$8,420',
    avatar: 'M',
  },
  {
    name: 'Sarah K.',
    role: 'Indices Trader',
    text: 'The daily rewards system is incredible. No more waiting weeks for payouts. I requested my first reward and it was processed same day.',
    reward: '$3,150',
    avatar: 'S',
  },
  {
    name: 'Ahmed R.',
    role: 'Crypto Trader',
    text: 'Pro 2-Phase was perfect for my trading style. The 90% profit split with daily rewards makes this the best prop firm I\'ve worked with.',
    reward: '$12,800',
    avatar: 'A',
  },
];

const comparisonRows = [
  { feature: 'Reward Frequency', us: 'Multiple times a day', them: '7 to 30 days' },
  { feature: 'First Reward Wait', us: '0 seconds', them: '7 to 30 days' },
  { feature: 'Reward Guarantee', us: 'Guaranteed', them: 'No guarantee' },
  { feature: 'Market Manipulation Risk', us: 'Absent', them: 'High risk' },
  { feature: 'Profit Split', us: 'Up to 90%', them: 'Up to 80%' },
];

const faqItems = [
  {
    q: "What's the max daily drawdown?",
    a: 'Max Daily Drawdown is 5% on all Pro and Classic Challenges and Funded Accounts. It is 3% on the 1-Phase Challenge. The Daily Drawdown is balance based and calculated at the start of each trading day (5:00 p.m. EST).',
  },
  {
    q: 'How often can I request rewards?',
    a: 'With a NexTrade Pro Funded Account, you can request a reward any time you are at least 1% above your initial account balance. We aim to process all Funded Account rewards within 24 hours.',
  },
  {
    q: 'Can I trade news events?',
    a: 'Yes! News trading is allowed on all account types. You can also hold trades overnight and over weekends, giving you maximum flexibility in your trading strategy.',
  },
  {
    q: 'What leverage do you offer?',
    a: 'We offer up to 1:100 leverage on Forex, and 1:3 leverage on Metals, Oil, and Indices. Leverage varies by account type and asset class.',
  },
  {
    q: 'Are EAs and trading bots allowed?',
    a: 'Yes, Expert Advisors and trading bots are permitted on all account types. We support automated trading strategies to give every trader the tools they need to succeed.',
  },
];

const featureBadges = [
  'Daily Rewards',
  'News Trading',
  'Weekend Holding',
  'Swing Option',
  'EAs Allowed',
];

/* ─── Animation Variants ─── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ═══════════════════════════════════════════════
   FunderPro-Style HomePage
   ═══════════════════════════════════════════════ */

export default function HomePage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState('$50,000');

  /* Allow body scroll for landing page */
  useEffect(() => {
    document.body.classList.add('landing-active');
    return () => document.body.classList.remove('landing-active');
  }, []);

  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.bgBase }}>
      {/* ═══ TOP NAV ═══ */}
      <nav
        className="sticky top-0 z-50 w-full flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: 'rgba(15, 21, 39, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="NexTrade Pro" width={38} height={38} />
          <span className="text-xl font-bold hidden sm:block" style={{ color: C.textPrimary }}>
            NexTrade <span style={{ color: C.gold }}>Pro</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/signin?tab=register')}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 hover:opacity-90"
            style={{ color: C.textSecondary, background: 'transparent' }}
          >
            Sign Up
          </button>
          <button
            onClick={() => router.push('/signin')}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: C.ctaRed,
              color: '#fff',
              boxShadow: `0 0 20px ${C.ctaRedGlow}`,
            }}
          >
            Log In
          </button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative flex flex-col items-center text-center px-6 pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute rounded-full"
            style={{
              width: 600,
              height: 600,
              top: -200,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'radial-gradient(circle, rgba(229,57,53,0.1) 0%, transparent 65%)',
            }}
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-6 flex justify-center">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.25)',
                color: C.gold,
              }}
            >
              <Star size={13} fill={C.gold} />
              The Original Trading Firm with Daily Rewards
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
            style={{ color: C.textPrimary }}
          >
            Trade Smarter.{' '}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.accent}, ${C.accentYellow})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Get Funded.
            </span>
            <br />
            Earn Daily.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: C.textSecondary }}
          >
            Prove your skills, access up to $200K in funded capital, and receive daily rewards.
            Institutional-grade conditions for serious traders.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => router.push('/signin?tab=register')}
              className="group px-8 py-4 rounded-xl text-base font-bold cursor-pointer transition-all duration-300 hover:scale-[1.04] flex items-center gap-2"
              style={{
                background: C.ctaRed,
                color: '#fff',
                boxShadow: `0 0 30px ${C.ctaRedGlow}, 0 4px 15px rgba(0,0,0,0.3)`,
              }}
            >
              Start Your Challenge
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 hover:opacity-90 flex items-center gap-2"
              style={{
                background: 'transparent',
                color: C.accent,
                border: `1px solid ${C.borderHover}`,
              }}
            >
              View Plans
            </button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto"
          >
            {achievementStats.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="text-center"
              >
                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1" style={{ color: C.textPrimary }}>
                  {s.value}
                </p>
                <p className="text-xs sm:text-sm" style={{ color: C.textMuted }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ FEATURE BADGES BAR ═══ */}
      <section
        className="w-full py-5"
        style={{ background: C.bgDark, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}
      >
        <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {featureBadges.map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <CheckCircle size={16} style={{ color: C.accent }} />
              <span className="text-sm font-medium" style={{ color: C.textSecondary }}>
                {badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CHALLENGE TYPES ═══ */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3"
            style={{ color: C.textPrimary }}
          >
            Choose Your Challenge
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-center mb-14 max-w-xl mx-auto"
            style={{ color: C.textMuted }}
          >
            Two paths. One Pro Trading Experience. Prove your skills or go instant to access elite conditions.
          </motion.p>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {challengeTypes.map((ct) => (
              <motion.div
                key={ct.name}
                variants={fadeUp}
                className="relative rounded-2xl p-7 flex flex-col transition-all duration-300 hover:translate-y-[-4px]"
                style={{
                  background: C.bgCard,
                  border: ct.popular ? `2px solid ${C.ctaRed}` : `1px solid ${C.border}`,
                  boxShadow: ct.popular ? `0 0 40px ${C.ctaRedGlow}` : 'none',
                }}
              >
                {ct.popular && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                    style={{ background: C.ctaRed, color: '#fff' }}
                  >
                    MOST POPULAR
                  </span>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${ct.accent}20` }}
                  >
                    <Award size={20} style={{ color: ct.accent }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: C.textPrimary }}>
                      {ct.name}
                    </h3>
                    <p className="text-xs" style={{ color: ct.accent }}>
                      {ct.tagline}
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-6" style={{ color: C.textSecondary }}>
                  {ct.desc}
                </p>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {ct.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2.5 text-sm" style={{ color: C.textSecondary }}>
                      <CheckCircle size={15} style={{ color: ct.accent }} />
                      {h}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => router.push('/signin?tab=register')}
                  className="w-full py-3.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: ct.popular ? C.ctaRed : `${ct.accent}18`,
                    color: ct.popular ? '#fff' : ct.accent,
                    border: ct.popular ? 'none' : `1px solid ${ct.accent}40`,
                  }}
                >
                  {ct.popular ? 'Get Started' : 'Learn More'}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ PRICING / ACCOUNT SIZES ═══ */}
      <section
        id="pricing"
        className="w-full py-20 md:py-28"
        style={{ background: C.bgDark }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3"
              style={{ color: C.textPrimary }}
            >
              Select Your Account Size
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-center mb-14 max-w-xl mx-auto"
              style={{ color: C.textMuted }}
            >
              Start your challenge with the capital that matches your ambitions. Scale up to $5 million.
            </motion.p>

            {/* Size selector chips */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {accountSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200"
                  style={{
                    background: selectedSize === size ? C.ctaRed : `${C.bgCard}`,
                    color: selectedSize === size ? '#fff' : C.textSecondary,
                    border: selectedSize === size ? 'none' : `1px solid ${C.border}`,
                  }}
                >
                  {size}
                </button>
              ))}
            </motion.div>

            {/* Selected size detail card */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-3xl mx-auto rounded-2xl p-8 md:p-10"
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: C.textMuted }}>
                    Pro 2-Phase Challenge
                  </p>
                  <p className="text-5xl md:text-6xl font-extrabold mb-2" style={{ color: C.textPrimary }}>
                    {selectedSize}
                  </p>
                  <p className="text-sm" style={{ color: C.accent }}>
                    Up to 90% profit split
                  </p>
                </div>

                <div className="flex flex-col gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.accent}15` }}>
                      <TrendingUp size={16} style={{ color: C.accent }} />
                    </div>
                    <div>
                      <p style={{ color: C.textMuted }}>Profit Target</p>
                      <p className="font-semibold" style={{ color: C.textPrimary }}>10% (Phase 1) / 5% (Phase 2)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.accent}15` }}>
                      <Shield size={16} style={{ color: C.accent }} />
                    </div>
                    <div>
                      <p style={{ color: C.textMuted }}>Max Drawdown</p>
                      <p className="font-semibold" style={{ color: C.textPrimary }}>5% Daily / 10% Overall</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${C.accent}15` }}>
                      <Clock size={16} style={{ color: C.accent }} />
                    </div>
                    <div>
                      <p style={{ color: C.textMuted }}>Duration</p>
                      <p className="font-semibold" style={{ color: C.textPrimary }}>Unlimited</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 flex flex-col sm:flex-row items-center gap-4" style={{ borderTop: `1px solid ${C.border}` }}>
                <button
                  onClick={() => router.push('/signin?tab=register')}
                  className="group w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold cursor-pointer transition-all duration-300 hover:scale-[1.03] flex items-center justify-center gap-2"
                  style={{
                    background: C.ctaRed,
                    color: '#fff',
                    boxShadow: `0 0 25px ${C.ctaRedGlow}`,
                  }}
                >
                  Start Challenge
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
                <p className="text-xs" style={{ color: C.textMuted }}>
                  Price processed with your first reward. No upfront fee deduction.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TRADER REVIEWS ═══ */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3"
            style={{ color: C.textPrimary }}
          >
            Real People. Real Rewards.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-center mb-14 max-w-xl mx-auto"
            style={{ color: C.textMuted }}
          >
            Trader success speaks for itself. These are real stories from funded traders.
          </motion.p>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {traderReviews.map((review) => (
              <motion.div
                key={review.name}
                variants={fadeUp}
                className="rounded-2xl p-7 transition-all duration-300 hover:translate-y-[-4px]"
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                }}
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill={C.accent} style={{ color: C.accent }} />
                  ))}
                </div>

                <p className="text-sm leading-relaxed mb-6" style={{ color: C.textSecondary }}>
                  &ldquo;{review.text}&rdquo;
                </p>

                <div
                  className="flex items-center justify-between pt-5"
                  style={{ borderTop: `1px solid ${C.border}` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${C.accent}, ${C.accentYellow})`,
                        color: '#fff',
                      }}
                    >
                      {review.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: C.textPrimary }}>
                        {review.name}
                      </p>
                      <p className="text-xs" style={{ color: C.textMuted }}>
                        {review.role}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: C.textMuted }}>Total Rewards</p>
                    <p className="text-lg font-bold" style={{ color: C.green }}>
                      {review.reward}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ COMPARISON TABLE ═══ */}
      <section
        className="w-full py-20 md:py-28"
        style={{ background: C.bgDark }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3"
              style={{ color: C.textPrimary }}
            >
              Pro-Trader. Always.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-center mb-14 max-w-xl mx-auto"
              style={{ color: C.textMuted }}
            >
              Setting the new industry standard for transparent, fair, and secure rewards.
            </motion.p>

            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${C.border}` }}
            >
              {/* Table Header */}
              <div
                className="grid grid-cols-3 gap-4 px-6 py-4 text-sm font-bold"
                style={{ background: C.bgCard, color: C.textMuted }}
              >
                <span>Feature</span>
                <span className="text-center" style={{ color: C.accent }}>
                  NexTrade Pro
                </span>
                <span className="text-center">Industry Average</span>
              </div>

              {/* Rows */}
              {comparisonRows.map((row, i) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-3 gap-4 px-6 py-4 text-sm transition-colors duration-200"
                  style={{
                    background: i % 2 === 0 ? C.bgCard : 'transparent',
                    borderTop: `1px solid ${C.border}`,
                  }}
                >
                  <span className="font-medium" style={{ color: C.textSecondary }}>
                    {row.feature}
                  </span>
                  <span className="text-center font-semibold" style={{ color: C.green }}>
                    {row.us}
                  </span>
                  <span className="text-center" style={{ color: C.textMuted }}>
                    {row.them}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-14"
            style={{ color: C.textPrimary }}
          >
            Why NexTrade Pro
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {[
              { icon: Zap, title: 'Instant Account Setup', desc: 'Get started in minutes. No lengthy verification, no delays. Your funded trading journey begins immediately.' },
              { icon: Clock, title: 'Daily Reward Processing', desc: 'Request rewards any time you\'re 1% above starting balance. We process within 24 hours, not weeks.' },
              { icon: Shield, title: 'Bank-Grade Security', desc: 'Enterprise encryption, two-factor authentication, and cold storage for all digital assets on the platform.' },
              { icon: Globe, title: 'Multi-Asset Trading', desc: 'Trade forex, metals, indices, and crypto from a single funded account with professional-grade execution.' },
              { icon: BarChart3, title: 'Advanced Analytics', desc: 'Real-time performance dashboards, drawdown monitoring, and detailed trade history at your fingertips.' },
              { icon: Users, title: 'Global Community', desc: 'Join 15,000+ funded traders in our Discord. Share strategies, get support, and grow together.' },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="rounded-2xl p-7 transition-all duration-300 hover:translate-y-[-3px] group"
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${C.accent}15` }}
                >
                  <f.icon size={22} style={{ color: C.accent }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: C.textPrimary }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section
        className="w-full py-20 md:py-28"
        style={{ background: C.bgDark }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3"
              style={{ color: C.textPrimary }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-center mb-14"
              style={{ color: C.textMuted }}
            >
              Our support team is available 24/7 via live chat.
            </motion.p>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col gap-3"
            >
              {faqItems.map((faq, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="rounded-xl overflow-hidden transition-all duration-300"
                  style={{
                    background: C.bgCard,
                    border: `1px solid ${openFaq === i ? C.borderHover : C.border}`,
                  }}
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                  >
                    <span className="text-sm font-semibold pr-4" style={{ color: C.textPrimary }}>
                      {faq.q}
                    </span>
                    {openFaq === i ? (
                      <ChevronUp size={18} style={{ color: C.accent, flexShrink: 0 }} />
                    ) : (
                      <ChevronDown size={18} style={{ color: C.textMuted, flexShrink: 0 }} />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <p
                          className="px-6 pb-5 text-sm leading-relaxed"
                          style={{ color: C.textSecondary }}
                        >
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="w-full py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute rounded-full"
            style={{
              width: 500,
              height: 500,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${C.ctaRedGlow} 0%, transparent 60%)`,
            }}
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5"
            style={{ color: C.textPrimary }}
          >
            Ready to Get Funded?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
            style={{ color: C.textSecondary }}
          >
            Join thousands of traders earning daily rewards. Your challenge starts now.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/signin?tab=register')}
              className="group px-10 py-4 rounded-xl text-base font-bold cursor-pointer transition-all duration-300 hover:scale-[1.04] flex items-center gap-2"
              style={{
                background: C.ctaRed,
                color: '#fff',
                boxShadow: `0 0 40px ${C.ctaRedGlow}, 0 4px 20px rgba(0,0,0,0.3)`,
              }}
            >
              Start Trading Now
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-xl text-base font-semibold cursor-pointer transition-all duration-200"
              style={{
                background: 'transparent',
                color: C.textSecondary,
                border: `1px solid ${C.border}`,
              }}
            >
              Compare Plans
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer
        className="w-full"
        style={{ background: C.bgDarkest, borderTop: `1px solid ${C.border}` }}
      >
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Image src="/logo.png" alt="NexTrade Pro" width={36} height={36} />
                <span className="text-lg font-bold" style={{ color: C.textPrimary }}>
                  NexTrade Pro
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: C.textMuted }}>
                The original prop trading firm with daily rewards. Prove your skills and trade with funded capital.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
                >
                  <MessageCircle size={16} style={{ color: C.textSecondary }} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: C.bgCard, border: `1px solid ${C.border}` }}
                >
                  <ExternalLink size={16} style={{ color: C.textSecondary }} />
                </a>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-5"
                style={{ color: C.textSecondary }}
              >
                Company
              </h4>
              <ul className="flex flex-col gap-3">
                {['About Us', 'Careers', 'Blog', 'Press'].map((link) => (
                  <li key={link}>
                    <span
                      className="text-sm cursor-pointer transition-colors duration-200"
                      style={{ color: C.textMuted }}
                    >
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trading */}
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-5"
                style={{ color: C.textSecondary }}
              >
                Trading
              </h4>
              <ul className="flex flex-col gap-3">
                {['Challenge Rules', 'Pricing', 'FAQ', 'Support'].map((link) => (
                  <li key={link}>
                    <span
                      className="text-sm cursor-pointer transition-colors duration-200"
                      style={{ color: C.textMuted }}
                    >
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-5"
                style={{ color: C.textSecondary }}
              >
                Legal
              </h4>
              <ul className="flex flex-col gap-3">
                {['Terms of Service', 'Privacy Policy', 'Risk Disclosure', 'Cookie Policy'].map((link) => (
                  <li key={link}>
                    <span
                      className="text-sm cursor-pointer transition-colors duration-200"
                      style={{ color: C.textMuted }}
                    >
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pt-8 mb-8" style={{ borderTop: `1px solid ${C.border}` }}>
            <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>
              All trading activity takes place in a simulated trading environment using virtual funds and
              does not involve real-market execution or real capital. Past performance is not indicative of
              future results. Trading involves substantial risk and is not suitable for every investor.
            </p>
          </div>

          {/* Bottom */}
          <div
            className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: `1px solid ${C.border}` }}
          >
            <p className="text-xs" style={{ color: C.textMuted }}>
              &copy; {new Date().getFullYear()} NexTrade Pro. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.5 13.11l2.198-2.602zM5.864 2.658L16.8 8.99l-2.302 2.303-8.634-8.635z" />
                </svg>
                <div className="text-left">
                  <p className="text-[9px] leading-none" style={{ color: C.textMuted }}>GET IT ON</p>
                  <p className="text-xs font-semibold" style={{ color: C.textPrimary }}>Google Play</p>
                </div>
              </button>
              <button
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <p className="text-[9px] leading-none" style={{ color: C.textMuted }}>Download on the</p>
                  <p className="text-xs font-semibold" style={{ color: C.textPrimary }}>App Store</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}