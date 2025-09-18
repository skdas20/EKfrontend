# EasyKirana - Public Frontend

A modern e-commerce frontend for EasyKirana built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Clean cream and white color scheme design
- 📱 Fully responsive design
- 🛒 Shopping cart functionality
- 🔍 Product search and filtering
- 📦 Product categories
- 🚀 Fast performance with Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd easykirana-public
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Header, Footer, Layout)
│   ├── Hero/           # Homepage hero section
│   ├── Product/        # Product-related components
│   ├── Categories/     # Category components
│   └── Cart/           # Shopping cart components
├── context/            # React Context providers
├── services/           # API service layer
├── styles/             # Global styles and Tailwind config
└── types/              # TypeScript type definitions
```

## API Integration

The app is designed to work with the EasyKirana backend API. API endpoints are configured in `src/services/api.ts`.

### Environment Variables

- `VITE_API_BASE_URL`: Base URL for the backend API
- `VITE_MAPS_API_KEY`: API key for location services

## Design System

### Colors

- **Cream Palette**: Primary brand colors from cream-50 to cream-900
- **White**: Clean backgrounds and cards
- **Gray**: Text and neutral elements

### Components

- `btn-primary`: Main action buttons
- `btn-secondary`: Secondary action buttons
- `card`: Content cards with consistent styling
- `input-field`: Form input fields

## Location-Based Features

The app includes placeholder integration for location-based services:

- Automatic location detection
- Product availability by location
- Location-specific pricing
- Delivery area validation

## TODO: Backend Integration

Currently using mock data. To connect to the real backend:

1. Update `VITE_API_BASE_URL` in your `.env` file
2. Replace mock responses in `src/services/api.ts` with actual fetch calls
3. Implement proper error handling and loading states
4. Add authentication token management

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint