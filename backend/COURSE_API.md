# Course Module API Documentation

## Overview
The Course Module provides REST APIs to manage vocational courses with YouTube video content for an e-learning platform. Supports three vocational categories with full CRUD operations.

---

## Base URL
```
http://localhost:5000/api/courses
```

---

## Vocational Categories
- `Computer Skills`
- `English Communication`
- `Basic Math`

---

## API Endpoints

### 1. CREATE A NEW COURSE
**POST** `/api/courses`

Creates a new vocational course with YouTube video links.

#### Request Body
```json
{
  "title": "Advanced Excel for Data Entry",
  "category": "Computer Skills",
  "description": "Learn advanced Excel functions and features for efficient data entry and analysis. This comprehensive course covers formulas, pivot tables, and data visualization.",
  "youtubeLinks": [
    {
      "title": "Excel Basics",
      "url": "https://www.youtube.com/watch?v=example1"
    },
    {
      "title": "Pivot Tables Tutorial",
      "url": "https://www.youtube.com/watch?v=example2"
    }
  ],
  "instructor": "John Smith"
}
```

#### Request Validation
- **title**: String, 5-100 characters (required)
- **category**: Enum (required) - one of: "Computer Skills", "English Communication", "Basic Math"
- **description**: String, 20-1000 characters (required)
- **youtubeLinks**: Array of objects (required) - minimum 1 link
  - **title**: String, min 3 characters (required)
  - **url**: Valid YouTube URL (required)
- **instructor**: String (optional)

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Advanced Excel for Data Entry",
    "category": "Computer Skills",
    "description": "Learn advanced Excel functions...",
    "youtubeLinks": [
      {
        "title": "Excel Basics",
        "url": "https://www.youtube.com/watch?v=example1"
      },
      {
        "title": "Pivot Tables Tutorial",
        "url": "https://www.youtube.com/watch?v=example2"
      }
    ],
    "instructor": "John Smith",
    "isActive": true,
    "viewCount": 0,
    "createdAt": "2024-01-17T10:30:00Z",
    "updatedAt": "2024-01-17T10:30:00Z"
  }
}
```

#### Error Responses
**400 Bad Request** - Validation Failed
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title must be at least 5 characters long",
    "Please provide a valid YouTube URL"
  ]
}
```

**409 Conflict** - Course Already Exists
```json
{
  "success": false,
  "message": "A course with this title already exists in this category"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Error creating course",
  "error": "Database connection error"
}
```

---

### 2. GET ALL COURSES
**GET** `/api/courses`

Retrieves all active courses with pagination support.

#### Query Parameters
- **sortBy**: `"newest"` (default) | `"oldest"` - Sort order
- **limit**: Number (default: 10) - Courses per page
- **page**: Number (default: 1) - Page number

#### Example Request
```
GET /api/courses?sortBy=newest&limit=5&page=1
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Courses fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Advanced Excel for Data Entry",
      "category": "Computer Skills",
      "description": "Learn advanced Excel functions...",
      "youtubeLinks": [...],
      "instructor": "John Smith",
      "isActive": true,
      "viewCount": 15,
      "createdAt": "2024-01-17T10:30:00Z",
      "updatedAt": "2024-01-17T10:30:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "English Communication for Workplace",
      "category": "English Communication",
      "description": "Improve your English speaking and writing skills...",
      "youtubeLinks": [...],
      "instructor": "Jane Doe",
      "isActive": true,
      "viewCount": 32,
      "createdAt": "2024-01-16T14:20:00Z",
      "updatedAt": "2024-01-16T14:20:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCourses": 12,
    "limit": 5
  }
}
```

#### Error Response (500)
```json
{
  "success": false,
  "message": "Error fetching courses",
  "error": "Database connection error"
}
```

---

### 3. GET COURSES BY CATEGORY
**GET** `/api/courses/category/:category`

Retrieves all courses for a specific vocational category.

#### URL Parameters
- **category**: String (required) - One of: "Computer Skills", "English Communication", "Basic Math"

#### Query Parameters
- **sortBy**: `"newest"` (default) | `"oldest"`
- **limit**: Number (default: 10)

#### Example Request
```
GET /api/courses/category/Computer%20Skills?sortBy=newest&limit=5
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Computer Skills courses fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Advanced Excel for Data Entry",
      "category": "Computer Skills",
      "description": "Learn advanced Excel functions...",
      "youtubeLinks": [...],
      "instructor": "John Smith",
      "isActive": true,
      "viewCount": 15,
      "createdAt": "2024-01-17T10:30:00Z",
      "updatedAt": "2024-01-17T10:30:00Z"
    }
  ],
  "count": 1
}
```

