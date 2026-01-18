# Video Completion Tracking System - API Documentation

## Overview
This system tracks user's video completion progress for courses. Videos can be marked as completed, and course progress is automatically calculated.

## Database Schema

### VideoProgress Collection
```javascript
{
  userId: ObjectId,           // Reference to User
  courseId: String,           // Course ID (e.g., "course-001")
  videoId: String,            // Video ID (e.g., "excel-beginner")
  completed: Boolean,         // Completion status
  completedAt: Date,          // Timestamp when completed
  watchDuration: Number,      // Watch time in seconds (optional)
  totalDuration: Number,      // Total video duration in seconds (optional)
  createdAt: Date,            // Record creation timestamp
  updatedAt: Date             // Record update timestamp
}
```

**Indexes:**
- `userId` (indexed for fast lookups)
- `courseId` (indexed for filtering by course)
- `completed` (indexed for filtering completed videos)
- `{ userId, courseId, videoId }` (unique compound index - prevents duplicates)

## API Endpoints

### 1. Mark Video as Completed
**POST** `/api/progress/video`

**Request:**
```json
{
  "courseId": "course-001",
  "videoId": "excel-beginner"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Video marked as completed",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "courseId": "course-001",
    "videoId": "excel-beginner",
    "completed": true,
    "completedAt": "2025-01-18T10:30:00.000Z",
    "createdAt": "2025-01-18T10:30:00.000Z",
    "updatedAt": "2025-01-18T10:30:00.000Z"
  }
}
```

**Error Cases:**
- Missing `courseId` or `videoId`: 400 Bad Request
- User not authenticated: 401 Unauthorized
- Database error: 500 Internal Server Error

---

### 2. Get Course Progress
**GET** `/api/progress/course/:courseId`

**Parameters:**
- `courseId` (path) - Course identifier

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "courseId": "course-001",
    "totalVideos": 9,
    "completedVideos": 3,
    "completionPercentage": 33,
    "videos": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "videoId": "excel-beginner",
        "completed": true,
        "completedAt": "2025-01-18T10:30:00.000Z"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "videoId": "word-beginner",
        "completed": false,
        "completedAt": null
      }
    ]
  }
}
```

**Use Cases:**
- Display course progress bar
- Show "3/9 videos completed"
- Calculate course completion percentage

---

### 3. Get Video Status
**GET** `/api/progress/video/:courseId/:videoId`

**Parameters:**
- `courseId` (path) - Course identifier
- `videoId` (path) - Video identifier

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "courseId": "course-001",
    "videoId": "excel-beginner",
    "completed": true,
    "completedAt": "2025-01-18T10:30:00.000Z"
  }
}
```

**Use Cases:**
- Check if video is already completed (before showing button)
- Display "✓ Completed" badge
- Disable completion button for completed videos

---

### 4. Get Completed Videos
**GET** `/api/progress/completed/:courseId`

**Parameters:**
- `courseId` (path) - Course identifier

**Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "videoId": "excel-beginner",
      "completed": true,
      "completedAt": "2025-01-18T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "videoId": "word-beginner",
      "completed": true,
      "completedAt": "2025-01-18T10:35:00.000Z"
    }
  ],
  "count": 2
}
```

---

### 5. Initialize Course Videos
**POST** `/api/progress/initialize`

**Request:**
```json
{
  "courseId": "course-001",
  "videos": ["excel-beginner", "word-beginner", "ppt-beginner", ...]
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Video progress initialized for course",
  "data": {
    "acknowledged": true,
    "upsertedCount": 9,
    "modifiedCount": 0
  }
}
```

**Use Cases:**
- Initialize progress tracking when course is first accessed
- Bulk create video tracking records for new courses
- Prevent "video not found" errors later

---

## Data Flow

### Mark Video as Completed
```
Frontend (Learning.tsx)
    ↓
User clicks "Mark as Completed"
    ↓
VideoCompletionCheckbox component
    ↓
markVideoCompleted() API call
    ↓
POST /api/progress/video
    ↓
Backend VideoProgress Controller
    ↓
VideoProgress.markVideoCompleted()
    ↓
MongoDB Update/Upsert
    ↓
