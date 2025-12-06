import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Artists',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Artist Name',
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
      name: 'image',
      title: 'Artist Image',
      type: 'image',
      options: {
        hotspot: true,
      }
    }),
    defineField({
      name: 'genre',
      title: 'Genre',
      type: 'string',
      options: {
        list: [
          {title: 'Afrobeats', value: 'afrobeats'},
          {title: 'Amapiano', value: 'amapiano'},
          {title: 'Hip-Hop', value: 'hip-hop'},
          {title: 'R&B', value: 'rnb'},
          {title: 'Gospel', value: 'gospel'},
          {title: 'Highlife', value: 'highlife'},
          {title: 'Alté', value: 'alte'},
          {title: 'Grime', value: 'grime'},
          {title: 'Other', value: 'other'}
        ]
      }
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'text'
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({name: 'instagram', title: 'Instagram', type: 'url'}),
        defineField({name: 'twitter', title: 'Twitter', type: 'url'}),
        defineField({name: 'spotify', title: 'Spotify', type: 'url'}),
        defineField({name: 'youtube', title: 'YouTube', type: 'url'})
      ]
    }),
    defineField({
      name: 'performanceDay',
      title: 'Performance Day',
      type: 'number',
      options: {
        list: [
          {title: 'Day 1', value: 1},
          {title: 'Day 2', value: 2},
          {title: 'Day 3', value: 3},
          {title: 'Day 4', value: 4}
        ]
      }
    }),
    defineField({
      name: 'performanceTime',
      title: 'Performance Time',
      type: 'string'
    }),
    defineField({
      name: 'stage',
      title: 'Stage',
      type: 'string',
      options: {
        list: [
          {title: 'Main Stage', value: 'main'},
          {title: 'Secondary Stage', value: 'secondary'},
          {title: 'Club Stage', value: 'club'},
          {title: 'Acoustic Stage', value: 'acoustic'}
        ]
      }
    }),
    defineField({
      name: 'featured',
      title: 'Featured Artist',
      type: 'boolean',
      description: 'Featured artists appear prominently on the lineup',
      initialValue: false
    }),
    defineField({
      name: 'roles',
      title: 'Artist Roles',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Live Performance', value: 'livePerformance'},
          {title: 'DJ', value: 'dj'},
          {title: 'Speaker', value: 'speaker'},
          {title: 'Host/MC', value: 'host'}
        ]
      },
      description: 'Select all roles this artist will perform (can select multiple)',
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: 'performanceWindow',
      title: 'Performance Window',
      type: 'string',
      options: {
        list: [
          {title: 'Main Event', value: 'main'},
          {title: 'Shakara After Dark', value: 'afterDark'}
        ]
      },
      description: 'When does this artist perform?',
      initialValue: 'main'
    }),
    defineField({
      name: 'performanceDate',
      title: 'Performance Date',
      type: 'datetime',
      description: 'Actual date and time of performance (for sorting)'
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      subtitle: 'genre'
    },
    prepare({title, media, subtitle}) {
      return {
        title: title,
        subtitle: subtitle,
        media: media
      }
    }
  }
})