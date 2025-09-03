# Shakara Festival Website

A modern, dynamic website for Shakara Festival - Africa's premier music festival experience. Built with Next.js 15 and powered by Sanity CMS for seamless content management.

## 🎵 About Shakara Festival

Shakara Festival is a vibrant music celebration taking place December 18-21, 2025, in Victoria Island, Lagos, Nigeria. The festival showcases the best of African music and culture, featuring world-class artists, immersive experiences, and unforgettable performances.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS + SCSS Modules
- **CMS**: Sanity Studio
- **Email**: Resend API
- **Animations**: Framer Motion
- **UI Components**: Radix UI
- **TypeScript**: Full type safety
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
shakara/
├── shakara-festival/          # Next.js frontend application
│   ├── src/
│   │   ├── app/              # App Router pages and API routes
│   │   ├── components/       # React components
│   │   │   └── sections/     # Page sections (Hero, About, Lineup, etc.)
│   │   ├── lib/              # Utilities and Sanity client
│   │   └── types/            # TypeScript definitions
│   └── public/               # Static assets
└── shakara-sanity/           # Sanity Studio CMS
    ├── schemas/              # Content schemas
    └── sanity.config.ts      # Sanity configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shakara
   ```

2. **Install dependencies for both applications**
   ```bash
   # Frontend
   cd shakara-festival
   npm install
   
   # CMS
   cd ../shakara-sanity  
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` in the `shakara-festival` directory:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=9u7w33ib
   NEXT_PUBLIC_SANITY_DATASET=production
   RESEND_API_KEY=your_resend_api_key_here
   ```

4. **Start development servers**
   
   In separate terminals:
   ```bash
   # Frontend (http://localhost:3000)
   cd shakara-festival
   npm run dev
   
   # CMS (http://localhost:3333)
   cd shakara-sanity
   npm run dev
   ```

## 📝 Available Scripts

### Frontend (`shakara-festival/`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

### CMS (`shakara-sanity/`)
- `npm run dev` - Start Sanity Studio
- `npm run build` - Build Sanity Studio
- `npm run deploy` - Deploy Sanity Studio

## 🎨 Features

- **Dynamic Content Management**: All content managed through Sanity CMS
- **Artist Lineup**: Featured artists with performance schedules
- **Ticket Sales**: Multiple ticket tiers with pricing
- **Event Schedule**: Day-by-day festival programming
- **Newsletter Signup**: Email marketing with Resend integration
- **Partner Showcase**: Sponsors and partner organizations
- **Responsive Design**: Mobile-first responsive layout
- **Performance Optimized**: Server-side rendering and image optimization

## 🔧 Content Management

The website uses Sanity CMS for content management. Content types include:

- **Hero Section**: Festival branding and key information
- **Artists**: Performer profiles and lineup
- **Tickets**: Pricing tiers and availability
- **Schedule**: Event programming and timetables  
- **Partners**: Sponsors and collaborators
- **About**: Festival information and statistics
- **Merchandise**: Festival goods and apparel

### Accessing the CMS

1. Run `npm run dev` in the `shakara-sanity` directory
2. Visit http://localhost:3333
3. Create content and publish changes
4. Content automatically appears on the frontend

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### CMS Deployment

```bash
cd shakara-sanity
npm run deploy
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | Yes |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name | Yes |
| `RESEND_API_KEY` | Resend API key for emails | Yes |

## 📧 Newsletter Integration

The website includes a newsletter signup feature powered by Resend:

- Collects email, name, and interests
- Sends welcome email with festival branding
- Handles form validation and error states
- API endpoint: `/api/newsletter`

## 🎯 Development Guidelines

- Use TypeScript for all new code
- Follow existing component patterns
- Test CMS integration with fallback data
- Ensure responsive design across breakpoints
- Run `npm run type-check` before committing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📞 Contact

For questions about the festival: [contact@shakarafestival.com](mailto:contact@shakarafestival.com)

---

**Shakara Festival 2025** • December 18-21 • Victoria Island, Lagos 🇳🇬