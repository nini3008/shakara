import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Orders',
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
          { name: 'units', title: 'Units', type: 'number' },
          { name: 'unitPrice', title: 'Unit Price', type: 'number' },
          { name: 'name', title: 'Name', type: 'string' },
        ]
      }]
    }),
    defineField({ name: 'amount', title: 'Amount (NGN)', type: 'number' }),
    defineField({ name: 'currency', title: 'Currency', type: 'string', initialValue: 'NGN' }),
    defineField({ name: 'email', title: 'Customer Email', type: 'string' }),
    defineField({ name: 'gateway', title: 'Gateway', type: 'string', initialValue: 'flutterwave' }),
    defineField({ name: 'status', title: 'Status', type: 'string', options: { list: ['paid', 'refunded', 'failed'] }, initialValue: 'paid' }),
    defineField({
      name: 'verification',
      title: 'Verification Snapshot',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'id', title: 'Gateway ID', type: 'string' }),
        defineField({ name: 'tx_ref', title: 'Gateway Tx Ref', type: 'string' }),
        defineField({ name: 'gateway_amount', title: 'Gateway Amount', type: 'number' }),
      ],
    }),
    defineField({ name: 'createdAt', title: 'Created At', type: 'datetime', initialValue: () => new Date().toISOString() }),
  ],
})


