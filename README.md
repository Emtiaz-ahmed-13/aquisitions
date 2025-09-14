# Acquisitions API

A robust backend service for handling user authentication and data management with built-in security features.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Docker Setup](#docker-setup)
- [Security](#security)
- [Project Structure](#project-structure)

## Features

- 🔐 User authentication (register, login, logout)
- 🛡️ Security middleware with Arcjet protection
- 🧪 Comprehensive test coverage
- 🐳 Docker support for easy deployment
- 📝 Request/response validation with Zod
- 🗃️ Database integration with Drizzle ORM
- 📊 Logging with Winston
- 🔒 Password hashing with bcrypt
- 📈 Rate limiting and bot detection

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js v5.1.0
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: JWT, bcrypt
- **Validation**: Zod
- **Security**: Arcjet, Helmet
- **Logging**: Winston
- **Testing**: Jest, Supertest
- **Deployment**: Docker

## Prerequisites

- Node.js 18+
- npm or yarn
- Docker (for containerized deployment)
- Neon Database account (for production)

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
# Arcjet API Key (required for security features)
ARCJET_KEY=your_arcjet_key_here

# Neon Database Configuration (for production)
NEON_API_KEY=your_neon_api_key_here
NEON_PROJECT_ID=your_neon_project_id_here

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development
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

### Authentication

#### Register User
**POST** `/api/auth/register`
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
**POST** `/api/auth/login`
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
**POST** `/api/auth/logout`
- **Description**: Invalidate user session
- **Headers**: 
  - Authorization: Bearer [token]
- **Response**:
  ```json
  {
    "message": "Logout successful"
  }
  ```

#### Get User Profile
**GET** `/api/auth/profile`
- **Description**: Get authenticated user's profile
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

### Users Management

#### Get All Users
**GET** `/api/users`
- **Description**: Get list of all users (admin only)
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
- **Description**: Get specific user by ID
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
- **Description**: Update user information
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
- **Description**: Delete a user
- **Headers**: 
  - Authorization: Bearer [token]
- **Response**:
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

## Testing

The project uses Jest and Supertest for testing.

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

## Docker Setup

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

### Docker Compose

The project includes a `docker-compose.yml` file for easy container orchestration:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
```

## Security

This project implements multiple security layers:

1. **Arcjet Protection**: Bot detection, rate limiting, and attack protection
2. **Helmet**: Security headers for Express
3. **JWT**: Secure token-based authentication
4. **Bcrypt**: Password hashing
5. **Input Validation**: Zod schema validation for all requests
6. **CORS**: Cross-origin resource sharing protection

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