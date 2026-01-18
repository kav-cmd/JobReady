# 📚 Vocational Course Module

A complete course management system for an e-learning platform focused on vocational training. Includes full REST APIs, MongoDB integration, and comprehensive validation.

---

## 🎯 Features

✅ **Three Vocational Categories**
- Computer Skills
- English Communication  
- Basic Math

✅ **Complete CRUD Operations**
- Create courses with YouTube content
- Retrieve all courses with pagination
- Filter courses by category
- Get individual course details
- Soft delete courses

✅ **Robust Validation**
- Joi schema validation
- YouTube URL verification
- Category enumeration
- Title uniqueness within category
- Field length constraints

✅ **Analytics & Management**
- View count tracking
- Active/inactive status
- Timestamps (createdAt, updatedAt)
- Instructor information
- Multiple video links per course

✅ **Clean Architecture**
- Separation of concerns (models, controllers, routes, validation)
- Reusable components
- Well-documented code
- Error handling
- Proper HTTP status codes

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/
│   │   └── course.model.js              # Mongoose schema for courses
│   ├── controllers/
│   │   └── course.controller.js         # Business logic handlers
│   ├── routes/
│   │   └── course.routes.js             # API endpoint definitions
│   ├── validation/
│   │   └── course.validation.js         # Joi validation schemas
│   ├── config/
│   │   └── db.js                        # MongoDB connection
│   └── server.js                        # Main Express app
├── COURSE_API.md                        # Complete API documentation
├── test-courses.js                      # Test script for all endpoints
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 14+ installed
- MongoDB running locally or remote URI configured
- npm or yarn package manager

### 2. Installation

```bash
# Install dependencies
npm install

# Install required packages (if not already installed)
npm install express mongoose joi cors
npm install nodemon --save-dev
```

### 3. Environment Setup

Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vocational
NODE_ENV=development
```

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
Server is running on port 5000
MongoDB Connected: localhost
```

---

## 📝 Course Model

### MongoDB Schema
```javascript
{
  _id: ObjectId,
  title: String,                    // 5-100 chars, required
  category: String,                 // Enum: "Computer Skills", "English Communication", "Basic Math"
  description: String,              // 20-1000 chars, required
  youtubeLinks: [
    {
      title: String,                // Min 3 chars
      url: String                   // Valid YouTube URL
    }
  ],
  instructor: String,               // Optional
  isActive: Boolean,                // Default: true
  viewCount: Number,                // Default: 0, increments on fetch
  createdAt: Date,                  // Automatic timestamp
  updatedAt: Date                   // Automatic timestamp
}
```

---

## 🔗 API Endpoints

### Create Course
```bash
POST /api/courses
Content-Type: application/json

{
  "title": "Advanced Excel for Data Entry",
  "category": "Computer Skills",
  "description": "Learn advanced Excel functions...",
  "youtubeLinks": [
    {
      "title": "Excel Basics",
      "url": "https://www.youtube.com/watch?v=example"
    }
  ],
  "instructor": "John Smith"
}
```

### Get All Courses
```bash
GET /api/courses?sortBy=newest&limit=10&page=1
```

### Get Courses by Category
```bash
GET /api/courses/category/Computer%20Skills
```

### Get Course by ID
```bash
GET /api/courses/507f1f77bcf86cd799439011
```

### Delete Course
```bash
DELETE /api/courses/507f1f77bcf86cd799439011
```

---

## 🧪 Testing

### Option 1: Automated Test Script
```bash
node test-courses.js
```

The test script includes:
- ✅ Creating sample courses
- ✅ Fetching all courses
- ✅ Filtering by category
- ✅ Pagination testing
- ✅ Validation testing
- ✅ Duplicate prevention
- ✅ URL validation
- ✅ Soft delete testing

### Option 2: Manual Testing with cURL

**Create a course:**
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Excel for Data Entry",
    "category": "Computer Skills",
    "description": "Learn advanced Excel functions and features.",
    "youtubeLinks": [
      {
        "title": "Excel Basics",
        "url": "https://www.youtube.com/watch?v=example"
      }
    ]
  }'
```

**Get all courses:**
```bash
curl -X GET "http://localhost:5000/api/courses"
```

**Get by category:**
```bash
curl -X GET "http://localhost:5000/api/courses/category/Computer%20Skills"
```

### Option 3: Postman/Thunder Client

1. Open Postman or Thunder Client
2. Create requests for each endpoint
3. Set method (GET, POST, DELETE)
4. Add request body for POST requests
5. Send and view responses

---

## ✅ Validation Rules

### Title
- Required
- Min length: 5 characters
- Max length: 100 characters
- Must be unique within same category

### Category
- Required
- Enum values only:
  - "Computer Skills"
  - "English Communication"
  - "Basic Math"

### Description
- Required
- Min length: 20 characters
- Max length: 1000 characters

### YouTube Links
- Required (at least 1)
- Valid YouTube URLs only
- Title: 3-100 characters
- URL: Valid YouTube URL format

### Instructor (Optional)
- String value
- Used for course attribution

---

## 🔍 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Description of error",
  "errors": ["Detailed error message"]  // Optional array
}
```

