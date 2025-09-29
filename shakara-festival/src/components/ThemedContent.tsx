'use client'

import React from 'react'
import './ThemedContent.scss'

interface ThemedContentProps {
  children: React.ReactNode
  className?: string
  transparent?: boolean
}

const ThemedContent: React.FC<ThemedContentProps> = ({ children, className = '', transparent = false }) => {
  // Always use dark theme
  const theme = 'dark'
  
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