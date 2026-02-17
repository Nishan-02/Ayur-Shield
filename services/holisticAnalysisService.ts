
import { GoogleGenAI } from "@google/genai";
import { User, InteractionStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface HolisticAnalysisInput {
    user: User;
    location: string;
    weather: string;
    season: string;
    currentTime: string;
    medicineIntake: string[];
    foodIntake?: {
        description: string;
        image?: string;
        mimeType?: string;
    };
    symptoms?: string[];
    activities?: string[];
}

export interface HolisticAnalysisResult {
    overallScore: number; // 1-10
    bodyAnalysis: {
        doshaBalance: string;
        currentState: string;
        recommendations: string[];
    };
    weatherPlaceAnalysis: {
        seasonalImpact: string;
        locationRecommendations: string[];
        weatherAdvisory: string;
    };
    foodAnalysis: {
        suitability: string;
        modifications: string[];
        timingScore: number;
    };
    medicineAnalysis: {
        interactions: Array<{
            medicine: string;
            status: InteractionStatus;
            warning: string;
        }>;
        overallSafety: string;
    };
    holisticRecommendations: string[];
    summary: string;
}

/**
 * Performs a comprehensive holistic analysis integrating all aspects:
 * body constitution, weather/location, food intake, and medicine interactions
 */
export const performHolisticAnalysis = async (
    input: HolisticAnalysisInput
): Promise<HolisticAnalysisResult> => {
    const model = 'gemini-3-flash-preview';

    // Build comprehensive prompt
    const prompt = `
    Act as a senior Ayurvedic physician with expertise in holistic health analysis.
    
    **PATIENT PROFILE:**
    - Name: ${input.user.name}
    - Primary Dosha: ${input.user.dosha}
    - Current Medications: ${input.user.medications.join(", ")}
    
    **ENVIRONMENTAL CONTEXT:**
    - Location: ${input.location}
    - Current Weather: ${input.weather}
    - Season: ${input.season}
    - Time of Day: ${input.currentTime}
    
    **CURRENT INTAKE:**
    - Medicines Today: ${input.medicineIntake.join(", ") || "None"}
    - Food Consumed: ${input.foodIntake?.description || "Not provided"}
    ${input.symptoms ? `- Reported Symptoms: ${input.symptoms.join(", ")}` : ""}
    ${input.activities ? `- Today's Activities: ${input.activities.join(", ")}` : ""}
    
    **ANALYSIS REQUIRED:**
    Provide a comprehensive holistic analysis in the following JSON format:
    
    {
      "overallScore": <1-10 health score>,
      "bodyAnalysis": {
        "doshaBalance": "<current dosha balance assessment>",
        "currentState": "<overall body state description>",
        "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
      },
      "weatherPlaceAnalysis": {
        "seasonalImpact": "<how current season affects this dosha>",
        "locationRecommendations": ["<location-specific advice 1>", "<location-specific advice 2>"],
        "weatherAdvisory": "<weather-specific guidance>"
      },
      "foodAnalysis": {
        "suitability": "<assessment of food for dosha and season>",
        "modifications": ["<suggested modification 1>", "<suggested modification 2>"],
        "timingScore": <1-10 score for eating this food at this time>
      },
      "medicineAnalysis": {
        "interactions": [
          {
            "medicine": "<medicine name>",
            "status": "Safe|Caution|Conflict",
            "warning": "<specific warning or reassurance>"
          }
        ],
        "overallSafety": "<overall medicine safety assessment>"
      },
      "holisticRecommendations": [
        "<holistic recommendation 1>",
        "<holistic recommendation 2>",
        "<holistic recommendation 3>",
        "<holistic recommendation 4>"
      ],
      "summary": "<2-3 sentence executive summary of overall health status and key actions>"
    }
    
    **IMPORTANT GUIDELINES:**
    1. Consider the interplay between dosha, season, weather, and time of day
    2. Assess food-medicine interactions and timing
    3. Provide actionable, specific recommendations
    4. Be mindful of contraindications
    5. Always remind to consult healthcare provider for serious concerns
    6. Return ONLY valid JSON, no markdown formatting
  `;

    try {
        let response;

        // If food image is provided, include it in the analysis
        if (input.foodIntake?.image && input.foodIntake?.mimeType) {
            response = await ai.models.generateContent({
                model,
                contents: {
                    parts: [
                        { inlineData: { data: input.foodIntake.image, mimeType: input.foodIntake.mimeType } },
                        { text: prompt }
                    ]
                }
            });
        } else {
            response = await ai.models.generateContent({ model, contents: prompt });
        }

        const responseText = response.text || "{}";

        // Clean up response text (remove markdown code blocks if present)
        const cleanedText = responseText
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        const result: HolisticAnalysisResult = JSON.parse(cleanedText);
        return result;

    } catch (error) {
        console.error("Holistic Analysis Error:", error);

        // Return a fallback result
        return {
            overallScore: 5,
            bodyAnalysis: {
                doshaBalance: "Unable to assess at this time",
                currentState: "Analysis unavailable",
                recommendations: ["Please consult with an Ayurvedic practitioner", "Maintain regular routine", "Stay hydrated"]
            },
            weatherPlaceAnalysis: {
                seasonalImpact: "Unable to determine",
                locationRecommendations: ["Follow general seasonal guidelines"],
                weatherAdvisory: "Dress appropriately for the weather"
            },
            foodAnalysis: {
                suitability: "Unable to analyze",
                modifications: ["Eat mindfully", "Choose fresh, seasonal foods"],
                timingScore: 5
            },
            medicineAnalysis: {
                interactions: [],
                overallSafety: "Please consult your healthcare provider"
            },
            holisticRecommendations: [
                "Maintain a regular daily routine (Dinacharya)",
                "Practice mindful eating",
                "Stay physically active",
                "Ensure adequate rest and sleep"
            ],
            summary: "Unable to complete full analysis. Please try again or consult with a healthcare professional for personalized guidance."
        };
    }
};

/**
 * Get quick health insights based on user query and context
 */
export const getQuickHealthInsight = async (
    user: User,
    query: string,
    context: {
        season: string;
        location: string;
        weather: string;
    }
): Promise<string> => {
    const model = 'gemini-3-flash-preview';

    const prompt = `
    You are AyurBot, an expert Ayurvedic health assistant.
    
    User Profile:
    - Dosha: ${user.dosha}
    - Current Medications: ${user.medications.join(", ")}
    
    Current Context:
    - Season: ${context.season}
    - Location: ${context.location}
    - Weather: ${context.weather}
    
    User Query: "${query}"
    
    Provide a helpful, personalized response considering their dosha, medications, and current environmental context.
    Keep it concise (3-4 sentences) and actionable. Always remind users to consult healthcare providers for serious concerns.
  `;

    try {
        const response = await ai.models.generateContent({ model, contents: prompt });
        return response.text || "I'm having trouble processing that. Could you rephrase?";
    } catch (error) {
        console.error("Quick Insight Error:", error);
        return "I'm experiencing technical difficulties. Please try again.";
    }
};
