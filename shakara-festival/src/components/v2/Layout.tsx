'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CartProvider, useCart } from '@/contexts/CartContext'
import CartDropdown from './CartDropdown'
import NewsletterSignup from '@/components/sections/NewsLetterSignup'
import { CART_ENABLED } from '@/lib/featureFlags'

type FooterData = {
  brandSection?: { tagline?: string; location?: string }
  quickLinks?: { label?: string; href?: string }[]
  socialLinks?: Record<string, string>
  copyright?: string
}

type InnerLayoutProps = {
  children: React.ReactNode
  footerData?: FooterData | null
}

const navigationItems = [
  { title: 'Home', url: '/' },
  { title: 'About', url: '/about' },
  { title: 'Lineup', url: '/lineup' },
  { title: 'Schedule', url: '/schedule' },
  { title: 'Tickets', url: '/tickets' },
  { title: 'Vendors', url: '/vendors' },
  { title: 'Stay Updated', url: '#newsletter' },
  { title: 'Partnership', url: '/partnership' },
]

function InnerLayout({ children, footerData: initialFooterData }: InnerLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [footerData] = React.useState<FooterData | null>(initialFooterData || null)
  const { count } = useCart()
  const [cartOpen, setCartOpen] = React.useState(false)
  const [cartPulse, setCartPulse] = React.useState(false)

  React.useEffect(() => {
    const onAdd = () => {
      setCartPulse(true)
      setCartOpen(true)
      window.setTimeout(() => setCartPulse(false), 700)
      window.setTimeout(() => setCartOpen(false), 1800)
    }
    window.addEventListener('cart:add', onAdd as EventListener)
    return () => window.removeEventListener('cart:add', onAdd as EventListener)
  }, [])

  return (
    <div className="relative min-h-screen texture-bg">
      <style>{`
          :root {
            --gradient-primary: linear-gradient(135deg, #DC2626 0%, #F97316 100%);
            --gradient-secondary: linear-gradient(135deg, #EF4444 0%, #FB923C 100%);
            --gradient-primary-dark: linear-gradient(135deg, #7f1d1d 0%, #9a3412 100%);
            --gradient-secondary-dark: linear-gradient(135deg, #991b1b 0%, #c2410c 100%);
          }
          .gradient-text {
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
          }
          .gradient-bg { background: var(--gradient-primary); }
          .gradient-bg-secondary { background: var(--gradient-secondary); }
        `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[90] bg-gray-950/45 backdrop-blur-md border-b border-gray-800 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img
                src="/images/flutterwave-shakara-white.png"
                alt="Shakara Festival"
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    pathname === item.url
                      ? 'text-orange-400'
                      : 'text-gray-200 hover:text-orange-400'
                  }`}
                  onClick={(e) => {
                    // Handle smooth scrolling for anchor links
                    if (item.url.startsWith('#')) {
                      e.preventDefault()
                      const element = document.querySelector(item.url)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' })
                      }
                    }
                  }}
                >
                  {item.title}
                </Link>
              ))}
              <div className="relative inline-flex rounded-md shadow-sm">
                <Link href="/tickets">
                  <Button className="gradient-bg text-white hover:opacity-90 transition-opacity rounded-md">
                    Buy Tickets
                  </Button>
                </Link>
                {CART_ENABLED && (
                  <>
                    <Button
                      onClick={() => setCartOpen((o) => !o)}
                      size="icon"
                      aria-label="Open cart"
                      className={`rounded-none rounded-r-md bg-white/20 hover:bg-white/30 border-l border-white/30 relative ${cartPulse ? 'animate-pulse' : ''}`}
                    >
                      <ShoppingCart className="h-4 w-4 text-white" />
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center text-[10px] font-semibold px-1.5 h-4 min-w-4 rounded-full bg-orange-600 text-white pointer-events-none">
                          {Math.min(count, 99)}
                        </span>
                      )}
                    </Button>
                    <CartDropdown open={cartOpen} />
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Cart Icon for Mobile */}
                {CART_ENABLED && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open cart"
                    onClick={() => setCartOpen((o) => !o)}
                    className={`relative text-gray-200 hover:text-orange-400 ${cartPulse ? 'animate-pulse' : ''}`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                        {count}
                      </span>
                    )}
                  </Button>
                )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gray-950 border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    pathname === item.url
                      ? 'text-orange-400'
                      : 'text-gray-200 hover:text-orange-400'
                  }`}
                  onClick={(e) => {
                    setMobileMenuOpen(false)
                    // Handle smooth scrolling for anchor links
                    if (item.url.startsWith('#')) {
                      e.preventDefault()
                      // Small delay to allow mobile menu to close
                      setTimeout(() => {
                        const element = document.querySelector(item.url)
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' })
                        }
                      }, 150)
                    }
                  }}
                >
                  {item.title}
                </Link>
              ))}
              <div className="px-3 py-2 flex items-center gap-2">
                <Link href="/tickets" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                  <Button className="w-full gradient-bg text-white hover:opacity-90 transition-opacity rounded-md">
                    Buy Tickets
                  </Button>
                </Link>
                {CART_ENABLED && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open cart"
                    onClick={() => setCartOpen((o) => !o)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Torn paper overlay at page top over base texture */}
      {/* Torn paper overlay removed */}

      {/* Main Content */}
      <main className="pt-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-white py-16 bg-black/40 dark:bg-black/40 backdrop-blur-md border-t border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Newsletter Section - Full Width */}
          <div id="newsletter" className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Stay in the Loop</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Get first access to tickets, lineup announcements, and exclusive festival updates delivered straight to your inbox
              </p>
            </div>
            <div className="max-w-lg mx-auto">
              <NewsletterSignup variant="modal" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <img
                src="/images/flutterwave-shakara-white.png"
                alt="Shakara Festival"
                className="h-16 w-auto mb-4"
              />
              <p className="text-gray-400 text-lg leading-relaxed max-w-md mb-4">
                {footerData?.brandSection?.tagline || 'Experience the ultimate music festival with world-class artists, immersive stages, and unforgettable moments.'}
              </p>
              {footerData?.brandSection?.location && (
                <p className="text-gray-500 mb-4">{footerData.brandSection.location}</p>
              )}

              {/* Social Links moved here */}
              <div className="flex space-x-4">
                {footerData?.socialLinks ? (
                  Object.entries(footerData.socialLinks)
                    .filter(([platform, url]) => url && platform !== 'facebook' && platform !== 'youtube') // Hide Facebook and YouTube
                    .map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-orange-400 transition-colors"
                        aria-label={`Follow us on ${platform}`}
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    ))
                ) : (
                  // Fallback social links when CMS data is not available
                  <>
                    <a
                      href="https://www.instagram.com/theshakarafest/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-orange-400 transition-colors"
                      aria-label="Follow us on Instagram"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://x.com/theshakarafest/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-orange-400 transition-colors"
                      aria-label="Follow us on Twitter"
                    >
                      Twitter
                    </a>
                  </>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-2">
                {(footerData?.quickLinks?.length ? footerData.quickLinks : navigationItems).map((item: { label?: string; title?: string; href?: string; url?: string }, idx: number) => {
                  const label = item.label || item.title
                  const href = item.href || item.url

                  // Skip items without valid href or use navigationItems fallback
                  if (!href || href === '#') {
                    const fallbackItem = navigationItems[idx]
                    if (!fallbackItem) return null
                    return (
                      <Link
                        key={(fallbackItem.title || 'link') + idx}
                        href={fallbackItem.url}
                        className="block text-gray-400 hover:text-white transition-colors"
                      >
                        {fallbackItem.title}
                      </Link>
                    )
                  }

                  return (
                    <Link
                      key={(label || 'link') + idx}
                      href={href}
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  )
                })}
                <Link
                  href="/faq"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} {footerData?.copyright || 'Shakara Festival. All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function V2Layout({ children, footerData }: { children: React.ReactNode; currentPageName?: string; footerData?: FooterData | null }) {
  return (
    <CartProvider>
      <InnerLayout footerData={footerData}>{children}</InnerLayout>
    </CartProvider>
  )
}


