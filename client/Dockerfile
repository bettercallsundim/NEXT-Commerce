# Base image with Node.js (Alpine version)
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port for the Next.js application
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
