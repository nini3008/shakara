import { Fragment, type ReactNode } from 'react'
import Image from 'next/image'

import styles from './BlogContent.module.scss'
import type { BlogPortableImage, BlogPortableText, PortableTextBlock, PortableTextSpan } from '@/types'
import { urlFor } from '@/lib/sanity'

type BlogContentProps = {
  value: BlogPortableText
}

type ListPortableTextBlock = PortableTextBlock & {
  listItem?: 'bullet' | 'number'
}

type PortableTextMarkDef = Record<string, unknown> & {
  _key?: string
  _type?: string
  href?: string
  openInNewTab?: boolean
}

const wrapWithMark = (
  content: ReactNode,
  mark: string,
  markDefs: PortableTextMarkDef[]
): ReactNode => {
  switch (mark) {
    case 'strong':
      return <strong>{content}</strong>
    case 'em':
      return <em>{content}</em>
    case 'underline':
      return <span style={{ textDecoration: 'underline' }}>{content}</span>
    case 'code':
      return <code className={styles.code}>{content}</code>
    default: {
      const markDef = markDefs.find((def) => def._key === mark)
      if (markDef && markDef._type === 'link') {
        const href = typeof markDef.href === 'string' ? markDef.href : '#'
        const openInNewTab = markDef.openInNewTab !== false
        const isAnchorLink = href.startsWith('#')
        return (
          <a
            href={href}
            target={!isAnchorLink && openInNewTab ? '_blank' : undefined}
            rel={!isAnchorLink && openInNewTab ? 'noopener noreferrer' : undefined}
          >
            {content}
          </a>
        )
      }
      return content
    }
  }
}

const renderSpans = (
  spans: PortableTextSpan[] = [],
  markDefs: PortableTextMarkDef[] = []
): ReactNode => {
  return spans.map((span) => {
    const text = span.text ?? ''
    if (!text) return null
    const marks = span.marks ?? []
    const node = marks.reduce<ReactNode>((acc, mark) => wrapWithMark(acc, mark, markDefs), text)
    return <Fragment key={span._key}>{node}</Fragment>
  })
}

const renderBlockElement = (block: PortableTextBlock): ReactNode => {
  const key = block._key || Math.random().toString(36).slice(2)
  const markDefs = (block.markDefs as PortableTextMarkDef[]) || []
  const children = renderSpans(block.children, markDefs)
  const style = block.style || 'normal'

  switch (style) {
    case 'h2':
      return <h2 key={key}>{children}</h2>
    case 'h3':
      return <h3 key={key}>{children}</h3>
    case 'h4':
      return <h4 key={key}>{children}</h4>
    case 'blockquote':
      return <blockquote key={key}>{children}</blockquote>
    default:
      return <p key={key}>{children}</p>
  }
}

const renderImageBlock = (imageValue: BlogPortableImage, key: string): ReactNode => {
  if (!imageValue?.asset?._ref) {
    return null
  }

  const width = imageValue.width ?? 1600
  const height = imageValue.height ?? Math.round(width * 0.6)
  const imageUrl = urlFor(imageValue).width(width).height(height).quality(85).url()
  const wrapperClass = imageValue.isFullWidth ? styles.fullWidthImage : styles.inlineImage

  return (
    <div className={wrapperClass} key={key}>
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
}

export default function BlogContent({ value }: BlogContentProps) {
  if (!value || value.length === 0) {
    return null
  }

  const elements: ReactNode[] = []
  let currentList: {
    type: 'bullet' | 'number'
    items: ReactNode[]
    key: string
  } | null = null

  const flushList = () => {
    if (!currentList) return
    const ListTag = currentList.type === 'bullet' ? 'ul' : 'ol'
    const listClass = currentList.type === 'bullet' ? styles.listBullet : styles.listNumber
    elements.push(
      <ListTag key={currentList.key} className={listClass}>
        {currentList.items}
      </ListTag>
    )
    currentList = null
  }

  value.forEach((block, index) => {
    if (!block) return

    if ((block as BlogPortableImage)._type === 'image') {
      flushList()
      const imageValue = block as BlogPortableImage
      const key = imageValue._key || `image-${index}`
      elements.push(renderImageBlock(imageValue, key))
      return
    }

    const textBlock = block as ListPortableTextBlock
    if (textBlock._type !== 'block') {
      return
    }

    const listItem = (textBlock as ListPortableTextBlock).listItem
    const key = textBlock._key || `block-${index}`

    if (listItem) {
      const markDefs = (textBlock.markDefs as PortableTextMarkDef[]) || []
      const children = renderSpans(textBlock.children, markDefs)
      const listContent = <li key={key}>{children}</li>

      if (currentList && currentList.type === listItem) {
        currentList.items.push(listContent)
      } else {
        flushList()
        currentList = {
          type: listItem,
          items: [listContent],
          key: `list-${key}`,
        }
      }
    } else {
      flushList()
      elements.push(renderBlockElement(textBlock))
    }
  })

  flushList()

  return <div className={styles.content}>{elements}</div>
}

