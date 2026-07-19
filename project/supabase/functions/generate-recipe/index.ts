import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
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

Create ONE realistic recipe using the user's ingredients.

IMPORTANT RULES:
- Return ONLY JSON.
- No markdown.
- No explanations.
- No text before or after JSON.
- Do not use triple backticks.
- Always follow the exact JSON structure below.

JSON FORMAT:

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

Diet Preference:
${req.dietaryPreference}

Cooking Time:
${req.cookingTime}

Difficulty:
${req.difficulty}

Create one recipe.
Remember: Output ONLY valid JSON.
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

    const apiKey = Deno.env.get("OPENROUTER_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Missing OPENROUTER_API_KEY secret."
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173/",
          "X-Title": "ChefMate AI"
        },
        body: JSON.stringify({
          model: "qwen/qwen3-8b:free",

          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user",
              content: buildPrompt(body)
            }
          ],

          temperature: 0.5,
          max_tokens: 1000
        })
      }
    );


    if (!openRouterResponse.ok) {
      const error = await openRouterResponse.text();

      return new Response(
        JSON.stringify({
          error: "OpenRouter error",
          details: error
        }),
        {
          status: openRouterResponse.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }


    const result = await openRouterResponse.json();

    let recipeText = result.choices?.[0]?.message?.content;


    if (!recipeText) {
      throw new Error("Empty AI response");
    }


    // Remove markdown if AI adds it
    recipeText = recipeText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();


    // Extract JSON if AI adds extra words
    const start = recipeText.indexOf("{");
    const end = recipeText.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      recipeText = recipeText.substring(start, end + 1);
    }


    const parsedRecipe = JSON.parse(recipeText);


    return new Response(
      JSON.stringify(parsedRecipe),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );


  } catch (error) {

    return new Response(
      JSON.stringify({
        error: "Failed to generate recipe.",
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});