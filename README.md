# Amana Marketing Dashboard

A comprehensive marketing analytics dashboard built with Next.js that provides real-time insights into marketing campaign performance, demographics, regional data, and weekly trends.

## Features

### 📊 **Dashboard Overview**
- Real-time marketing metrics and KPIs
- Company information and performance highlights
- Market insights including peak performance analytics
- Total campaigns, revenue, ROAS, and conversion tracking

### 🎯 **Campaign Analytics**
- Detailed campaign performance tracking
- Advanced filtering by campaign name and type
- Interactive charts for revenue and ROAS comparison
- Performance breakdown by medium (Instagram, Facebook, Google Ads)
- Comprehensive campaign data table with sorting capabilities

### 👥 **Demographic Insights**
- Audience demographic analysis
- Age group and gender performance metrics
- Device performance tracking
- Target audience insights

### 📅 **Weekly Performance**
- Week-over-week performance tracking
- Time-based analytics and trends
- Historical performance data

### 🌍 **Regional Analytics**
- Geographic performance breakdown
- Country and region-specific metrics
- Regional ROAS and conversion tracking

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Data Source**: External API integration with Amana Bootcamp

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd amana-marketing
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the dashboard.

## Project Structure

```
amana-marketing/
├── app/                          # Next.js App Router pages
│   ├── api/marketing-data/       # API routes for data fetching
│   ├── campaign-view/            # Campaign analytics page
│   ├── demographic-view/         # Demographic insights page
│   ├── weekly-view/              # Weekly performance page
│   ├── region-view/              # Regional analytics page
│   └── page.tsx                  # Main dashboard page
├── src/
│   ├── components/ui/            # Reusable UI components
│   │   ├── navbar.tsx           # Navigation sidebar
│   │   ├── card-metric.tsx      # Metric display cards
│   │   ├── bar-chart.tsx        # Chart components
│   │   ├── table.tsx            # Data table component
│   │   └── ...
│   ├── lib/                      # Utility functions
│   │   └── api.ts               # API integration
│   └── types/                    # TypeScript type definitions
│       └── marketing.ts         # Marketing data types
└── public/                       # Static assets
```

## Key Components

### Navigation
- Responsive sidebar navigation with collapsible design
- Mobile-friendly hamburger menu
- Active page indication

### Data Visualization
- Interactive bar charts for performance metrics
- Sortable and filterable data tables
- Real-time metric cards with icons
- Responsive design for all screen sizes

### Filtering System
- Search functionality for campaigns
- Multi-select dropdown filters
- Real-time filtering with instant results

## API Integration

The dashboard connects to the Amana Bootcamp API to fetch real-time marketing data:
- Endpoint: `https://www.amanabootcamp.org/api/fs-classwork-data/amana-marketing`
- Automatic data refresh and error handling
- CORS-enabled for development

## Development

### Building for Production
```bash
npm run build
npm run start
```

### Tech Stack Details
- **Next.js 15**: Latest version with Turbopack for faster builds
- **React 19**: Latest React features
- **TypeScript**: Full type safety
- **Tailwind CSS 4**: Modern styling framework
- **Lucide React**: Beautiful, customizable icons
