/**
 * OpenAI client wrapper with streaming support.
 * Sends the chat completion request and streams deltas back to the caller.
 */

import { SYSTEM_PROMPT, buildUserPrompt } from './prompt.js';

/**
 * Streams an OpenAI chat completion, invoking onDelta for each content chunk.
 * Returns the full accumulated content when done.
 */
export async function streamRecipeGeneration(
  request,
  { onDelta, signal } = {},
) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured on the server.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(request) },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
      response_format: { type: 'json_object' },
    }),
    signal,
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('OpenAI API error:', response.status, errText);
    const status = response.status === 429 ? 429 : 502;
    throw new HttpError(
      'The AI service returned an error. Please try again.',
      status,
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;

      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') {
        return fullContent;
      }

      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) {
          fullContent += delta;
          onDelta?.(delta, fullContent);
        }
      } catch {
        // Skip malformed SSE chunks
      }
    }
  }

  return fullContent;
}

export class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
