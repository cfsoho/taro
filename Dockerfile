# Use an official Node runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source inside the Docker image
COPY . .

# Build the app for production
RUN npm run build

# Use the official nginx image for a production build
FROM nginx:stable-alpine

# Copy the build output to replace the default nginx contents.
COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
