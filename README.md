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
# Reddit API Configuration (Required)
VITE_REDDIT_CLIENT_ID="your_reddit_client_id"
VITE_REDDIT_CLIENT_SECRET="your_reddit_client_secret"

# Other configurations have defaults
```

### Environment Files

- **`.env.example`** - Template with placeholder values
- **`.env.local`** - Local development (gitignored)
- **`.env.production`** - Production environment variables

### Getting Reddit API Credentials

1. Go to [Reddit Apps](https://www.reddit.com/prefs/apps)
2. Click "Create App" or "Create Another App"
3. Choose "web app" type
4. Set redirect URI to: `http://localhost:5173/auth/callback`
5. Copy the client ID and secret

### Type-Safe Environment Access with Zod

The environment variables are validated using Zod schemas for type safety and runtime validation:

```typescript
import { env, isDevelopment } from '@/utils/env'

// Fully typed environment variables with Zod validation
console.log(env.REDDIT_CLIENT_ID) // string (required)
console.log(env.PORT)             // number (coerced and validated)
console.log(env.ENABLE_ANALYTICS) // boolean (coerced from string)
console.log(env.API_TIMEOUT)      // number (with positive validation)

// Environment helpers
console.log(isDevelopment) // boolean
```

#### Zod Validation Features

- **Type Safety**: Full TypeScript inference from Zod schemas
- **Runtime Validation**: Validates values at startup, not runtime
- **Coercion**: Automatically converts strings to numbers/booleans
- **Default Values**: Provides sensible defaults for optional variables
- **Custom Messages**: Clear error messages for validation failures

#### Schema Examples

```typescript
// String with minimum length (required)
REDDIT_CLIENT_ID: z.string().min(1, 'REDDIT_CLIENT_ID is required')

// Number with coercion and validation
PORT: z.coerce.number().int().positive().default(5173)

// Boolean with coercion
ENABLE_ANALYTICS: z.coerce.boolean().default(false)

// URL validation
BACKEND_URL: z.string().url().default('http://localhost:8000')

// Optional string
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
- `VITE_REDDIT_CLIENT_ID`
- `VITE_REDDIT_CLIENT_SECRET`
- `VITE_REDDIT_REDIRECT_URI` (your production callback URL)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
