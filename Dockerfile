# Use official Node.js image as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY fsd/server/package.json fsd/server/package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY fsd/server ./

# Expose the port your backend is running on (assuming it's 5000)
EXPOSE 5000

# Command to run your app
CMD ["node", "server.js"]
