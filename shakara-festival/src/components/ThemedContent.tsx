'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import './ThemedContent.scss'

interface ThemedContentProps {
  children: React.ReactNode
  className?: string
  transparent?: boolean
}

const ThemedContent: React.FC<ThemedContentProps> = ({ children, className = '', transparent = false }) => {
  const { theme } = useTheme()
  
  return (
    <div 
      className={`themed-content theme-${theme} ${transparent ? 'transparent' : ''} ${className}`}
      data-theme={theme}
    >
      {children}
    </div>
  )
}

export default ThemedContent