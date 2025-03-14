# Database Schema

## Users

Stores user account information and golf preferences.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| first_name | VARCHAR(50) | User's first name |
| last_name | VARCHAR(50) | User's last name |
| email | VARCHAR(255) | User's email address (unique) |
| password_hash | VARCHAR(255) | Hashed password |
| zip_5 | VARCHAR(5) | 5-digit ZIP code |
| golf_experience | VARCHAR(20) | Experience level (beginner, intermediate, advanced) |
| handicap | VARCHAR(10) | Golf handicap |
| average_score | VARCHAR(10) | Average score |
| preferences | JSONB | All golf preferences (round type, rules, pace, price, etc.) |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |

## Booking Platforms

Stores information about golf course booking platforms.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | VARCHAR(255) | Platform name (e.g., GolfNow, TeeOff) |
| api_endpoint | TEXT | API endpoint URL (for API-based platforms) |
| scrape_url | TEXT | URL for scraping (for web scraping-based platforms) |
| api_key | TEXT | API key for authentication (if required) |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |

## Golf Courses

Stores information about golf courses.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | VARCHAR(255) | Course name |
| zip_code | VARCHAR(10) | ZIP code |
| booking_platform_id | INTEGER | Foreign key to booking_platforms.id |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |

## Tee Times

Stores information about available tee times.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| booking_platform_id | INTEGER | Foreign key to booking_platforms.id |
| course_name | VARCHAR(255) | Name of the golf course |
| date_time | TIMESTAMP | Date and time of the tee time |
| holes | INTEGER | Number of holes (9 or 18) |
| capacity | INTEGER | Maximum number of players |
| total_cost | DECIMAL(10,2) | Total cost of the tee time |
| booking_url | TEXT | URL to book the tee time |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |

## Requests

Stores information about requests to join tee times.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| user_id | INTEGER | Foreign key to users.id |
| tee_time_id | INTEGER | Foreign key to tee_times.id |
| group_size | INTEGER | Number of players in the group (1-4) |
| preferences | JSONB | Golf preferences for this request (can override user preferences) |
| stripe_customer_id | VARCHAR(255) | Stripe customer ID |
| status | VARCHAR(20) | Status (pending, matched, confirmed, completed, cancelled) |
| created_at | TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | Record update timestamp |

## Entity Relationship Diagram

```
+----------------+       +----------------+
|                |       |                |
|  BookingPlatform|<------+  GolfCourse   |
|                |       |                |
+----------------+       +----------------+
        ^
        |
+----------------+       +----------------+       +----------------+
|                |       |                |       |                |
|   TeeTime      |<------+    Request     |<------+     User       |
|                |       |                |       |                |
+----------------+       +----------------+       +----------------+
```

## Schema Changes

In the latest version of the application:

1. The `User` model now uses a single JSONB `preferences` field to store all golf preferences.
2. `TeeTime` is now directly linked to `BookingPlatform` instead of `GolfCourse`.
3. `BookingPlatform` now supports both API-based integration (via `api_endpoint`) and web scraping (via `scrape_url`).
4. `Request` has a JSONB `preferences` field that can override user preferences for that specific booking. 