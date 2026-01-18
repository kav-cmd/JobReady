# 📚 Course Module - Quick Reference Guide

## 🎯 What Was Built

A complete **Course Management System** for vocational e-learning with 5 REST APIs, MongoDB integration, and comprehensive validation.

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Express.js Server (Node.js)                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Routes: /api/courses                                │  │
│  │  ├── POST   /                                         │  │
│  │  ├── GET    /                                         │  │
│  │  ├── GET    /category/:category                       │  │
│  │  ├── GET    /:id                                      │  │
│  │  └── DELETE /:id                                      │  │
│  └───────────────┬──────────────────────────────────────┘  │
│                  ▼                                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Controllers: Business Logic                          │  │
│  │  ├── createCourse()                                   │  │
│  │  ├── getAllCourses()                                  │  │
│  │  ├── getCoursesByCategory()                           │  │
│  │  ├── getCourseById()                                  │  │
│  │  └── deleteCourse()                                   │  │
│  └───────────────┬──────────────────────────────────────┘  │
│                  ▼                                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Models: Database Schema                              │  │
│  │  ├── Validation (Mongoose + Joi)                      │  │
│  │  └── Error Handling                                   │  │
│  └───────────────┬──────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ MongoDB Query
                         ▼
        ┌─────────────────────────────────┐
        │    MongoDB Database             │
        │  ┌─────────────────────────┐   │
        │  │ Collections:            │   │
        │  │ - courses               │   │
        │  │   ├── title             │   │
        │  │   ├── category          │   │
        │  │   ├── description       │   │
        │  │   ├── youtubeLinks []   │   │
        │  │   ├── isActive          │   │
        │  │   ├── viewCount         │   │
        │  │   └── timestamps        │   │
        │  └─────────────────────────┘   │
        └─────────────────────────────────┘
```

---

## 📋 API Endpoints Reference

### 1️⃣ CREATE COURSE
```
POST /api/courses
Content-Type: application/json

{
  "title": "Advanced Excel for Data Entry",
  "category": "Computer Skills",
  "description": "Learn advanced Excel functions...",
  "youtubeLinks": [
    {
      "title": "Excel Basics",
      "url": "https://www.youtube.com/watch?v=..."
    }
  ],
  "instructor": "John Smith"  // Optional
}

Response: 201 Created
{
  "success": true,
  "data": { /* course object */ }
}
```

### 2️⃣ GET ALL COURSES
```
GET /api/courses?sortBy=newest&limit=10&page=1

Response: 200 OK
{
  "success": true,
  "data": [ /* array of courses */ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCourses": 25,
    "limit": 10
  }
}
```

### 3️⃣ GET BY CATEGORY
```
GET /api/courses/category/Computer%20Skills

Response: 200 OK
{
  "success": true,
  "data": [ /* array of courses */ ],
  "count": 5
}
```

### 4️⃣ GET COURSE BY ID
```
GET /api/courses/507f1f77bcf86cd799439011

Response: 200 OK
{
  "success": true,
  "data": { /* course object */ }
}

Note: Increments viewCount by 1
```

### 5️⃣ DELETE COURSE
```
DELETE /api/courses/507f1f77bcf86cd799439011

Response: 200 OK
{
  "success": true,
  "data": { /* course with isActive: false */ }
}

Note: Soft delete - data not removed
```

---

## ✅ Validation Rules

```
┌─────────────────────────────────────────────────┐
│               VALIDATION RULES                  │
├─────────────────────────────────────────────────┤
│                                                 │
│ Field         Required  Type      Constraints   │
│ ─────────────────────────────────────────────   │
│ title         ✅        string    5-100 chars   │
│ category      ✅        enum      3 options     │
│ description   ✅        string    20-1000 chars │
│ youtubeLinks  ✅        array     min 1 link    │
│ - title       ✅        string    3+ chars      │
│ - url         ✅        string    YouTube URL   │
│ instructor    ❌        string    optional      │
│                                                 │
└─────────────────────────────────────────────────┘

Categories (Enum):
  • Computer Skills
  • English Communication
  • Basic Math
```

---

## 📂 File Structure

```
backend/
│
├── src/
│   ├── models/
│   │   └── course.model.js          ← Database schema
│   │       ├── YouTube links sub-schema
│   │       ├── Field validation
│   │       ├── Database indexes
│   │       └── Timestamps
│   │
│   ├── controllers/
│   │   └── course.controller.js      ← Business logic
│   │       ├── createCourse()
│   │       ├── getAllCourses()
│   │       ├── getCoursesByCategory()
│   │       ├── getCourseById()
│   │       └── deleteCourse()
│   │
│   ├── routes/
│   │   └── course.routes.js          ← API endpoints
│   │       ├── POST /
│   │       ├── GET /
│   │       ├── GET /category/:category
│   │       ├── GET /:id
│   │       └── DELETE /:id
│   │
│   ├── validation/
│   │   └── course.validation.js      ← Joi schemas
│   │       ├── createCourseValidation
│   │       └── getCoursesByCategoryValidation
│   │
│   └── server.js                     ← Updated with routes
│
├── COURSE_API.md                     ← API Documentation
├── COURSE_MODULE_README.md           ← Setup Guide
├── COURSE_IMPLEMENTATION.md          ← This file
└── test-courses.js                   ← Test suite
```

---

## 🧪 Testing Commands

### Run Automated Test Suite
```bash
node test-courses.js
```

**Tests included:**
- ✅ Create 3 sample courses
- ✅ Get all courses
- ✅ Filter by category
- ✅ Get course by ID
- ✅ Pagination
- ✅ Invalid category rejection
- ✅ Duplicate prevention
- ✅ Invalid URL rejection
- ✅ Delete course

### Manual cURL Testing

**Create:**
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Excel","category":"Computer Skills","description":"Learn Excel functions for data entry work","youtubeLinks":[{"title":"Basics","url":"https://www.youtube.com/watch?v=example"}]}'
```

