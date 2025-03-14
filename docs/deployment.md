# Deployment Guide

This guide explains how to deploy GolfingGrouper to Render.

## Prerequisites

- A Render account (https://render.com)
- A PostgreSQL database (can be hosted on Render or elsewhere)
- A Stripe account for payment processing
- A SendGrid account for email notifications

## Deploying to Render

### 1. Set Up a PostgreSQL Database

1. Log in to your Render account
2. Go to the Dashboard and click "New" > "PostgreSQL"
3. Configure your database:
   - Name: `golfing-grouper-db` (or your preferred name)
   - Database: `golfing_grouper`
   - User: `golfing_grouper_user` (or your preferred username)
   - Region: Choose the region closest to your users
4. Click "Create Database"
5. Note the connection details (hostname, port, username, password)

### 2. Deploy the Backend API

1. From the Render Dashboard, click "New" > "Web Service"
2. Connect your GitHub repository
3. Configure the web service:
   - Name: `golfing-grouper-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Region: Choose the same region as your database
4. Add environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=your-db-hostname
   DB_PORT=5432
   DB_NAME=golfing_grouper
   DB_USER=your-db-username
   DB_PASSWORD=your-db-password
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRE=30d
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   SENDGRID_API_KEY=your-sendgrid-api-key
   SENDGRID_FROM_EMAIL=your-verified-email@example.com
   FRONTEND_URL=https://your-frontend-url.com
   MODAL_URL=https://your-frontend-url.com/modal
   MATCHING_CRON_SCHEDULE="*/5 * * * *"
   CLEANUP_CRON_SCHEDULE="0 0 * * *"
   ```
5. Click "Create Web Service"

### 3. Deploy the Frontend

1. From the Render Dashboard, click "New" > "Static Site"
2. Connect your GitHub repository
3. Configure the static site:
   - Name: `golfing-grouper-frontend`
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/build`
   - Environment Variables:
     ```
     REACT_APP_API_URL=https://your-api-url.render.com
     ```
4. Click "Create Static Site"

### 4. Set Up Web Scraping Workers (Optional)

If you're using web scraping for some booking platforms:

1. From the Render Dashboard, click "New" > "Web Service"
2. Configure a worker service:
   - Name: `golfing-grouper-scraper`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node src/workers/scraper.js`
   - Add the same environment variables as the main API
3. Click "Create Web Service"

## Setting Up Webhooks

### Stripe Webhook

1. Log in to your Stripe Dashboard
2. Go to Developers > Webhooks
3. Click "Add Endpoint"
4. Enter your webhook URL: `https://your-api-url.render.com/api/payments/webhook`
5. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. Click "Add Endpoint"
7. Copy the signing secret and add it to your Render environment variables as `STRIPE_WEBHOOK_SECRET`

## Monitoring and Logs

1. In the Render Dashboard, click on your web service
2. Go to the "Logs" tab to view application logs
3. Set up alerts in the "Alerts" tab for important events

## Scheduled Tasks

GolfingGrouper uses scheduled tasks for matching and cleanup:

1. The matching task runs according to your `MATCHING_CRON_SCHEDULE` setting
2. The cleanup task runs according to your `CLEANUP_CRON_SCHEDULE` setting

No additional configuration is needed as these are handled by the Node.js application using node-cron.

## Scaling

As your application grows, you can scale your Render services:

1. Go to your web service in the Render Dashboard
2. Click on the "Settings" tab
3. Under "Instance Type", select a larger instance
4. For horizontal scaling, enable auto-scaling in the "Scaling" section

## Backup and Recovery

Render PostgreSQL databases include automatic daily backups:

1. Go to your database in the Render Dashboard
2. Click on the "Backups" tab to view and manage backups
3. To restore a backup, click "Restore" next to the backup you want to use

## Troubleshooting

If you encounter issues with your deployment:

1. Check the application logs in the Render Dashboard
2. Verify that all environment variables are set correctly
3. Ensure your database connection is working
4. Check that your Stripe and SendGrid credentials are valid

For additional help, contact Render support or refer to their documentation at https://render.com/docs. 