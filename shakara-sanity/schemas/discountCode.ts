import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'discountCode',
  title: 'Discount Codes',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Discount Code',
      type: 'string',
      description: 'The code customers will enter at checkout',
      validation: (Rule) => Rule.required().uppercase(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Display name for this discount (e.g., "Early Bird Special")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Discount Type',
      type: 'string',
      options: {
        list: [
          { title: 'Percentage', value: 'percentage' },
          { title: 'Flat Amount', value: 'flat' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amount',
      title: 'Discount Amount',
      type: 'number',
      description: 'For percentage type: enter 0-100. For flat type: enter NGN amount',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this discount code can be used',
      initialValue: true,
    }),
    defineField({
      name: 'validFrom',
      title: 'Valid From',
      type: 'datetime',
      description: 'When this discount becomes active',
    }),
    defineField({
      name: 'validTo',
      title: 'Valid Until',
      type: 'datetime',
      description: 'When this discount expires',
    }),
    defineField({
      name: 'maxUses',
      title: 'Maximum Uses',
      type: 'number',
      description: 'Total number of times this code can be used (leave empty for unlimited)',
      validation: (Rule) => Rule.min(1).integer(),
    }),
    defineField({
      name: 'maxUsesPerEmail',
      title: 'Max Uses Per Email',
      type: 'number',
      description: 'Maximum times a single email can use this code (leave empty for unlimited)',
      validation: (Rule) => Rule.min(1).integer(),
    }),
    defineField({
      name: 'applicableSkus',
      title: 'Applicable SKUs',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'SKUs this discount applies to (leave empty for all products)',
    }),
    defineField({
      name: 'usageCount',
      title: 'Usage Count',
      type: 'number',
      description: 'Number of times this code has been used',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      description: 'Any notes about this discount code',
    }),
  ],
  preview: {
    select: {
      title: 'code',
      subtitle: 'label',
      type: 'type',
      amount: 'amount',
      active: 'active',
      usageCount: 'usageCount',
      maxUses: 'maxUses',
    },
    prepare({ title, subtitle, type, amount, active, usageCount, maxUses }) {
      const amountStr = type === 'percentage' ? `${amount}%` : `₦${amount}`
      const usageStr = maxUses ? `(${usageCount || 0}/${maxUses} used)` : `(${usageCount || 0} used)`
      return {
        title: title,
        subtitle: `${subtitle} - ${amountStr} ${usageStr} ${!active ? '[INACTIVE]' : ''}`,
      }
    },
  },
})
