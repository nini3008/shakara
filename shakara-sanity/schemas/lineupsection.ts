// sanity/schemas/lineupSection.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'lineupSection',
  title: 'Lineup Section',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Section Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Lineup Section'
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
      initialValue: 'Festival Lineup'
    }),
    defineField({
      name: 'introText',
      title: 'Introduction Text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
      description: 'Brief description of the lineup'
    }),
    defineField({
      name: 'stats',
      title: 'Lineup Statistics',
      type: 'object',
      fields: [
        defineField({
          name: 'artistCount',
          title: 'Number of Artists',
          type: 'string',
          initialValue: '50+'
        }),
        defineField({
          name: 'stageCount',
          title: 'Number of Stages',
          type: 'string',
          initialValue: '5'
        }),
        defineField({
          name: 'genreCount',
          title: 'Number of Genres',
          type: 'string',
          initialValue: '15'
        })
      ]
    }),
    defineField({
      name: 'ctaSection',
      title: 'Call to Action Section',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'CTA Text',
          type: 'string',
          initialValue: "Don't miss these incredible performances!"
        }),
        defineField({
          name: 'primaryButton',
          title: 'Primary Button',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Button Text',
              type: 'string',
              initialValue: 'Get Your Tickets'
            }),
            defineField({
              name: 'url',
              title: 'Button URL',
              type: 'string',
              initialValue: '/tickets'
            }),
            defineField({
              name: 'enabled',
              title: 'Show Button',
              type: 'boolean',
              initialValue: true
            })
          ]
        }),
        defineField({
          name: 'secondaryButton',
          title: 'Secondary Button',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Button Text',
              type: 'string',
              initialValue: 'View Schedule'
            }),
            defineField({
              name: 'url',
              title: 'Button URL',
              type: 'string',
              initialValue: '#schedule'
            }),
            defineField({
              name: 'enabled',
              title: 'Show Button',
              type: 'boolean',
              initialValue: true
            })
          ]
        })
      ]
    }),
    defineField({
      name: 'emptyState',
      title: 'Empty State (When No Artists)',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Empty State Title',
          type: 'string',
          initialValue: 'Lineup Coming Soon'
        }),
        defineField({
          name: 'description',
          title: 'Empty State Description',
          type: 'text',
          rows: 2,
          initialValue: 'Get ready for an incredible lineup announcement featuring the best of African music!'
        }),
        defineField({
          name: 'buttonText',
          title: 'Notification Button Text',
          type: 'string',
          initialValue: 'Get Notified'
        }),
        defineField({
          name: 'buttonUrl',
          title: 'Notification Button URL',
          type: 'string',
          initialValue: '/newsletter'
        })
      ]
    }),
    defineField({
      name: 'featuredArtistCount',
      title: 'Number of Featured Artists to Show',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(20),
      initialValue: 8,
      description: 'How many artists to display in the grid'
    }),
    defineField({
      name: 'active',
      title: 'Active Section',
      type: 'boolean',
      description: 'Is this the active lineup section?',
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