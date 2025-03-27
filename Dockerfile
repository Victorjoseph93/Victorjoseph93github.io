# Use an official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR ./

# Copy package.json and package-lock.json first
COPY package*.json /root/Victorjoseph93github.io/mea-backend


# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 9000

# Start the application
CMD ["node", "server.js"]

