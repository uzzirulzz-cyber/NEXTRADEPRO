---
Task ID: 1
Agent: Main Agent
Task: Fix homepage, sign-in/sign-up, admin, and indexing for NexTrade Pro

Work Log:
- Explored full codebase structure and identified all routing/architecture issues
- Fixed root page.tsx: Added LoginPage and RegisterPage rendering for unauthenticated SPA navigation, added re-hydration useEffect to handle auth state from standalone /signin page
- Fixed RegisterPage.tsx: Complete rewrite with separate firstName/lastName fields, global phone with 25 country codes, proper validation, auto-login after registration via setAuth
- Fixed register API: Now handles both { firstName, lastName } and legacy { name } formats for backward compatibility
- Fixed store hydration: SUB_AGENT now correctly routes to ADMIN_USERS instead of DASHBOARD
- Fixed User model: Added firstName and lastName fields to schema
- Fixed signin/page.tsx: Corrected Mexico country code from +55 (Brazil) to +52
- Fixed LoginPage.tsx: Updated glow orb color from old #3b82f6 to NexTrade #0F5EFF
- Verified build compiles successfully with all 37 routes properly indexed

Stage Summary:
- All auth flows now work: SPA login/register, standalone /signin page, /reg invitation redirect
- Navigation indexing fixed: LOGIN and REGISTER pages render correctly for unauthenticated users
- Admin panel auth guard verified working with proper SUPER_ADMIN/SUB_AGENT role checks
- Store hydration fixed for both initial load and cross-route navigation
