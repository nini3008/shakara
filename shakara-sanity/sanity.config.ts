import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Shakara Festival',

  projectId: '9u7w33ib',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Artists section
            S.listItem()
              .title('Artists')
              .child(
                S.documentTypeList('artist')
                  .title('Artists')
                  .filter('_type == "artist"')
              ),
            
            // Schedule section
            S.listItem()
              .title('Schedule')
              .child(
                S.documentTypeList('scheduleEvent')
                  .title('Schedule Events')
                  .filter('_type == "scheduleEvent"')
              ),
            
            // Tickets section
            S.listItem()
              .title('Tickets')
              .child(
                S.documentTypeList('ticket')
                  .title('Tickets')
                  .filter('_type == "ticket"')
              ),
            
            // Orders section
            S.listItem()
              .title('Orders')
              .child(
                S.documentTypeList('order')
                  .title('Orders')
                  .filter('_type == "order"')
              ),

            // Merchandise section
            S.listItem()
              .title('Merchandise')
              .child(
                S.documentTypeList('merchItem')
                  .title('Merchandise')
                  .filter('_type == "merchItem"')
              ),

            // FAQ section
            S.listItem()
              .title('FAQ')
              .child(
                S.documentTypeList('faq')
                  .title('FAQs')
                  .filter('_type == "faq"')
              ),

            // Blog section
            S.listItem()
              .title('Blog Posts')
              .child(
                S.documentTypeList('blogPost')
                  .title('Blog Posts')
                  .filter('_type == "blogPost"')
              ),
            S.listItem()
              .title('Blog Authors')
              .child(
                S.documentTypeList('blogAuthor')
                  .title('Blog Authors')
                  .filter('_type == "blogAuthor"')
              ),

            // Divider
            S.divider(),

            // All documents
            ...S.documentTypeListItems().filter(
              (listItem) =>
                ![
                  'artist',
                  'ticket',
                  'scheduleEvent',
                  'merchItem',
                  'faq',
                  'blogPost',
                  'blogAuthor',
                  'order',
                ].includes(listItem.getId()!)
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})