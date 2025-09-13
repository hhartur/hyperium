## Auth Validation Adjustment Tasks

- [x] Update signUpSchema in components/auth/auth-dialog.tsx: Add stronger password validation (min 8 chars, uppercase, lowercase, number) and confirmPassword field with matching check.
- [x] Update username validation: Ensure alphanumeric, no spaces, min 3 max 20 or something.
- [x] Add confirmPassword input field to the sign-up form in components/auth/auth-dialog.tsx.
- [x] Modify handleSignUp in components/auth/auth-dialog.tsx: Add check if password === confirmPassword before submitting.
- [ ] Test the updated sign-up form to ensure validation works correctly.
