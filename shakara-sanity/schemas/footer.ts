import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'footerSection',
  title: 'Footer Section',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Configuration Name',
      type: 'string',
      description: 'Internal name for this footer configuration',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Unique identifier for this footer configuration',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Enable this footer configuration',
      initialValue: true,
    }),
    defineField({
      name: 'brandSection',
      title: 'Brand Section',
      type: 'object',
      fields: [
        defineField({
          name: 'festivalName',
          title: 'Festival Name',
          type: 'string',
          initialValue: 'SHAKARA FESTIVAL',
        }),
        defineField({
          name: 'tagline',
          title: 'Tagline',
          type: 'string',
          initialValue: "Africa's premier music festival",
        }),
        defineField({
          name: 'location',
          title: 'Location & Date',
          type: 'string',
          initialValue: 'Victoria Island, Lagos • December 2025',
        }),
      ],
    }),
    defineField({
      name: 'quickLinks',
      title: 'Quick Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Link Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Link URL',
              type: 'string',
              description: 'Use # for anchor links (e.g., #about) or full URLs',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
            },
          },
        },
      ],
      initialValue: [
        {label: 'About', href: '#about'},
        {label: 'Lineup', href: '#lineup'},
        {label: 'Tickets', href: '#tickets'},
        {label: 'Schedule', href: '#schedule'},
        {label: 'Partners', href: '#partners'},
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
          description: 'Instagram profile URL',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter',
          type: 'url',
          description: 'Twitter profile URL',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
          description: 'Facebook page URL',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
          description: 'YouTube channel URL',
        }),
        defineField({
          name: 'spotify',
          title: 'Spotify',
          type: 'url',
          description: 'Spotify playlist or artist URL',
        }),
        defineField({
          name: 'tiktok',
          title: 'TikTok',
          type: 'url',
          description: 'TikTok profile URL',
        }),
        defineField({
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'url',
          description: 'LinkedIn page URL',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
    defineField({
      name: 'legalLinks',
      title: 'Legal Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Link Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Link URL',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
            },
          },
        },
      ],
      initialValue: [
        {label: 'Privacy Policy', href: '/privacy'},
        {label: 'Terms of Service', href: '/terms'},
      ],
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright Text',
      type: 'string',
      description: 'Copyright text (year will be automatically added)',
      initialValue: 'Shakara Festival. All rights reserved.',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this footer appears (lower numbers first)',
      initialValue: 1,
    }),
  ],
  orderings: [
    {
      title: 'Active First',
      name: 'activeFirst',
      by: [
        {field: 'active', direction: 'desc'},
        {field: 'order', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'brandSection.festivalName',
      active: 'active',
    },
    prepare({title, subtitle, active}) {
      return {
        title: title || 'Untitled Footer',
        subtitle: `${subtitle || 'No festival name'} ${active ? '(Active)' : '(Inactive)'}`,
      }
    },
  },
})