**Get All:**
```bash
curl http://localhost:5000/api/courses
```

**Get By Category:**
```bash
curl "http://localhost:5000/api/courses/category/Computer%20Skills"
```

**Get By ID:**
```bash
curl http://localhost:5000/api/courses/[COURSE_ID]
```

**Delete:**
```bash
curl -X DELETE http://localhost:5000/api/courses/[COURSE_ID]
```

---

## 🔄 Request/Response Flow

```
┌──────────────────────┐
│  Client Request      │
└──────────────┬───────┘
               │
               ▼
    ┌──────────────────────┐
    │  Express Routes      │
    │  /api/courses        │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Validate Input      │
    │  (Joi Schema)        │
    └──┬─────────────────┬─┘
       │                 │
    ✅ Valid        ❌ Invalid
       │                 │
       ▼                 ▼
    ┌──────────────  ┌──────────────┐
    │ Call Controller   Error Response│
    └──────────┬───   └──────────────┘
               │         Status: 400
               ▼
    ┌──────────────────────┐
    │ Query Database       │
    │ (Mongoose Model)     │
    └──┬─────────────────┬─┘
       │                 │
    ✅ Success    ❌ Error
       │                 │
       ▼                 ▼
    ┌──────────────  ┌──────────────┐
    │ Success        │ Error        │
    │ Response       │ Response     │
    │ Status: 200/201   Status: 500 │
    └──────────────  └──────────────┘
       │                 │
       └────────┬────────┘
                ▼
    ┌──────────────────────┐
    │  JSON Response       │
    │  sent to Client      │
    └──────────────────────┘
```

---

## 📊 Database Schema

```javascript
Course Collection:
{
  _id: ObjectId,                    // MongoDB ID
  
  // Required Fields
  title: String,                    // 5-100 chars
  category: String,                 // Enum: 3 options
  description: String,              // 20-1000 chars
  
  // YouTube Links Array
  youtubeLinks: [
    {
      title: String,                // Video title
      url: String                   // YouTube URL
    },
    // ... more links
  ],
  
  // Optional & Metadata
  instructor: String,               // Optional
  isActive: Boolean,                // true/false
  viewCount: Number,                // Increments on fetch
  
  // Timestamps
  createdAt: Date,                  // Auto
  updatedAt: Date                   // Auto
}
```

---

## 🔐 Error Handling

```
Status Code → Error Type → Response

200 OK
└── Get/List operations successful

201 Created
└── Create operation successful

400 Bad Request
├── Validation error
├── Invalid category
├── Missing required fields
└── Invalid YouTube URL

404 Not Found
└── Course doesn't exist

409 Conflict
└── Duplicate course in category

500 Internal Server Error
└── Database/Server error
```

---

## 💡 Key Code Snippets

### 1. Model Validation
```javascript
title: {
  type: String,
  required: [true, "Course title is required"],
  minlength: [5, "Title must be at least 5 characters"],
  maxlength: [100, "Title cannot exceed 100 characters"]
}
```

### 2. Joi Validation
```javascript
const schema = Joi.object({
  title: Joi.string().required().min(5).max(100),
  category: Joi.string().required().valid(...),
  // ...
});
const { error, value } = schema.validate(req.body);
```

### 3. Controller Logic
```javascript
const createCourse = async (req, res) => {
  try {
    const { error, value } = validate(req.body);
    if (error) return res.status(400).json({...});
    
    const course = await Course.create(value);
    return res.status(201).json({
      success: true,
      data: course
    });
  } catch (err) {
    return res.status(500).json({...});
  }
};
```

### 4. YouTube URL Validation
```javascript
const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//;

url: {
  validate: function(v) {
    return youtubeUrlRegex.test(v);
  }
}
```

---

## 📈 Performance Features

```
✅ Database Indexes
  └── category (for filtering)
  └── createdAt (for sorting)

✅ Pagination
  └── Default limit: 10
  └── Reduces memory
  └── Faster responses

✅ Soft Deletes
  └── Data preserved
  └── Quick recovery
  └── No fragmentation

✅ View Count Tracking
  └── Analytics
  └── Popular courses
  └── User engagement
```

---

## 🎓 What You Learned

✅ MongoDB Schema Design
✅ Mongoose Models
✅ Express.js REST APIs
✅ Joi Validation
✅ Error Handling
✅ HTTP Status Codes
✅ Pagination
✅ MVC Architecture
✅ Code Documentation
✅ API Testing

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| COURSE_API.md | Complete API reference |
| COURSE_MODULE_README.md | Setup & implementation guide |
| COURSE_IMPLEMENTATION.md | Summary & checklist |
| test-courses.js | Automated test suite |

---

## ✨ Ready to Use!

```
✅ Fully implemented
✅ Well documented
✅ Thoroughly tested
✅ Production ready
✅ Student project suitable
✅ Clean code
✅ Error handling
✅ Best practices
```

---

## 🚀 Next Steps

1. **Start Backend**
   ```bash
   npm run dev
   ```

2. **Run Tests**
   ```bash
   node test-courses.js
   ```

3. **Test Endpoints**
   - Use cURL or Postman
   - Follow COURSE_API.md
   - Check responses

4. **Integrate with Frontend**
   - Call /api/courses endpoints
   - Display courses
   - Create course form

5. **Enhance**
   - Add authentication
   - Add reviews/ratings
   - Add search
   - Add statistics

---

**Happy Learning! 🎓**
