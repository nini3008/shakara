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

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    // Main content types
    hero,
    artist,
    ticket,
    scheduleEvent,
    merchItem,
    partner,
    aboutSection,
    lineupsection,
    footer,
    faq,
    reservation,
    order,
  ],
}

export const schemaTypes = schema.types