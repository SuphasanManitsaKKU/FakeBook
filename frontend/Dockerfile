# Stage 1: Build the Angular application
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy dependencies files
COPY package.json package-lock.json ./
RUN npm install

# Copy application source code
COPY . .

# Build the Angular application
RUN npm run build --prod

# Stage 2: Serve the Angular application with Nginx
FROM nginx:alpine

# Set working directory in Nginx
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy built Angular app from the `browser` directory
COPY --from=build /app/dist/frontend/browser .

# Configure Nginx to handle Angular SPA routing
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 4200
EXPOSE 4200

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
