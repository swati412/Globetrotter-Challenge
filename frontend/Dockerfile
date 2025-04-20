FROM node:18-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set up environment
ENV VITE_API_URL=http://localhost:5002

# Expose the port
EXPOSE 5173

# Run development server with host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 