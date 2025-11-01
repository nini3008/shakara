import { BookIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Posts',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'blogAuthor' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Feature on Blog Landing',
      type: 'boolean',
      description: 'Featured posts appear in the hero section of the blog landing page.',
      initialValue: false,
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Important for accessibility and SEO.',
          validation: (Rule) => Rule.required().min(10),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().min(50).max(280),
      description: 'Short introduction used in previews and social sharing.',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      validation: (Rule) => Rule.required().min(2),
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Heading 4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule) => Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
                  }),
                  defineField({
                    name: 'openInNewTab',
                    title: 'Open in new tab',
                    type: 'boolean',
                    initialValue: true,
                  }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required().min(10),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'isFullWidth',
              title: 'Display full width',
              type: 'boolean',
              description: 'If enabled, the image stretches to the full content width.',
              initialValue: false,
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'estimatedReadTime',
      title: 'Estimated Read Time (minutes)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(60),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'seoTitle',
          title: 'SEO Title',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        }),
        defineField({
          name: 'seoDescription',
          title: 'SEO Description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160),
        }),
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Publish date (newest first)',
      name: 'publishDateDesc',
      by: [
        { field: 'publishedAt', direction: 'desc' },
        { field: 'title', direction: 'asc' },
      ],
    },
    {
      title: 'Publish date (oldest first)',
      name: 'publishDateAsc',
      by: [
        { field: 'publishedAt', direction: 'asc' },
        { field: 'title', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'author.name',
      media: 'featuredImage',
      publishedAt: 'publishedAt',
      featured: 'featured',
    },
    prepare({ title, subtitle, media, publishedAt, featured }) {
      const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : 'Unscheduled'

      return {
        title,
        subtitle: `${featured ? '⭐ Featured · ' : ''}${subtitle ?? 'Unknown author'} · ${formattedDate}`,
        media,
      }
    },
  },
})

