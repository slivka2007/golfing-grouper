# API Endpoints

## Authentication

### Register User
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: User object with JWT token

### Login User
- **URL**: `/api/users/login`
- **Method**: `POST`
- **Description**: Login an existing user
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: User object with JWT token

## User Management

### Get Current User
- **URL**: `/api/users/me`
- **Method**: `GET`
- **Description**: Get the current authenticated user's profile
- **Authentication**: Required
- **Response**: User object

### Update Current User
- **URL**: `/api/users/me`
- **Method**: `PUT`
- **Description**: Update the current authenticated user's profile
- **Authentication**: Required
- **Request Body**: User fields to update
- **Response**: Updated user object

### Get User Preferences
- **URL**: `/api/users/preferences`
- **Method**: `GET`
- **Description**: Get the current user's golf preferences
- **Authentication**: Required
- **Response**: User preferences object

### Update User Preferences
- **URL**: `/api/users/preferences`
- **Method**: `PUT`
- **Description**: Update the current user's golf preferences
- **Authentication**: Required
- **Request Body**: Preference fields to update
- **Response**: Updated preferences object

## Booking Platforms

### Get All Booking Platforms
- **URL**: `/api/booking-platforms`
- **Method**: `GET`
- **Description**: Get a list of all supported booking platforms
- **Authentication**: Optional
- **Response**: Array of booking platform objects

### Get Booking Platform by ID
- **URL**: `/api/booking-platforms/:id`
- **Method**: `GET`
- **Description**: Get a booking platform by ID
- **Authentication**: Optional
- **Response**: Booking platform object

## Tee Times

### Create Tee Time
- **URL**: `/api/tee-times`
- **Method**: `POST`
- **Description**: Create a new tee time
- **Request Body**:
  ```json
  {
    "booking_platform_id": 1,
    "course_name": "Demo Golf Club",
    "date_time": "2023-06-15T08:30:00Z",
    "holes": 18,
    "capacity": 4,
    "total_cost": 200.00,
    "booking_url": "https://example.com/book/123"
  }
  ```
- **Response**: Created tee time object

### Get Tee Time by ID
- **URL**: `/api/tee-times/:id`
- **Method**: `GET`
- **Description**: Get a tee time by its ID
- **Authentication**: Optional
- **Response**: Tee time object

### Get All Tee Times
- **URL**: `/api/tee-times`
- **Method**: `GET`
- **Description**: Get all tee times (with optional filtering)
- **Authentication**: Required
- **Query Parameters**: `booking_platform_id`, `course_name`, `date`, `holes`
- **Response**: Array of tee time objects

### Search Tee Times
- **URL**: `/api/tee-times/search`
- **Method**: `GET`
- **Description**: Search for tee times across multiple booking platforms
- **Authentication**: Optional
- **Query Parameters**: `location`, `date`, `holes`, `max_price`
- **Response**: Array of tee time objects from various booking platforms

## Requests

### Create Request
- **URL**: `/api/requests`
- **Method**: `POST`
- **Description**: Create a new request to join a tee time
- **Authentication**: Optional
- **Request Body**:
  ```json
  {
    "tee_time_id": 1,
    "user_id": 1,
    "group_size": 2,
    "preferences": {
      "experience_level": "intermediate",
      "pace_of_play": "moderate",
      "round_type": "casual"
    }
  }
  ```
- **Response**: Created request object

### Get User Requests
- **URL**: `/api/requests`
- **Method**: `GET`
- **Description**: Get all requests for the current user
- **Authentication**: Required
- **Response**: Array of request objects

### Get Request by ID
- **URL**: `/api/requests/:id`
- **Method**: `GET`
- **Description**: Get a request by its ID
- **Authentication**: Required
- **Response**: Request object

### Update Request
- **URL**: `/api/requests/:id`
- **Method**: `PUT`
- **Description**: Update a request
- **Authentication**: Required
- **Request Body**: Request fields to update
- **Response**: Updated request object

### Cancel Request
- **URL**: `/api/requests/:id`
- **Method**: `DELETE`
- **Description**: Cancel a request
- **Authentication**: Required
- **Response**: Success message

## Payments

### Create Payment Intent
- **URL**: `/api/payments/create-payment-intent`
- **Method**: `POST`
- **Description**: Create a Stripe payment intent
- **Request Body**:
  ```json
  {
    "request_id": 1,
    "amount": 50.00
  }
  ```
- **Response**: Stripe payment intent client secret

### Stripe Webhook
- **URL**: `/api/payments/webhook`
- **Method**: `POST`
- **Description**: Handle Stripe webhook events
- **Request Body**: Stripe webhook event
- **Response**: Acknowledgement

### Get Payment Methods
- **URL**: `/api/payments/methods`
- **Method**: `GET`
- **Description**: Get all payment methods for the current user
- **Authentication**: Required
- **Response**: Array of payment method objects

### Add Payment Method
- **URL**: `/api/payments/methods`
- **Method**: `POST`
- **Description**: Add a new payment method for the current user
- **Authentication**: Required
- **Request Body**:
  ```json
  {
    "payment_method_id": "pm_123456789"
  }
  ```
- **Response**: Added payment method object

### Delete Payment Method
- **URL**: `/api/payments/methods/:id`
- **Method**: `DELETE`
- **Description**: Delete a payment method
- **Authentication**: Required
- **Response**: Success message 