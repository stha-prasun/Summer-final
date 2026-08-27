# WheelsRUs

A full-stack e-commerce platform for Hot Wheels die-cast car collections. Features a scroll-driven animated hero section, 3D model viewer, real-time chat, Khalti payment integration, and a full admin dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4, GSAP (scroll animations), Three.js / React Three Fiber (3D), Redux Toolkit, React Router v7 |
| Backend | Node.js, Express 5, Mongoose 9, ioredis, Socket.IO, amqplib (RabbitMQ), Winston (logging) |
| Database | MongoDB 7, Redis 7 |
| Message Queue | RabbitMQ 3 |
| Payments | Khalti (Nepalese payment gateway) |
| Image Storage | Cloudinary + Sharp (optimization) |
| Email | Resend |
| Auth | JWT (dual-role: admin + user), Google OAuth |
| Monitoring | Grafana, Loki, Promtail |
| Containerization | Docker (multi-stage builds), Docker Compose |
| Testing | Vitest |

## Project Structure

```
Summer-final/
├── Frontend/                  # React SPA (Vite)
│   ├── public/                # Static assets (frames, models, icons)
│   └── src/
│       ├── components/        # UI components (Hero, Navbar, Footer, etc.)
│       ├── pages/             # Route pages (Home, Collection, Admin, Users)
│       ├── hooks/             # Custom React hooks
│       ├── redux/             # Redux store + slices
│       ├── services/          # API service layer (Axios)
│       └── utils/             # Utility functions
├── Backend/                   # Express REST API
│   └── src/
│       ├── config/            # DB, Redis, RabbitMQ, Swagger config
│       ├── modules/           # Feature modules (auth, user, product, order, chat, etc.)
│       │   └── {module}/
│       │       ├── {module}.model.js
│       │       ├── {module}.controller.js
│       │       ├── {module}.service.js
│       │       ├── {module}.routes.js
│       │       └── {module}.test.js
│       ├── seed/              # Database seeder
│       └── test/              # Test setup
├── docker/
│   ├── frontend/
│   │   ├── Dockerfile         # Multi-stage: Node build -> Nginx serve
│   │   └── nginx.conf         # SPA routing + security headers
│   └── backend/
│       └── Dockerfile         # Node Alpine -> Express API
├── grafana/                   # Grafana datasources + dashboards provisioning
├── docker-compose.dev.yml     # Dev services (MongoDB, Redis, monitoring, etc.)
├── docker-compose.prod.yml    # Production stack (Frontend + Backend + DB)
├── .env.dev                   # Environment variables
└── package.json               # Root monorepo (Husky + commitlint)
```

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **Docker** & **Docker Compose** (for containerized setup)
- **MongoDB** (local or Docker)
- **Redis** (local or Docker)
- **RabbitMQ** (optional, for bulk email feature)

## Local Development Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Summer-final
```

### 2. Environment Variables

Copy the example env file and fill in your credentials:

```bash
cp .env.dev .env
```

Key variables:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `REDIS_URL` | Redis connection string |
| `PORT` | Backend port (default: 8000) |
| `RABBITMQ_URL` | RabbitMQ connection string |
| `JWT_SECRET_KEY` | Secret for JWT signing |
| `CLOUDINARY_*` | Cloudinary image storage credentials |
| `KHALTI_*` | Khalti payment gateway credentials |
| `RESEND_API_KEY` | Resend email API key |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `FRONTEND_URL` | Frontend URL (default: http://localhost:5173) |

### 3. Start Backend

```bash
cd Backend
npm install
npm run dev        # Development with nodemon
# or
npm run start      # Production
```

Backend runs on `http://localhost:8000`. API docs available at `http://localhost:8000/api/docs`.

### 4. Start Frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

### 5. Seed Database (optional)

```bash
cd Backend
npm run seed
```

## Docker Setup

### Development (services only)

Start infrastructure services (MongoDB, Redis, monitoring tools):

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts:

