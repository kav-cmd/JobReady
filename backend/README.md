# Vocational Platform - Backend

Complete authentication module for the E-learning vocational platform built with Node.js, Express, MongoDB, and JWT.

## Features

- ✅ User registration with Joi validation
- ✅ User login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ MongoDB database integration with Mongoose
- ✅ Email uniqueness validation
- ✅ Role-based user system (student/instructor)
- ✅ Timestamps on user records

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection configuration
│   ├── controllers/
│   │   └── auth.controller.js # Authentication logic
│   ├── models/
│   │   └── user.model.js      # User Mongoose schema
│   ├── routes/
│   │   └── auth.routes.js     # Authentication routes
│   ├── validation/
│   │   └── auth.validation.js # Joi validation schemas
│   └── server.js              # Main server file
├── .env.example               # Environment variables template
└── package.json               # Project dependencies
```

## Installation

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong secret key for JWT
   - `PORT`: Server port (default: 5000)

## Running the Server

### Development (with auto-reload):
```bash
npm run dev
```

### Production:
```bash
npm start
```

## API Endpoints

### Register User
**POST** `/api/auth/register`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "student"  // optional, defaults to "student"
}
```

Success Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

Error Response (409 - Account exists):
```json
{
  "success": false,
  "message": "Account already exists"
}
```

### Login User
**POST** `/api/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Success Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

Error Response (401):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Health Check
**GET** `/api/health`

Response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["student", "instructor"], default: "student"),
  createdAt: Date (timestamp),
  updatedAt: Date (timestamp)
}
```

## Authentication Flow

1. **Registration**: User provides name, email, and password
   - Validation using Joi
   - Check if email already exists (returns 409 if exists)
   - Hash password using bcrypt
   - Save user to MongoDB
   - Return user data (password excluded)

2. **Login**: User provides email and password
   - Validation using Joi
   - Check if user exists in MongoDB
   - Compare provided password with stored hashed password
   - Generate JWT token containing user ID and role
   - Return token and user data

## Environment Variables

Create a `.env` file in the backend folder with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/vocational
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **joi**: Request validation
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT generation and verification
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing
- **nodemon**: Development auto-reload (dev only)

## Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens for stateless authentication
- ✅ Input validation with Joi
- ✅ Email uniqueness constraint at database level
- ✅ Passwords never returned in API responses
- ✅ HTTP-only configuration ready (for future enhancement)

## Next Steps

Consider implementing:
- JWT verification middleware for protected routes
- Refresh token mechanism
- Email verification
- Password reset functionality
- Role-based access control (RBAC)
- API rate limiting
- Request logging

## Testing

You can test the API using tools like:
- Postman
- Thunder Client
- curl

Example curl command:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```
