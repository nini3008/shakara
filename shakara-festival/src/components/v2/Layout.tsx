'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/contexts/ThemeContext'

type FooterData = {
  brandSection?: { tagline?: string; location?: string }
  quickLinks?: { label?: string; href?: string }[]
  socialLinks?: Record<string, string>
  copyright?: string
}

const navigationItems = [
  { title: 'Home', url: '/' },
  { title: 'About', url: '/about' },
  { title: 'Lineup', url: '/lineup' },
  { title: 'Schedule', url: '/schedule' },
  { title: 'Sponsors', url: '/sponsors' },
  { title: 'Areas', url: '/areas' },
  { title: 'Partnership', url: '/partnership' },
]

export default function V2Layout({ children, currentPageName }: { children: React.ReactNode; currentPageName?: string }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [footerData, setFooterData] = React.useState<FooterData | null>(null)
  const { theme, toggleTheme } = useTheme()

  React.useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/footer', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setFooterData(data)
        }
      } catch {
        // ignore
      }
    })()
  }, [])

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} texture-bg`} data-theme={theme}>
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
          }
          .dark .gradient-text { background: var(--gradient-primary-dark); }
          .gradient-bg { background: var(--gradient-primary); }
          .dark .gradient-bg { background: var(--gradient-primary-dark); }
          .gradient-bg-secondary { background: var(--gradient-secondary); }
          .dark .gradient-bg-secondary { background: var(--gradient-secondary-dark); }
        `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/55 dark:bg-gray-950/45 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img
                src="/images/SHAKARAGradient.png"
                alt="Shakara Festival"
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    pathname === item.url
                      ? 'gradient-text'
                      : 'text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
              <Link href="/tickets">
                <Button className="gradient-bg text-white hover:opacity-90 transition-opacity">
                  Buy Tickets
                </Button>
              </Link>

              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                onClick={toggleTheme}
                className="ml-2 text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                onClick={toggleTheme}
                className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
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
          <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    pathname === item.url
                      ? 'gradient-text'
                      : 'text-gray-700 hover:text-orange-500 dark:text-gray-200 dark:hover:text-orange-400'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              <div className="px-3 py-2">
                <Link href="/tickets" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gradient-bg text-white hover:opacity-90 transition-opacity">
                    Buy Tickets
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <img
                src="/images/SHAKARAGradient.png"
                alt="Shakara Festival"
                className="h-16 w-auto mb-4"
              />
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                {footerData?.brandSection?.tagline || 'Experience the ultimate music festival with world-class artists, immersive stages, and unforgettable moments.'}
              </p>
              {footerData?.brandSection?.location && (
                <p className="text-gray-500 mt-2">{footerData.brandSection.location}</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {(footerData?.quickLinks?.length ? footerData.quickLinks : navigationItems).map((item: any, idx: number) => {
                  const label = item.label || item.title
                  const href = item.href || item.url
                  return (
                    <Link
                      key={(label || 'link') + idx}
                      href={href || '#'}
                      className="block text-gray-400 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>info@shakarafestival.com</p>
                <p>+1 (555) 123-4567</p>
                <p>Follow @shakarafestival</p>
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


