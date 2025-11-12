'use client'

import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast, { Toaster } from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
})

type NewsletterForm = z.infer<typeof newsletterSchema>

interface NewsletterSignupProps {
  variant?: 'hero' | 'footer' | 'modal'
  className?: string
}

const NewsletterSignup = ({ variant = 'hero', className }: NewsletterSignupProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [lastSubmission, setLastSubmission] = useState<number>(0)
  const [emailExists, setEmailExists] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid }
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
    mode: 'onChange'
  })

  const emailValue = watch('email')

  // Debounced email validation
  const checkEmailExists = useCallback(async (email: string) => {
    if (!email || !email.includes('@')) return

    setCheckingEmail(true)
    try {
      const response = await fetch('/api/newsletter/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const result = await response.json()
        setEmailExists(result.exists)
      }
    } catch (error) {
      console.error('Error checking email:', error)
      setEmailExists(false)
    } finally {
      setCheckingEmail(false)
    }
  }, [])

  // Debounce email checking
  useEffect(() => {
    if (!emailValue) {
      setEmailExists(false)
      setCheckingEmail(false)
      return
    }

    const timeoutId = setTimeout(() => {
      checkEmailExists(emailValue)
    }, 800) // 800ms debounce

    return () => clearTimeout(timeoutId)
  }, [emailValue, checkEmailExists])

  const onSubmit = async (data: NewsletterForm) => {
    // Check if email already exists before submission
    if (emailExists) {
      toast.error('This email is already subscribed to our newsletter!', {
        duration: 4000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #feca57',
        },
      })
      return
    }

    // Prevent rapid duplicate submissions (client-side protection)
    const now = Date.now()
    if (now - lastSubmission < 2000) { // 2 second debounce
      toast.error('Please wait a moment before submitting again.', {
        duration: 3000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #ffa726',
        },
      })
      return
    }

    setLastSubmission(now)
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: Failed to subscribe`)
      }

      if (result.success) {
        toast.success('🎉 Welcome to the Shakara family! Check your email for updates.', {
          duration: 5000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #feca57',
          },
        })
        trackEvent('movement_signup_success')
        reset()
      } else {
        throw new Error(result.error || 'Subscription failed')
      }
    } catch (error) {
      console.error('Newsletter signup error:', error)
      
      // Check for specific error types
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      const isRateLimited = errorMessage.includes('Too many signup requests');
      const isAlreadySubscribed = errorMessage.includes('already subscribed');
      
      toast.error(errorMessage, {
        duration: isAlreadySubscribed ? 4000 : (isRateLimited ? 5000 : 3000),
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: `1px solid ${isAlreadySubscribed ? '#feca57' : (isRateLimited ? '#ffa726' : '#ff6b6b')}`,
        },
      })
    } finally {
      setIsLoading(false)
    }
  }


  if (variant === 'hero') {
    return (
      <div className={cn('max-w-md mx-auto', className)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('firstName')}
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>
            )}
          </div>
          
          <div>
            <div className="relative">
              <input
                {...register('email')}
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-xl border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent ${
                  emailExists
                    ? 'border-red-400 focus:ring-red-400'
                    : checkingEmail
                      ? 'border-yellow-400 focus:ring-yellow-400'
                      : 'border-white/30 focus:ring-yellow-400'
                }`}
              />
              {checkingEmail && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>
                </div>
              )}
              {emailExists && !checkingEmail && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-red-400">✗</span>
                </div>
              )}
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
            {emailExists && !errors.email && (
              <p className="mt-1 text-sm text-red-400">This email is already subscribed!</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading || emailExists}
          >
            {isLoading ? 'Signing Up...' : 'SIGN UP FOR UPDATES'}
          </Button>
        </form>
        <Toaster position="top-center" />
      </div>
    )
  }

  if (variant === 'modal') {
    return (
      <div className={cn('glass p-8 rounded-3xl max-w-lg mx-auto', className)}>
        <div className="text-center mb-6">
          <h3 className="heading-font text-2xl font-bold text-gradient-afro mb-2">
            Join the Shakara Family
          </h3>
          <p className="text-gray-300">
            Be the first to know about lineup drops, ticket sales, and exclusive experiences.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                {...register('firstName')}
                type="text"
                placeholder="First Name"
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <input
                {...register('email')}
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
          </div>


          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
            disabled={!isValid || isLoading || emailExists}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Joining...
              </span>
            ) : (
              'JOIN THE MOVEMENT'
            )}
          </Button>
        </form>
        <Toaster position="top-center" />
      </div>
    )
  }

  // Footer variant
  return (
    <div className={cn('max-w-md', className)}>
      <h4 className="heading-font text-xl font-bold text-white mb-4">Stay Updated</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="relative">
          <input
            {...register('email')}
            type="email"
            placeholder="Enter your email"
            className={`w-full px-4 py-2 rounded-lg bg-white/20 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
              emailExists
                ? 'border-red-400 focus:ring-red-400'
                : checkingEmail
                  ? 'border-yellow-400 focus:ring-yellow-400'
                  : 'border-white/30 focus:ring-yellow-400'
            }`}
          />
          {checkingEmail && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full"></div>
            </div>
          )}
          {emailExists && !checkingEmail && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-red-400 text-sm">✗</span>
            </div>
          )}
        </div>
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
        {emailExists && !errors.email && (
          <p className="text-sm text-red-400">This email is already subscribed!</p>
        )}
        <Button
          type="submit"
          size="sm"
          className="w-full"
          disabled={!isValid || isLoading || emailExists}
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      <Toaster position="bottom-center" />
    </div>
  )
}

export default NewsletterSignup