# GolfingGrouper

A standalone static website that serves as a wrapper around multiple golf booking platforms, helping golfers find tee times and match with other players.

## Project Overview

GolfingGrouper simplifies the golfing experience by enabling users to:
1. Discover available tee times from various online booking websites in one place
2. Match with other golfers to form complete groups based on preferences
3. Automatically book the chosen tee time on the selected platform

This application acts as a unified interface, eliminating the need for users to navigate multiple booking sites directly.

## Features

- **Multi-Platform Integration**: Support for various golf booking websites through both API integration and web scraping
- **Unified Search Interface**: Find available tee times across platforms with a single search
- **Smart Matching Algorithm**: Connect with compatible golfers based on preferences and experience
- **Secure Payment Processing**: Handle payments via Stripe with complete security
- **Automated Booking**: Book tee times automatically on the original platform
- **Email Notifications**: Receive updates via SendGrid at every step of the process
- **User Profile Management**: Save preferences for faster matching in future bookings

## Technology Stack

- **Frontend**: HTML, CSS (Bootstrap), JavaScript (React)
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Services**: 
  - Payment Processing: Stripe
  - Email Notifications: SendGrid
  - Web Scraping/API Integration: Axios, Puppeteer
- **Containerization**: Docker and Docker Compose
- **Hosting**: Render (initial deployment), with planned scaling to AWS

## Project Structure

The project follows a modern full-stack architecture:

```
golfing-grouper/
├── client/                # React frontend application
│   ├── public/            # Static assets
│   ├── src/               # React components and logic
│   ├── Dockerfile         # Production build container
│   └── Dockerfile.dev     # Development container
├── src/                   # Node.js backend application
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── db/                # Database setup and migrations
│   ├── middleware/        # Express middleware
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── workers/           # Background workers (scrapers, etc.)
├── public/                # Backend public files
├── docs/                  # Documentation
├── Dockerfile             # Backend Docker configuration
├── docker-compose.yml     # Main Docker Compose configuration
├── docker-compose.dev.yml # Development environment overrides
└── docker-compose.test.yml # Testing environment configuration
```

## Installation and Setup

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js 18+ and npm (for local development without Docker)
- PostgreSQL (for local development without Docker)

### Option 1: Using Docker (Recommended)

1. Clone the repository
```bash
git clone https://github.com/yourusername/golfing-grouper.git
cd golfing-grouper
```

2. Copy the example environment file
```bash
cp .env.example .env
```

3. Build and start the application
```bash
# Build Docker images
npm run docker:build

# Start development environment
npm run docker:dev
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Demo page: http://localhost:5000/demo.html

### Option 2: Local Development (Without Docker)

1. Clone the repository
```bash
git clone https://github.com/yourusername/golfing-grouper.git
cd golfing-grouper
```

2. Install backend dependencies
```bash
npm install
```

3. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

4. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Set up the database
```bash
npm run db:setup
```

6. Start the development servers
```bash
# Start backend and frontend concurrently
npm run dev:full

# Or start separately
npm run dev        # Backend only
npm run client     # Frontend only
```

## Development Workflow

### Using Docker

```bash
# Start development environment with hot-reloading
npm run docker:dev

# Stop containers
npm run docker:down

# Remove containers and volumes (clean state)
npm run docker:clean
```

### Without Docker

```bash
# Start both frontend and backend in development mode
npm run dev:full

# Run database setup/migrations
npm run db:setup
```

## Testing

### Using Docker

```bash
# Run tests in isolated containers
npm run docker:test
```

### Without Docker

```bash
# Run backend tests
npm test

# Run frontend tests
cd client
npm test
```

## Production Deployment

### Build for Production

```bash
# Build Docker images for production
npm run docker:build

# Start in production mode
npm run docker:up
```

## Documentation

See the `docs` directory for detailed documentation on:
- [API endpoints](docs/api-endpoints.md)
- [Integration guide](docs/integration-guide.md) for golf booking platforms
- [Database schema](docs/database-schema.md)
- [Deployment instructions](docs/deployment.md)

## Key Workflows

### For Golfers
1. Search for tee times by location, date, and other criteria
2. Select a tee time and specify your group size and preferences
3. Get matched with compatible players
4. Confirm and pay for your booking
5. Receive confirmation and details via email

### For Booking Platforms
1. Integrate with our system via JavaScript button or API
2. Receive bookings automatically when users are matched
3. Gain additional traffic and bookings from our user base

## Recent Changes

The project has been significantly enhanced with:
- **Docker Containerization**: Consistent development, testing, and production environments
- **Full Microservices Architecture**: Separation of frontend, backend, and worker processes
- **Improved Development Workflows**: Streamlined Docker-based development experience
- **Enhanced Testing Infrastructure**: Isolated testing environment with Docker
- **Multi-Platform Support**: Integration with various golf booking services through both APIs and web scraping
- **Unified Database Schema**: Optimized for efficient searching and matching
- **Comprehensive Documentation**: Updated guides for all aspects of the system

## License

This project is licensed under the terms of the license included in the repository.