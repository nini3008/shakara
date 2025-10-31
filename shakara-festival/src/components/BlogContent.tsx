import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import type {
  PortableTextComponents,
  PortableTextMarkComponentProps,
  PortableTextListComponent,
  PortableTextListItemComponent,
  PortableTextTypeComponentProps,
} from '@portabletext/react'
import type { ReactNode } from 'react'

import styles from './BlogContent.module.scss'
import type { BlogPortableImage, BlogPortableText } from '@/types'
import { urlFor } from '@/lib/sanity'

type BlogContentProps = {
  value: BlogPortableText
}

const bulletList: PortableTextListComponent = ({ children }) => (
  <ul className={styles.listBullet}>{children}</ul>
)

const numberList: PortableTextListComponent = ({ children }) => (
  <ol className={styles.listNumber}>{children}</ol>
)

const bulletItem: PortableTextListItemComponent = ({ children }) => <li>{children}</li>
const numberItem: PortableTextListItemComponent = ({ children }) => <li>{children}</li>

const components: PortableTextComponents = {
  types: {
    image: ({ value }: PortableTextTypeComponentProps<BlogPortableImage>) => {
      const imageValue = value

      if (!imageValue?.asset) {
        return null
      }

      const width = imageValue.width ?? 1600
      const height = imageValue.height ?? Math.round(width * 0.6)

      const imageUrl = urlFor(imageValue).width(width).height(height).quality(85).url()

      const wrapperClass = imageValue.isFullWidth ? styles.fullWidthImage : styles.inlineImage

      return (
        <div className={wrapperClass}>
          <figure>
            <Image
              src={imageUrl}
              alt={imageValue.alt ?? 'Blog visual'}
              width={width}
              height={height}
              sizes={imageValue.isFullWidth ? '100vw' : '(max-width: 768px) 100vw, 720px'}
              placeholder={imageValue.lqip ? 'blur' : 'empty'}
              blurDataURL={imageValue.lqip}
            />
            {imageValue.caption && <figcaption className={styles.imageCaption}>{imageValue.caption}</figcaption>}
          </figure>
        </div>
      )
    },
  },
  block: {
    normal: ({ children }: { children?: ReactNode }) => <p>{children}</p>,
    h2: ({ children }: { children?: ReactNode }) => <h2>{children}</h2>,
    h3: ({ children }: { children?: ReactNode }) => <h3>{children}</h3>,
    h4: ({ children }: { children?: ReactNode }) => <h4>{children}</h4>,
    blockquote: ({ children }: { children?: ReactNode }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    strong: ({ children }: PortableTextMarkComponentProps) => <strong>{children}</strong>,
    em: ({ children }: PortableTextMarkComponentProps) => <em>{children}</em>,
    underline: ({ children }: PortableTextMarkComponentProps) => <span style={{ textDecoration: 'underline' }}>{children}</span>,
    code: ({ children }: PortableTextMarkComponentProps) => <code className={styles.code}>{children}</code>,
    link: ({ children, value }: PortableTextMarkComponentProps<{ href?: string; openInNewTab?: boolean }>) => {
      const href = value?.href || '#'
      const openInNewTab = value?.openInNewTab ?? true

      if (href.startsWith('#')) {
        return <a href={href}>{children}</a>
      }

      return (
        <a
          href={href}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: bulletList,
    number: numberList,
  },
  listItem: {
    bullet: bulletItem,
    number: numberItem,
  },
}

export default function BlogContent({ value }: BlogContentProps) {
  if (!value || value.length === 0) {
    return null
  }

  return (
    <div className={styles.content}>
      <PortableText value={value} components={components} />
    </div>
  )
}

