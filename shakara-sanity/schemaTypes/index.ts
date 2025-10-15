import {type SchemaTypeDefinition} from 'sanity'

import hero from '../schemas/hero'
import artist from '../schemas/artist'
import ticket from '../schemas/ticket'
import scheduleEvent from '../schemas/scheduleEvent'
import partner from '../schemas/partner'
import aboutSection from '../schemas/aboutSection'
import merchItem from '../schemas/merchItem'
import lineupsection from '../schemas/lineupsection'
import footer from '../schemas/footer'
import faq from '../schemas/faq'

export const schemaTypes: SchemaTypeDefinition[] = [
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
]
