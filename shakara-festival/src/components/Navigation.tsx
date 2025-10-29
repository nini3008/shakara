'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Menu, X, Ticket, Calendar, Music, ShoppingBag, Users, Handshake, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import ThemeToggle from './ThemeToggle'
import styles from './Navigation.module.scss'

interface NavLink {
  href: string
  label: string
  icon: LucideIcon
  type: 'anchor' | 'route'
}

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Different nav links based on current page
  const isHomePage = pathname === '/'
  
  const navLinks: NavLink[] = isHomePage ? [
    { href: '#about', label: 'About', icon: Music, type: 'anchor' },
    { href: '#lineup', label: 'Lineup', icon: Music, type: 'anchor' },
    { href: '#tickets', label: 'Tickets', icon: Ticket, type: 'anchor' },
    { href: '#schedule', label: 'Schedule', icon: Calendar, type: 'anchor' },
    { href: '#partners', label: 'Partners', icon: Handshake, type: 'anchor' },
    // { href: '#merch', label: 'Merch', icon: ShoppingBag, type: 'anchor' },
  ] : [
    { href: '/', label: 'Home', icon: Music, type: 'route' },
    { href: '/#lineup', label: 'Lineup', icon: Music, type: 'route' },
    { href: '/#artists', label: 'Artists', icon: Users, type: 'route' },
    { href: '/#tickets', label: 'Tickets', icon: Ticket, type: 'route' },
  ]

  const handleLinkClick = (href: string, type: string) => {
    setIsOpen(false)
    
    if (type === 'anchor') {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    // For route type, Next.js Link will handle the navigation
  }

  const NavLinkComponent = ({ link, index }: { link: NavLink; index: number }) => {
    const isActive = link.type === 'route' && pathname === link.href
    const IconComponent = link.icon

    if (link.type === 'route') {
      return (
        <motion.li
          key={link.href}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            href={link.href}
            className={`${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <IconComponent />
            <span>{link.label}</span>
          </Link>
        </motion.li>
      )
    }

    return (
      <motion.li
        key={link.href}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <button
          onClick={() => handleLinkClick(link.href, link.type)}
          className={styles.navLink}
        >
          <IconComponent />
          <span>{link.label}</span>
        </button>
      </motion.li>
    )
  }

  const MobileNavLinkComponent = ({ link, index }: { link: NavLink; index: number }) => {
    const isActive = link.type === 'route' && pathname === link.href
    const IconComponent = link.icon

    if (link.type === 'route') {
      return (
        <motion.div
          key={link.href}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <Link
            href={link.href}
            onClick={() => setIsOpen(false)}
            className={`${styles.mobileNavLink} ${isActive ? styles.active : ''} ${theme === 'light' ? styles.light : ''}`}
          >
            <IconComponent className={styles.mobileNavIcon} />
            <span className={styles.mobileNavLabel}>
              {link.label}
            </span>
          </Link>
        </motion.div>
      )
    }

    return (
      <motion.button
        key={link.href}
        onClick={() => handleLinkClick(link.href, link.type)}
        className={`${styles.mobileNavLink} ${theme === 'light' ? styles.light : ''}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 + index * 0.05 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <IconComponent className={styles.mobileNavIcon} />
        <span className={styles.mobileNavLabel}>
          {link.label}
        </span>
      </motion.button>
    )
  }

  return (
    <>
      <motion.nav
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''} ${theme === 'light' ? styles.light : ''} theme-${theme}`}
        data-theme={theme}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.container}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className={styles.logo}>
              <img
                src="/images/SHAKARABW.png"
                alt="SHAKARA Festival"
                style={{ height: '40px', width: 'auto' }}
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation Menu */}
          <ul className={`${styles.menu} ${styles.desktop}`}>
            {navLinks.map((link, index) => (
              <NavLinkComponent key={link.href} link={link} index={index} />
            ))}
          </ul>

          {/* Desktop Theme Toggle and CTA Button */}
          <div className={styles.cta}>
            <ThemeToggle />
            {isHomePage ? (
              <button 
                className={styles.ctaButton}
                onClick={() => handleLinkClick('#tickets', 'anchor')}
              >
                Get Tickets
              </button>
            ) : (
              <Link href="/tickets" className={styles.ctaButton}>
                Get Tickets
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Custom Mobile Drawer using Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Drawer Backdrop/Overlay - ONLY for mobile menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className={styles.mobileBackdrop}
            />
            
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'spring', 
                damping: 30, 
                stiffness: 300 
              }}
              className={`${styles.drawer} ${theme === 'light' ? styles.light : ''}`}
            >
              <div className={styles.drawerContent}>
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className={`${styles.closeButton} ${theme === 'light' ? styles.light : ''}`}
                  aria-label="Close menu"
                >
                  <X />
                </button>

                {/* Mobile Logo */}
                <div className={`${styles.mobileHeader} ${theme === 'light' ? styles.light : ''}`}>
                  <motion.h2 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link href="/" onClick={() => setIsOpen(false)}>
                      <img
                        src="/images/SHAKARABW.png"
                        alt="SHAKARA Festival"
                        style={{ height: '32px', width: 'auto' }}
                      />
                    </Link>
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Festival 2025
                  </motion.p>
                </div>

                {/* Mobile Theme Toggle */}
                <motion.div 
                  className={styles.mobileThemeToggle}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <ThemeToggle />
                </motion.div>

                {/* Mobile Menu Links */}
                <div className={styles.mobileNav}>
                  {navLinks.map((link, index) => (
                    <MobileNavLinkComponent key={link.href} link={link} index={index} />
                  ))}
                </div>

                {/* Mobile CTA */}
                <motion.div 
                  className={styles.mobileCta}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {isHomePage ? (
                    <button
                      className={styles.mobilePrimaryButton}
                      onClick={() => handleLinkClick('#tickets', 'anchor')}
                    >
                      Get Tickets Now
                    </button>
                  ) : (
                    <Link href="/tickets" onClick={() => setIsOpen(false)} className={styles.mobilePrimaryButton}>
                      Get Tickets Now
                    </Link>
                  )}
                  <button
                    className={`${styles.mobileSecondaryButton} ${theme === 'light' ? styles.light : ''}`}
                    onClick={() => {
                      setIsOpen(false)
                      if (isHomePage) {
                        handleLinkClick('#newsletter', 'anchor')
                      }
                    }}
                  >
                    Stay Updated
                  </button>
                </motion.div>

                {/* Social Links */}
                <motion.div 
                  className={`${styles.socialLinks} ${theme === 'light' ? styles.light : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {['Instagram', 'Twitter', 'TikTok', 'YouTube'].map((social, idx) => (
                    <motion.a
                      key={social}
                      href="#"
                      className={`${styles.socialLink} ${theme === 'light' ? styles.light : ''}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + idx * 0.05 }}
                      aria-label={`Visit our ${social} page`}
                    >
                      <span>
                        {social[0]}
                      </span>
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* REMOVED: The problematic Navigation Backdrop that was blocking mobile content */}
      {/* This section was causing the mobile scroll blocking issue */}
    </>
  )
}

export default Navigation