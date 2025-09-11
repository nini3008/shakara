'use client'

import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './ThemeToggle.module.scss'

interface ThemeToggleProps {
  className?: string
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme, isLoading } = useTheme()

  if (isLoading) {
    return (
      <div className={`${styles.toggle} ${className}`}>
        <div className={styles.loading} />
      </div>
    )
  }

  return (
    <motion.button
      className={`${styles.toggle} ${className}`}
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        className={styles.iconContainer}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: theme === 'light' ? 0 : 180 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <motion.div
          className={styles.iconWrapper}
          animate={{ 
            opacity: theme === 'light' ? 1 : 0,
            scale: theme === 'light' ? 1 : 0.8
          }}
          transition={{ duration: 0.3 }}
        >
          <Sun className={styles.icon} />
        </motion.div>
        <motion.div
          className={`${styles.iconWrapper} ${styles.moonWrapper}`}
          animate={{ 
            opacity: theme === 'dark' ? 1 : 0,
            scale: theme === 'dark' ? 1 : 0.8
          }}
          transition={{ duration: 0.3 }}
        >
          <Moon className={styles.icon} />
        </motion.div>
      </motion.div>
      
      <span className={styles.label}>
        {theme === 'light' ? 'Light' : 'Dark'}
      </span>
    </motion.button>
  )
}

export default ThemeToggle