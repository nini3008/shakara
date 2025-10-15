'use client'

import React, { useState } from 'react'

interface EmailButtonProps {
  email: string
  subject?: string
  className?: string
  children: React.ReactNode
  'aria-label'?: string
}

export default function EmailButton({ email, subject, className, children, 'aria-label': ariaLabel }: EmailButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    try {
      // First try mailto with subject (might work on some systems)
      const mailtoUrl = subject
        ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
        : `mailto:${email}`
      window.location.href = mailtoUrl

      // Wait a bit, then copy to clipboard as fallback
      setTimeout(async () => {
        try {
          await navigator.clipboard.writeText(email)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea')
          textArea.value = email
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
      }, 500)
    } catch (error) {
      // If mailto fails, just copy to clipboard
      try {
        await navigator.clipboard.writeText(email)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy email:', err)
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel}
      title={copied ? `Copied ${email}!` : `Contact us at ${email}`}
    >
      {copied ? 'Email Copied!' : children}
    </button>
  )
}