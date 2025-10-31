import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogAuthor',
  title: 'Blog Authors',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
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
      description: 'Inactive authors are hidden from the site.',
      initialValue: true,
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Display role or title for the author (e.g. Festival Team).',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Brief description for accessibility.',
        }),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
      description: 'Brief description used on blog posts.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({name: 'instagram', title: 'Instagram', type: 'url'}),
        defineField({name: 'twitter', title: 'Twitter/X', type: 'url'}),
        defineField({name: 'facebook', title: 'Facebook', type: 'url'}),
        defineField({name: 'linkedin', title: 'LinkedIn', type: 'url'}),
        defineField({name: 'website', title: 'Website', type: 'url'}),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'profileImage',
      subtitle: 'role',
      active: 'active',
    },
    prepare({title, media, subtitle, active}) {
      return {
        title,
        subtitle: active === false ? `${subtitle ?? 'Inactive Author'} (Inactive)` : subtitle,
        media,
      }
    },
  },
})

