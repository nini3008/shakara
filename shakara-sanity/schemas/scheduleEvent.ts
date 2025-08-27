import React from 'react'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'scheduleEvent',
  title: 'Schedule Events',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'time',
      title: 'Start Time',
      type: 'string',
      description: 'Event start time (e.g., "6:00 PM")',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'endTime',
      title: 'End Time',
      type: 'string',
      description: 'Event end time (optional)'
    }),
    defineField({
      name: 'day',
      title: 'Festival Day',
      type: 'number',
      options: {
        list: [
          {title: 'Day 1 (Dec 17)', value: 1},
          {title: 'Day 2 (Dec 18)', value: 2},
          {title: 'Day 3 (Dec 19)', value: 3},
          {title: 'Day 4 (Dec 20)', value: 4}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'type',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          {title: 'Musical Performance', value: 'music'},
          {title: 'Panel Discussion', value: 'panel'},
          {title: 'Vendors/Market', value: 'vendors'},
          {title: 'After Party', value: 'afterparty'},
          {title: 'Workshop', value: 'workshop'},
          {title: 'Food & Drinks', value: 'food'},
          {title: 'Art Installation', value: 'art'},
          {title: 'Meet & Greet', value: 'meetgreet'}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'artist',
      title: 'Featured Artist',
      type: 'reference',
      to: [{type: 'artist'}],
      description: 'Link to artist if this is a musical performance'
    }),
    defineField({
      name: 'stage',
      title: 'Stage/Location',
      type: 'string',
      options: {
        list: [
          {title: 'Main Stage', value: 'main'},
          {title: 'Secondary Stage', value: 'secondary'},
          {title: 'Club Stage', value: 'club'},
          {title: 'Acoustic Stage', value: 'acoustic'},
          {title: 'Conference Hall', value: 'conference'},
          {title: 'VIP Lounge', value: 'vip-lounge'},
          {title: 'Food Court', value: 'food-court'},
          {title: 'Art Gallery', value: 'art-gallery'},
          {title: 'Vendor Area', value: 'vendor-area'}
        ]
      }
    }),
    defineField({
      name: 'featured',
      title: 'Featured Event',
      type: 'boolean',
      description: 'Featured events appear prominently in the schedule',
      initialValue: false
    }),
    defineField({
      name: 'ticketRequired',
      title: 'Ticket Required',
      type: 'string',
      options: {
        list: [
          {title: 'General Admission', value: 'general'},
          {title: 'VIP Only', value: 'vip'},
          {title: 'VVIP Only', value: 'vvip'},
          {title: 'Free/No Ticket', value: 'free'},
          {title: 'Separate Ticket', value: 'separate'}
        ]
      },
      initialValue: 'general'
    }),
    defineField({
      name: 'capacity',
      title: 'Capacity',
      type: 'number',
      description: 'Maximum number of attendees (optional)'
    }),
    defineField({
      name: 'image',
      title: 'Event Image',
      type: 'image',
      options: {
        hotspot: true,
      }
    })
  ],
  orderings: [
    {
      title: 'By Day and Time',
      name: 'dayAndTime',
      by: [
        {field: 'day', direction: 'asc'},
        {field: 'time', direction: 'asc'}
      ]
    },
    {
      title: 'By Type',
      name: 'type',
      by: [
        {field: 'type', direction: 'asc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      day: 'day',
      time: 'time',
      type: 'type',
      stage: 'stage',
      media: 'image'
    },
    prepare({ title, day, time, type, stage, media }) {
      const emoji =
        type === "music" ? "🎵" :
        type === "panel" ? "🎤" :
        type === "vendors" ? "🛍️" :
        "📅"

      return {
        title,
        subtitle: `Day ${day} • ${time} • ${stage || type}`,
        media: media || React.createElement(
          'span',
          { style: { fontSize: '1.5rem' } },
          emoji
        )
      }
    }
  }
})
