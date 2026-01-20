/**
 * Groq (OpenAI-compatible) chat completions helper.
 *
 * Env:
 * - LLAMA_API_KEY
 * - LLAMA_API_URL (e.g. https://api.groq.com/openai/v1)
 * - LLAMA_MODEL (e.g. llama-3.1-8b-instant)
 */

const getLlamaConfig = () => {
  const apiKey = process.env.LLAMA_API_KEY;
  const apiUrl = process.env.LLAMA_API_URL;
  const model = process.env.LLAMA_MODEL;

  return { apiKey, apiUrl, model };
};

export const isLlamaConfigured = () => {
  const { apiKey, apiUrl, model } = getLlamaConfig();
  const configured = Boolean(apiKey && apiUrl && model);
  if (!configured) {
    console.error('[Groq Config] Missing required env vars:', {
      hasKey: !!apiKey,
      hasUrl: !!apiUrl,
      hasModel: !!model
    });
  }
  return configured;
};

export const callLlamaChat = async ({ system, user, temperature = 0.2 }) => {
  const { apiKey, apiUrl, model } = getLlamaConfig();

  if (!apiKey || !apiUrl || !model) {
    const err = new Error(
      'Groq API is not configured. Please set LLAMA_API_KEY, LLAMA_API_URL, and LLAMA_MODEL in your .env file.'
    );
    console.error('[Groq] Configuration Error:', err.message);
    throw err;
  }

  const url = `${apiUrl.replace(/\/$/, '')}/chat/completions`;

  console.log('[Groq] Sending request to:', url.replace(apiKey, '***'), { model, temperature });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        temperature,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          { role: 'user', content: user }
        ]
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg =
        data?.error?.message ||
        data?.message ||
        `Groq request failed with status ${res.status}`;
      console.error('[Groq] API Error:', { status: res.status, message: msg, data });
      throw new Error(msg);
    }

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      console.error('[Groq] Empty response:', data);
      throw new Error('Groq returned an empty response.');
    }

    console.log('[Groq] Response received, length:', text.length);
    return text;
  } catch (error) {
    console.error('[Groq] Fetch Error:', error instanceof Error ? error.message : error);
    throw error;
  }
};

