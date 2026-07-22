import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RecipeRequest {
  ingredients: string;
  cuisine: string;
  dietaryPreference: string;
  cookingTime: string;
  difficulty: string;
}

const SYSTEM_PROMPT = `
You are ChefMate AI, an expert culinary assistant.

Create delicious, realistic recipes using the user's available ingredients.

Rules:
- Prioritize the ingredients the user already has.
- Respect dietary preferences.
- Match the requested cuisine.
- Stay within the requested cooking time.
- Match the requested difficulty.
- Never produce unsafe cooking advice.

Return ONLY valid JSON.

{
  "recipeName": "",
  "description": "",
  "preparationTime": "",
  "cookingTime": "",
  "servingSize": "",
  "estimatedCalories": "",
  "ingredients": [
    {
      "name": "",
      "amount": "",
      "available": true
    }
  ],
  "instructions": [],
  "chefTips": [],
  "substitutions": [],
  "nutritionalHighlights": []
}
`;

function buildPrompt(req: RecipeRequest) {
  return `
Available Ingredients:
${req.ingredients}

Cuisine:
${req.cuisine}

Diet:
${req.dietaryPreference}

Maximum Cooking Time:
${req.cookingTime}

Difficulty:
${req.difficulty}

Generate ONE recipe.
Return ONLY JSON.
`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const body: RecipeRequest = await req.json();

    if (!body.ingredients?.trim()) {
      return new Response(
        JSON.stringify({ error: "Ingredients are required." }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const apiKey = Deno.env.get("OPENROUTER_API_KEY");

if (!apiKey) {
  return new Response(
    JSON.stringify({ error: "Missing OPENROUTER_API_KEY secret." }),
    {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
}

// Leave this code below unchanged
const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://chefmateai.onrender.com",
        "X-Title": "Recipe Generator App"
      },
      body: JSON.stringify({
      model: "google/gemma-3-4b-it:free",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: buildPrompt(body),
          },
        ],
        temperature: 0.3,
        max_tokens: 1200,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      return new Response(
        JSON.stringify({
          error: "OpenRouter error",
          details: errorText,
        }),
        {
          status: openRouterResponse.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const result = await openRouterResponse.json();
    let recipeText = result.choices?.[0]?.message?.content;

    if (!recipeText) {
      throw new Error("Empty AI response");
    }

    recipeText = recipeText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = recipeText.indexOf("{");
    const end = recipeText.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      recipeText = recipeText.substring(start, end + 1);
    }

    const parsedRecipe = JSON.parse(recipeText);

    return new Response(JSON.stringify(parsedRecipe), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to generate recipe.",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});