#### Error Responses
**400 Bad Request** - Invalid Category
```json
{
  "success": false,
  "message": "Invalid category. Must be one of: Computer Skills, English Communication, or Basic Math"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Error fetching courses",
  "error": "Database connection error"
}
```

---

### 4. GET COURSE BY ID
**GET** `/api/courses/:id`

Retrieves a specific course by its ID. Also increments the view count.

#### URL Parameters
- **id**: MongoDB ObjectId (required) - 24-character hex string

#### Example Request
```
GET /api/courses/507f1f77bcf86cd799439011
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Course fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Advanced Excel for Data Entry",
    "category": "Computer Skills",
    "description": "Learn advanced Excel functions...",
    "youtubeLinks": [
      {
        "title": "Excel Basics",
        "url": "https://www.youtube.com/watch?v=example1"
      }
    ],
    "instructor": "John Smith",
    "isActive": true,
    "viewCount": 16,
    "createdAt": "2024-01-17T10:30:00Z",
    "updatedAt": "2024-01-17T10:35:00Z"
  }
}
```

#### Error Responses
**400 Bad Request** - Invalid ID Format
```json
{
  "success": false,
  "message": "Invalid course ID format"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Course not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Error fetching course",
  "error": "Database connection error"
}
```

---

### 5. DELETE COURSE
**DELETE** `/api/courses/:id`

Soft deletes a course (marks as inactive instead of permanent deletion).

#### URL Parameters
- **id**: MongoDB ObjectId (required) - 24-character hex string

#### Example Request
```
DELETE /api/courses/507f1f77bcf86cd799439011
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Course deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Advanced Excel for Data Entry",
    "category": "Computer Skills",
    "description": "Learn advanced Excel functions...",
    "youtubeLinks": [...],
    "instructor": "John Smith",
    "isActive": false,
    "viewCount": 16,
    "createdAt": "2024-01-17T10:30:00Z",
    "updatedAt": "2024-01-17T10:40:00Z"
  }
}
```

#### Error Responses
**400 Bad Request** - Invalid ID Format
```json
{
  "success": false,
  "message": "Invalid course ID format"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Course not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Error deleting course",
  "error": "Database connection error"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

---

## Example cURL Requests

### Create a Course
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Excel for Data Entry",
    "category": "Computer Skills",
    "description": "Learn advanced Excel functions and features for efficient data entry and analysis.",
    "youtubeLinks": [
      {
        "title": "Excel Basics",
        "url": "https://www.youtube.com/watch?v=example1"
      }
    ],
    "instructor": "John Smith"
  }'
```

### Get All Courses
```bash
curl -X GET "http://localhost:5000/api/courses?sortBy=newest&limit=5"
```

### Get Courses by Category
```bash
curl -X GET "http://localhost:5000/api/courses/category/Computer%20Skills"
```

### Get Course by ID
```bash
curl -X GET "http://localhost:5000/api/courses/507f1f77bcf86cd799439011"
```

### Delete Course
```bash
curl -X DELETE "http://localhost:5000/api/courses/507f1f77bcf86cd799439011"
```

---

## File Structure
```
backend/
├── src/
│   ├── models/
│   │   └── course.model.js           # Mongoose schema
│   ├── controllers/
│   │   └── course.controller.js      # Business logic
│   ├── routes/
│   │   └── course.routes.js          # API endpoints
│   ├── validation/
│   │   └── course.validation.js      # Joi validation schemas
│   └── server.js                     # Main app file
```

---

## Notes

1. **Soft Delete**: Courses are soft deleted (marked as `isActive: false`) rather than permanently removed from the database.
2. **View Count**: Increments by 1 each time a course is fetched by ID.
3. **YouTube URL Validation**: Only valid YouTube URLs are accepted.
4. **Category Enum**: Ensures data consistency by restricting categories to predefined values.
5. **Pagination**: Default limit is 10 courses per page.
6. **Timestamps**: All courses automatically have `createdAt` and `updatedAt` fields.

---

## Testing the APIs

You can test these endpoints using:
- **Postman** - REST client GUI
- **Thunder Client** - VS Code extension
- **cURL** - Command line tool
- **Insomnia** - REST API client

---

## Student Project Notes

This course module is designed for a student project with:
- ✅ Clean, well-commented code
- ✅ Proper error handling
- ✅ Data validation using Joi
- ✅ MongoDB integration with Mongoose
- ✅ RESTful API design principles
- ✅ Comprehensive documentation
- ✅ ES6 module syntax
- ✅ Production-ready structure
