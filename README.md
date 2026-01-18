# Saarthi Net Dashboard

> **Data Intelligence for Migration & Digital Inclusion**

A modern, responsive dashboard application for visualizing migration patterns, peri-urban development, and digital exclusion data across Indian districts. Built with React, TypeScript, and a comprehensive UI component library.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

---

## Overview

Saarthi Net Dashboard is a data visualization platform designed to provide insights into:

- **Migration Patterns** - Track and analyze population movement across districts
- **Peri-Urban Development** - Monitor growth in transitional urban-rural areas
- **Digital Exclusion** - Identify areas with limited digital access and connectivity

The dashboard features an interactive map interface with configurable data layers, filtering capabilities, and real-time insights.

---

## Features

- 🗺️ **Interactive Map Visualization** - Geographic data representation with multiple toggleable layers
- 📊 **Real-time Insights Panel** - Dynamic statistics and trend analysis
- 🔍 **Advanced Filtering** - Filter data by district and time range
- 📱 **Responsive Design** - Optimized for desktop and tablet viewports
- 🎨 **Modern UI Components** - Built with shadcn/ui and Radix primitives
- ⚡ **Fast Development** - Powered by Vite with hot module replacement

---

## Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3 | UI library for building component-based interfaces |
| **TypeScript** | 5.8 | Type-safe JavaScript with enhanced developer experience |
| **Vite** | 5.4 | Next-generation frontend build tool |

### Styling & UI
| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | Accessible, customizable component library |
| **Radix UI** | Unstyled, accessible UI primitives |
| **Lucide React** | Modern icon library |
| **class-variance-authority** | Variant management for components |

### State & Data Management
| Technology | Purpose |
|------------|---------|
| **TanStack React Query** | Server state management and caching |
| **React Hook Form** | Performant form handling |
| **Zod** | Schema validation |

### Routing & Navigation
| Technology | Purpose |
|------------|---------|
| **React Router DOM** | Client-side routing |

### Charts & Visualization
| Technology | Purpose |
|------------|---------|
| **Recharts** | Composable charting library |

### Testing
| Technology | Purpose |
|------------|---------|
| **Vitest** | Unit testing framework |
| **Testing Library** | React component testing utilities |

---

## Architecture

The application follows a **component-based architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                        App (Root)                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Providers Layer                          ││
│  │  • QueryClientProvider (TanStack Query)                     ││
│  │  • TooltipProvider (Radix UI)                               ││
│  │  • BrowserRouter (React Router)                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Pages Layer                              ││
│  │  • Index (Dashboard)                                        ││
│  │  • NotFound (404)                                           ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Dashboard Layout Architecture

The main dashboard implements a **3-column responsive layout**:

```
┌─────────────────────────────────────────────────────────────────┐
│                     DashboardHeader (Sticky)                     │
│  [Branding]                    [Time Range ▼] [District ▼]      │
├──────────────┬──────────────────────────────┬───────────────────┤
│              │                              │                   │
│ FiltersPanel │       MapContainer           │  InsightsPanel    │
│   (~20%)     │        (~55-60%)             │    (~20-25%)      │
│              │                              │                   │
│ • District   │   Interactive Map with       │  • Statistics     │
│ • Time Range │   Data Layers:               │  • Trends         │
│ • Layer      │   - Migration                │  • Metrics        │
│   Toggles    │   - Peri-Urban               │                   │
│              │   - Digital Exclusion        │                   │
│              │                              │                   │
├──────────────┴──────────────────────────────┴───────────────────┤
│                        LegendStrip                               │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App.tsx
├── QueryClientProvider
├── TooltipProvider
├── Toaster (Toast notifications)
├── Sonner (Alternative toast system)
└── BrowserRouter
    └── Routes
        ├── Index (/)
        │   ├── DashboardHeader
        │   ├── FiltersPanel
        │   ├── MapContainer
        │   ├── InsightsPanel
        │   └── LegendStrip
        └── NotFound (*)
```

### State Management Pattern

The dashboard uses **lifting state up** pattern with React's `useState`:

- **Filter State** - Managed at Index page level, passed down to components
- **Layer Toggle State** - Controls map data layer visibility
- **Server State** - Managed via TanStack Query for API data caching

---

## Project Structure

```
saarthi-net-dashboard/
├── 📁 public/                    # Static assets
│   └── robots.txt
├── 📁 src/
│   ├── 📄 main.tsx              # Application entry point
│   ├── 📄 App.tsx               # Root component with providers
│   ├── 📄 index.css             # Global styles & Tailwind imports
│   ├── 📄 App.css               # App-specific styles
│   ├── 📄 vite-env.d.ts         # Vite type declarations
│   │
│   ├── 📁 components/
│   │   ├── 📄 NavLink.tsx       # Navigation link component
│   │   │
│   │   ├── 📁 dashboard/        # Dashboard-specific components
│   │   │   ├── DashboardHeader.tsx   # Top navigation bar
│   │   │   ├── FiltersPanel.tsx      # Left sidebar filters
│   │   │   ├── MapContainer.tsx      # Central map visualization
│   │   │   ├── InsightsPanel.tsx     # Right sidebar insights
│   │   │   └── LegendStrip.tsx       # Bottom legend bar
│   │   │
│   │   └── 📁 ui/               # Reusable UI components (shadcn/ui)
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── tabs.tsx
│   │       ├── toast.tsx
│   │       ├── tooltip.tsx
│   │       └── ... (40+ UI components)
│   │
│   ├── 📁 hooks/                # Custom React hooks
│   │   ├── use-mobile.tsx       # Mobile detection hook
│   │   └── use-toast.ts         # Toast notification hook
│   │
│   ├── 📁 lib/                  # Utility functions
│   │   └── utils.ts             # cn() helper and utilities
│   │
│   ├── 📁 pages/                # Page components
│   │   ├── Index.tsx            # Main dashboard page
│   │   └── NotFound.tsx         # 404 error page
│   │
│   └── 📁 test/                 # Test files
│       ├── setup.ts             # Test configuration
│       └── example.test.ts      # Example test file
│
├── 📄 index.html                # HTML entry point
├── 📄 package.json              # Dependencies & scripts
├── 📄 vite.config.ts            # Vite configuration
├── 📄 vitest.config.ts          # Vitest test configuration
├── 📄 tailwind.config.ts        # Tailwind CSS configuration
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 tsconfig.app.json         # App-specific TS config
├── 📄 tsconfig.node.json        # Node-specific TS config
├── 📄 postcss.config.js         # PostCSS configuration
├── 📄 eslint.config.js          # ESLint configuration
├── 📄 components.json           # shadcn/ui configuration
└── 📄 bun.lockb                 # Bun lock file
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** runtime
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd saarthi-net-dashboard

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

---

## Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

### Recommended Hosting Platforms

- **Vercel** - Zero-config deployment for Vite apps
- **Netlify** - Drag-and-drop or Git-based deployment
- **AWS S3 + CloudFront** - Scalable static hosting
- **Lovable** - Integrated deployment via Share → Publish

---

## Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build and development configuration |
| `tailwind.config.ts` | Tailwind CSS theme and plugins |
| `tsconfig.json` | TypeScript compiler options |
| `components.json` | shadcn/ui component configuration |
| `eslint.config.js` | Code linting rules |
| `vitest.config.ts` | Test runner configuration |

---


