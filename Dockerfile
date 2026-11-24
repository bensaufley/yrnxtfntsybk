# Stage 1: Build the Application
# We use node:26 as the base for building and installing dependencies.
FROM node:26 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker caching.
# If these files don't change, subsequent builds can skip 'npm install'.
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Stage 2: Create the Final Production Image
# We use node:26-slim as a minimal runtime image.
FROM node:26-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy only production dependencies
COPY --from=build /usr/src/app/package*.json ./
RUN npm install --only=production

COPY public views ./
COPY server.js ./

# Expose the port your app runs on
ENV PORT=8080
EXPOSE $PORT

# Run the application using the non-root user (recommended for security)
USER node

# Define the command to start your application
CMD [ "node", "server.js" ]
