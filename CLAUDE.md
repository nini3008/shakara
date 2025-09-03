# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Shakara Festival** website project - a music festival website built with Next.js 15 and Sanity CMS. The project consists of two main applications:

1. **shakara-festival/**: Next.js frontend application 
2. **shakara-sanity/**: Sanity Studio for content management

## Development Commands

### Frontend (shakara-festival/)
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check (use this for validation)

### CMS (shakara-sanity/)
- `npm run dev` - Start Sanity Studio development server
- `npm run build` - Build Sanity Studio
- `npm run deploy` - Deploy Sanity Studio

## Architecture

### Content Management System Integration
The application uses **Sanity CMS** for all dynamic content. The CMS integration follows this pattern:

1. **Sanity Schemas** (`shakara-sanity/schemas/`): Define content structure for:
   - `hero.ts` - Hero section configuration
   - `artist.ts` - Artist information and lineup
   - `ticket.ts` - Ticket types and pricing
   - `scheduleEvent.ts` - Festival schedule and events
   - `partner.ts` - Sponsors and partners
   - `aboutSection.ts` - About section content
   - `merchItem.ts` - Merchandise items
   - `lineupsection.ts` - Lineup section configuration

2. **GROQ Queries** (`shakara-festival/src/lib/sanity.ts`): Predefined queries for fetching content:
   - Each content type has corresponding queries (e.g., `ARTIST_QUERY`, `TICKETS_QUERY`)
   - Includes featured content queries for homepage display
   - Supports filtering by day, tier, category, etc.

3. **Type System** (`shakara-festival/src/types/`):
   - `index.ts` - Frontend TypeScript interfaces
   - `sanity-adapters.ts` - Adapters to transform Sanity data to frontend types

### Data Flow Pattern
1. Server components fetch data from Sanity using GROQ queries
2. Data is transformed via adapters to match frontend types
3. Fallback data is provided when CMS content is unavailable
4. Client components handle interactions and animations

### Component Architecture
- **Server Components**: Handle data fetching (`HeroSection.tsx`, `AboutSection.tsx`, etc.)
- **Client Components**: Handle interactivity (typically suffixed with `Client.tsx`)
- **Section Pattern**: Each major page section is a separate component in `src/components/sections/`

### API Routes
- `/api/newsletter/route.ts` - Newsletter signup with Resend email service

## Environment Variables

Required environment variables (set in `.env.local`):
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID (currently: "9u7w33ib")
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset (currently: "production")  
- `RESEND_API_KEY` - Resend API key for newsletter functionality

## Key Technical Details

### Styling
- Uses **Tailwind CSS** for utility-first styling
- Custom SCSS modules for complex animations (e.g., `HeroSection.module.scss`)
- Responsive design with mobile-first approach

### Content Strategy
- All content is CMS-driven with fallback defaults
- Images are optimized through Sanity's image API
- Content sections can be activated/deactivated via CMS

### Performance Considerations
- Server-side rendering for SEO and performance
- Image optimization through Sanity CDN
- Client-side components only for interactive elements

## Working with Content

When modifying content-related features:
1. Always check the corresponding Sanity schema first
2. Update GROQ queries if new fields are needed  
3. Add TypeScript types for new data structures
4. Implement fallback data for when CMS is unavailable
5. Test both with and without CMS data

## Development Workflow

1. Run both applications simultaneously during development:
   - Frontend: `cd shakara-festival && npm run dev`
   - CMS: `cd shakara-sanity && npm run dev`

2. Always run `npm run type-check` before committing changes

3. The CMS is configured with project ID "9u7w33ib" and "production" dataset