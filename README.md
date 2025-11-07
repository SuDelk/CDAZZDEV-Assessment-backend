# 🎓 Online Learning Platform - Backend API

A comprehensive RESTful API backend for an online learning management system built with Node.js, Express, and MongoDB. This platform enables user authentication, course management, and student enrollment tracking.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Models](#-models)
- [Authentication](#-authentication)
- [Development](#-development)
- [Contributing](#-contributing)

## ✨ Features

- **User Authentication & Authorization**
  - User registration and login with JWT tokens
  - Role-based access control (Student/Admin)
  - Password hashing with bcrypt
  - Protected routes with bearer token authentication

- **Course Management**
  - Create, read, update, and delete courses
  - Course details including title, description, and pricing
  - Admin-controlled course operations

- **Enrollment System**
  - Student enrollment in courses
  - Track enrollment status (active/completed)
  - View enrolled courses and student lists
  - Manage enrollment records

- **API Documentation**
  - Interactive Swagger UI documentation
  - Comprehensive API endpoint descriptions
  - Request/response schemas

## 🛠 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **API Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **CORS**: Enabled for cross-origin requests
- **Environment Variables**: dotenv
- **Development**: nodemon (auto-restart on changes)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v14.x or higher ([Download](https://nodejs.org/))
- **npm**: v6.x or higher (comes with Node.js)
- **MongoDB**: v4.x or higher ([Download](https://www.mongodb.com/try/download/community)) or MongoDB Atlas account ([Sign up](https://www.mongodb.com/cloud/atlas/register))
- **Git**: For cloning the repository ([Download](https://git-scm.com/downloads))

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SuDelk/CDAZZDEV-Assessment-backend.git
cd CDAZZDEV-Assessment-backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

## ⚙️ Environment Configuration

Create a `.env` file in the root directory of the project with the following variables:

```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/learning-platform
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/learning-platform?retryWrites=true&w=majority

# JWT Secret Key (use a strong, random string in production)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
```

### Environment Variables Explained

- `PORT`: The port on which the server will run (default: 5000)
- `MONGODB_URI`: MongoDB connection string
  - For local MongoDB: `mongodb://localhost:27017/learning-platform`
  - For MongoDB Atlas: Get the connection string from your Atlas dashboard
- `JWT_SECRET`: Secret key for signing JWT tokens (use a strong, random string)

### MongoDB Setup Options

#### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # On macOS (using Homebrew)
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   
   # On Windows
   # MongoDB should start automatically as a service
   ```
3. Use `MONGODB_URI=mongodb://localhost:27017/learning-platform`

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster
3. Add a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and replace `<username>` and `<password>`
6. Use the connection string in your `.env` file

## 🏃 Running the Application

### Development Mode (with auto-restart)

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when file changes are detected.

### Production Mode

```bash
npm start
```

### Verify the Server is Running

Once started, you should see:

```
✅ MongoDB connected
🚀 Server running on port 5000
📘 Swagger Docs: http://localhost:5000/api-docs
```

## 📚 API Documentation

The API includes interactive Swagger documentation. Once the server is running, visit:

```
http://localhost:5000/api-docs
```

Here you can:
- View all available endpoints
- See request/response schemas
- Test API calls directly from the browser
- Authenticate and make protected requests

## 🔌 API Endpoints

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user and get JWT token | No |
| GET | `/api/auth/profile` | Get logged-in user's profile | Yes |
| GET | `/api/auth` | Get all users (Admin only) | Yes |
| GET | `/api/auth/students` | Get all students | Yes |
| PUT | `/api/auth/:id` | Update user by ID | Yes |
| DELETE | `/api/auth/:id` | Delete user by ID | Yes |

### Course Endpoints (`/api/courses`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses` | Get all courses | Yes |
| GET | `/api/courses/:id` | Get course by ID | Yes |
| POST | `/api/courses` | Create new course | Yes |
| PUT | `/api/courses/:id` | Update course | Yes |
| DELETE | `/api/courses/:id` | Delete course | Yes |

### Enrollment Endpoints (`/api/enrollments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/enrollments` | Get all enrollments | Yes |
| GET | `/api/enrollments/:id` | Get enrollment by ID | Yes |
| POST | `/api/enrollments` | Create new enrollment | Yes |
| PUT | `/api/enrollments/:id` | Update enrollment status | Yes |
| DELETE | `/api/enrollments/:id` | Delete enrollment | Yes |

### Example API Requests

#### Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "student"
  }'
```

#### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

Response includes a JWT token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### Create a Course (Authenticated)

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "React for Beginners",
    "description": "Learn the basics of React.js",
    "price": 99.99
  }'
```

## 📁 Project Structure

```
CDAZZDEV-Assessment-backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.js
│   │   ├── course.controller.js
│   │   └── enrollment.controller.js
│   ├── middleware/           # Custom middleware
│   │   └── auth.middleware.js
│   ├── models/              # MongoDB/Mongoose models
│   │   ├── user.model.js
│   │   ├── course.model.js
│   │   └── enrollment.model.js
│   └── routes/              # API routes
│       ├── auth.routes.js
│       ├── course.routes.js
│       └── enrollment.routes.js
├── index.js                 # Application entry point
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables (create this)
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🗄️ Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ["student", "admin"]),
  coursesEnrolled: [ObjectId] (references Course),
  timestamps: true
}
```

### Course Model
```javascript
{
  title: String,
  description: String,
  price: Number,
  timestamps: true
}
```

### Enrollment Model
```javascript
{
  userId: ObjectId (references User),
  courseId: ObjectId (references Course),
  status: String (enum: ["active", "completed"]),
  timestamps: true
}
```

## 🔐 Authentication

This API uses **JWT (JSON Web Tokens)** for authentication.

### How it Works

1. **Register/Login**: User registers or logs in with credentials
2. **Receive Token**: Server returns a JWT token
3. **Include Token**: Include the token in the `Authorization` header for protected routes
4. **Token Format**: `Authorization: Bearer YOUR_JWT_TOKEN`

### Protected Routes

Most endpoints require authentication. Include the JWT token in the request header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

Tokens are valid until explicitly invalidated. In production, consider implementing token expiration and refresh mechanisms.

## 💻 Development

### Available Scripts

```bash
# Start the server in production mode
npm start

# Start the server in development mode with auto-restart
npm run dev

# Run tests (not yet implemented)
npm test
```

### Development Workflow

1. Make changes to the code
2. Server automatically restarts (if using `npm run dev`)
3. Test changes using Swagger UI or API client (Postman, cURL, etc.)
4. Check server logs for errors or debugging information

### Adding New Features

1. **Create Model**: Add a new model in `src/models/`
2. **Create Controller**: Add business logic in `src/controllers/`
3. **Create Routes**: Define API endpoints in `src/routes/`
4. **Register Routes**: Import and register in `index.js`
5. **Add Swagger Docs**: Document endpoints with JSDoc comments
6. **Test**: Test the new endpoints via Swagger UI

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Repository Owner**: [SuDelk](https://github.com/SuDelk)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Swagger Documentation](http://localhost:5000/api-docs) when the server is running
2. Review the [Issues](https://github.com/SuDelk/CDAZZDEV-Assessment-backend/issues) page
3. Create a new issue if your problem isn't already listed

---

**Happy Coding! 🚀**
