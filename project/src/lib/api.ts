import type { Recipe, RecipeRequest } from '../types';

/**
 * Determine the API base URL.
 *
 * Priority:
 *  1. VITE_API_BASE_URL — explicit override (e.g. a deployed Express backend).
 *  2. Supabase Edge Function URL — built from the Vite env vars.
 */
function getApiBase(): string {
  const explicit = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (explicit) return explicit.replace(/\/$/, '');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (supabaseUrl && anonKey) {
    return `${supabaseUrl}/functions/v1/generate-recipe`;
  }

  return '';
}

const API_BASE = getApiBase();

console.log("API_BASE =", API_BASE);

/**
 * Streams a recipe from the backend. Calls onChunk for each text piece
 * as it arrives (progressive rendering) and resolves with the parsed recipe.
 */
export async function streamRecipe(
  request: RecipeRequest,
  onChunk: (chunk: string, accumulated: string) => void,
  signal?: AbortSignal,
): Promise<Recipe> {
  if (!API_BASE) {
    throw new Error(
      'No API endpoint configured. Set VITE_API_BASE_URL or Supabase env vars.',
    );
  }

  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(supabaseKey ? { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } : {}),
    },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data.error) message = data.error;
    } catch {
      /* response had no JSON body */
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') || '';

  // Non-streaming fallback — server returned complete JSON
  if (contentType.includes('application/json')) {
    const data = await response.json();
    const recipe = extractRecipe(data);
    onChunk('', '');
    return recipe;
  }

  // Streaming response — read chunks progressively
  if (!response.body) {
    throw new Error('Streaming not supported and no response body.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const decoded = decoder.decode(value, { stream: true });
    accumulated += decoded;

    // Parse SSE-style "data: {...}" lines or raw text deltas
    const lines = accumulated.split('\n');
    const remaining = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('data:')) {
        const payload = trimmed.slice(5).trim();
        if (payload === '[DONE]') continue;
        try {
          const parsed = JSON.parse(payload);
          // Final event carries the complete raw text for parsing
          if (parsed.raw) {
            fullText = parsed.raw;
            onChunk('', fullText);
            continue;
          }
          // If the server sends a final structured recipe, extract it
          if (parsed.recipe) {
            return parsed.recipe as Recipe;
          }
          const delta = parsed.delta ?? parsed.text ?? parsed.content ?? '';
          if (delta) {
            fullText += delta;
            onChunk(delta, fullText);
          }
        } catch {
          // Non-JSON data line — treat as raw text
          fullText += payload;
          onChunk(payload, fullText);
        }
      } else {
        fullText += trimmed;
        onChunk(trimmed, fullText);
      }
    }

    accumulated = remaining;
  }

  // After stream ends, try to parse the full text as JSON
  const recipe = extractRecipe(fullText);
  return recipe;
}

/**
 * Extracts a Recipe from a raw JSON string or a structured object.
 * Throws if no valid recipe can be produced.
 */
function extractRecipe(raw: string | Record<string, unknown>): Recipe {
  let data: Record<string, unknown>;

  if (typeof raw === 'string') {
    const jsonStr = extractJson(raw);
    if (!jsonStr) {
      throw new Error('The AI response could not be parsed. Please try again.');
    }
    data = JSON.parse(jsonStr);
  } else {
    data = raw;
  }

  const recipe = (data.recipe ?? data) as Record<string, unknown>;
  return normalizeRecipe(recipe);
}

/** Finds the first valid JSON object inside a text blob. */
function extractJson(text: string): string | null {
  // Remove markdown code fences
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  return cleaned.slice(start, end + 1);
}

/** Coerces a loosely-typed object into a well-formed Recipe. */
function normalizeRecipe(r: Record<string, unknown>): Recipe {
  const asArr = (v: unknown): string[] =>
    Array.isArray(v) ? v.map(String) : v ? [String(v)] : [];
  const asIngArr = (v: unknown): { name: string; amount: string; available: boolean }[] => {
    if (Array.isArray(v)) {
      return v.map((item) => {
        if (typeof item === 'string') {
          return { name: item, amount: '', available: false };
        }
        const o = item as Record<string, unknown>;
        return {
          name: String(o.name ?? o.ingredient ?? ''),
          amount: String(o.amount ?? o.quantity ?? ''),
          available: Boolean(o.available ?? false),
        };
      });
    }
    return [];
  };

  return {
    recipeName: String(r.recipeName ?? r.recipe_name ?? r.title ?? 'AI Generated Recipe'),
    description: String(r.description ?? r.shortDescription ?? ''),
    preparationTime: String(r.preparationTime ?? r.prep_time ?? 'N/A'),
    cookingTime: String(r.cookingTime ?? r.cooking_time ?? 'N/A'),
    servingSize: String(r.servingSize ?? r.servings ?? 'N/A'),
    estimatedCalories: String(r.estimatedCalories ?? r.calories ?? 'N/A'),
    ingredients: asIngArr(r.ingredients),
    instructions: asArr(r.instructions ?? r.steps),
    chefTips: asArr(r.chefTips ?? r.chef_tips ?? r.tips),
    substitutions: asArr(r.substitutions ?? r.substitutions_list),
    nutritionalHighlights: asArr(r.nutritionalHighlights ?? r.nutrition ?? r.nutritional_highlights),
  };
}