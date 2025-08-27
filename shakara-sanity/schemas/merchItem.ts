import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'merchItem',
  title: 'Merchandise',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
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
      }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'price',
      title: 'Price (NGN)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0)
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare at Price (NGN)',
      type: 'number',
      description: 'Original price if item is on sale'
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          }
        }
      ],
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Apparel', value: 'apparel'},
          {title: 'Headwear', value: 'headwear'},
          {title: 'Accessories', value: 'accessories'},
          {title: 'Festival Gear', value: 'gear'},
          {title: 'Home & Living', value: 'home'},
          {title: 'Collectibles', value: 'collectibles'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'available',
      title: 'Available for Purchase',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'preOrder',
      title: 'Pre-Order Item',
      type: 'boolean',
      initialValue: false,
      description: 'Check if this is a pre-order item'
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'XS', value: 'XS'},
          {title: 'S', value: 'S'},
          {title: 'M', value: 'M'},
          {title: 'L', value: 'L'},
          {title: 'XL', value: 'XL'},
          {title: 'XXL', value: 'XXL'},
          {title: '3XL', value: '3XL'},
          {title: 'One Size', value: 'one-size'}
        ]
      }
    }),
    defineField({
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Black', value: 'black'},
          {title: 'White', value: 'white'},
          {title: 'Yellow', value: 'yellow'},
          {title: 'Pink', value: 'pink'},
          {title: 'Blue', value: 'blue'},
          {title: 'Orange', value: 'orange'},
          {title: 'Purple', value: 'purple'},
          {title: 'Red', value: 'red'},
          {title: 'Green', value: 'green'},
          {title: 'Natural', value: 'natural'},
          {title: 'Silver', value: 'silver'},
          {title: 'Gold', value: 'gold'}
        ]
      }
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
      description: 'e.g., 100% Cotton, Polyester Blend, etc.'
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'newArrival',
      title: 'New Arrival',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'limitedEdition',
      title: 'Limited Edition',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'inventory',
      title: 'Inventory Count',
      type: 'number',
      description: 'Leave blank for unlimited inventory'
    }),
    defineField({
      name: 'weight',
      title: 'Weight (grams)',
      type: 'number',
      description: 'Product weight for shipping calculations'
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Tags for search and filtering'
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
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [
        {field: 'name', direction: 'asc'}
      ]
    },
    {
      title: 'Category',
      name: 'category',
      by: [
        {field: 'category', direction: 'asc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'name',
      price: 'price',
      category: 'category',
      available: 'available',
      media: 'images.0'
    },
    prepare({title, price, category, available, media}) {
      return {
        title: title,
        subtitle: `₦${price?.toLocaleString()} • ${category} ${!available ? '(Unavailable)' : ''}`,
        media: media || '🛍️'
      }
    }
  }
})