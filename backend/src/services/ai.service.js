import { callLlamaChat, isLlamaConfigured } from './llama.service.js';

const LANGUAGE_MAP = {
  en: { label: 'English', instruction: 'Respond in English.' },
  hi: { label: 'Hindi', instruction: 'Respond in Hindi (Devanagari script).' },
  kn: { label: 'Kannada', instruction: 'Respond in Kannada (ಕನ್ನಡ).' },
  hinglish: { label: 'Hinglish', instruction: 'Respond in Hinglish (Hindi written in English letters).' }
};

export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_MAP);

const getLanguageInstruction = (language) => {
  const key = LANGUAGE_MAP[language] ? language : 'en';
  return LANGUAGE_MAP[key].instruction;
};

const generateTutorPrompt = ({ courseName, topic, userQuery, mode, language }) => {
  const basePrompt = `You are an expert AI tutor for vocational education.
You are teaching a course on "${courseName}".
Topic: "${topic}"
Use simple, easy-to-understand language suitable for students learning practical skills.
${getLanguageInstruction(language)}`;

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

const parseQuizJsonIfPossible = (text) => {
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return text;
    return JSON.parse(jsonMatch[0]);
  } catch {
    return text;
  }
};

export const generateTutorContent = async ({ courseName, topic, userQuery, mode, language }) => {
  if (!isLlamaConfigured()) {
    const err = new Error(
      'AI Tutor service failed: Groq API is not configured. Please set LLAMA_API_KEY, LLAMA_API_URL, and LLAMA_MODEL in your .env file.'
    );
    console.error('[AI Tutor] Config Error:', err.message);
    throw err;
  }

  console.log('[AI Tutor] Generating content:', { courseName, topic, mode, language });

  try {
    const prompt = generateTutorPrompt({ courseName, topic, userQuery: userQuery || '', mode, language });
    const text = await callLlamaChat({
    system: 'You are a helpful, accurate tutor. Follow the user’s requested output format strictly.',
    user: prompt,
    temperature: 0.2
  });

    const content = mode === 'quiz' ? parseQuizJsonIfPossible(text) : text;

    console.log('[AI Tutor] Content generated successfully for mode:', mode);

    return {
      success: true,
      content,
      mode,
      metadata: {
        courseName,
        topic,
        language: language && LANGUAGE_MAP[language] ? language : 'en',
        provider: 'groq',
        generatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('[AI Tutor] Generation failed:', error instanceof Error ? error.message : error);
    throw error;
  }
};

const extractYouTubeId = (input) => {
  if (!input) return null;

  // If it's already an ID-like string
  if (/^[a-zA-Z0-9_-]{8,20}$/.test(input) && !input.includes('http')) return input;

  try {
    const u = new URL(input);
    if (u.hostname === 'youtu.be') return u.pathname.replace('/', '') || null;
    if (u.hostname.endsWith('youtube.com')) return u.searchParams.get('v');
  } catch {
    return null;
  }

  return null;
};

const fetchYouTubeOEmbed = async (youtubeUrl) => {
  const u = new URL('https://www.youtube.com/oembed');
  u.searchParams.set('format', 'json');
  u.searchParams.set('url', youtubeUrl);

  const res = await fetch(u.toString());
  if (!res.ok) return null;
  return await res.json().catch(() => null);
};

export const generateYouTubeSummary = async ({ youtubeUrl, youtubeId, title, language }) => {
  if (!isLlamaConfigured()) {
    const err = new Error(
      'YouTube Summary failed: Groq API is not configured. Please set LLAMA_API_KEY, LLAMA_API_URL, and LLAMA_MODEL in your .env file.'
    );
    console.error('[YouTube Summary] Config Error:', err.message);
    throw err;
  }

  console.log('[YouTube Summary] Generating summary for:', { youtubeId, youtubeUrl, title });

  try {
    const id = youtubeId || extractYouTubeId(youtubeUrl);
    if (!id) {
      throw new Error('Invalid YouTube link or ID.');
    }

    const canonicalUrl = `https://www.youtube.com/watch?v=${id}`;
    let resolvedTitle = title;

    if (!resolvedTitle) {
      console.log('[YouTube Summary] Fetching title from oEmbed...');
      const oembed = await fetchYouTubeOEmbed(canonicalUrl);
      if (oembed?.title) resolvedTitle = oembed.title;
    }

    const prompt = `Create a short AI study summary for the YouTube video below.
Video title: "${resolvedTitle || 'Unknown title'}"
Video link: ${canonicalUrl}

${getLanguageInstruction(language)}

Output format (strict):
- 1 short paragraph summary (2-3 sentences)
- 5 bullet key takeaways
- 3 short "Ask your tutor" questions the student can ask next

Do not invent facts about the video. If details are unknown, keep it general and based on the title.`;

    const text = await callLlamaChat({
      system: 'You generate concise, student-friendly learning summaries.',
      user: prompt,
      temperature: 0.2
    });

    console.log('[YouTube Summary] Summary generated successfully');

    return {
      success: true,
      content: text,
      metadata: {
        youtubeId: id,
        youtubeUrl: canonicalUrl,
        title: resolvedTitle || null,
        language: language && LANGUAGE_MAP[language] ? language : 'en',
        provider: 'groq',
        generatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('[YouTube Summary] Generation failed:', error instanceof Error ? error.message : error);
    throw error;
  }
};

export const validateAIConnection = async () => {
  if (!isLlamaConfigured()) {
    return {
      success: false,
      message: 'Groq is not configured. Please set LLAMA_API_KEY, LLAMA_API_URL, and LLAMA_MODEL.',
      provider: 'groq'
    };
  }

  try {
    const text = await callLlamaChat({
      system: 'Return a single word.',
      user: 'Say "Hello" in one word.',
      temperature: 0
    });
    return { success: true, message: 'Groq connection successful', provider: 'groq', sample: text };
  } catch (e) {
    return { success: false, message: e?.message || 'Failed to connect to Groq', provider: 'groq' };
  }
};

