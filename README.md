# Reddit Client

A modern Reddit client built with React, TypeScript, TanStack Router, and TanStack Query. Features file-based routing, automatic code splitting, and comprehensive environment configuration.

## 🚀 Features

- **Modern React**: Built with React 19 and TypeScript
- **File-Based Routing**: TanStack Router with automatic code splitting
- **Data Fetching**: TanStack Query for efficient data management
- **UI Framework**: Tailwind CSS for styling
- **Development Tools**: Hot reload, devtools for routing and queries
- **Environment Management**: Type-safe environment variables with validation

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Routing**: TanStack Router (file-based)
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: Bun

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd reddit-client
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables** (see Environment Setup below)

5. **Start development server**
   ```bash
   bun run dev
   ```

## 🔧 Environment Setup

The application uses environment variables for configuration. All environment variables must be prefixed with `VITE_` to be accessible in the frontend.

### Required Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
# Backend API (Required)
VITE_BACKEND_URL="http://localhost:8000"

# Google OAuth (Optional - only if using Google auth)
VITE_GOOGLE_CLIENT_ID="your_google_client_id"
VITE_GOOGLE_REDIRECT_URI="http://localhost:8000/api/auth/google/callback"

# Other configurations have defaults
```

### Environment Files

- **`.env.example`** - Template with placeholder values
- **`.env.local`** - Local development (gitignored)

### Getting Google OAuth Credentials (Optional)

Only needed if you want to use Google authentication:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:8000/api/auth/google/callback`
6. Copy the client ID

### Type-Safe Environment Access with Zod

The environment variables are validated using Zod schemas for type safety and runtime validation:

```typescript
import { env, isDevelopment } from '@/shared/utils/env'

// Fully typed environment variables with Zod validation
console.log(env.BACKEND_URL)       // string (URL, required)
console.log(env.GOOGLE_CLIENT_ID)  // string | undefined (optional)
console.log(env.PORT)              // number (coerced and validated)
console.log(env.APP_ENV)           // "development" | "production" | "test"

// Environment helpers
console.log(isDevelopment)  // boolean
console.log(isProduction)   // boolean
```

#### Zod Validation Features

- **Type Safety**: Full TypeScript inference from Zod schemas
- **Runtime Validation**: Validates values at startup, not runtime
- **Coercion**: Automatically converts strings to numbers/booleans
- **Default Values**: Provides sensible defaults for optional variables
- **Custom Messages**: Clear error messages for validation failures

#### Schema Examples

```typescript
// URL validation with default
BACKEND_URL: z.string().url().default('http://localhost:8000')

// Number with coercion and validation
PORT: z.coerce.number().int().positive().default(5173)

// Enum with default
APP_ENV: z.enum(['development', 'production', 'test']).default('development')

// Optional string
GOOGLE_CLIENT_ID: z.string().optional()
SENTRY_DSN: z.string().optional()
```

## 📁 Project Structure (FSD)

Following **Feature-Sliced Design (FSD)** architecture:

```
src/
├── app/                      # 📱 Application layer
│   ├── index.tsx            # Application entry point
│   ├── providers/           # App-wide providers
│   ├── routing/             # Routing configuration
│   └── styles/              # Global styles
│       └── index.css
├── pages/                   # 📄 Page components
│   ├── home/                # Home page
│   │   └── index.tsx
│   └── root/                # Root layout
│       └── __root.tsx
├── widgets/                 # 🎨 Complex UI components
├── features/                # ⚡ Business features
├── entities/                # 🔧 Business entities
├── shared/                  # 🔄 Shared resources
│   ├── ui/                 # Reusable UI components
│   ├── utils/              # Utility functions
│   │   ├── env.ts         # Environment configuration
│   │   └── query-client.ts # Query client setup
│   ├── lib/                # External libraries config
│   ├── config/             # App configuration
│   └── assets/             # Static assets
├── routeTree.gen.ts        # Auto-generated route tree
└── index.html
```

### FSD Layers Explained

- **`app`** - Application initialization, providers, global config
- **`pages`** - Page components and routing logic (formerly routes)
- **`widgets`** - Composite UI components combining features/entities
- **`features`** - Business features (auth, posts, comments, etc.)
- **`entities`** - Business entities (user, post, subreddit, etc.)
- **`shared`** - Reusable code across the application

## 🏃 Development

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run linting
bun run lint

# Type checking
bun run type-check
```

## 🔍 Development Tools

- **TanStack Router Devtools**: Inspect routes and navigation
- **TanStack Query Devtools**: Monitor data fetching and caching
- **Vite Dev Server**: Fast HMR and development experience

## 🚢 Deployment

1. **Build the application**

   ```bash
   bun run build
   ```

2. **Set production environment variables** in your deployment platform

3. **Deploy the `dist` folder** to your hosting service

### Environment Variables for Production

Make sure to set these in your production environment:

- `VITE_BACKEND_URL` - Your production backend API URL
- `VITE_GOOGLE_CLIENT_ID` - (Optional) If using Google OAuth
- `VITE_GOOGLE_REDIRECT_URI` - (Optional) Your production OAuth callback URL
- `VITE_SENTRY_DSN` - (Optional) For error tracking
- `VITE_APP_ENV=production` - Set environment to production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