| Service | Port | Description |
|---|---|---|
| MongoDB | 27018 | Database |
| Redis | 6379 | Cache + session store |
| Redis Commander | 8082 | Redis GUI (http://localhost:8082) |
| Mongo Express | 8090 | MongoDB GUI (http://localhost:8090) |
| RabbitMQ | 5672 / 15672 | Message queue + management UI (http://localhost:15672) |
| Grafana | 3001 | Monitoring dashboards (http://localhost:3001) |
| Loki | 3100 | Log aggregation |
| Promtail | - | Log shipping to Loki |

Then run the frontend and backend locally with `npm run dev`.

### Production (full stack)

Build and run all services:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

This starts:

| Service | Port | Description |
|---|---|---|
| Frontend | 5173 | Nginx serving React build |
| Backend | 3000 | Express API |
| MongoDB | internal | Database (not exposed) |
| Redis | internal | Cache (not exposed) |
| RabbitMQ | internal | Message queue (not exposed) |

### Stopping Services

```bash
# Dev services
docker compose -f docker-compose.dev.yml down

# Production stack
docker compose -f docker-compose.prod.yml down

# Remove volumes (deletes data)
docker compose -f docker-compose.dev.yml down -v
```

## API Overview

All routes are prefixed with `/api/v1`.

| Route | Description |
|---|---|
| `GET /check` | Health check |
| `POST /admin/login` | Admin login |
| `POST /user/register` | User registration |
| `POST /user/login` | User login |
| `POST /user/google` | Google OAuth |
| `GET /products/` | List products |
| `GET /products/:id` | Get product |
| `POST /products/` | Create product (admin) |
| `PUT /products/:id` | Update product (admin) |
| `DELETE /products/:id` | Delete product (admin) |
| `POST /payment/initiate` | Initiate Khalti payment |
| `POST /payment/verify` | Verify Khalti payment |
| `GET /orders/all` | User orders |
| `GET /admin/stats` | Dashboard statistics |
| `GET /admin/orders` | All orders (admin) |
| `GET /chat/conversation` | User chat |
| `POST /contact/` | Contact form |

Full interactive API docs: `http://localhost:8000/api/docs`

## Key Features

### Rate Limiter (`rate-limiter-flexible`)

Redis-backed rate limiting across the entire API to prevent abuse. Three tiers of protection:

- **Auth endpoints** -- 10 requests per 15 minutes (blocks for 15 minutes on breach)
- **Contact form** -- 5 requests per hour (blocks for 1 hour)
- **Global** -- 300 requests per minute across all routes

Rate limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`) are returned on every response. Can be disabled via `RATE_LIMIT_ENABLED=false` env var.

### Real-Time Chat (Socket.IO)

Full user-to-admin support chat system built with Socket.IO:

- **Users** initiate conversations, send messages, and view history
- **Admins** see all conversations with unread counts and respond in real time
- WebSocket events: `joinConversation`, `leaveConversation`, `sendMessage`, `markRead`
- Unread message counters on both user and admin sides
- Socket.IO rooms: `user:{userId}`, `admins`, `conversation:{convoId}`
- REST API fallback for message history and conversation management

### Redis Implementation (`ioredis`)

Redis serves multiple purposes across the stack:

- **JWT refresh token storage** -- 7-day TTL for both admin and user tokens (`refresh:{adminID}`, `user-refresh:{userID}`)
- **Product caching** -- 300-second TTL on product list queries, invalidated on writes
- **Order caching** -- Cached user order queries for faster repeat loads
- **Rate limiting** -- Backbone for the `rate-limiter-flexible` rate limiter
- **Connection verified** at server startup with a ping check

### Image Optimization (`Sharp` + Cloudinary)

Product images go through a Sharp optimization pipeline before Cloudinary upload:

- **JPEG** -- MozJPEG encoder at 85% quality
- **PNG** -- Palette-based compression
- **WebP** -- 85% quality for modern browsers
- 5MB file size limit enforced via Multer
- Supported formats: JPEG, PNG, WebP
- Images stored in Cloudinary's `products/` folder with automatic `cloudinaryId` tracking

### Google OAuth

Social login and registration via Google OAuth:

- Verifies Google ID tokens server-side using `google-auth-library`
- Auto-creates accounts on first Google sign-in
- Returns `needsOnboarding` flag if the user profile (phone, address) is incomplete
- Separate from the standard email+password auth flow
- Works for both new signups and existing account linking

### Resend (Email Service)

Transactional email powered by Resend:

- **Contact form submissions** -- Saves to MongoDB and sends notification email to admin
- **Bulk email** -- Admin can send newsletters, promotions, and announcements to all users
- Three HTML email templates: newsletter, promotion, announcement
- Emails processed asynchronously via RabbitMQ queue

### Swagger API Documentation

Interactive API documentation auto-generated from JSDoc annotations:

- Swagger UI mounted at `/api/docs`
- OpenAPI 3.0.0 spec generated with `swagger-jsdoc`
- Annotations in `*.routes.js` files using `@openapi` JSDoc tags
- Bearer JWT security scheme defined globally
- Covers all endpoints: auth, products, payments, orders, chat, contact

### Grafana + Loki + Promtail (Monitoring)

Full observability stack for backend logs:

- **Promtail** ships log files from `Backend/logs/` to Loki
- **Loki** aggregates and indexes log data
- **Grafana** provides dashboards for log exploration and visualization
- Pre-provisioned datasources and dashboards in `grafana/`
- Accessible at `http://localhost:3001` (default: admin/admin)

### File Upload (`Multer`)

Product image uploads handled with Multer:

- Memory storage (no temp files on disk)
- 5MB file size limit
- MIME type validation: JPEG, PNG, WebP only
- Integrated with Cloudinary storage via `multer-storage-cloudinary`
- Admin-only endpoints protected by JWT auth middleware

### Husky + Commitlint (Git Hooks)

Enforced code quality at the git level:

- **Husky** runs pre-commit hooks automatically
- **Commitlint** enforces [Conventional Commits](https://www.conventionalcommits.org/) format
- Ensures consistent commit messages: `feat:`, `fix:`, `chore:`, etc.
- Configured in root `package.json` as a monorepo setup

### React Three Fiber (3D Model Viewer)

Interactive 3D car model viewing on the product page:

- Built with `@react-three/fiber` (React Three.js renderer) and `@react-three/drei` (helpers)
- Loads `.glb` models from `public/models/`
- Orbit controls for user interaction (rotate, zoom, pan)
- Environment lighting and shadows for realistic rendering
- Available on the dedicated `/model` route

### Redux Toolkit + Redux Persist

State management with persistence:

- **Redux Toolkit** for predictable state updates with slices
- **Redux Persist** serializes Redux state to localStorage
- Manages user auth state, cart, and UI state across page reloads
- Connected via `react-redux` provider at the app root

### Vitest (Testing)

Backend testing with Vitest:

- Configured in `vitest.config.js` with environment and coverage settings
- Test files colocated with their modules (`{module}.test.js`)
- Run with `npm test` (single run) or `npm run test:watch` (watch mode)
- Covers auth, products, orders, and chat modules

### Khalti Payment Integration

Full payment flow with the Khalti gateway (Nepalese payment system):

1. User submits cart items -> backend creates an Order (status: `pending`)
2. Backend calls Khalti API to initiate payment -> returns payment URL
3. User completes payment on Khalti's hosted page
4. Backend verifies payment status via Khalti lookup API
5. Order status updated to `paid` or `failed`

Payment data stored in an embedded `payment` sub-document on orders (gateway, pidx, transactionId, status, amount).

### RabbitMQ Message Queuing

Asynchronous job processing with RabbitMQ:

- Bulk email queue (`bulk-emails`) for decoupled email sending
- Worker consumes messages and sends via Resend API
- Retry logic: up to 3 retries per email (tracked via `x-retries` header)
- Failed emails discarded after max retries
- Connection managed via `amqplib`

## Testing

```bash
cd Backend
npm test           # Run all tests
npm run test:watch # Watch mode
```

## Monitoring

Access Grafana at `http://localhost:3001` (default credentials: admin/admin).

Loki aggregates logs from the backend via Promtail. Dashboards are pre-provisioned in `grafana/dashboards/`.

## License

ISC
