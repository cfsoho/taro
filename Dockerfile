# Use an official Node runtime as a parent image
FROM node:16-alpine as build-stage

# Set the working directory in the container
WORKDIR /app

# Install app dependencies by copying
# package.json and package-lock.json first
COPY package*.json ./

RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Build the app for production
RUN npm run build

# Use the official Nginx image for a production build
FROM nginx:stable-alpine as production-stage

# Copy the build output to replace the default Nginx contents.
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
