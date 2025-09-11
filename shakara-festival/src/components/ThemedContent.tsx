'use client'

import React from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import './ThemedContent.scss'

interface ThemedContentProps {
  children: React.ReactNode
  className?: string
}

const ThemedContent: React.FC<ThemedContentProps> = ({ children, className = '' }) => {
  const { theme } = useTheme()
  
  return (
    <div 
      className={`themed-content theme-${theme} ${className}`}
      data-theme={theme}
    >
      {children}
    </div>
  )
}

export default ThemedContent