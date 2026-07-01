# AttendOS Dashboard - Next.js Migration

## Project Structure

```
attendos-dashboard/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page (migrated from src/App.tsx)
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles with Tailwind CSS
├── public/                # Static assets
├── src/                   # Original Vite source (kept for reference)
│   ├── App.tsx           # Original component
│   ├── main.tsx          # Original entry point
│   └── index.css         # Original CSS
├── package.json          # Updated for Next.js dependencies
├── tsconfig.json         # TypeScript config for Next.js
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
└── README.md             # This file
```

## Migration Summary

Successfully migrated from **Vite** to **Next.js App Router** with the following changes:

### Dependencies Updated
- Removed: `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`
- Added: `next`, `@types/react`, `@types/react-dom`, `eslint`, `eslint-config-next`

### Key Changes
1. **Entry Point**: `src/main.tsx` → `app/layout.tsx` + `app/page.tsx`
2. **Component Structure**: Added `'use client'` directive for client-side interactivity
3. **Build System**: Vite (`vite build`) → Next.js (`next build`)
4. **Development Server**: Changed port and host configuration
5. **Styling**: Kept Tailwind CSS with updated configuration for Next.js

### Configuration Files
- **next.config.js**: Next.js specific configuration
- **tailwind.config.js**: Updated for Next.js file structure
- **postcss.config.js**: PostCSS plugins for Tailwind CSS
- **tsconfig.json**: Updated with Next.js compiler options

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Server runs on `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Type Checking
```bash
npm run lint
```

## Original Vite Setup

The original Vite configuration files have been removed:
- `vite.config.ts` ✗ (removed)
- `index.html` ✗ (removed)

The original source files are retained in the `src/` directory for reference.

## Technology Stack

- **Framework**: Next.js 15+
- **UI Library**: React 19+
- **Styling**: Tailwind CSS 4.1+
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Language**: TypeScript
- **Type Checking**: TypeScript strict mode enabled

## Features

- ✅ Industrial RFID Telemetry Dashboard
- ✅ Real-time MQTT stream simulation
- ✅ Employee asset directory with RFID tracking
- ✅ Operational shifts management
- ✅ AI-powered insights and analytics
- ✅ Responsive design with Tailwind CSS
- ✅ Smooth animations with Motion
- ✅ Dark theme with premium styling

## Notes

- All original functionality is preserved in the migration
- The application is fully client-side rendered with no server-side logic
- Perfect for static hosting or serverless deployment
- TypeScript strict mode is enabled for type safety
