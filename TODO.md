# Hyperium Game Store Development Plan

## Phase 1: Setup and Confirm Theme/Auth Providers (Already Done)
- [x] Theme provider with dark/light toggle
- [x] Auth provider with Supabase integration
- [x] Basic layout with header

## Phase 2: Implement Core Pages
- [x] Home page (app/page.tsx) - Featured games, categories, search
- [x] Game details page (app/games/[id]/page.tsx) - Full game info, ratings, comments
- [x] Add game page (app/games/add/page.tsx) - Form to add new game
- [x] Cart page (app/cart/page.tsx) - View and manage cart items
- [x] Purchase history page (app/purchases/page.tsx) - List of user's purchases

## Phase 3: Implement Authentication Flows
- [ ] Login dialog (components/auth/auth-dialog.tsx) - Email/password login
- [ ] Signup dialog - Email/password/username signup
- [ ] Header integration - Show login/signup buttons when not authenticated

## Phase 4: Add Search Bar
- [ ] Search bar in header (components/layout/header.tsx) - Search games by title, genre, tags
- [ ] Search results page (app/search/page.tsx) - Display search results

## Phase 5: Implement Purchase Simulation and History
- [ ] Purchase simulation - Add to purchases table, update history
- [ ] Purchase history - Display list of purchased games
- [ ] Cart management - Add/remove games from cart

## Phase 6: Implement Chat Feature
- [ ] Chat rooms for purchases (components/chat/chat-room.tsx)
- [ ] Message sending/receiving with file upload (.zip)
- [ ] Chat list for user purchases

## Phase 7: Implement Reporting Feature
- [ ] Report button on game pages
- [ ] Report form (reason, description)
- [ ] Admin view for reports

## Phase 8: Implement Admin Account Management
- [x] Admin dashboard (app/admin/page.tsx)
- [x] User management - View/edit users
- [x] Game moderation - Approve/reject games
- [x] Report management - Review/resolve reports

## Phase 9: Implement Game Ratings and Comments
- [ ] Rating system (1-5 stars, one per user)
- [ ] Comments section on game pages
- [ ] Display average rating and comments

## General Tasks
- [ ] Ensure purple theme in dark mode
- [ ] Add missing Shadcn UI components as needed
- [ ] Test critical paths: login, add game, purchase simulation, chat
- [ ] Responsive design for mobile/desktop
