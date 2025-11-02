import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'ticket',
  title: 'Tickets',
  type: 'document',
  fields: [
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Unique Stock Keeping Unit for this sellable variant',
      validation: (Rule) => Rule.required().regex(/^[A-Z0-9\-]+$/, {name: 'SKU'}),
    }),
    defineField({
      name: 'day',
      title: 'Festival Day',
      type: 'string',
      description: 'Which festival day this ticket applies to (leave blank for multi-day bundles)',
      options: {
        list: [
          {title: 'Day 1 (Thu, Dec 18)', value: '2025-12-18'},
          {title: 'Day 2 (Fri, Dec 19)', value: '2025-12-19'},
          {title: 'Day 3 (Sat, Dec 20)', value: '2025-12-20'},
          {title: 'Day 4 (Sun, Dec 21)', value: '2025-12-21'},
        ]
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const isBundle = (context?.parent as {isBundle?: boolean})?.isBundle
          if (isBundle) {
            return true
          }
          if (!value) {
            return 'Select a festival day for single-day tickets'
          }
          return true
        })
    }),
    defineField({
      name: 'name',
      title: 'Ticket Name',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    // Bundle controls (explicit bundle products)
    defineField({
      name: 'isBundle',
      title: 'Bundle Product',
      type: 'boolean',
      description: 'Mark this ticket as a bundle (e.g., 4‑Pack).'
    }),
    defineField({
      name: 'bundle',
      title: 'Bundle Settings',
      type: 'object',
      hidden: ({parent}) => !parent?.isBundle,
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'dayCount',
          title: 'Number of Days',
          type: 'number',
          description: 'How many unique festival days this bundle spans.',
          validation: Rule => Rule.required().min(2).max(4),
        }),
        defineField({
          name: 'targetSku',
          title: 'Target Ticket SKU',
          type: 'string',
          description: 'SKU of the base single-day ticket this bundle reserves inventory from.',
          validation: Rule => Rule.required(),
        }),
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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Early Bird', value: 'early-bird'},
          {title: 'Standard', value: 'standard'},
        ]
      },
    }),
    defineField({
      name: 'price',
      title: 'Price (NGN)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0)
    }),
    defineField({
      name: 'testPrice',
      title: 'Test Price (NGN)',
      type: 'number',
      description: 'Optional sandbox/test price override',
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
      name: 'live',
      title: 'Live (Production)',
      type: 'boolean',
      description: 'Whether this price represents production/live pricing',
      initialValue: true,
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
          {title: 'Add-on', value: 'addon'},
          {title: 'Family Package', value: 'family'},
          {title: 'Student', value: 'student'},
          {title: 'Early Bird', value: 'early-bird'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'packageType',
      title: 'Package Type',
      type: 'string',
      options: { list: [ {title: 'Standard', value: 'standard'}, {title: 'Table', value: 'table'} ] },
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
      name: 'inventory',
      title: 'Inventory Cap (units)',
      type: 'number',
      description: 'Leave empty for unlimited inventory',
    }),
    defineField({
      name: 'sold',
      title: 'Units Sold',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'reserved',
      title: 'Units Reserved (Holds)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'allowOversell',
      title: 'Allow Oversell',
      type: 'boolean',
      initialValue: false,
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
      name: 'taxInclusive',
      title: 'Prices Include Tax',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'feesIncluded',
      title: 'Prices Include Fees',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'fwProductId',
      title: 'Flutterwave Product ID',
      type: 'string',
    }),
    defineField({
      name: 'fwPaymentLink',
      title: 'Flutterwave Payment Link',
      type: 'url',
    }),
    defineField({
      name: 'lastSyncedNote',
      title: 'Last Synced Note',
      type: 'string',
      description: 'Notes about the last manual sync with Flutterwave',
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