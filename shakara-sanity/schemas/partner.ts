// sanity/schemas/partner.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'partner',
  title: 'Partners',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Partner Name',
      type: 'string',
      validation: (Rule) => Rule.required()
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
      name: 'logo',
      title: 'Partner Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
      description: 'Partner website link (optional)',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      })
    }),
    defineField({
      name: 'tier',
      title: 'Partnership Tier',
      type: 'string',
      options: {
        list: [
          {title: 'Title Sponsor', value: 'title'},
          {title: 'Presenting Sponsor', value: 'presenting'},
          {title: 'Official Partner', value: 'official'},
          {title: 'Media Partner', value: 'media'},
          {title: 'Supporting Partner', value: 'supporting'}
        ]
      },
      initialValue: 'official',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Partner Category',
      type: 'string',
      options: {
        list: [
          {title: 'Music & Entertainment', value: 'music'},
          {title: 'Technology', value: 'technology'},
          {title: 'Food & Beverage', value: 'food'},
          {title: 'Fashion & Lifestyle', value: 'fashion'},
          {title: 'Media & Broadcasting', value: 'media'},
          {title: 'Financial Services', value: 'finance'},
          {title: 'Transportation', value: 'transport'},
          {title: 'Hospitality', value: 'hospitality'},
          {title: 'Healthcare', value: 'healthcare'},
          {title: 'Other', value: 'other'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Partner Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of the partnership'
    }),
    defineField({
      name: 'featured',
      title: 'Featured Partner',
      type: 'boolean',
      description: 'Show in featured partners section',
      initialValue: false
    }),
    defineField({
      name: 'active',
      title: 'Active Partnership',
      type: 'boolean',
      description: 'Is this partnership currently active?',
      initialValue: true
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order for displaying partners (lower numbers first)',
      initialValue: 100
    }),
    defineField({
      name: 'logoVariant',
      title: 'Logo Variant',
      type: 'string',
      options: {
        list: [
          {title: 'Full Color', value: 'color'},
          {title: 'White/Light', value: 'light'},
          {title: 'Black/Dark', value: 'dark'},
          {title: 'Monochrome', value: 'mono'}
        ]
      },
      initialValue: 'color',
      description: 'Which version of the logo to display'
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'email',
          title: 'Contact Email',
          type: 'email'
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string'
        }),
        defineField({
          name: 'contactPerson',
          title: 'Contact Person',
          type: 'string'
        })
      ]
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({name: 'instagram', title: 'Instagram', type: 'url'}),
        defineField({name: 'twitter', title: 'Twitter', type: 'url'}),
        defineField({name: 'facebook', title: 'Facebook', type: 'url'}),
        defineField({name: 'linkedin', title: 'LinkedIn', type: 'url'}),
        defineField({name: 'youtube', title: 'YouTube', type: 'url'})
      ]
    }),
    defineField({
      name: 'partnershipDetails',
      title: 'Partnership Details',
      type: 'object',
      fields: [
        defineField({
          name: 'startDate',
          title: 'Partnership Start Date',
          type: 'date'
        }),
        defineField({
          name: 'endDate',
          title: 'Partnership End Date',
          type: 'date'
        }),
        defineField({
          name: 'benefits',
          title: 'Partnership Benefits',
          type: 'array',
          of: [{type: 'string'}],
          description: 'List of benefits provided by this partnership'
        })
      ]
    })
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'tier', direction: 'asc'},
        {field: 'name', direction: 'asc'}
      ]
    },
    {
      title: 'Partnership Tier',
      name: 'tierAsc',
      by: [
        {field: 'tier', direction: 'asc'},
        {field: 'order', direction: 'asc'},
        {field: 'name', direction: 'asc'}
      ]
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [
        {field: 'name', direction: 'asc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      tier: 'tier',
      category: 'category',
      featured: 'featured',
      active: 'active',
      media: 'logo'
    },
    prepare({title, tier, category, featured, active, media}) {
      const tierLabels: Record<string, string> = {
        title: 'Title Sponsor',
        presenting: 'Presenting',
        official: 'Official',
        media: 'Media',
        supporting: 'Supporting'
      };
      
      return {
        title: title,
        subtitle: `${tierLabels[tier] || tier} • ${category}${featured ? ' (Featured)' : ''}${!active ? ' (Inactive)' : ''}`,
        media: media
      }
    }
  }
})