### Common HTTP Status Codes
- **200** - Success (GET, DELETE)
- **201** - Created (POST successful)
- **400** - Bad Request (Validation error)
- **404** - Not Found (Course doesn't exist)
- **409** - Conflict (Duplicate course)
- **500** - Server Error

---

## 💡 Code Highlights

### Model with Validation
```javascript
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Course title is required"],
    minlength: [5, "Title must be at least 5 characters"],
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  // ... more fields
}, { timestamps: true });
```

### Joi Validation
```javascript
const createCourseValidation = {
  body: Joi.object({
    title: Joi.string().required().min(5).max(100),
    category: Joi.string().required().valid("Computer Skills", "English Communication", "Basic Math"),
    // ... more schemas
  })
};
```

### Controller with Error Handling
```javascript
const createCourse = async (req, res) => {
  try {
    const { error, value } = createCourseValidation.body.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map(d => d.message)
      });
    }
    
    const newCourse = await Course.create(value);
    
    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message
    });
  }
};
```

---

## 📊 Sample Data

The `test-courses.js` includes sample courses for testing:

1. **Advanced Excel for Data Entry** (Computer Skills)
2. **Professional Business English** (English Communication)
3. **Accounting Fundamentals** (Basic Math)

Each includes realistic descriptions and multiple YouTube video links.

---

## 🔐 Security Considerations

For production use, add:

1. **Authentication**
   ```javascript
   router.post("/", authenticate, createCourse);
   ```

2. **Authorization**
   ```javascript
   if (req.user.role !== 'admin') return res.status(403).json({...});
   ```

3. **Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   router.post("/", rateLimit({...}), createCourse);
   ```

4. **Input Sanitization**
   ```javascript
   const sanitizeHtml = require('sanitize-html');
   ```

5. **Environment Variables**
   - Never hardcode credentials
   - Use `.env` files
   - Add `.env` to `.gitignore`

---

## 📈 Performance Features

1. **Indexing**
   - Category index for faster queries
   - CreatedAt index for sorting

2. **Pagination**
   - Limits large result sets
   - Reduces memory usage
   - Improves response time

3. **Query Optimization**
   - Select only needed fields
   - Limit results with pagination
   - Use indexes effectively

---

## 🎓 Learning Outcomes

After completing this module, students will understand:

✅ MongoDB schema design and validation
✅ Express.js REST API development
✅ Joi schema validation in Node.js
✅ Error handling and HTTP status codes
✅ CRUD operations
✅ Separation of concerns (MVC pattern)
✅ Code documentation best practices
✅ API testing methodologies
✅ Clean, maintainable code structure
✅ Production-ready patterns

---

## 📚 Additional Resources

- [Mongoose Documentation](https://mongoosejs.com/)
- [Express.js Guide](https://expressjs.com/)
- [Joi Validation](https://joi.dev/)
- [REST API Best Practices](https://restfulapi.net/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)

---

## 🤝 Contributing

This is a student project. Suggestions for improvements:
- Add authentication
- Implement caching
- Add sorting options
- Create admin dashboard
- Add course reviews/ratings
- Implement course prerequisites
- Add search functionality

---

## 📝 License

Student Project - Feel free to use and modify for learning purposes.

---

## 🆘 Troubleshooting

### MongoDB Connection Error
```
Error: Cannot connect to MongoDB
```
**Solution**: Ensure MongoDB is running
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` or kill existing process

### Validation Errors
**Always check**:
- Title: 5-100 characters
- Category: Valid enum value
- Description: 20-1000 characters
- YouTube URL: Valid YouTube link

---

## ✨ Features Implemented

| Feature | Status | Details |
|---------|--------|---------|
| Create Course | ✅ | Full validation |
| Read All Courses | ✅ | Pagination support |
| Filter by Category | ✅ | Three categories |
| Get by ID | ✅ | View tracking |
| Delete Course | ✅ | Soft delete |
| Validation | ✅ | Joi schemas |
| Error Handling | ✅ | Proper status codes |
| Documentation | ✅ | Complete API docs |
| Test Script | ✅ | Automated tests |
| Code Comments | ✅ | Well documented |

---

**Ready to use and test! Happy learning! 🚀**
