'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast, { Toaster } from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  interests: z.array(z.string()).optional(),
})

type NewsletterForm = z.infer<typeof newsletterSchema>

interface NewsletterSignupProps {
  variant?: 'hero' | 'footer' | 'modal'
  className?: string
}

const NewsletterSignup = ({ variant = 'hero', className }: NewsletterSignupProps) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: NewsletterForm) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe')
      }

      const result = await response.json()
      
      if (result.success) {
        toast.success('🎉 Welcome to the Shakara family! Check your email for updates.', {
          duration: 5000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #feca57',
          },
        })
        reset()
      } else {
        throw new Error(result.error || 'Subscription failed')
      }
    } catch (error) {
      console.error('Newsletter signup error:', error)
      toast.error('Something went wrong. Please try again.', {
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #ff6b6b',
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const interests = [
    'Lineup Announcements',
    'Ticket Sales',
    'VIP Experiences',
    'Merchandise',
    'Schedule Updates',
    'After Parties'
  ]

  if (variant === 'hero') {
    return (
      <div className={cn('max-w-md mx-auto', className)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('firstName')}
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>
            )}
          </div>
          
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!isValid || isLoading}
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
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-3">What interests you most? (optional)</p>
            <div className="grid grid-cols-2 gap-2">
              {interests.map((interest) => (
                <label key={interest} className="flex items-center space-x-2 text-sm">
                  <input
                    {...register('interests')}
                    type="checkbox"
                    value={interest}
                    className="rounded border-gray-600 bg-white/10 text-yellow-400 focus:ring-yellow-400"
                  />
                  <span className="text-gray-300">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Joining...' : 'JOIN THE MOVEMENT'}
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
        <input
          {...register('email')}
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email.message}</p>
        )}
        <Button 
          type="submit" 
          size="sm"
          className="w-full"
          disabled={!isValid || isLoading}
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
      <Toaster position="bottom-center" />
    </div>
  )
}

export default NewsletterSignup