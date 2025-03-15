FROM node:18-alpine

WORKDIR /app

# Install puppeteer dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# Set puppeteer environment variable to use installed chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source code
COPY . .

# Install dev dependencies if running in non-production
RUN if [ "$NODE_ENV" != "production" ]; then npm ci --only=development; fi

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port the app will run on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"] 