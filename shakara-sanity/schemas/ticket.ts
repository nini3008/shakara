import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'ticket',
  title: 'Tickets',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Ticket Name',
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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'price',
      title: 'Price (NGN)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0)
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original Price (NGN)',
      type: 'number',
      description: 'If this ticket is on sale, enter the original price here'
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          {title: 'Nigerian Naira (NGN)', value: 'NGN'},
          {title: 'US Dollar (USD)', value: 'USD'},
          {title: 'British Pound (GBP)', value: 'GBP'},
          {title: 'Euro (EUR)', value: 'EUR'}
        ]
      },
      initialValue: 'NGN'
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'string'}],
      description: 'List of features included with this ticket'
    }),
    defineField({
      name: 'available',
      title: 'Available for Purchase',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      options: {
        list: [
          {title: '1 Day', value: '1-day'},
          {title: '2 Days', value: '2-day'},
          {title: '3 Days', value: '3-day'},
          {title: '4 Days (Full Festival)', value: '4-day'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'type',
      title: 'Ticket Type',
      type: 'string',
      options: {
        list: [
          {title: 'General Admission', value: 'general'},
          {title: 'Pit Access', value: 'pit'},
          {title: 'VIP', value: 'vip'},
          {title: 'VVIP', value: 'vvip'},
          {title: 'Family Package', value: 'family'},
          {title: 'Student', value: 'student'},
          {title: 'Early Bird', value: 'early-bird'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'discount',
      title: 'Discount Percentage',
      type: 'number',
      description: 'Enter discount percentage (e.g., 25 for 25% off)',
      validation: (Rule) => Rule.min(0).max(100)
    }),
    defineField({
      name: 'maxQuantity',
      title: 'Maximum Quantity per Order',
      type: 'number',
      initialValue: 10,
      validation: (Rule) => Rule.min(1)
    }),
    defineField({
      name: 'soldOut',
      title: 'Sold Out',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'saleStartDate',
      title: 'Sale Start Date',
      type: 'datetime',
      description: 'When this ticket becomes available for purchase'
    }),
    defineField({
      name: 'saleEndDate',
      title: 'Sale End Date',
      type: 'datetime',
      description: 'When this ticket stops being available for purchase'
    }),
    defineField({
      name: 'featured',
      title: 'Featured Ticket',
      type: 'boolean',
      description: 'Featured tickets appear prominently on the tickets page',
      initialValue: false
    }),
    defineField({
      name: 'badge',
      title: 'Badge Text',
      type: 'string',
      description: 'Optional badge text (e.g., "BEST VALUE", "LIMITED TIME")',
      validation: (Rule) => Rule.max(20)
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which tickets should be displayed (lower numbers first)',
      initialValue: 0
    })
  ],
  orderings: [
    {
      title: 'Price (Low to High)',
      name: 'priceAsc',
      by: [
        {field: 'price', direction: 'asc'}
      ]
    },
    {
      title: 'Price (High to Low)', 
      name: 'priceDesc',
      by: [
        {field: 'price', direction: 'desc'}
      ]
    },
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'type',
      price: 'price',
      currency: 'currency',
      available: 'available'
    },
    prepare({title, subtitle, price, currency, available}) {
      return {
        title: title,
        subtitle: `${subtitle} - ${currency} ${price?.toLocaleString()} ${!available ? '(Unavailable)' : ''}`,
      }
    }
  }
})