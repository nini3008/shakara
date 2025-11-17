import {type SchemaTypeDefinition} from 'sanity'

import hero from './hero'
import artist from './artist'
import ticket from './ticket'
import scheduleEvent from './scheduleEvent'
import partner from './partner'
import aboutSection from './aboutSection'
import merchItem from './merchItem'
import lineupsection from './lineupsection'
import footer from './footer'
import faq from './faq'
import reservation from './reservation'
import order from './order'
import blogAuthor from './blogAuthor'
import blogPost from './blogPost'
import vendor from './vendor'
import discountCode from './discountCode'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    // Main content types
    hero,
    artist,
    ticket,
    scheduleEvent,
    merchItem,
    partner,
    vendor,
    aboutSection,
    lineupsection,
    footer,
    faq,
    reservation,
    order,
    blogAuthor,
    blogPost,
    discountCode,
  ],
}

export const schemaTypes = schema.types