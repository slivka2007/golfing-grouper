# GolfingGrouper Architecture

This document outlines the architecture and design decisions for the GolfingGrouper platform.

## Project Overview

GolfingGrouper is a standalone static website that serves as a wrapper around multiple golf booking platforms. The primary goal is to simplify the golfing experience by enabling users to:

1. Discover available tee times from various online booking websites
2. Match with other golfers to form full groups
3. Automatically book the chosen tee time on the selected platform

This application acts as a unified interface, eliminating the need for users to navigate multiple booking sites directly.

## System Architecture

The application follows a modern full-stack architecture with containerization for development, testing, and deployment:

```
┌─────────────────────────────────────────────────────────────────┐
│                       Client Application                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   React UI  │  │   Context   │  │ Service/API Integration │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Express API Backend                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Routes    │  │ Controllers │  │         Services        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└──────────┬────────────────────────────────────────┬─────────────┘
           │                                        │
           ▼                                        ▼
┌────────────────────┐               ┌─────────────────────────────┐
│  PostgreSQL DB     │               │    External Integrations    │
│  - User data       │◄─────────────►│  - Booking API/Scraping     │
│  - Tee times       │               │  - Payment Processing       │
│  - Booking requests│               │  - Email Notifications      │
└────────────────────┘               └─────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React.js for dynamic user interface
- **Styling**: Bootstrap and React-Bootstrap for responsive design
- **State Management**: React Context API
- **Routing**: React Router for navigation
- **API Communication**: Axios for HTTP requests

### Backend
- **Server**: Node.js with Express
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet for HTTP headers, CORS for cross-origin resource sharing

### External Services
- **Payment Processing**: Stripe
- **Email Notifications**: SendGrid
- **Web Scraping/API Integration**: Axios for API calls, Puppeteer for scraping

### DevOps & Infrastructure
- **Containerization**: Docker and Docker Compose
- **Environment Management**: dotenv for configuration
- **Logging**: Morgan for HTTP request logging
- **Initial Hosting**: Render, with potential scaling to AWS

## Database Schema

The database is designed to support the core functionality of the application:

### users
- `id` (SERIAL PRIMARY KEY)
- `first_name` (VARCHAR(50) NOT NULL)
- `last_name` (VARCHAR(50) NOT NULL)
- `email` (VARCHAR(255) UNIQUE NOT NULL)
- `password_hash` (VARCHAR(255) NOT NULL)
- `zip_5` (VARCHAR(5)) - User's location for nearby course suggestions
- `golf_experience` (VARCHAR(20)) - e.g., beginner, intermediate, advanced
- `handicap` (VARCHAR(10)) - Optional, for matching purposes
- `average_score` (VARCHAR(10)) - Optional
- `preferences` (JSONB) - Stores user preferences like round type, pace, and price range

### booking_platforms
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(255) NOT NULL) - e.g., TeeOff, GolfNow
- `api_endpoint` (TEXT) - For platforms with APIs
- `scrape_url` (TEXT) - For platforms requiring web scraping
- `api_key` (TEXT) - If authentication is needed

### tee_times
- `id` (SERIAL PRIMARY KEY)
- `booking_platform_id` (INTEGER REFERENCES booking_platforms(id))
- `course_name` (VARCHAR(255) NOT NULL)
- `date_time` (TIMESTAMP NOT NULL)
- `holes` (INTEGER NOT NULL CHECK (holes IN (9, 18)))
- `capacity` (INTEGER NOT NULL CHECK (capacity > 0)) - Max players per slot
- `total_cost` (DECIMAL(10,2) NOT NULL)
- `booking_url` (TEXT NOT NULL) - Direct link to book on the platform

### requests
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER REFERENCES users(id))
- `tee_time_id` (INTEGER REFERENCES tee_times(id))
- `group_size` (INTEGER NOT NULL CHECK (group_size > 0 AND group_size <= 4))
- `status` (VARCHAR(20) NOT NULL DEFAULT 'pending') - e.g., pending, matched, booked

## Key Components

### User Registration and Profile
- Users sign up with basic details (name, email, password)
- Optional profile customization includes location, golf experience, and preferences

### Tee Time Search
- Users input search criteria (e.g., location, date, number of holes)
- The website aggregates tee times from multiple booking platforms via APIs or scraping
- Displays a consolidated list of available tee times with course details and costs

### Golfer Matching
- Users select a tee time and indicate their desired group size
- The system matches users with others based on tee time and group size compatibility
- Matching runs periodically (e.g., via a cron job) to ensure timely group formation

### Automated Booking
- Once a group is fully matched, the application collects payment via Stripe
- It then books the tee time automatically on the respective platform using APIs or automation tools
- Users receive a confirmation email via SendGrid

### Integration Button
- A customizable JavaScript button that golf booking platforms can embed
- Allows direct integration with minimal code changes on partner sites
- Provides a modal interface for user registration and group matching

## Development Workflows

The application supports multiple development workflows:

1. **Docker-based Development**
   - Complete containerized environment with hot-reloading
   - Consistent setup across developer machines

2. **Local Development**
   - Traditional local setup for developers who prefer direct access
   - Supports both full-stack and component-specific development

3. **Testing Environment**
   - Isolated Docker containers for automated testing
   - Ensures tests run against a clean environment

## Deployment Strategy

The deployment strategy follows modern best practices:

1. **Docker Containerization**
   - Consistent environments from development to production
   - Easy scaling and deployment across different hosting providers

2. **Database Migrations**
   - Structured approach to database schema changes
   - Version-controlled database evolution

3. **Environment-specific Configurations**
   - Development, testing, and production environments
   - Secure management of sensitive configuration values

## Security Considerations

Security is a priority in the design:

- **Data Protection**: Encryption of sensitive data in transit and at rest
- **Authentication**: JWT-based authentication with secure token handling
- **Input Validation**: Comprehensive validation of all user inputs
- **Payment Security**: Delegation to Stripe for PCI compliance
- **Dependency Management**: Regular updates to minimize vulnerabilities

