# Auth Fix Tasks

## Completed
- [x] Update seed.sql: Fix handle_new_user function to use user_metadata instead of raw_user_meta_data
- [x] Update lib/auth.ts: Add emailRedirectTo to signUp options
- [x] Create app/auth/callback/page.tsx: Handle email confirmation redirects
- [x] Update components/auth/auth-dialog.tsx: Adjust signup success toast message

## Followup Steps
- [x] Added INSERT policy to seed.sql: CREATE POLICY "Allow insert for new users" ON users FOR INSERT WITH CHECK (true);
- [ ] Enable email confirmation in Supabase project settings under Authentication > Settings (required for sending verification emails)
- [ ] Configure SMTP in Supabase if you want custom emails sent
- [ ] Test the sign-up process to verify users are added to the database and emails are sent (if enabled)
- [ ] If running seed.sql again, note that the SELECT policy already exists; run only the new parts or drop existing policies first
