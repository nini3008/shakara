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
import blogAuthor from '../schemas/blogAuthor'
import blogPost from '../schemas/blogPost'
import reservation from '../schemas/reservation'
import order from '../schemas/order'
import vendor from '../schemas/vendor'

export const schemaTypes: SchemaTypeDefinition[] = [
  hero,
  artist,
  ticket,
  scheduleEvent,
  merchItem,
  vendor,
  partner,
  aboutSection,
  lineupsection,
  footer,
  faq,
  blogAuthor,
  blogPost,
  reservation,
  order,
]
