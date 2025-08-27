// sanity/schemas/aboutSection.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutSection',
  title: 'About Section',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Section Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'About Section'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'About Shakara Festival'
    }),
    defineField({
      name: 'description',
      title: 'Festival Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
      description: 'Main description of the festival'
    }),
    defineField({
      name: 'stats',
      title: 'Festival Statistics',
      type: 'object',
      fields: [
        defineField({
          name: 'artistCount',
          title: 'Number of Artists',
          type: 'string',
          initialValue: '50+'
        }),
        defineField({
          name: 'dayCount',
          title: 'Number of Days',
          type: 'string',
          initialValue: '4'
        }),
        defineField({
          name: 'stageCount',
          title: 'Number of Stages',
          type: 'string',
          initialValue: '5'
        }),
        defineField({
          name: 'expectedAttendance',
          title: 'Expected Attendance',
          type: 'string',
          initialValue: '50K'
        })
      ]
    }),
    defineField({
      name: 'highlights',
      title: 'Festival Highlights',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon (Emoji)',
              type: 'string',
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'title',
              title: 'Highlight Title',
              type: 'string',
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'description',
              title: 'Highlight Description',
              type: 'string',
              validation: (Rule) => Rule.required()
            })
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              icon: 'icon'
            },
            prepare({title, subtitle, icon}) {
              return {
                title: `${icon} ${title}`,
                subtitle: subtitle
              }
            }
          }
        }
      ],
      validation: (Rule) => Rule.min(1).max(6)
    }),
    defineField({
      name: 'essentialInfo',
      title: 'Essential Information',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Info Title',
              type: 'string',
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'content',
              title: 'Info Content',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required()
            })
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'content'
            }
          }
        }
      ],
      validation: (Rule) => Rule.min(1).max(5)
    }),
    defineField({
      name: 'socialSection',
      title: 'Social Media Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Social Section Title',
          type: 'string',
          initialValue: 'Follow Us'
        }),
        defineField({
          name: 'showSocialLinks',
          title: 'Show Social Links',
          type: 'boolean',
          initialValue: true
        }),
        defineField({
          name: 'socialLinks',
          title: 'Social Media Links',
          type: 'object',
          fields: [
            defineField({name: 'instagram', title: 'Instagram', type: 'url'}),
            defineField({name: 'twitter', title: 'Twitter', type: 'url'}),
            defineField({name: 'facebook', title: 'Facebook', type: 'url'}),
            defineField({name: 'youtube', title: 'YouTube', type: 'url'}),
            defineField({name: 'spotify', title: 'Spotify', type: 'url'}),
            defineField({name: 'tiktok', title: 'TikTok', type: 'url'}),
            defineField({name: 'linkedin', title: 'LinkedIn', type: 'url'})
          ]
        })
      ]
    }),
    defineField({
      name: 'active',
      title: 'Active Section',
      type: 'boolean',
      description: 'Is this the active about section?',
      initialValue: true
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order for displaying sections (lower numbers first)',
      initialValue: 100
    })
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'name', direction: 'asc'}
      ]
    },
    {
      title: 'Active First',
      name: 'activeFirst',
      by: [
        {field: 'active', direction: 'desc'},
        {field: 'order', direction: 'asc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      name: 'name',
      active: 'active',
      order: 'order'
    },
    prepare({title, name, active, order}) {
      return {
        title: title || name,
        subtitle: `${active ? 'Active' : 'Inactive'} • Order: ${order}`,
        media: undefined
      }
    }
  }
})