Response: { success: true, data: videoProgress }
    ↓
Frontend: Update UI, show toast, disable button
```

### Get Course Progress
```
Frontend (Dashboard.tsx, Learning.tsx)
    ↓
Component mounts / Course loads
    ↓
getCourseProgress(courseId) API call
    ↓
GET /api/progress/course/:courseId
    ↓
Backend Controller
    ↓
VideoProgress.getCourseProgress()
    ↓
MongoDB Query: Find all videos for this course
    ↓
Calculate: totalVideos, completedVideos, percentage
    ↓
Response: { success: true, data: { totalVideos, completedVideos, completionPercentage } }
    ↓
Frontend: Display progress bar (3/9), percentage, completion status
```

---

## Frontend Integration

### 1. Video Completion Button
```typescript
import { VideoCompletionCheckbox } from "@/components/VideoCompletionButton";

<VideoCompletionCheckbox 
  courseId="course-001"
  videoId="excel-beginner"
  onCompleted={() => {
    // Refresh progress
    getCourseProgress("course-001");
  }}
/>
```

### 2. API Service
```typescript
import { 
  markVideoCompleted,
  getCourseProgress,
  getVideoStatus,
  getCompletedVideos
} from "@/lib/videoProgressApi";

// Mark video completed
await markVideoCompleted("course-001", "excel-beginner");

// Get progress
const progress = await getCourseProgress("course-001");
console.log(`${progress.data.completedVideos}/${progress.data.totalVideos} completed`);

// Check status
const status = await getVideoStatus("course-001", "excel-beginner");
if (status.data.completed) {
  // Show completed badge
}
```

---

## Logic Rules

### 1. Video Can Only Be Marked Completed Once
- Unique compound index prevents duplicate entries
- Attempting to mark a completed video again returns the existing record
- Button is disabled after first completion

### 2. Completion Must Be Tied to Authenticated User
- All endpoints require `verifyToken` middleware
- `userId` extracted from `req.user._id` or `req.user.id`
- No completion without valid authentication token

### 3. Prevent Duplicate Entries
- Unique index: `{ userId: 1, courseId: 1, videoId: 1 }`
- MongoDB `upsert` prevents duplicates automatically
- Multiple mark attempts update `completedAt` timestamp

### 4. No Data Loss on Errors
- Already completed videos stay completed
- Failed API calls don't change database state
- Transactional consistency maintained

---

## Error Handling

### Error Scenarios

| Scenario | Status | Message |
|----------|--------|---------|
| Missing courseId/videoId | 400 | "courseId and videoId are required" |
| User not authenticated | 401 | "User not authenticated" |
| Database connection error | 500 | "Error marking video as completed" |
| Invalid courseId | 500 | "Error fetching course progress" |

---

## Example Usage Workflow

### Scenario: User Completes a Video
```
1. User clicks "Mark as Completed" on Excel Beginner video
   
2. Frontend calls: markVideoCompleted("course-001", "excel-beginner")
   
3. Backend saves to MongoDB:
   {
     userId: "user123",
     courseId: "course-001",
     videoId: "excel-beginner",
     completed: true,
     completedAt: "2025-01-18T10:30:00.000Z"
   }
   
4. Frontend shows:
   ✓ Completed badge
   Disables "Mark as Completed" button
   Toast: "Great! 🎉 Video marked as completed."
   
5. Dashboard updates progress:
   Excel Beginner module: 1/3 videos completed
   Course-001: 1/9 videos completed
```

---

## Performance Considerations

1. **Indexing**: Compound index `(userId, courseId, videoId)` ensures O(1) lookups
2. **Bulk Operations**: `initializeCourseVideos()` uses `bulkWrite()` for efficiency
3. **Query Optimization**: Selective field retrieval avoids unnecessary data transfer
4. **Pagination**: Can be added to `getCompletedVideos()` for large courses

---

## Future Enhancements

1. **Watch Duration Tracking**: Store actual watch time
2. **Batch Completion**: Mark multiple videos as completed in one request
3. **Progress Notifications**: Alert user when course reaches 50%, 100% completion
4. **Leaderboards**: Track fastest completions per course
5. **Statistics**: Analytics on most/least completed videos
