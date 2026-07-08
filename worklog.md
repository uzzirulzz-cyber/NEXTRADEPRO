---
Task ID: 2
Agent: Main Agent
Task: Full frontend & backend integration fix for Brock Exchange platform (nextradepro.top)

Work Log:
- Analyzed entire codebase structure: 30+ pages, 20+ API routes, Zustand store, Prisma schema
- Identified 4 API routes still using Mongoose models (trades, wallet/balance, wallet/withdraw, wallet/transactions) that would crash at runtime
- Rewrote all 4 Mongoose-based API routes to use Prisma ORM
- Created new /api/wallet/deposit endpoint for deposit requests
- Created new /api/notifications endpoint with GET (list) and PATCH (mark read) handlers
- Rewrote DashboardPage: replaced all mock wallet/trade/transaction data with real API calls to /api/wallet, /api/trades, /api/wallet/transactions
- Rewrote TradingPage: connected trade submission to POST /api/trades with loading states, error handling, wallet balance refresh
- Rewrote WalletPage: connected deposit to POST /api/wallet/deposit and withdrawal to POST /api/wallet/withdraw with real API calls
- Rewrote NotificationsPage: replaced 10 hardcoded mock notifications with real API fetch from /api/notifications, real mark-as-read via PATCH
- Rewrote ProfilePage: connected password change to POST /api/auth/change-password, updated avatar to Brock Exchange gold→cyan gradient
- Fixed admin deposits route: replaced non-existent prisma.deposit model with Transaction type='DEPOSIT', added balance crediting on approval
- Fixed admin withdrawals route: added proper balance handling (deduct frozen on approve, unfreeze on reject)
- Fixed navigation: Home button in sidebar now navigates to Dashboard for authenticated users (not landing page)
- Installed missing tailwindcss-animate dependency
- Fixed .env DATABASE_URL to point to Neon PostgreSQL
- Verified server compilation and page rendering (HTTP 200, 72KB HTML, API routes responding)

Stage Summary:
- All API routes now use Prisma (zero Mongoose imports remain in API layer)
- All user-facing pages fetch real data from backend APIs
- Trading flow: coin selection → trade page → API submission → balance refresh
- Wallet flow: deposit/withdraw → pending status → admin approval → balance update
- Navigation fully functional: all sidebar items open correct pages, coin clicks navigate to trade
- Loading indicators and error handling on all pages
- Server compiles and serves pages successfully