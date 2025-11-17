import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'reservation',
  title: 'Reservations',
  type: 'document',
  fields: [
    defineField({ name: 'tx_ref', title: 'Transaction Ref', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'lines',
      title: 'Lines',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'sku', title: 'SKU', type: 'string' },
          { name: 'quantity', title: 'Quantity', type: 'number' },
          { name: 'units', title: 'Units (quantity per reserved day)', type: 'number' },
          { name: 'unitPrice', title: 'Unit Price', type: 'number' },
          { name: 'name', title: 'Name', type: 'string' },
          { name: 'selectedDate', title: 'Selected Date', type: 'string' },
        ]
      }]
    }),
    defineField({ name: 'amount', title: 'Amount (NGN)', type: 'number' }),
    defineField({ name: 'currency', title: 'Currency', type: 'string', initialValue: 'NGN' }),
    defineField({ name: 'email', title: 'Customer Email', type: 'string' }),
    defineField({ name: 'firstName', title: 'First Name', type: 'string' }),
    defineField({ name: 'lastName', title: 'Last Name', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone Number', type: 'string' }),
    defineField({ name: 'status', title: 'Status', type: 'string', options: { list: ['held', 'confirmed', 'expired', 'canceled'] }, initialValue: 'held' }),
    defineField({ name: 'expiresAt', title: 'Expires At', type: 'datetime' }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'holdApplied', title: 'Hold Applied', type: 'boolean', initialValue: true }),
    defineField({
      name: 'discount',
      title: 'Applied Discount',
      type: 'object',
      description: 'Discount applied to this reservation',
      fields: [
        { name: 'code', title: 'Code', type: 'string' },
        { name: 'label', title: 'Label', type: 'string' },
        { name: 'type', title: 'Type', type: 'string', options: { list: ['percentage', 'flat'] } },
        { name: 'amount', title: 'Amount', type: 'number' },
        { name: 'valueApplied', title: 'Value Applied', type: 'number' },
      ],
    }),
  ],
})


