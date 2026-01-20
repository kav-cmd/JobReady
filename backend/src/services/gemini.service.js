import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with API key from environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const isPlaceholderKey = !GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here';
const genAI = !isPlaceholderKey ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Mock responses for development
const mockResponses = {
  quiz: [
    {
      "question": "What is the primary purpose of a Data Entry Specialist?",
      "options": ["To repair computers", "To input data into systems accurately", "To manage office security", "To design websites"],
      "correctAnswer": 1,
      "explanation": "Data Entry Specialists are responsible for transcribing and entering data into electronic systems with high precision."
    },
    {
      "question": "Which software is most commonly used for data organization and entry?",
      "options": ["Adobe Photoshop", "Microsoft Excel", "VLC Media Player", "Windows Media Player"],
      "correctAnswer": 1,
      "explanation": "Microsoft Excel is the industry standard for tabulating, organizing, and managing structured data."
    }
  ],
  notes: `### Key Principles of Professional Data Entry

- **Accuracy over Speed**: Always prioritize correct data input over fast typing.
- **Data Verification**: Double-check entries against source documents.
- **Ergonomics**: Maintain proper posture to prevent strain during long sessions.
- **Confidentiality**: Handle sensitive information according to privacy laws.
- **Shortcut Proficiency**: Use keyboard shortcuts to improve efficiency safely.`,
  doubt: `Data entry requires attention to detail. Common software used includes spreadsheets like Excel or Google Sheets, and database management systems. Accuracy is crucial because errors in data can lead to significant business mistakes downstream.`
};

/**
 * Get the Gemini Pro model
 */
const getModel = () => {
  if (isPlaceholderKey) return null;
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

/**
 * Generate a prompt based on the mode (quiz, notes, or doubt)
 */
const generatePrompt = (courseName, topic, userQuery, mode) => {
  const basePrompt = `You are an expert AI tutor for vocational education. 
You are teaching a course on "${courseName}".
Topic: "${topic}"
Use simple, easy-to-understand language suitable for students learning practical skills.`;

  switch (mode) {
    case 'quiz':
      return `${basePrompt}

Generate exactly 5 multiple choice questions (MCQs) about "${topic}" from the "${courseName}" course.
For each question, provide:
1. The question
2. Option A
3. Option B
4. Option C
5. Option D
6. Correct answer with brief explanation

Format your response as a valid JSON array like this:
[
  {
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this is correct"
  }
]`;

    case 'notes':
      return `${basePrompt}

Generate short, bullet-point notes about "${topic}" from the "${courseName}" course.
Keep it concise - maximum 5-7 main points with sub-points.
Focus on practical, job-relevant information.

Format as bullet points with proper hierarchy.`;

    case 'doubt':
      return `${basePrompt}

Student's doubt/question: "${userQuery}"

Answer this doubt clearly and concisely. Include:
1. Direct answer
2. 1-2 practical examples
3. Key takeaway

Keep the answer to 2-3 paragraphs maximum.`;

    default:
      return basePrompt;
  }
};

/**
 * Call Gemini API to generate content
 */
export const callGeminiAPI = async (courseName, topic, userQuery, mode) => {
  try {
    // Validate inputs
    if (!courseName || !topic || !mode) {
      throw new Error('Missing required parameters: courseName, topic, and mode');
    }

    if (!['quiz', 'notes', 'doubt'].includes(mode)) {
      throw new Error('Invalid mode. Must be one of: quiz, notes, doubt');
    }

    if (mode === 'doubt' && !userQuery) {
      throw new Error('User query is required for doubt resolution mode');
    }

    // Generate prompt based on mode
    const prompt = generatePrompt(courseName, topic, userQuery || '', mode);

    // Generate content using Gemini API
    let text;
    if (isPlaceholderKey) {
      console.warn('⚠️ Gemini API key is placeholder. Using mock response.');
      text = mode === 'quiz' ? JSON.stringify(mockResponses.quiz) : mockResponses[mode];
    } else {
      const model = getModel();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
    }

    // Parse JSON responses for quiz mode
    let parsedContent = text;
    if (mode === 'quiz') {
      try {
        // Try to extract JSON from the response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error('Error parsing quiz JSON:', parseError);
        // Return raw text if JSON parsing fails
        parsedContent = text;
      }
    }

    return {
      success: true,
      content: parsedContent,
      mode: mode,
      metadata: {
        courseName,
        topic,
        generatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

/**
 * Validate Gemini API connection
 */
export const validateGeminiConnection = async () => {
  if (isPlaceholderKey) {
    return {
      success: true,
      message: 'Gemini API is running in MOCK mode (placeholder key detected)'
    };
  }
  try {
    const model = getModel();
    if (!model) throw new Error('Model initialization failed');

    // Simple test call
    const result = await model.generateContent('Say "Hello" in one word.');
    const response = await result.response;

    return {
      success: true,
      message: 'Gemini API connection successful'
    };
  } catch (error) {
    console.error('Gemini API Connection Error:', error);
    return {
      success: false,
      message: error.message || 'Failed to connect to Gemini API'
    };
  }
};

export default {
  callGeminiAPI,
  validateGeminiConnection
};
