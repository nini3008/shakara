// sanity/schemas/vendor.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'vendor',
  title: 'Vendors',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Vendor Name',
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
      title: 'Vendor Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Optional banner/hero image for vendor',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        }
      ]
    }),
    defineField({
      name: 'category',
      title: 'Vendor Category',
      type: 'string',
      options: {
        list: [
          {title: 'Food & Beverages', value: 'food'},
          {title: 'Fashion & Apparel', value: 'fashion'},
          {title: 'Arts & Crafts', value: 'arts'},
          {title: 'Beauty & Wellness', value: 'beauty'},
          {title: 'Accessories & Jewelry', value: 'accessories'},
          {title: 'Home & Lifestyle', value: 'lifestyle'},
          {title: 'Tech & Gadgets', value: 'tech'},
          {title: 'Entertainment', value: 'entertainment'},
          {title: 'Services', value: 'services'},
          {title: 'Other', value: 'other'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      description: 'Brief description of the vendor and what they offer',
      validation: (Rule) => Rule.required().min(50).max(500)
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Key offerings or unique selling points (3-5 items recommended)',
      validation: (Rule) => Rule.max(7)
    }),
    defineField({
      name: 'location',
      title: 'Booth Location',
      type: 'string',
      description: 'Location at the festival (e.g., "Food Court - Section A", "Main Plaza - Booth 12")'
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      })
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({name: 'instagram', title: 'Instagram', type: 'url'}),
        defineField({name: 'twitter', title: 'Twitter', type: 'url'}),
        defineField({name: 'facebook', title: 'Facebook', type: 'url'}),
        defineField({name: 'tiktok', title: 'TikTok', type: 'url'}),
        defineField({name: 'linkedin', title: 'LinkedIn', type: 'url'})
      ]
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'email',
          title: 'Email',
          type: 'email'
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string'
        })
      ]
    }),
    defineField({
      name: 'featured',
      title: 'Featured Vendor',
      type: 'boolean',
      description: 'Highlight this vendor on the vendors page',
      initialValue: false
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Is this vendor confirmed for the festival?',
      initialValue: true
    }),
    defineField({
      name: 'acceptsPayments',
      title: 'Accepts Card Payments',
      type: 'boolean',
      description: 'Does this vendor accept card payments?',
      initialValue: false
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 100,
      validation: (Rule) => Rule.min(0)
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Searchable tags (e.g., "vegan", "handmade", "sustainable", "local")',
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'priceRange',
      title: 'Price Range',
      type: 'string',
      options: {
        list: [
          {title: '$ - Budget Friendly', value: 'budget'},
          {title: '$$ - Moderate', value: 'moderate'},
          {title: '$$$ - Premium', value: 'premium'},
          {title: '$$$$ - Luxury', value: 'luxury'}
        ]
      }
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [{
        type: 'image',
        options: {
          hotspot: true
        },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alt Text',
          },
          {
            name: 'caption',
            type: 'string',
            title: 'Caption',
          }
        ]
      }],
      description: 'Additional images showcasing products/services',
      validation: (Rule) => Rule.max(8)
    })
  ],
  orderings: [
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        {field: 'featured', direction: 'desc'},
        {field: 'order', direction: 'asc'},
        {field: 'name', direction: 'asc'}
      ]
    },
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'name', direction: 'asc'}
      ]
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [
        {field: 'category', direction: 'asc'},
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
      category: 'category',
      featured: 'featured',
      active: 'active',
      media: 'logo'
    },
    prepare({title, category, featured, active, media}) {
      const categoryLabels: Record<string, string> = {
        food: 'Food & Beverages',
        fashion: 'Fashion & Apparel',
        arts: 'Arts & Crafts',
        beauty: 'Beauty & Wellness',
        accessories: 'Accessories & Jewelry',
        lifestyle: 'Home & Lifestyle',
        tech: 'Tech & Gadgets',
        entertainment: 'Entertainment',
        services: 'Services',
        other: 'Other'
      };

      const status = !active ? ' (Inactive)' : featured ? ' ⭐' : '';

      return {
        title: title,
        subtitle: `${categoryLabels[category] || category}${status}`,
        media: media
      }
    }
  }
})
