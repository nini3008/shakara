'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark') // Default to dark (night mode)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if there's a saved theme in localStorage
    const savedTheme = localStorage.getItem('shakara-theme') as Theme | null
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme)
    } else {
      // Default to dark theme if no saved preference
      setTheme('dark')
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      // Save theme to localStorage
      localStorage.setItem('shakara-theme', theme)
      
      // Apply theme to document root
      document.documentElement.setAttribute('data-theme', theme)
      document.documentElement.classList.toggle('light', theme === 'light')
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
  }, [theme, isLoading])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  )
}