# GolfingGrouper Integration Guide

This guide explains how to integrate GolfingGrouper with golf booking websites.

## Overview

GolfingGrouper provides a simple JavaScript button that can be added to tee time booking pages across multiple booking platforms. When clicked, it opens a modal that allows golfers to join with other compatible players instead of booking alone.

## Integration Options

GolfingGrouper supports two types of integration:

1. **JavaScript Button Integration**: Add a button to your booking website that connects to our service.
2. **API Integration**: Deeper integration for booking platforms that want full control over the user experience.

## JavaScript Button Integration

### 1. Add the GolfingGrouper Script

Add the following script tag to your website's header:

```html
<script src="https://cdn.golfinggrouper.com/js/button.js" async></script>
```

### 2. Add the Button to Your Tee Time Pages

Add the following HTML where you want the GolfingGrouper button to appear:

```html
<div 
  class="golfing-grouper-button" 
  data-platform-id="YOUR_PLATFORM_ID" 
  data-course-name="Demo Golf Club"
  data-tee-time="2023-06-15T08:30:00Z" 
  data-holes="18" 
  data-capacity="4" 
  data-cost="200.00" 
  data-booking-url="https://example.com/book/123">
</div>
```

Replace the `data-` attributes with your actual tee time information:

- `data-platform-id`: Your booking platform ID in the GolfingGrouper system
- `data-course-name`: The name of the golf course
- `data-tee-time`: ISO 8601 formatted date and time of the tee time
- `data-holes`: Number of holes (9 or 18)
- `data-capacity`: Maximum number of players
- `data-cost`: Total cost of the tee time
- `data-booking-url`: URL to book the tee time directly

### 3. Customize the Button (Optional)

You can customize the appearance of the button by adding CSS:

```html
<style>
  .golfing-grouper-button {
    /* Your custom styles */
  }
</style>
```

## API Integration

For booking platforms that want a deeper integration, we offer a comprehensive API:

### 1. Register as a Booking Platform

Contact us at partners@golfinggrouper.com to register your platform and receive an API key.

### 2. API Endpoints

Once registered, you can:

- Create tee times on our platform when they're added to your system
- Receive notifications when matches are made
- Confirm bookings through our API

See the [API Documentation](api-endpoints.md) for detailed endpoint descriptions.

## Web Scraping Option

For platforms without an API, we also support web scraping integration:

1. Register your platform with us
2. Provide details about your website structure
3. We'll configure our system to scrape tee time data from your site

## How It Works

1. When a golfer clicks the GolfingGrouper button, a modal opens.
2. The golfer enters their information and preferences.
3. GolfingGrouper matches them with compatible golfers.
4. When a match is found, all golfers are notified and can confirm.
5. Once confirmed, GolfingGrouper books the tee time via the appropriate booking method.

## Testing Your Integration

1. Add the button to a test page.
2. Click the button to ensure the modal opens correctly.
3. Submit a test request to verify the full flow.

## Support

If you need help with your integration, contact us at support@golfinggrouper.com. 