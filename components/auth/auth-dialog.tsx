'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be at most 20 characters').regex(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignInForm = z.infer<typeof signInSchema>
type SignUpForm = z.infer<typeof signUpSchema>

export function AuthDialog() {
  const [open, setOpen] = React.useState(false)
  const [isSignUp, setIsSignUp] = React.useState(false)

  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  })

  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  })

  const handleSignIn = async (data: SignInForm) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign in failed');
      }

      toast.success('Logged in successfully!')
      setOpen(false)
      signInForm.reset()
      window.location.reload(); // Reload to update auth context

    } catch (error: any) {
      toast.error(error.message || 'Sign in failed')
    }
  }

  const handleSignUp = async (data: SignUpForm) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
      }

      toast.success('Account created successfully! Please check your email for confirmation.')
      setOpen(false)
      signUpForm.reset()

    } catch (error: any) {
      toast.error(error.message || 'Sign up failed')
    }
  }

  const resetToInitial = () => {
    setIsSignUp(false)
    signInForm.reset()
    signUpForm.reset()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      setOpen(open)
      if (!open) resetToInitial()
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Create an account' : 'Login to your account'}</DialogTitle>
        </DialogHeader>
        {isSignUp ? (
          <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                {...signUpForm.register('email')}
              />
              {signUpForm.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">{signUpForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Username"
                {...signUpForm.register('username')}
              />
              {signUpForm.formState.errors.username && (
                <p className="text-sm text-red-500 mt-1">{signUpForm.formState.errors.username.message}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                {...signUpForm.register('password')}
              />
              {signUpForm.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">{signUpForm.formState.errors.password.message}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                {...signUpForm.register('confirmPassword')}
              />
              {signUpForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{signUpForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <Button type="submit">Sign Up</Button>
              <Button variant="link" onClick={() => setIsSignUp(false)}>
                Have an account? Login
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                {...signInForm.register('email')}
              />
              {signInForm.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">{signInForm.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                {...signInForm.register('password')}
              />
              {signInForm.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">{signInForm.formState.errors.password.message}</p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <Button type="submit">Login</Button>
              <Button variant="link" onClick={() => setIsSignUp(true)}>
                Don't have an account? Sign Up
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}