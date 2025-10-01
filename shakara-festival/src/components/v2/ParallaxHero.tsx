'use client'

import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ParallaxHero({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6])

  return (
    <motion.div style={{ y, opacity, willChange: 'transform, opacity' }}>
      {children}
    </motion.div>
  )
}


