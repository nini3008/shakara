import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Section Name',
      type: 'string',
      description: 'Internal name for this hero section (not displayed on site)',
      validation: (Rule) => Rule.required()
    }),
    defineField({
        name: 'logo',
        title: 'Festival Logo',
        type: 'image',
        options: { hotspot: true },
        fields: [
          {
            name: 'alt',
            title: 'Alt text',
            type: 'string',
          },
        ],
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
      name: 'festivalName',
      title: 'Festival Name',
      type: 'string',
      description: 'Main festival title (e.g., "SHAKARA FESTIVAL")',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'badge',
      title: 'Badge Text',
      type: 'string',
      description: 'Text shown in the badge above the title',
      initialValue: "🌍 Africa's Premier Music Festival"
    }),
    defineField({
      name: 'dates',
      title: 'Festival Dates',
      type: 'object',
      fields: [
        defineField({
          name: 'start',
          title: 'Start Date',
          type: 'date',
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: 'end',
          title: 'End Date', 
          type: 'date',
          validation: (Rule) => Rule.required()
        })
      ]
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        defineField({
          name: 'venue',
          title: 'Venue',
          type: 'string',
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: 'country',
          title: 'Country',
          type: 'string',
          initialValue: 'Nigeria'
        }),
        defineField({
          name: 'address',
          title: 'Full Address',
          type: 'text',
          description: 'Complete address for the venue'
        })
      ]
    }),
    defineField({
      name: 'stats',
      title: 'Festival Stats',
      type: 'object',
      description: 'Statistics displayed in the hero section',
      fields: [
        defineField({
          name: 'artistCount',
          title: 'Number of Artists',
          type: 'number',
          description: 'Total number of performing artists',
          initialValue: 50
        }),
        defineField({
          name: 'expectedAttendance',
          title: 'Expected Attendance',
          type: 'string',
          description: 'Expected number of attendees (e.g., "50K+")',
          initialValue: '50K+'
        }),
        defineField({
          name: 'dayCount',
          title: 'Number of Days',
          type: 'number',
          description: 'Duration of the festival in days',
          options: {
            list: [
              {title: '1 Day', value: 1},
              {title: '2 Days', value: 2},
              {title: '3 Days', value: 3},
              {title: '4 Days', value: 4},
              {title: '5 Days', value: 5}
            ]
          },
          initialValue: 4
        })
      ]
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Optional background image for the hero section',
      options: {
        hotspot: true,
      }
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      description: 'Social media links displayed in the hero section',
      fields: [
        defineField({name: 'instagram', title: 'Instagram', type: 'url'}),
        defineField({name: 'twitter', title: 'Twitter', type: 'url'}),
        defineField({name: 'tiktok', title: 'TikTok', type: 'url'}),
        defineField({name: 'youtube', title: 'YouTube', type: 'url'}),
        defineField({name: 'facebook', title: 'Facebook', type: 'url'}),
        defineField({name: 'spotify', title: 'Spotify', type: 'url'})
      ]
    }),
    defineField({
      name: 'description',
      title: 'Festival Description',
      type: 'text',
      description: 'Brief description of the festival (for SEO and meta tags)'
    }),
    defineField({
      name: 'ctaButtons',
      title: 'Call-to-Action Buttons',
      type: 'object',
      description: 'Optional action buttons in the hero section',
      fields: [
        defineField({
          name: 'primary',
          title: 'Primary Button',
          type: 'object',
          fields: [
            defineField({name: 'text', title: 'Button Text', type: 'string'}),
            defineField({name: 'url', title: 'Button URL', type: 'url'}),
            defineField({name: 'enabled', title: 'Show Button', type: 'boolean', initialValue: false})
          ]
        }),
        defineField({
          name: 'secondary',
          title: 'Secondary Button',
          type: 'object',
          fields: [
            defineField({name: 'text', title: 'Button Text', type: 'string'}),
            defineField({name: 'url', title: 'Button URL', type: 'url'}),
            defineField({name: 'enabled', title: 'Show Button', type: 'boolean', initialValue: false})
          ]
        })
      ]
    }),
    defineField({
      name: 'showScrollIndicator',
      title: 'Show Scroll Indicator',
      type: 'boolean',
      description: 'Display the animated scroll indicator at the bottom',
      initialValue: true
    }),
    defineField({
      name: 'showStats',
      title: 'Show Statistics',
      type: 'boolean',
      description: 'Display the festival statistics in the hero section',
      initialValue: true
    }),
    defineField({
      name: 'showSocialLinks',
      title: 'Show Social Links',
      type: 'boolean',
      description: 'Display social media links in the hero section',
      initialValue: true
    }),
    defineField({
      name: 'active',
      title: 'Active Hero Section',
      type: 'boolean',
      description: 'Set as the active hero section to display on the homepage',
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: 'festivalName',
      subtitle: 'name',
      media: 'heroImage',
      active: 'active'
    },
    prepare({title, subtitle, media, active}) {
      return {
        title: title || 'Untitled Festival',
        subtitle: `${subtitle}${active ? ' (Active)' : ''}`,
        media: media
      }
    }
  },
  orderings: [
    {
      title: 'Active First',
      name: 'activeFirst',
      by: [
        {field: 'active', direction: 'desc'},
        {field: 'festivalName', direction: 'asc'}
      ]
    }
  ]
})