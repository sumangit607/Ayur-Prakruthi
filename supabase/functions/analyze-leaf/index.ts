import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing leaf image with Lovable AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: "You are a botanical expert specializing in leaf identification. Analyze leaf images and provide comprehensive information about the plant.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this leaf image and provide detailed botanical information.",
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "identify_leaf",
              description: "Provide comprehensive botanical information about an identified leaf",
              parameters: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Common name of the plant",
                  },
                  scientificName: {
                    type: "string",
                    description: "Scientific/botanical name of the plant",
                  },
                  medicinalUses: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of medicinal uses and health benefits",
                  },
                  foodUses: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of culinary and food-related uses",
                  },
                  classification: {
                    type: "string",
                    enum: ["Herb", "Shrub", "Tree"],
                    description: "Plant classification type",
                  },
                  geographicalLocation: {
                    type: "array",
                    items: { type: "string" },
                    description: "Regions where this plant typically grows",
                  },
                },
                required: [
                  "name",
                  "scientificName",
                  "medicinalUses",
                  "foodUses",
                  "classification",
                  "geographicalLocation",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "identify_leaf" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to analyze leaf" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI Response received");

    // Extract the tool call response
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || !toolCall.function?.arguments) {
      console.error("No tool call found in response");
      return new Response(
        JSON.stringify({ error: "Unable to identify the leaf. Please try with a clearer image." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const leafInfo = JSON.parse(toolCall.function.arguments);
    console.log("Leaf identified:", leafInfo.name);

    return new Response(
      JSON.stringify(leafInfo),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-leaf function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
