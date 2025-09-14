# Acquisitions API

A production-ready backend service for handling user authentication and data management with enterprise-grade security features.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

Acquisitions API is a robust, scalable backend solution designed for modern web applications. Built with security as a primary concern, it provides comprehensive user management, authentication, and data handling capabilities with enterprise-grade protection against common web vulnerabilities.

## Key Features

- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 🛡️ **Advanced Security**: Arcjet integration for bot detection, rate limiting, and attack protection
- 🧪 **Comprehensive Testing**: Full test coverage with Jest and Supertest
- 🐳 **Containerized Deployment**: Docker support for consistent development and production environments
- 📝 **Data Validation**: Zod schema validation for all API requests
- 🗃️ **Database Integration**: PostgreSQL with Drizzle ORM for efficient data operations
- 📊 **Detailed Logging**: Winston logging for monitoring and debugging
- 🚀 **Modern Architecture**: Express.js with clean, modular code structure

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js v5.1.0
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT, bcrypt
- **Validation**: Zod
- **Security**: Arcjet, Helmet
- **Logging**: Winston
- **Testing**: Jest, Supertest
- **Deployment**: Docker, Docker Compose

## Prerequisites

- Node.js 18+
- npm or yarn
- Docker and Docker Compose (for containerized deployment)
- Arcjet account (for security features)

## Installation

```bash
# Clone the repository
git clone https://github.com/Emtiaz-ahmed-13/aquistions.git

# Navigate to the project directory
cd aquistions

# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Arcjet API Key (required for security features)
ARCJET_KEY=your_arcjet_key_here

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# Database Configuration
DATABASE_URL=your_database_connection_string
```

## Running the Application

### Development Mode

```bash
# Run in development mode with file watching
npm run dev
```

### Production Mode

```bash
# Run in production mode
npm start
```

## API Endpoints

### Health Check

**GET** `/health`

- **Description**: Check if the API is running
- **Response**:
  ```json
  {
    "status": "OK",
    "timestamp": "2025-09-14T19:39:41.939Z"
  }
  ```

### API Root

**GET** `/api`

- **Description**: Welcome message
- **Response**:
  ```json
  {
    "message": "API is working"
  }
  ```

### Authentication Endpoints

#### Register User

**POST** `/api/auth/sign-up`

- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
  ```

#### Login User

**POST** `/api/auth/sign-in`

- **Description**: Authenticate user and get access token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "jwt_access_token",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
  ```

#### Logout User

**POST** `/api/auth/sign-out`

- **Description**: Invalidate user session
- **Headers**:
  - Authorization: Bearer [token]
- **Response**:
  ```json
  {
    "message": "Logout successful"
  }
  ```

### User Management Endpoints

#### Get All Users

**GET** `/api/users`

- **Description**: Get list of all users (requires authentication)
- **Headers**:
  - Authorization: Bearer [token]
- **Response**:
  ```json
  {
    "users": [
      {
        "id": "user_id",
        "email": "user@example.com",
        "name": "John Doe",
        "createdAt": "2025-09-14T19:39:41.939Z"
      }
    ]
  }
  ```

#### Get User by ID

**GET** `/api/users/:id`

- **Description**: Get specific user by ID (requires authentication)
- **Headers**:
  - Authorization: Bearer [token]
- **Response**:
  ```json
  {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-09-14T19:39:41.939Z"
  }
  ```

#### Update User

**PUT** `/api/users/:id`

- **Description**: Update user information (requires authentication)
- **Headers**:
  - Authorization: Bearer [token]
- **Request Body**:
  ```json
  {
    "name": "Updated Name",
    "email": "updated@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User updated successfully",
    "user": {
      "id": "user_id",
      "email": "updated@example.com",
      "name": "Updated Name"
    }
  }
  ```

#### Delete User

**DELETE** `/api/users/:id`

- **Description**: Delete a user (requires authentication)
- **Headers**:
  - Authorization: Bearer [token]
- **Response**:
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

## Security Features

### Arcjet Protection

This application integrates Arcjet for comprehensive security protection:

1. **Bot Detection**
   - Blocks malicious bots and scrapers
   - Allows legitimate search engine crawlers
   - Customizable bot detection rules

2. **Rate Limiting**
   - Prevents abuse and DDoS attacks
   - Configurable limits per endpoint
   - IP-based rate limiting

3. **Shield Protection**
   - Protection against common web attacks
   - SQL injection prevention
   - Cross-site scripting (XSS) protection

### Implementation Details

The security middleware is applied to all routes and provides:

- Real-time threat detection
- Automated blocking of malicious requests
- Detailed logging of security events
- Minimal performance impact

### Testing Security Features

You can test the security features using the provided test scripts:

```bash
# Test rate limiting
node test-rate-limit.js

# Test bot detection
node test-bot-detection.js
```

Or manually with curl:

```bash
# Test rate limiting
for i in {1..5}; do curl http://localhost:3000/health; echo; done

# Test bot detection
curl -H "User-Agent: Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)" http://localhost:3000/health
```

## Testing

The project uses Jest and Supertest for comprehensive testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

Tests are located in the `tests/` directory:

- `app.test.js`: Tests for core API endpoints

### Example Test Output

```bash
PASS tests/app.test.js
  API Endpoints
    GET /health
      ✓ should return health status (21 ms)
    GET /api
      ✓ should return API message (6 ms)
    GET /nonexistent
      ✓ should return 404 for non-existent routes (2 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

## Docker Deployment

### Development with Docker

```bash
# Run in Docker development mode
npm run dev:docker
```

### Production with Docker

```bash
# Run in Docker production mode
npm run prod:docker
```

### Docker Compose Configuration

The project includes a `docker-compose.yml` file for easy container orchestration:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
```

## Project Structure

```
aquistions/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validations/     # Input validation schemas
│   ├── app.js           # Express app configuration
│   └── server.js        # Server entry point
├── tests/               # Test files
├── drizzle/             # Database migrations
├── public/              # Static files
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose configuration
├── .env                 # Environment variables
├── .gitignore           # Git ignore rules
└── package.json         # Project dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Emtiaz Ahmed
