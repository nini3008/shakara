'use client'

import React from 'react'
import styles from './PaperSection.module.scss'

type Tone = 'default' | 'red' | 'cream'

export default function PaperSection({
  children,
  tone = 'default',
  className = '',
  flush = false,
  bgImage,
}: {
  children: React.ReactNode
  tone?: Tone
  className?: string
  flush?: boolean
  bgImage?: string
}) {
  return (
    <section
      className={`${styles.paperSection} ${styles[tone]} ${flush ? styles.flush : ''} ${bgImage ? styles.imageMode : ''} ${className}`}
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      <div className={styles.inner}>
        <div className={styles.content}>{children}</div>
      </div>
    </section>
  )
}


