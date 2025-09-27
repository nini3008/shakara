'use client'

import React from 'react'
import { motion, useInView } from 'framer-motion'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  y?: number
}

export default function Reveal({ children, delay = 0, y = 24 }: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { margin: '-100px', once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      style={{ willChange: 'opacity, transform, filter' }}
    >
      {children}
    </motion.div>
  )
}


