# AI Tutor API Documentation

## Overview
The AI Tutor service integrates Google's Gemini API to provide intelligent tutoring capabilities for vocational learning. It can generate quizzes, create study notes, and answer student doubts.

## Setup Instructions

### 1. Get Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Click "Create API Key"
3. Copy the API key

### 2. Configure Environment
Add your API key to `.env`:
```
GEMINI_API_KEY=your_api_key_here
```

### 3. Test Connection
```bash
curl http://localhost:5000/api/ai/health
```

## API Endpoints

### 1. Main AI Tutor Endpoint
**POST** `/api/ai/tutor`

Generate content in any mode (quiz, notes, or doubt resolution).

**Request Body:**
```json
{
  "courseName": "Data Entry Specialist",
  "topic": "Keyboard Shortcuts",
  "userQuery": "How to use Ctrl+Z?",
  "mode": "quiz"
}
```

**Parameters:**
- `courseName` (string, required): Name of the vocational course
- `topic` (string, required): Topic within the course
- `userQuery` (string, optional): Student's question (required for "doubt" mode)
- `mode` (string, required): One of `"quiz"`, `"notes"`, or `"doubt"`

**Response (Success):**
```json
{
  "success": true,
  "content": [...],
  "mode": "quiz",
  "metadata": {
    "courseName": "Data Entry Specialist",
    "topic": "Keyboard Shortcuts",
    "generatedAt": "2026-01-17T12:34:56.789Z"
  }
}
```

---

### 2. Generate Quiz
**POST** `/api/ai/quiz`

Generate 5 multiple-choice questions for a topic.

**Request Body:**
```json
{
  "courseName": "Data Entry Specialist",
  "topic": "Keyboard Shortcuts"
}
```

**Response:**
```json
{
  "success": true,
  "content": [
    {
      "question": "Which keyboard shortcut is used to undo?",
      "options": ["Ctrl+Z", "Ctrl+Y", "Ctrl+A", "Ctrl+D"],
      "correctAnswer": 0,
      "explanation": "Ctrl+Z is the standard shortcut for undo in most applications."
    },
    ...
  ],
  "mode": "quiz",
  "metadata": {...}
}
```

---

### 3. Generate Notes
**POST** `/api/ai/notes`

Generate concise bullet-point notes for studying.

**Request Body:**
```json
{
  "courseName": "Data Entry Specialist",
  "topic": "Keyboard Shortcuts"
}
```

**Response:**
```json
{
  "success": true,
  "content": "# Keyboard Shortcuts\n\n• **Ctrl+C** - Copy selected text\n• **Ctrl+X** - Cut selected text\n• **Ctrl+Z** - Undo last action\n• **Ctrl+Y** - Redo last action\n• **Alt+Tab** - Switch between windows",
  "mode": "notes",
  "metadata": {...}
}
```

---

### 4. Resolve Doubt
**POST** `/api/ai/doubt`

Answer specific student questions about a topic.

**Request Body:**
```json
{
  "courseName": "Data Entry Specialist",
  "topic": "Keyboard Shortcuts",
  "userQuery": "How can I efficiently use keyboard shortcuts to increase typing speed?"
}
```

**Response:**
```json
{
  "success": true,
  "content": "Keyboard shortcuts are essential for improving typing efficiency. Here's how to use them effectively:\n\n1. **Start with basics** - Learn the most common shortcuts like Ctrl+C (copy), Ctrl+X (cut), and Ctrl+V (paste). These are used in nearly every application.\n\n2. **Practice regularly** - Set aside time each day to practice. Try to use shortcuts instead of clicking the mouse. This muscle memory will develop naturally over time.\n\n3. **Focus on one set at a time** - Don't try to learn all shortcuts at once. Master one set (like editing shortcuts) before moving to another.\n\nExample: Instead of clicking Edit > Copy, use Ctrl+C. This saves approximately 2-3 seconds per action, which adds up when you're entering data throughout the day.",
  "mode": "doubt",
  "metadata": {...}
}
```

---

### 5. Health Check
**GET** `/api/ai/health`

Check if the AI service is operational.

**Response:**
```json
{
  "success": true,
  "message": "AI Tutor service is operational",
  "service": "gemini-ai"
}
```

---

## Error Handling

### Missing API Key
```json
{
  "success": false,
  "message": "Gemini API is not configured. Please add GEMINI_API_KEY to environment variables."
}
```

### Invalid Mode
```json
{
  "success": false,
  "message": "Mode must be one of: quiz, notes, doubt"
}
```

### Missing Query for Doubt Mode
```json
{
  "success": false,
  "message": "User query is required to resolve a doubt"
}
```

### API Connection Error
```json
{
  "success": false,
  "message": "Gemini API is not configured..."
}
```

---

## Vocational Courses Examples

The system works with any vocational course. Common examples include:

- Data Entry Specialist
- Customer Service Representative
- Office Assistant
- Retail Sales Associate
- Bank Teller
- Receptionist
- Accounting Assistant
- Medical Assistant
- IT Support Specialist

---

## Usage Examples

### cURL Examples

#### Generate Quiz
```bash
curl -X POST http://localhost:5000/api/ai/quiz \
  -H "Content-Type: application/json" \
  -d '{
    "courseName": "Data Entry Specialist",
    "topic": "Keyboard Shortcuts"
  }'
```

#### Resolve a Doubt
```bash
curl -X POST http://localhost:5000/api/ai/doubt \
  -H "Content-Type: application/json" \
  -d '{
    "courseName": "Data Entry Specialist",
    "topic": "Keyboard Shortcuts",
    "userQuery": "What is the fastest way to copy and paste text?"
  }'
```

#### Generate Notes
```bash
curl -X POST http://localhost:5000/api/ai/notes \
  -H "Content-Type: application/json" \
  -d '{
    "courseName": "Customer Service",
    "topic": "Handling Difficult Customers"
  }'
```

---

## Response Formats

### Quiz Response
- Returns structured JSON array with:
  - `question`: The MCQ question
  - `options`: Array of 4 answer options
  - `correctAnswer`: Index of correct option (0-3)
  - `explanation`: Why this answer is correct

### Notes Response
- Returns formatted markdown/bullet-point text
- Easy to read and copy
- Suitable for studying

### Doubt Response
- Returns comprehensive explanation
- Includes practical examples
- Clear and concise

---

## Best Practices

1. **Rate Limiting**: Implement rate limiting in production to prevent API abuse
2. **Caching**: Cache frequently requested content to reduce API calls
3. **Error Handling**: Always check the `success` field before processing `content`
4. **User Feedback**: Provide feedback to users while waiting for API response
5. **Topic Specificity**: Use specific topic names for better responses

---

## Troubleshooting

### Issue: "API key is not configured"
- Solution: Add GEMINI_API_KEY to .env file and restart server

### Issue: Empty or irrelevant responses
- Solution: Use more specific topic names and course names

### Issue: API timeout
- Solution: Check internet connection and Gemini API status

---

## Technical Details

- **Model**: Google Generative AI - gemini-pro
- **Language**: JavaScript/Node.js
- **Framework**: Express.js
- **Database**: MongoDB (for storing user progress, not AI responses)

---

## Security Notes

- Store API key securely in environment variables
- Never commit .env file to version control
- Implement authentication middleware for production
- Add rate limiting for public APIs
- Monitor API usage and costs

---

## Future Enhancements

- [ ] Response caching
- [ ] User progress tracking
- [ ] Personalized difficulty levels
- [ ] Audio responses
- [ ] Multi-language support
- [ ] Real-time response streaming
- [ ] User performance analytics

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify Gemini API configuration
3. Check server logs for detailed error messages
