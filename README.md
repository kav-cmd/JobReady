# JobReady

**JobReady** is an AI-powered vocational learning platform that helps students and job-seekers build practical, employment-ready skills. It combines structured video courses, a multilingual AI tutor, progress tracking, and a professional resume builder — all in one place.

---

## Features

- **Course Library** — Structured video courses across Computer Skills (Microsoft Office, Data Entry), English Communication, and Basic Math
- **AI Tutor** — Powered by LLaMA 3.1 (via Groq), generates quizzes, study notes, and answers doubts — in English, Hindi, Kannada, or Hinglish
- **Progress Tracking** — Track video completion and course progress with persistent storage
- **Resume Builder** — Build and export a PDF resume from your completed skills, with 3 template styles
- **Assessments** — Skills assessments to evaluate job readiness
- **Multilingual UI** — Full i18n support for English, Hindi, and Kannada
- **Authentication** — JWT-based auth with email OTP verification

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, shadcn/ui |
| Routing | React Router v6 |
| Data Fetching | TanStack React Query |
| Animations | Framer Motion |
| i18n | i18next |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Bcrypt |
| AI | Groq API (LLaMA 3.1 8B) |
| Email | Nodemailer |
| PDF Export | html2canvas + jsPDF |

---

## Project Structure

```
JobReady/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection, mock DB
│   │   ├── controllers/    # Auth, courses, AI, video progress
│   │   ├── middleware/     # JWT auth middleware
│   │   ├── models/         # User, Course, VideoProgress schemas
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # AI & Groq integration logic
│   │   └── server.js       # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Route-level page components
    │   ├── hooks/          # Custom React hooks
    │   ├── lib/            # Auth helpers, API clients, utilities
    │   └── i18n/           # Translation files (en, hi, kn)
    ├── .env.example
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas URI)
- A [Groq API key](https://console.groq.com) for AI features

### 1. Clone the repo

```bash
git clone https://github.com/vaanyaasingh/JobReady.git
cd JobReady
```

### 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/vocational
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=5001
NODE_ENV=development

# Groq AI (get key at console.groq.com)
LLAMA_API_KEY=your-groq-api-key
LLAMA_API_URL=https://api.groq.com/openai/v1
LLAMA_MODEL=llama-3.1-8b-instant

# Email (optional, for OTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

```bash
npm run dev     # starts on http://localhost:5001
```

### 3. Set up the frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

```bash
npm run dev     # starts on http://localhost:8080
```

---

## API Overview

Base URL: `http://localhost:5001/api`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |
| GET | `/auth/profile` | Get user profile (auth required) |
| PUT | `/auth/profile` | Update profile (auth required) |
| GET | `/courses` | List all courses |
| GET | `/courses/category/:category` | Filter courses by category |
| POST | `/ai/quiz` | Generate AI quiz for a topic |
| POST | `/ai/notes` | Generate study notes |
| POST | `/ai/doubt` | Get answer to a doubt |
| POST | `/ai/youtube-summary` | Summarize a YouTube video |
| POST | `/progress/video` | Mark video as complete (auth required) |
| GET | `/progress/course/:courseId` | Get course progress (auth required) |

---

## AI Tutor Request Format

```json
{
  "courseName": "Microsoft Skills",
  "topic": "Excel Formulas",
  "mode": "quiz",
  "language": "en",
  "userQuery": ""
}
```

`mode` can be `quiz`, `notes`, or `doubt`. `language` supports `en`, `hi`, `kn`, `hinglish`.

---

## License

MIT
