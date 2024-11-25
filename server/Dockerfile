# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Copy the Prisma schema
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the port your server will run on
EXPOSE 4000

# Use the built JavaScript files to start the application
CMD ["node", "dist/server.js"]
