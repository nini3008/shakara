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
    defineField({
      name: 'discount',
      title: 'Applied Discount',
      type: 'object',
      description: 'Discount applied to this order',
      fields: [
        { name: 'code', title: 'Code', type: 'string' },
        { name: 'label', title: 'Label', type: 'string' },
        { name: 'type', title: 'Type', type: 'string', options: { list: ['percentage', 'flat'] } },
        { name: 'amount', title: 'Amount', type: 'number' },
        { name: 'valueApplied', title: 'Value Applied', type: 'number' },
      ],
    }),
    defineField({
      name: 'guestIntegration',
      title: 'Guest Integration',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'status', title: 'Status', type: 'string', options: { list: ['success', 'error'] } }),
        defineField({ name: 'externalId', title: 'External ID', type: 'number' }),
        defineField({ name: 'uniqueCode', title: 'Unique Code', type: 'string' }),
        defineField({ name: 'amountPaid', title: 'Amount Paid', type: 'string' }),
        defineField({ name: 'qrCodeId', title: 'QR Code ID', type: 'number' }),
        defineField({ name: 'qrCodeCode', title: 'QR Code Reference', type: 'string' }),
        defineField({ name: 'qrCodeUrl', title: 'QR Code URL', type: 'url' }),
        defineField({ name: 'message', title: 'Error Message', type: 'text' }),
        defineField({ name: 'raw', title: 'Raw Payload', type: 'text' }),
        defineField({ name: 'syncedAt', title: 'Synced At', type: 'datetime' }),
      ],
    }),
  ],
})


